import dagre from "@dagrejs/dagre";
import { FONT, measureText, wrapText, type ColorName, type Skeleton } from "./elements";

export type GraphNode = {
  id: string;
  label: string;
  shape?: "rectangle" | "ellipse" | "diamond";
  color?: ColorName;
};
export type GraphEdge = { from: string; to: string; label?: string; dashed?: boolean };
export type Direction = "TB" | "LR" | "BT" | "RL";

/** Lay out a node/edge graph with dagre and return skeletons positioned at `origin`. */
export function layoutGraph(nodes: GraphNode[], edges: GraphEdge[], direction: Direction, origin: { x: number; y: number }): Skeleton[] {
  const g = new dagre.graphlib.Graph();
  // Labeled edges need longer arrows so the label doesn't sit on the arrowhead.
  const labeled = edges.some((e) => e.label);
  g.setGraph({ rankdir: direction, nodesep: 60, ranksep: labeled ? 150 : 90, marginx: 0, marginy: 0 });
  g.setDefaultEdgeLabel(() => ({}));

  const sizes = new Map<string, { width: number; height: number }>();
  for (const n of nodes) {
    const factor = n.shape && n.shape !== "rectangle" ? 1.45 : 1;
    const wrapped = wrapText(n.label, 220, 20, FONT.hand);
    const t = measureText(wrapped, 20, FONT.hand);
    const size = {
      width: Math.max(140, Math.ceil((t.width + 40) * factor)),
      height: Math.max(70, Math.ceil((t.height + 40) * factor)),
    };
    sizes.set(n.id, size);
    g.setNode(n.id, size);
  }
  const ids = new Set(nodes.map((n) => n.id));
  for (const e of edges) {
    if (!ids.has(e.from)) throw new Error(`Edge source "${e.from}" isn't a node id`);
    if (!ids.has(e.to)) throw new Error(`Edge target "${e.to}" isn't a node id`);
    g.setEdge(e.from, e.to, e.label ? { width: e.label.length * 9, height: 20, labelpos: "c" } : {});
  }
  dagre.layout(g);

  const out: Skeleton[] = [];
  for (const n of nodes) {
    const pos = g.node(n.id);
    const size = sizes.get(n.id)!;
    out.push({
      id: n.id,
      type: n.shape ?? "rectangle",
      x: Math.round(origin.x + pos.x - size.width / 2),
      y: Math.round(origin.y + pos.y - size.height / 2),
      width: size.width,
      height: size.height,
      label: n.label,
      color: n.color,
    });
  }
  for (const e of edges) {
    // Bend through dagre's route (minus its endpoints, which sit on the node
    // borders) so arrows go around nodes instead of through them.
    const pts = (g.edge(e.from, e.to)?.points ?? []) as { x: number; y: number }[];
    const via = pts.slice(1, -1).map((p) => [Math.round(origin.x + p.x), Math.round(origin.y + p.y)] as [number, number]);
    out.push({
      type: "arrow",
      start: e.from,
      end: e.to,
      via: via.length ? via : undefined,
      label: e.label,
      strokeStyle: e.dashed ? "dashed" : undefined,
    });
  }
  return out;
}
