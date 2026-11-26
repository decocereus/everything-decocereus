// WebMCP tools that only make sense inside the open editor. The board CRUD
// tools come from the server's WebMCP bridge script (/api/mcp?webmcp-script).
import {
  CaptureUpdateAction,
  convertToExcalidrawElements,
  getCommonBounds,
} from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

interface Tool {
  annotations?: { readOnlyHint?: boolean };
  description: string;
  // biome-ignore lint/suspicious/noExplicitAny: each tool takes its own argument shape, which the browser validates against inputSchema
  execute: (args: any) => Promise<unknown>;
  inputSchema: object;
  name: string;
}

interface ModelContext {
  registerTool: (tool: Tool, opts?: { signal?: AbortSignal }) => unknown;
  unregisterTool?: (name: string) => unknown;
}

interface WithModelContext {
  modelContext?: ModelContext;
}

function modelContext(): ModelContext | undefined {
  return (
    (document as Document & WithModelContext).modelContext ??
    (navigator as Navigator & WithModelContext).modelContext
  );
}

const textOf = (el: ExcalidrawElement | undefined) =>
  el?.type === "text" ? el.text : undefined;

function describe(el: ExcalidrawElement, all: Map<string, ExcalidrawElement>) {
  const label = el.boundElements?.find((b) => b.type === "text");
  return {
    backgroundColor: el.backgroundColor,
    end: "endBinding" in el ? el.endBinding?.elementId : undefined,
    height: Math.round(el.height),
    id: el.id,
    start: "startBinding" in el ? el.startBinding?.elementId : undefined,
    strokeColor: el.strokeColor,
    text: el.type === "text" ? el.text : textOf(label && all.get(label.id)),
    type: el.type,
    width: Math.round(el.width),
    x: Math.round(el.x),
    y: Math.round(el.y),
  };
}

export function registerPageTools(
  api: ExcalidrawImperativeAPI,
  boardId: string,
  getName: () => string
) {
  const mc = modelContext();
  if (!mc) {
    return;
  }
  const controller = new AbortController();

  const tools: Tool[] = [
    {
      annotations: { readOnlyHint: true },
      description:
        "Get the id and name of the board open in this tab. Pass the id as boardId to the other board tools.",
      execute: async () => ({ boardId, name: getName(), url: location.href }),
      inputSchema: { properties: {}, type: "object" },
      name: "get_current_board",
    },
    {
      annotations: { readOnlyHint: true },
      description:
        "Get the elements the user has selected in this tab, so you can act on 'this' or 'these'.",
      // biome-ignore lint/suspicious/useAwait: WebMCP execute must return a Promise
      execute: async () => {
        const all = new Map(api.getSceneElements().map((e) => [e.id, e]));
        const ids = Object.keys(api.getAppState().selectedElementIds).filter(
          (id) => api.getAppState().selectedElementIds[id]
        );
        return {
          boardId,
          selected: ids
            .map((id) => all.get(id))
            .filter((el) => el !== undefined)
            .map((el) => describe(el, all)),
        };
      },
      inputSchema: { properties: {}, type: "object" },
      name: "get_selection",
    },
    {
      description:
        "Convert a Mermaid diagram (flowchart, sequence or class diagram) into editable shapes on this board, placed to the right of existing content.",
      execute: async ({ definition }: { definition: string }) => {
        const { parseMermaidToExcalidraw } = await import(
          "@excalidraw/mermaid-to-excalidraw"
        );
        const { elements: skeletons, files } =
          await parseMermaidToExcalidraw(definition);
        const fresh = convertToExcalidrawElements(skeletons, {
          regenerateIds: true,
        });
        const existing = api.getSceneElements();
        if (existing.length && fresh.length) {
          const [, minY, maxX] = getCommonBounds(existing);
          const [fx, fy] = getCommonBounds(fresh);
          // The new elements aren't in the scene yet, so move them in place.
          for (const el of fresh as { x: number; y: number }[]) {
            el.x += maxX + 120 - fx;
            el.y += minY - fy;
          }
        }
        if (files) {
          api.addFiles(Object.values(files));
        }
        api.updateScene({
          captureUpdate: CaptureUpdateAction.IMMEDIATELY,
          elements: [...api.getSceneElementsIncludingDeleted(), ...fresh],
        });
        api.scrollToContent(fresh, { animate: true, fitToViewport: true });
        return `Added ${fresh.length} elements: ${fresh.map((e) => e.id).join(", ")}`;
      },
      inputSchema: {
        properties: {
          definition: {
            description: "Mermaid source, e.g. 'flowchart LR\\n A-->B'",
            type: "string",
          },
        },
        required: ["definition"],
        type: "object",
      },
      name: "add_mermaid",
    },
    {
      description:
        "Scroll and zoom this tab to show the given elements and select them, to point the user at something.",
      // biome-ignore lint/suspicious/useAwait: WebMCP execute must return a Promise
      execute: async ({ ids }: { ids: string[] }) => {
        const targets = api
          .getSceneElements()
          .filter((e) => ids.includes(e.id));
        if (!targets.length) {
          return "None of those ids are on the board.";
        }
        api.updateScene({
          appState: {
            selectedElementIds: Object.fromEntries(
              targets.map((e) => [e.id, true])
            ),
          },
          captureUpdate: CaptureUpdateAction.NEVER,
        });
        api.scrollToContent(targets, { animate: true, fitToViewport: true });
        return `Showing ${targets.length} elements.`;
      },
      inputSchema: {
        properties: { ids: { items: { type: "string" }, type: "array" } },
        required: ["ids"],
        type: "object",
      },
      name: "focus_elements",
    },
  ];

  for (const tool of tools) {
    try {
      mc.registerTool(tool, { signal: controller.signal });
    } catch (e) {
      console.warn(`WebMCP: couldn't register ${tool.name}`, e);
    }
  }

  return () => {
    controller.abort();
    for (const tool of tools) {
      try {
        mc.unregisterTool?.(tool.name);
      } catch {
        // Already gone; nothing to clean up.
      }
    }
  };
}
