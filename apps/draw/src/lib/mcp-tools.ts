import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import {
  addSkeletons,
  createBoard,
  deleteBoard,
  getBoard,
  listBoards,
  nextFreeOrigin,
  removeElements,
  renameBoard,
  updateBoardElements,
} from "./boards.ts";
import { COLOR_NAMES, summarize } from "./elements.ts";
import { layoutGraph } from "./layout.ts";
import { renderBoardPng } from "./render.ts";

const color = z
  .enum(COLOR_NAMES as [string, ...string[]])
  .describe("Named color; sets a matching stroke and light fill");

const skeleton = z.object({
  backgroundColor: z.string().optional().describe("Hex color or 'transparent'"),
  children: z
    .array(z.string())
    .optional()
    .describe("Frame: ids of elements to put inside it"),
  color: color.optional(),
  end: z.string().optional().describe("Arrow: id of the element it points to"),
  endArrowhead: z
    .enum(["arrow", "bar", "dot", "triangle", "diamond"])
    .nullable()
    .optional()
    .describe("Defaults to 'arrow' on arrows"),
  fillStyle: z.enum(["solid", "hachure", "cross-hatch", "zigzag"]).optional(),
  font: z.enum(["hand", "normal", "code"]).optional(),
  fontSize: z
    .number()
    .optional()
    .describe("16 small, 20 normal, 28 large, 36 heading"),
  height: z.number().optional(),
  id: z
    .string()
    .optional()
    .describe(
      "Your own id for this element, so arrows in the same call can reference it"
    ),
  label: z
    .string()
    .optional()
    .describe("Text inside a shape, on an arrow, or a frame's name"),
  link: z.string().optional(),
  name: z.string().optional().describe("Frame title"),
  opacity: z.number().optional(),
  points: z
    .array(z.tuple([z.number(), z.number()]))
    .optional()
    .describe("Arrow/line without bindings: points relative to x,y"),
  roughness: z
    .number()
    .optional()
    .describe("0 clean lines, 1 hand-drawn (default), 2 sketchy"),
  start: z
    .string()
    .optional()
    .describe(
      "Arrow: id of the element it starts from (bound, follows the shape when moved)"
    ),
  startArrowhead: z
    .enum(["arrow", "bar", "dot", "triangle", "diamond"])
    .nullable()
    .optional(),
  strokeColor: z.string().optional().describe("Hex color, overrides `color`"),
  strokeStyle: z.enum(["solid", "dashed", "dotted"]).optional(),
  strokeWidth: z.number().optional().describe("1 thin, 2 normal, 4 bold"),
  text: z.string().optional().describe("Content of a text element"),
  textAlign: z.enum(["left", "center", "right"]).optional(),
  type: z.enum([
    "rectangle",
    "ellipse",
    "diamond",
    "text",
    "arrow",
    "line",
    "frame",
  ]),
  via: z
    .array(z.tuple([z.number(), z.number()]))
    .optional()
    .describe("Arrow with start/end: absolute waypoints to bend through"),
  width: z
    .number()
    .optional()
    .describe("Omit on labeled shapes to size them to the label"),
  x: z.number().optional(),
  y: z.number().optional(),
});

const patch = z.object({
  angle: z.number().optional().describe("Rotation in radians"),
  backgroundColor: z.string().optional(),
  color: color.optional(),
  fillStyle: z.enum(["solid", "hachure", "cross-hatch", "zigzag"]).optional(),
  fontSize: z.number().optional(),
  height: z.number().optional(),
  id: z.string(),
  label: z
    .string()
    .optional()
    .describe("New label for a shape or arrow (adds one if missing)"),
  link: z.string().nullable().optional(),
  locked: z.boolean().optional(),
  name: z.string().optional().describe("Frame title"),
  opacity: z.number().optional(),
  roughness: z.number().optional(),
  strokeColor: z.string().optional(),
  strokeStyle: z.enum(["solid", "dashed", "dotted"]).optional(),
  strokeWidth: z.number().optional(),
  text: z.string().optional().describe("New text for a text element"),
  width: z.number().optional(),
  x: z.number().optional(),
  y: z.number().optional(),
});

const text = (t: string) => ({ content: [{ text: t, type: "text" as const }] });
const fail = (e: unknown) => ({
  content: [
    {
      text: `Error: ${e instanceof Error ? e.message : String(e)}`,
      type: "text" as const,
    },
  ],
  isError: true,
});

function boardUrl(origin: string, id: string) {
  return `${origin}/b/${id}`;
}

async function describeBoard(origin: string, id: string) {
  const { doc } = await getBoard(id);
  const lines = summarize(doc.elements);
  return [
    `Board "${doc.name}" (${id}) ${boardUrl(origin, id)}`,
    `${lines.length} elements:`,
    ...lines,
  ].join("\n");
}

const WRITE_HINT =
  "The user's open tab picks up the change within a couple of seconds.";

export const WEBMCP_TOOLS = [
  "list_boards",
  "create_board",
  "read_board",
  "add_elements",
  "add_diagram",
  "update_elements",
  "delete_elements",
];

export function registerTools(server: McpServer, origin: string) {
  server.registerTool(
    "list_boards",
    {
      annotations: { readOnlyHint: true },
      description:
        "List the user's Excalidraw boards, most recently edited first.",
      inputSchema: z.object({}),
      title: "List boards",
    },
    async () => {
      try {
        const boards = await listBoards();
        if (!boards.length) {
          return text("No boards yet. Use create_board.");
        }
        return text(
          boards
            .map(
              (b) =>
                `${b.id}  ${JSON.stringify(b.name)}  edited ${b.updatedAt}  ${boardUrl(origin, b.id)}`
            )
            .join("\n")
        );
      } catch (e) {
        return fail(e);
      }
    }
  );

  server.registerTool(
    "create_board",
    {
      description: "Create a new empty board and return its id and URL.",
      inputSchema: z.object({ name: z.string().min(1) }),
      title: "Create board",
    },
    async ({ name }) => {
      try {
        const doc = await createBoard(name);
        return text(`Created board ${doc.id}: ${boardUrl(origin, doc.id)}`);
      } catch (e) {
        return fail(e);
      }
    }
  );

  server.registerTool(
    "read_board",
    {
      annotations: { readOnlyHint: true },
      description:
        "Read a board. `summary` (default) lists each element on one line with its id, type, label, position, size, colors and arrow connections. `json` returns the raw Excalidraw elements. Call get_board_image to see it.",
      inputSchema: z.object({
        boardId: z.string(),
        format: z.enum(["summary", "json"]).optional(),
      }),
      title: "Read board",
    },
    async ({ boardId, format }) => {
      try {
        if (format === "json") {
          const { doc } = await getBoard(boardId);
          return text(JSON.stringify(doc.elements.filter((e) => !e.isDeleted)));
        }
        return text(await describeBoard(origin, boardId));
      } catch (e) {
        return fail(e);
      }
    }
  );

  server.registerTool(
    "add_elements",
    {
      description: [
        "Draw shapes, text, arrows, lines and frames on a board.",
        "Give shapes an `id` and connect them with arrows via `start`/`end`; arrows bind to the shapes and follow them when moved.",
        "Labeled shapes size themselves to fit the label when width/height are omitted.",
        "Coordinates are canvas pixels, y grows downward. A normal box is about 160x80; leave 80+ px between boxes.",
        "To lay out a graph automatically, use add_diagram instead.",
        WRITE_HINT,
      ].join(" "),
      inputSchema: z.object({
        boardId: z.string(),
        elements: z.array(skeleton).min(1),
      }),
      title: "Add elements",
    },
    async ({ boardId, elements }) => {
      try {
        const { result } = await addSkeletons(boardId, elements as never);
        const ids = Object.entries(result.idMap).map(([ref, id]) =>
          ref === id ? id : `${ref} -> ${id}`
        );
        return text(
          `Added ${result.created.length} elements (including labels). Ids: ${ids.join(", ")}`
        );
      } catch (e) {
        return fail(e);
      }
    }
  );

  server.registerTool(
    "add_diagram",
    {
      description: [
        "Draw a flowchart or architecture diagram from nodes and edges; positions are computed automatically (dagre layout).",
        "Placed to the right of existing content unless `origin` is given.",
        "Node ids must be unique on the board; they become the element ids, so you can update or connect them later.",
        WRITE_HINT,
      ].join(" "),
      inputSchema: z.object({
        boardId: z.string(),
        direction: z
          .enum(["TB", "LR", "BT", "RL"])
          .optional()
          .describe("TB top-to-bottom (default), LR left-to-right"),
        edges: z
          .array(
            z.object({
              dashed: z.boolean().optional(),
              from: z.string(),
              label: z.string().optional(),
              to: z.string(),
            })
          )
          .optional(),
        nodes: z
          .array(
            z.object({
              color: color.optional(),
              id: z.string(),
              label: z.string(),
              shape: z.enum(["rectangle", "ellipse", "diamond"]).optional(),
            })
          )
          .min(1),
        origin: z.object({ x: z.number(), y: z.number() }).optional(),
        title: z
          .string()
          .optional()
          .describe("Wraps the diagram in a named frame"),
      }),
      title: "Add diagram",
    },
    async ({ boardId, nodes, edges, direction, origin: at, title }) => {
      try {
        const { result } = await addSkeletons(boardId, (doc) => {
          const o = at ?? nextFreeOrigin(doc.elements);
          const pad = title ? 40 : 0;
          const skels = layoutGraph(
            nodes as never,
            edges ?? [],
            direction ?? "TB",
            { x: o.x + pad, y: o.y + pad + (title ? 20 : 0) }
          );
          if (title) {
            const shapes = skels.filter((s) => s.type !== "arrow");
            // layoutGraph places every node, so these are always set.
            const maxX = Math.max(
              ...shapes.map((s) => (s.x ?? 0) + (s.width ?? 0))
            );
            const maxY = Math.max(
              ...shapes.map((s) => (s.y ?? 0) + (s.height ?? 0))
            );
            skels.push({
              children: nodes.map((n) => n.id),
              height: maxY - o.y + pad,
              name: title,
              type: "frame",
              width: maxX - o.x + pad,
              x: o.x,
              y: o.y,
            });
          }
          return skels;
        });
        return text(
          `Added ${nodes.length} nodes and ${edges?.length ?? 0} edges (${result.created.length} elements). Node ids: ${nodes.map((n) => n.id).join(", ")}`
        );
      } catch (e) {
        return fail(e);
      }
    }
  );

  server.registerTool(
    "update_elements",
    {
      description:
        "Change existing elements by id: move (x/y), resize, relabel, recolor or restyle. Moving a shape moves its label and re-routes arrows bound to it; moving a frame moves its contents. " +
        WRITE_HINT,
      inputSchema: z.object({
        boardId: z.string(),
        updates: z.array(patch).min(1),
      }),
      title: "Update elements",
    },
    async ({ boardId, updates }) => {
      try {
        const { result } = await updateBoardElements(boardId, updates as never);
        return text(`Updated ${result} elements.`);
      } catch (e) {
        return fail(e);
      }
    }
  );

  server.registerTool(
    "delete_elements",
    {
      annotations: { destructiveHint: true },
      description:
        "Delete elements by id (their labels go with them; arrows attached to them stay but come unbound). Pass all: true to clear the board. " +
        WRITE_HINT,
      inputSchema: z.object({
        all: z.boolean().optional(),
        boardId: z.string(),
        ids: z.array(z.string()).optional(),
      }),
      title: "Delete elements",
    },
    async ({ boardId, ids, all }) => {
      try {
        if (!(all || ids?.length)) {
          return fail("Pass ids or all: true");
        }
        const { result } = await removeElements(
          boardId,
          all ? "all" : (ids ?? [])
        );
        return text(`Deleted ${result} elements.`);
      } catch (e) {
        return fail(e);
      }
    }
  );

  server.registerTool(
    "get_board_image",
    {
      annotations: { readOnlyHint: true },
      description:
        "Render the board (or just some elements) to a PNG so you can see it. Takes a few seconds.",
      inputSchema: z.object({
        boardId: z.string(),
        dark: z.boolean().optional(),
        elementIds: z
          .array(z.string())
          .optional()
          .describe("Only render these elements"),
        maxSize: z
          .number()
          .optional()
          .describe("Longest side in pixels, default 1600"),
      }),
      title: "Get board image",
    },
    async ({ boardId, elementIds, dark, maxSize }) => {
      try {
        await getBoard(boardId);
        const img = await renderBoardPng(origin, boardId, {
          dark,
          elementIds,
          maxSize,
        });
        return {
          content: [
            { data: img.png, mimeType: "image/png", type: "image" as const },
            { text: `${img.width}x${img.height}px`, type: "text" as const },
          ],
        };
      } catch (e) {
        return fail(e);
      }
    }
  );

  server.registerTool(
    "rename_board",
    {
      description: "Rename a board.",
      inputSchema: z.object({ boardId: z.string(), name: z.string().min(1) }),
      title: "Rename board",
    },
    async ({ boardId, name }) => {
      try {
        await renameBoard(boardId, name);
        return text(`Renamed to ${JSON.stringify(name)}.`);
      } catch (e) {
        return fail(e);
      }
    }
  );

  server.registerTool(
    "delete_board",
    {
      annotations: { destructiveHint: true },
      description:
        "Permanently delete a board. Only do this when the user asks.",
      inputSchema: z.object({ boardId: z.string() }),
      title: "Delete board",
    },
    async ({ boardId }) => {
      try {
        await deleteBoard(boardId);
        return text(`Deleted board ${boardId}.`);
      } catch (e) {
        return fail(e);
      }
    }
  );
}
