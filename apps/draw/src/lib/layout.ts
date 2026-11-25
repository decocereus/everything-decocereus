import dagre from "@dagrejs/dagre";
import {
  type ColorName,
  FONT,
  measureText,
  type Skeleton,
  wrapText,
} from "./elements.ts";

export interface GraphNode {
  color?: ColorName;
  id: string;
  label: string;
  shape?: "rectangle" | "ellipse" | "diamond";
}
export interface GraphEdge {
  dashed?: boolean;
  from: string;
  label?: string;
  to: string;
}
export type Direction = "TB" | "LR" | "BT" | "RL";

/** Size a node's shape to fit its wrapped label. */
function nodeSize(n: GraphNode) {
  const factor = n.shape && n.shape !== "rectangle" ? 1.45 : 1;
  const wrapped = wrapText(n.label, 220, 20, FONT.hand);
  const t = measureText(wrapped, 20, FONT.hand);
  return {
    height: Math.max(70, Math.ceil((t.height + 40) * factor)),
    width: Math.max(140, Math.ceil((t.width + 40) * factor)),
  };
}

/** Lay out a node/edge graph with dagre and return skeletons positioned at `origin`. */
export function layoutGraph(
  nodes: GraphNode[],
  edges: GraphEdge[],
  direction: Direction,
  origin: { x: number; y: number }
): Skeleton[] {
  const g = new dagre.graphlib.Graph();
  // Labeled edges need longer arrows so the label doesn't sit on the arrowhead.
  const labeled = edges.some((e) => e.label);
  g.setGraph({
    marginx: 0,
    marginy: 0,
    nodesep: 60,
    rankdir: direction,
    ranksep: labeled ? 150 : 90,
  });
  g.setDefaultEdgeLabel(() => ({}));

  const sized = nodes.map((n) => ({ n, size: nodeSize(n) }));
  for (const { n, size } of sized) {
    g.setNode(n.id, size);
  }
  const ids = new Set(nodes.map((n) => n.id));
  for (const e of edges) {
    if (!ids.has(e.from)) {
      throw new Error(`Edge source "${e.from}" isn't a node id`);
    }
    if (!ids.has(e.to)) {
      throw new Error(`Edge target "${e.to}" isn't a node id`);
    }
    g.setEdge(
      e.from,
      e.to,
      e.label ? { height: 20, labelpos: "c", width: e.label.length * 9 } : {}
    );
  }
  dagre.layout(g);

  const out: Skeleton[] = [];
  for (const { n, size } of sized) {
    const pos = g.node(n.id);
    out.push({
      color: n.color,
      height: size.height,
      id: n.id,
      label: n.label,
      type: n.shape ?? "rectangle",
      width: size.width,
      x: Math.round(origin.x + pos.x - size.width / 2),
      y: Math.round(origin.y + pos.y - size.height / 2),
    });
  }
  for (const e of edges) {
    // Bend through dagre's route (minus its endpoints, which sit on the node
    // borders) so arrows go around nodes instead of through them.
    const pts = (g.edge(e.from, e.to)?.points ?? []) as {
      x: number;
      y: number;
    }[];
    const via = pts
      .slice(1, -1)
      .map(
        (p) =>
          [Math.round(origin.x + p.x), Math.round(origin.y + p.y)] as [
            number,
            number,
          ]
      );
    out.push({
      end: e.to,
      label: e.label,
      start: e.from,
      strokeStyle: e.dashed ? "dashed" : undefined,
      type: "arrow",
      via: via.length ? via : undefined,
    });
  }
  return out;
}
