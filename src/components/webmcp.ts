// WebMCP tools that only make sense inside the open editor. The board CRUD
// tools come from the server's WebMCP bridge script (/api/mcp?webmcp-script).
import { CaptureUpdateAction, convertToExcalidrawElements, getCommonBounds } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

type Tool = {
  name: string;
  description: string;
  inputSchema: object;
  annotations?: { readOnlyHint?: boolean };
  execute: (args: any) => Promise<unknown>;
};

type ModelContext = {
  registerTool: (tool: Tool, opts?: { signal?: AbortSignal }) => unknown;
  unregisterTool?: (name: string) => unknown;
};

function modelContext(): ModelContext | undefined {
  return (document as any).modelContext ?? (navigator as any).modelContext;
}

function describe(el: any, all: Map<string, any>) {
  const label = el.boundElements?.find((b: any) => b.type === "text");
  return {
    id: el.id,
    type: el.type,
    text: el.type === "text" ? el.text : label ? all.get(label.id)?.text : undefined,
    x: Math.round(el.x),
    y: Math.round(el.y),
    width: Math.round(el.width),
    height: Math.round(el.height),
    strokeColor: el.strokeColor,
    backgroundColor: el.backgroundColor,
    start: el.startBinding?.elementId,
    end: el.endBinding?.elementId,
  };
}

export function registerPageTools(api: ExcalidrawImperativeAPI, boardId: string, getName: () => string) {
  const mc = modelContext();
  if (!mc) return;
  const controller = new AbortController();

  const tools: Tool[] = [
    {
      name: "get_current_board",
      description: "Get the id and name of the board open in this tab. Pass the id as boardId to the other board tools.",
      inputSchema: { type: "object", properties: {} },
      annotations: { readOnlyHint: true },
      execute: async () => ({ boardId, name: getName(), url: location.href }),
    },
    {
      name: "get_selection",
      description: "Get the elements the user has selected in this tab, so you can act on 'this' or 'these'.",
      inputSchema: { type: "object", properties: {} },
      annotations: { readOnlyHint: true },
      execute: async () => {
        const all = new Map(api.getSceneElements().map((e) => [e.id, e]));
        const ids = Object.keys(api.getAppState().selectedElementIds).filter((id) => api.getAppState().selectedElementIds[id]);
        return { boardId, selected: ids.map((id) => all.get(id)).filter(Boolean).map((el) => describe(el, all)) };
      },
    },
    {
      name: "add_mermaid",
      description:
        "Convert a Mermaid diagram (flowchart, sequence or class diagram) into editable shapes on this board, placed to the right of existing content.",
      inputSchema: {
        type: "object",
        properties: { definition: { type: "string", description: "Mermaid source, e.g. 'flowchart LR\\n A-->B'" } },
        required: ["definition"],
      },
      execute: async ({ definition }: { definition: string }) => {
        const { parseMermaidToExcalidraw } = await import("@excalidraw/mermaid-to-excalidraw");
        const { elements: skeletons, files } = await parseMermaidToExcalidraw(definition);
        const fresh = convertToExcalidrawElements(skeletons, { regenerateIds: true });
        const existing = api.getSceneElements();
        if (existing.length && fresh.length) {
          const [, minY, maxX] = getCommonBounds(existing);
          const [fx, fy] = getCommonBounds(fresh);
          for (const el of fresh as any[]) {
            el.x += maxX + 120 - fx;
            el.y += minY - fy;
          }
        }
        if (files) api.addFiles(Object.values(files));
        api.updateScene({ elements: [...api.getSceneElementsIncludingDeleted(), ...fresh], captureUpdate: CaptureUpdateAction.IMMEDIATELY });
        api.scrollToContent(fresh, { fitToViewport: true, animate: true });
        return `Added ${fresh.length} elements: ${fresh.map((e) => e.id).join(", ")}`;
      },
    },
    {
      name: "focus_elements",
      description: "Scroll and zoom this tab to show the given elements and select them, to point the user at something.",
      inputSchema: {
        type: "object",
        properties: { ids: { type: "array", items: { type: "string" } } },
        required: ["ids"],
      },
      execute: async ({ ids }: { ids: string[] }) => {
        const targets = api.getSceneElements().filter((e) => ids.includes(e.id));
        if (!targets.length) return "None of those ids are on the board.";
        api.updateScene({
          appState: { selectedElementIds: Object.fromEntries(targets.map((e) => [e.id, true])) },
          captureUpdate: CaptureUpdateAction.NEVER,
        });
        api.scrollToContent(targets, { fitToViewport: true, animate: true });
        return `Showing ${targets.length} elements.`;
      },
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
      } catch {}
    }
  };
}
