import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/server";
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
} from "./boards";
import { COLOR_NAMES, summarize } from "./elements";
import { layoutGraph } from "./layout";
import { renderBoardPng } from "./render";

const color = z.enum(COLOR_NAMES as [string, ...string[]]).describe("Named color; sets a matching stroke and light fill");

const skeleton = z.object({
  id: z.string().optional().describe("Your own id for this element, so arrows in the same call can reference it"),
  type: z.enum(["rectangle", "ellipse", "diamond", "text", "arrow", "line", "frame"]),
  x: z.number().optional(),
  y: z.number().optional(),
  width: z.number().optional().describe("Omit on labeled shapes to size them to the label"),
  height: z.number().optional(),
  text: z.string().optional().describe("Content of a text element"),
  label: z.string().optional().describe("Text inside a shape, on an arrow, or a frame's name"),
  color: color.optional(),
  strokeColor: z.string().optional().describe("Hex color, overrides `color`"),
  backgroundColor: z.string().optional().describe("Hex color or 'transparent'"),
  fillStyle: z.enum(["solid", "hachure", "cross-hatch", "zigzag"]).optional(),
  strokeStyle: z.enum(["solid", "dashed", "dotted"]).optional(),
  strokeWidth: z.number().optional().describe("1 thin, 2 normal, 4 bold"),
  roughness: z.number().optional().describe("0 clean lines, 1 hand-drawn (default), 2 sketchy"),
  opacity: z.number().optional(),
  fontSize: z.number().optional().describe("16 small, 20 normal, 28 large, 36 heading"),
  font: z.enum(["hand", "normal", "code"]).optional(),
  textAlign: z.enum(["left", "center", "right"]).optional(),
  start: z.string().optional().describe("Arrow: id of the element it starts from (bound, follows the shape when moved)"),
  end: z.string().optional().describe("Arrow: id of the element it points to"),
  points: z.array(z.tuple([z.number(), z.number()])).optional().describe("Arrow/line without bindings: points relative to x,y"),
  via: z.array(z.tuple([z.number(), z.number()])).optional().describe("Arrow with start/end: absolute waypoints to bend through"),
  startArrowhead: z.enum(["arrow", "bar", "dot", "triangle", "diamond"]).nullable().optional(),
  endArrowhead: z.enum(["arrow", "bar", "dot", "triangle", "diamond"]).nullable().optional().describe("Defaults to 'arrow' on arrows"),
  name: z.string().optional().describe("Frame title"),
  children: z.array(z.string()).optional().describe("Frame: ids of elements to put inside it"),
  link: z.string().optional(),
});

const patch = z.object({
  id: z.string(),
  x: z.number().optional(),
  y: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  text: z.string().optional().describe("New text for a text element"),
  label: z.string().optional().describe("New label for a shape or arrow (adds one if missing)"),
  color: color.optional(),
  strokeColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  fillStyle: z.enum(["solid", "hachure", "cross-hatch", "zigzag"]).optional(),
  strokeStyle: z.enum(["solid", "dashed", "dotted"]).optional(),
  strokeWidth: z.number().optional(),
  opacity: z.number().optional(),
  roughness: z.number().optional(),
  fontSize: z.number().optional(),
  angle: z.number().optional().describe("Rotation in radians"),
  locked: z.boolean().optional(),
  link: z.string().nullable().optional(),
  name: z.string().optional().describe("Frame title"),
});

const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });
const fail = (e: unknown) => ({ content: [{ type: "text" as const, text: `Error: ${e instanceof Error ? e.message : String(e)}` }], isError: true });

function boardUrl(origin: string, id: string) {
  return `${origin}/b/${id}`;
}

async function describeBoard(origin: string, id: string) {
  const { doc } = await getBoard(id);
  const lines = summarize(doc.elements);
  return [`Board "${doc.name}" (${id}) ${boardUrl(origin, id)}`, `${lines.length} elements:`, ...lines].join("\n");
}

const WRITE_HINT = "The user's open tab picks up the change within a couple of seconds.";

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
      title: "List boards",
      description: "List the user's Excalidraw boards, most recently edited first.",
      inputSchema: z.object({}),
      annotations: { readOnlyHint: true },
    },
    async () => {
      try {
        const boards = await listBoards();
        if (!boards.length) return text("No boards yet. Use create_board.");
        return text(boards.map((b) => `${b.id}  ${JSON.stringify(b.name)}  edited ${b.updatedAt}  ${boardUrl(origin, b.id)}`).join("\n"));
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.registerTool(
    "create_board",
    {
      title: "Create board",
      description: "Create a new empty board and return its id and URL.",
      inputSchema: z.object({ name: z.string().min(1) }),
    },
    async ({ name }) => {
      try {
        const doc = await createBoard(name);
        return text(`Created board ${doc.id}: ${boardUrl(origin, doc.id)}`);
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.registerTool(
    "read_board",
    {
      title: "Read board",
      description:
        "Read a board. `summary` (default) lists each element on one line with its id, type, label, position, size, colors and arrow connections. `json` returns the raw Excalidraw elements. Call get_board_image to see it.",
      inputSchema: z.object({
        boardId: z.string(),
        format: z.enum(["summary", "json"]).optional(),
      }),
      annotations: { readOnlyHint: true },
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
    },
  );

  server.registerTool(
    "add_elements",
    {
      title: "Add elements",
      description: [
        "Draw shapes, text, arrows, lines and frames on a board.",
        "Give shapes an `id` and connect them with arrows via `start`/`end`; arrows bind to the shapes and follow them when moved.",
        "Labeled shapes size themselves to fit the label when width/height are omitted.",
        "Coordinates are canvas pixels, y grows downward. A normal box is about 160x80; leave 80+ px between boxes.",
        "To lay out a graph automatically, use add_diagram instead.",
        WRITE_HINT,
      ].join(" "),
      inputSchema: z.object({ boardId: z.string(), elements: z.array(skeleton).min(1) }),
    },
    async ({ boardId, elements }) => {
      try {
        const { result } = await addSkeletons(boardId, elements as never);
        const ids = Object.entries(result.idMap).map(([ref, id]) => (ref === id ? id : `${ref} -> ${id}`));
        return text(`Added ${result.created.length} elements (including labels). Ids: ${ids.join(", ")}`);
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.registerTool(
    "add_diagram",
    {
      title: "Add diagram",
      description: [
        "Draw a flowchart or architecture diagram from nodes and edges; positions are computed automatically (dagre layout).",
        "Placed to the right of existing content unless `origin` is given.",
        "Node ids must be unique on the board; they become the element ids, so you can update or connect them later.",
        WRITE_HINT,
      ].join(" "),
      inputSchema: z.object({
        boardId: z.string(),
        nodes: z
          .array(
            z.object({
              id: z.string(),
              label: z.string(),
              shape: z.enum(["rectangle", "ellipse", "diamond"]).optional(),
              color: color.optional(),
            }),
          )
          .min(1),
        edges: z.array(z.object({ from: z.string(), to: z.string(), label: z.string().optional(), dashed: z.boolean().optional() })).optional(),
        direction: z.enum(["TB", "LR", "BT", "RL"]).optional().describe("TB top-to-bottom (default), LR left-to-right"),
        origin: z.object({ x: z.number(), y: z.number() }).optional(),
        title: z.string().optional().describe("Wraps the diagram in a named frame"),
      }),
    },
    async ({ boardId, nodes, edges, direction, origin: at, title }) => {
      try {
        const { result } = await addSkeletons(boardId, (doc) => {
          const o = at ?? nextFreeOrigin(doc.elements);
          const pad = title ? 40 : 0;
          const skels = layoutGraph(nodes as never, edges ?? [], direction ?? "TB", { x: o.x + pad, y: o.y + pad + (title ? 20 : 0) });
          if (title) {
            const shapes = skels.filter((s) => s.type !== "arrow");
            const maxX = Math.max(...shapes.map((s) => s.x! + s.width!));
            const maxY = Math.max(...shapes.map((s) => s.y! + s.height!));
            skels.push({ type: "frame", name: title, x: o.x, y: o.y, width: maxX - o.x + pad, height: maxY - o.y + pad, children: nodes.map((n) => n.id) });
          }
          return skels;
        });
        return text(`Added ${nodes.length} nodes and ${edges?.length ?? 0} edges (${result.created.length} elements). Node ids: ${nodes.map((n) => n.id).join(", ")}`);
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.registerTool(
    "update_elements",
    {
      title: "Update elements",
      description:
        "Change existing elements by id: move (x/y), resize, relabel, recolor or restyle. Moving a shape moves its label and re-routes arrows bound to it; moving a frame moves its contents. " +
        WRITE_HINT,
      inputSchema: z.object({ boardId: z.string(), updates: z.array(patch).min(1) }),
    },
    async ({ boardId, updates }) => {
      try {
        const { result } = await updateBoardElements(boardId, updates as never);
        return text(`Updated ${result} elements.`);
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.registerTool(
    "delete_elements",
    {
      title: "Delete elements",
      description: "Delete elements by id (their labels go with them; arrows attached to them stay but come unbound). Pass all: true to clear the board. " + WRITE_HINT,
      inputSchema: z.object({ boardId: z.string(), ids: z.array(z.string()).optional(), all: z.boolean().optional() }),
      annotations: { destructiveHint: true },
    },
    async ({ boardId, ids, all }) => {
      try {
        if (!all && !ids?.length) return fail("Pass ids or all: true");
        const { result } = await removeElements(boardId, all ? "all" : ids!);
        return text(`Deleted ${result} elements.`);
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.registerTool(
    "get_board_image",
    {
      title: "Get board image",
      description: "Render the board (or just some elements) to a PNG so you can see it. Takes a few seconds.",
      inputSchema: z.object({
        boardId: z.string(),
        elementIds: z.array(z.string()).optional().describe("Only render these elements"),
        dark: z.boolean().optional(),
        maxSize: z.number().optional().describe("Longest side in pixels, default 1600"),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ boardId, elementIds, dark, maxSize }) => {
      try {
        await getBoard(boardId);
        const img = await renderBoardPng(origin, boardId, { elementIds, dark, maxSize });
        return {
          content: [
            { type: "image" as const, data: img.png, mimeType: "image/png" },
            { type: "text" as const, text: `${img.width}x${img.height}px` },
          ],
        };
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.registerTool(
    "rename_board",
    {
      title: "Rename board",
      description: "Rename a board.",
      inputSchema: z.object({ boardId: z.string(), name: z.string().min(1) }),
    },
    async ({ boardId, name }) => {
      try {
        await renameBoard(boardId, name);
        return text(`Renamed to ${JSON.stringify(name)}.`);
      } catch (e) {
        return fail(e);
      }
    },
  );

  server.registerTool(
    "delete_board",
    {
      title: "Delete board",
      description: "Permanently delete a board. Only do this when the user asks.",
      inputSchema: z.object({ boardId: z.string() }),
      annotations: { destructiveHint: true },
    },
    async ({ boardId }) => {
      try {
        await deleteBoard(boardId);
        return text(`Deleted board ${boardId}.`);
      } catch (e) {
        return fail(e);
      }
    },
  );
}
