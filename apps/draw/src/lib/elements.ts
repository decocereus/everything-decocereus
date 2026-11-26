// Builds and edits Excalidraw elements on the server, where the Excalidraw
// package can't run (it needs a DOM and canvas for text measurement). Text
// sizes here are estimates; the browser re-measures text when it loads a board.
import { generateNKeysBetween } from "fractional-indexing";

export interface El {
  angle: number;
  boundElements: { id: string; type: "arrow" | "text" }[] | null;
  frameId: string | null;
  groupIds: string[];
  height: number;
  id: string;
  index: string | null;
  isDeleted: boolean;
  type: string;
  updated: number;
  version: number;
  versionNonce: number;
  width: number;
  x: number;
  y: number;
  // biome-ignore lint/suspicious/noExplicitAny: elements carry type-specific Excalidraw fields (points, bindings, text, ...) that this server-side type leaves open
  [key: string]: any;
}

export const FONT = { code: 3, hand: 5, normal: 2 } as const;
export type FontName = keyof typeof FONT;

export const PALETTE = {
  black: { fill: "#e9ecef", stroke: "#1e1e1e" },
  blue: { fill: "#a5d8ff", stroke: "#1971c2" },
  cyan: { fill: "#99e9f2", stroke: "#0c8599" },
  grape: { fill: "#eebefa", stroke: "#9c36b5" },
  gray: { fill: "#e9ecef", stroke: "#495057" },
  green: { fill: "#b2f2bb", stroke: "#2f9e44" },
  orange: { fill: "#ffd8a8", stroke: "#e8590c" },
  pink: { fill: "#fcc2d7", stroke: "#c2255c" },
  red: { fill: "#ffc9c9", stroke: "#e03131" },
  teal: { fill: "#96f2d7", stroke: "#099268" },
  violet: { fill: "#d0bfff", stroke: "#6741d9" },
  yellow: { fill: "#ffec99", stroke: "#f08c00" },
} as const;
export type ColorName = keyof typeof PALETTE;
export const COLOR_NAMES = Object.keys(PALETTE) as ColorName[];

export interface Skeleton {
  backgroundColor?: string;
  children?: string[];
  color?: ColorName;
  end?: string;
  endArrowhead?: string | null;
  fillStyle?: "solid" | "hachure" | "cross-hatch" | "zigzag";
  font?: FontName;
  fontSize?: number;
  height?: number;
  id?: string;
  label?: string;
  link?: string;
  name?: string;
  opacity?: number;
  points?: [number, number][];
  roughness?: number;
  start?: string;
  startArrowhead?: string | null;
  strokeColor?: string;
  strokeStyle?: "solid" | "dashed" | "dotted";
  strokeWidth?: number;
  text?: string;
  textAlign?: "left" | "center" | "right";
  type:
    | "rectangle"
    | "ellipse"
    | "diamond"
    | "text"
    | "arrow"
    | "line"
    | "frame";
  /** Absolute waypoints an arrow bends through between its start and end. */
  via?: [number, number][];
  width?: number;
  x?: number;
  y?: number;
}

const LINE_HEIGHT: Record<number, number> = { 2: 1.15, 3: 1.2, 5: 1.25 };
const CHAR_WIDTH: Record<number, number> = { 2: 0.55, 3: 0.6, 5: 0.6 };
const CONTAINER_PADDING = 20;
const ARROW_GAP = 6;
const WHITESPACE_RE = /\s+/;

export const randomId = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < 20; i += 1) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
};
const randomInt = () => Math.floor(Math.random() * 2 ** 31);

export function measureText(
  text: string,
  fontSize: number,
  fontFamily: number
) {
  const lines = text.split("\n");
  const longest = Math.max(1, ...lines.map((l) => [...l].length));
  return {
    height: Math.ceil(
      lines.length * fontSize * (LINE_HEIGHT[fontFamily] ?? 1.25)
    ),
    width: Math.ceil(longest * fontSize * (CHAR_WIDTH[fontFamily] ?? 0.6)),
  };
}

/** Greedy word wrap so auto-sized boxes get a sensible height. */
export function wrapText(
  text: string,
  maxWidth: number,
  fontSize: number,
  fontFamily: number
) {
  const charW = fontSize * (CHAR_WIDTH[fontFamily] ?? 0.6);
  const maxChars = Math.max(4, Math.floor(maxWidth / charW));
  return text
    .split("\n")
    .map((para) => {
      const out: string[] = [];
      let line = "";
      for (const word of para.split(WHITESPACE_RE)) {
        if (!line) {
          line = word;
        } else if (`${line} ${word}`.length <= maxChars) {
          line += ` ${word}`;
        } else {
          out.push(line);
          line = word;
        }
      }
      out.push(line);
      return out.join("\n");
    })
    .join("\n");
}

function base(type: string, props: Partial<El>): El {
  return {
    angle: 0,
    backgroundColor: "transparent",
    boundElements: null,
    fillStyle: "solid",
    frameId: null,
    groupIds: [],
    height: 0,
    id: randomId(),
    index: null,
    isDeleted: false,
    link: null,
    locked: false,
    opacity: 100,
    roughness: 1,
    roundness: null,
    seed: randomInt(),
    strokeColor: "#1e1e1e",
    strokeStyle: "solid",
    strokeWidth: 2,
    type,
    updated: Date.now(),
    version: 1,
    versionNonce: randomInt(),
    width: 0,
    x: 0,
    y: 0,
    ...props,
  };
}

function textElement(
  text: string,
  opts: {
    fontSize: number;
    fontFamily: number;
    containerId: string | null;
    textAlign: string;
    strokeColor: string;
  }
): El {
  const size = measureText(text, opts.fontSize, opts.fontFamily);
  return base("text", {
    ...size,
    autoResize: true,
    containerId: opts.containerId,
    fontFamily: opts.fontFamily,
    fontSize: opts.fontSize,
    lineHeight: LINE_HEIGHT[opts.fontFamily] ?? 1.25,
    originalText: text,
    strokeColor: opts.strokeColor,
    text,
    textAlign: opts.textAlign,
    verticalAlign: opts.containerId ? "middle" : "top",
  });
}

const isBindable = (el: El) =>
  ["rectangle", "ellipse", "diamond", "text", "image", "frame"].includes(
    el.type
  );

/** Where a ray from the shape's center toward (tx, ty) leaves its outline, pushed out by `gap`. */
export function edgePoint(
  el: El,
  tx: number,
  ty: number,
  gap = ARROW_GAP
): [number, number] {
  const cx = el.x + el.width / 2;
  const cy = el.y + el.height / 2;
  const dx = tx - cx;
  const dy = ty - cy;
  if (dx === 0 && dy === 0) {
    return [cx, cy];
  }
  const hw = el.width / 2 || 1;
  const hh = el.height / 2 || 1;
  let t: number;
  if (el.type === "ellipse") {
    t = 1 / Math.sqrt((dx / hw) ** 2 + (dy / hh) ** 2);
  } else if (el.type === "diamond") {
    t = 1 / (Math.abs(dx) / hw + Math.abs(dy) / hh);
  } else {
    t = Math.min(
      dx === 0 ? Number.POSITIVE_INFINITY : hw / Math.abs(dx),
      dy === 0 ? Number.POSITIVE_INFINITY : hh / Math.abs(dy)
    );
  }
  const len = Math.hypot(dx, dy);
  return [cx + dx * t + (dx / len) * gap, cy + dy * t + (dy / len) * gap];
}

const center = (el: El): [number, number] => [
  el.x + el.width / 2,
  el.y + el.height / 2,
];

/** Point an arrow's ends at the shapes it's bound to. Mutates `arrow`. */
export function routeArrow(arrow: El, byId: Map<string, El>) {
  const start = arrow.startBinding
    ? byId.get(arrow.startBinding.elementId)
    : undefined;
  const end = arrow.endBinding
    ? byId.get(arrow.endBinding.elementId)
    : undefined;
  if (!(start || end)) {
    return;
  }
  const abs = (arrow.points as [number, number][]).map(
    ([px, py]) => [arrow.x + px, arrow.y + py] as [number, number]
  );
  const n = abs.length;
  // A straight arrow aims at the other end; a bent one at its nearest waypoint.
  const towardEnd = end ? center(end) : abs[n - 1];
  const towardStart = start ? center(start) : abs[0];
  const nextFromStart = n > 2 ? abs[1] : towardEnd;
  const nextFromEnd = n > 2 ? abs[n - 2] : towardStart;
  if (start) {
    abs[0] = edgePoint(start, nextFromStart[0], nextFromStart[1]);
  }
  if (end) {
    abs[n - 1] = edgePoint(end, nextFromEnd[0], nextFromEnd[1]);
  }
  setPoints(arrow, abs);
}

function setPoints(el: El, abs: [number, number][]) {
  const [ox, oy] = abs[0];
  el.x = ox;
  el.y = oy;
  el.points = abs.map(([px, py]) => [px - ox, py - oy]);
  const xs = el.points.map((p: number[]) => p[0]);
  const ys = el.points.map((p: number[]) => p[1]);
  el.width = Math.max(...xs) - Math.min(...xs);
  el.height = Math.max(...ys) - Math.min(...ys);
}

function addBound(el: El, id: string, type: "arrow" | "text") {
  const list = el.boundElements ?? [];
  if (!list.some((b) => b.id === id)) {
    el.boundElements = [...list, { id, type }];
  }
}

/** Center a container's label inside it (or at an arrow's midpoint). */
export function placeLabel(label: El, container: El) {
  if (container.type === "arrow" || container.type === "line") {
    const pts = container.points as [number, number][];
    const a = pts[Math.floor((pts.length - 1) / 2)];
    const b = pts[Math.ceil((pts.length - 1) / 2)];
    const mx = container.x + (a[0] + b[0]) / 2;
    const my = container.y + (a[1] + b[1]) / 2;
    label.x = mx - label.width / 2;
    label.y = my - label.height / 2;
  } else {
    label.x = container.x + (container.width - label.width) / 2;
    label.y = container.y + (container.height - label.height) / 2;
  }
}

function colors(s: Skeleton, filled: boolean) {
  const p = s.color ? PALETTE[s.color] : undefined;
  return {
    backgroundColor:
      s.backgroundColor ?? (filled && p ? p.fill : "transparent"),
    strokeColor: s.strokeColor ?? p?.stroke ?? "#1e1e1e",
  };
}

const styleProps = (s: Skeleton) => {
  const out: Partial<El> = {};
  for (const k of [
    "fillStyle",
    "strokeStyle",
    "strokeWidth",
    "roughness",
    "opacity",
  ] as const) {
    if (s[k] !== undefined) {
      out[k] = s[k];
    }
  }
  if (s.link) {
    out.link = s.link;
  }
  return out;
};

/**
 * Turn simplified element descriptions into full Excalidraw elements.
 * `existing` lets arrows bind to shapes already on the board; any shapes it
 * binds to come back in `touched` and must be saved too.
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: one pass per element type sharing the id maps; splitting it would scatter that shared state
export function buildElements(skeletons: Skeleton[], existing: El[]) {
  const created: El[] = [];
  const touched = new Map<string, El>();
  const idMap = new Map<string, El>();
  const byId = new Map<string, El>();
  for (const el of existing) {
    if (!el.isDeleted) {
      byId.set(el.id, el);
    }
  }

  const resolve = (ref: string) => idMap.get(ref) ?? byId.get(ref);
  const pending: { skel: Skeleton; el: El }[] = [];

  // Shapes and text first so arrows can bind to shapes created in the same call.
  const order = [...skeletons].sort(
    (a, b) =>
      Number(a.type === "arrow" || a.type === "line") -
      Number(b.type === "arrow" || b.type === "line")
  );

  for (const s of order) {
    const fontFamily = FONT[s.font ?? "hand"];
    const fontSize = s.fontSize ?? 20;
    if (s.type === "text") {
      const { strokeColor } = colors(s, false);
      const el = textElement(s.text ?? s.label ?? "", {
        containerId: null,
        fontFamily,
        fontSize,
        strokeColor,
        textAlign: s.textAlign ?? "left",
      });
      el.x = s.x ?? 0;
      el.y = s.y ?? 0;
      Object.assign(el, styleProps(s));
      register(s, el);
    } else if (
      s.type === "rectangle" ||
      s.type === "ellipse" ||
      s.type === "diamond"
    ) {
      const el = base(s.type, {
        ...colors(s, true),
        ...styleProps(s),
        roundness: s.type === "rectangle" ? { type: 3 } : { type: 2 },
      });
      let wrapped: string | undefined;
      if (s.label) {
        const shapeFactor = s.type === "rectangle" ? 1 : 1.45;
        const maxTextW = s.width
          ? s.width / shapeFactor - CONTAINER_PADDING * 2
          : 220;
        wrapped = wrapText(s.label, maxTextW, fontSize, fontFamily);
        const t = measureText(wrapped, fontSize, fontFamily);
        el.width =
          s.width ??
          Math.max(
            120,
            Math.ceil((t.width + CONTAINER_PADDING * 2) * shapeFactor)
          );
        el.height =
          s.height ??
          Math.max(
            60,
            Math.ceil((t.height + CONTAINER_PADDING * 2) * shapeFactor)
          );
      } else {
        el.width = s.width ?? 120;
        el.height = s.height ?? 80;
      }
      el.x = s.x ?? 0;
      el.y = s.y ?? 0;
      register(s, el);
      if (s.label && wrapped !== undefined) {
        const label = textElement(s.label, {
          containerId: el.id,
          fontFamily,
          fontSize,
          strokeColor: el.strokeColor,
          textAlign: s.textAlign ?? "center",
        });
        Object.assign(label, measureText(wrapped, fontSize, fontFamily), {
          text: wrapped,
        });
        addBound(el, label.id, "text");
        placeLabel(label, el);
        created.push(label);
      }
    } else if (s.type === "frame") {
      const el = base("frame", {
        backgroundColor: "transparent",
        height: s.height ?? 600,
        name: s.name ?? s.label ?? null,
        roughness: 0,
        strokeColor: "#bbb",
        width: s.width ?? 800,
        x: s.x ?? 0,
        y: s.y ?? 0,
      });
      register(s, el);
      pending.push({ el, skel: s });
    } else if (s.type === "arrow" || s.type === "line") {
      const endArrowhead =
        s.endArrowhead === undefined ? "arrow" : s.endArrowhead;
      const el = base(s.type, {
        ...colors(s, false),
        ...styleProps(s),
        endArrowhead: s.type === "arrow" ? endArrowhead : null,
        endBinding: null,
        lastCommittedPoint: null,
        points: [],
        roundness: { type: 2 },
        startArrowhead: s.type === "arrow" ? (s.startArrowhead ?? null) : null,
        startBinding: null,
        ...(s.type === "arrow" ? { elbowed: false } : {}),
      });
      register(s, el);
      const startEl = s.start ? resolve(s.start) : undefined;
      const endEl = s.end ? resolve(s.end) : undefined;
      if (s.start && !startEl) {
        throw new Error(
          `Arrow start "${s.start}" doesn't match any element id`
        );
      }
      if (s.end && !endEl) {
        throw new Error(`Arrow end "${s.end}" doesn't match any element id`);
      }

      const ox = s.x ?? 0;
      const oy = s.y ?? 0;
      let abs: [number, number][] = s.points?.length
        ? s.points.map(([px, py]) => [ox + px, oy + py])
        : [];
      if (abs.length < 2) {
        const a: [number, number] = startEl
          ? center(startEl)
          : (abs[0] ?? [ox, oy]);
        const b: [number, number] = endEl
          ? center(endEl)
          : [a[0] + (s.width ?? 150), a[1] + (s.height ?? 0)];
        abs = [a, ...(s.via ?? []), b];
      }
      setPoints(el, abs);
      if (s.type === "arrow") {
        for (const [bound, key] of [
          [startEl, "startBinding"],
          [endEl, "endBinding"],
        ] as const) {
          if (!(bound && isBindable(bound))) {
            continue;
          }
          el[key] = { elementId: bound.id, focus: 0, gap: ARROW_GAP };
          addBound(bound, el.id, "arrow");
          if (!(idMap.has(bound.id) || created.includes(bound))) {
            touched.set(bound.id, bound);
          }
        }
        routeArrow(
          el,
          new Map([
            ...byId,
            ...[...idMap.values()].map((e) => [e.id, e] as const),
          ])
        );
      }
      if (s.label) {
        const label = textElement(s.label, {
          containerId: el.id,
          fontFamily,
          fontSize: s.fontSize ?? 16,
          strokeColor: el.strokeColor,
          textAlign: "center",
        });
        addBound(el, label.id, "text");
        placeLabel(label, el);
        created.push(label);
      }
    }
  }

  // Frames claim their children once everything exists.
  for (const { skel, el } of pending) {
    for (const ref of skel.children ?? []) {
      const child = resolve(ref);
      if (!child) {
        throw new Error(`Frame child "${ref}" doesn't match any element id`);
      }
      child.frameId = el.id;
      if (!idMap.has(child.id)) {
        touched.set(child.id, child);
      }
      for (const b of child.boundElements ?? []) {
        const bound = byId.get(b.id) ?? created.find((c) => c.id === b.id);
        if (bound && b.type === "text") {
          bound.frameId = el.id;
        }
      }
    }
  }

  return {
    created,
    idMap: Object.fromEntries([...idMap].map(([k, v]) => [k, v.id])),
    touched: [...touched.values()],
  };

  function register(s: Skeleton, el: El) {
    if (s.id) {
      if (idMap.has(s.id) || byId.has(s.id)) {
        throw new Error(`Duplicate element id "${s.id}"`);
      }
      el.id = s.id;
    }
    idMap.set(s.id ?? el.id, el);
    created.push(el);
  }
}

/** Give new elements fractional indices that place them above everything else. */
export function assignIndices(existing: El[], fresh: El[]) {
  let top: string | null = null;
  for (const el of existing) {
    if (el.index && (top === null || el.index > top)) {
      top = el.index;
    }
  }
  const keys = generateNKeysBetween(top, null, fresh.length);
  for (const [i, el] of fresh.entries()) {
    el.index = keys[i];
  }
}

export function bump(el: El) {
  el.version += 1;
  el.versionNonce = randomInt();
  el.updated = Date.now();
}

/** Higher version wins; ties go to the lower nonce, as in Excalidraw's own reconciliation. */
export function isNewer(incoming: El, current: El | undefined) {
  if (!current) {
    return true;
  }
  if (incoming.version !== current.version) {
    return incoming.version > current.version;
  }
  return incoming.versionNonce < current.versionNonce;
}

const TOMBSTONE_TTL_MS = 30 * 24 * 3600 * 1000;

export function mergeElements(existing: El[], incoming: El[]) {
  const byId = new Map(existing.map((e) => [e.id, e]));
  let changed = 0;
  for (const el of incoming) {
    if (isNewer(el, byId.get(el.id))) {
      byId.set(el.id, el);
      changed += 1;
    }
  }
  const cutoff = Date.now() - TOMBSTONE_TTL_MS;
  const elements = [...byId.values()]
    .filter((e) => !(e.isDeleted && e.updated < cutoff))
    .sort((a, b) => compareIndex(a.index, b.index));
  return { changed, elements };
}

/** Order by fractional index, with unindexed elements last. */
function compareIndex(a: string | null, b: string | null) {
  if (a === b) {
    return 0;
  }
  if (a === null) {
    return 1;
  }
  if (b === null) {
    return -1;
  }
  return a < b ? -1 : 1;
}

export interface ElementPatch {
  angle?: number;
  backgroundColor?: string;
  color?: ColorName;
  fillStyle?: string;
  fontSize?: number;
  height?: number;
  id: string;
  label?: string;
  link?: string | null;
  locked?: boolean;
  name?: string;
  opacity?: number;
  roughness?: number;
  strokeColor?: string;
  strokeStyle?: string;
  strokeWidth?: number;
  text?: string;
  width?: number;
  x?: number;
  y?: number;
}

/** Apply patches to a copy of the scene and return every element that changed. */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: applies each patch field and its knock-on effects (labels, arrows, frame children) in one readable sequence
export function patchElements(elements: El[], patches: ElementPatch[]) {
  const byId = new Map(
    elements.filter((e) => !e.isDeleted).map((e) => [e.id, structuredClone(e)])
  );
  const changed = new Map<string, El>();
  const touch = (el: El) => changed.set(el.id, el);
  const created: El[] = [];

  for (const p of patches) {
    const el = byId.get(p.id);
    if (!el) {
      throw new Error(`No element with id "${p.id}"`);
    }
    const dx = p.x === undefined ? 0 : p.x - el.x;
    const dy = p.y === undefined ? 0 : p.y - el.y;
    const resized = p.width !== undefined || p.height !== undefined;

    if (p.color) {
      el.strokeColor = PALETTE[p.color].stroke;
      if (el.type !== "text" && el.type !== "arrow" && el.type !== "line") {
        el.backgroundColor = PALETTE[p.color].fill;
      }
    }
    for (const k of [
      "strokeColor",
      "backgroundColor",
      "fillStyle",
      "strokeStyle",
      "strokeWidth",
      "opacity",
      "roughness",
      "angle",
      "locked",
      "link",
    ] as const) {
      if (p[k] !== undefined) {
        el[k] = p[k];
      }
    }
    if (p.name !== undefined && el.type === "frame") {
      el.name = p.name;
    }
    if (p.width !== undefined) {
      el.width = p.width;
    }
    if (p.height !== undefined) {
      el.height = p.height;
    }
    el.x += dx;
    el.y += dy;

    if (el.type === "text") {
      const t = p.text ?? p.label;
      if (t !== undefined) {
        el.text = t;
        el.originalText = t;
      }
      if (p.fontSize !== undefined) {
        el.fontSize = p.fontSize;
      }
      if (
        p.text !== undefined ||
        p.label !== undefined ||
        p.fontSize !== undefined
      ) {
        Object.assign(el, measureText(el.text, el.fontSize, el.fontFamily));
      }
    }

    const labelText = p.label ?? (el.type === "text" ? undefined : p.text);
    const boundTextId = el.boundElements?.find((b) => b.type === "text")?.id;
    let label = boundTextId ? byId.get(boundTextId) : undefined;
    if (labelText !== undefined && el.type !== "text") {
      if (label) {
        label.text = labelText;
        label.originalText = labelText;
        Object.assign(
          label,
          measureText(labelText, label.fontSize, label.fontFamily)
        );
      } else {
        label = textElement(labelText, {
          containerId: el.id,
          fontFamily: 5,
          fontSize: p.fontSize ?? 20,
          strokeColor: el.strokeColor,
          textAlign: "center",
        });
        addBound(el, label.id, "text");
        byId.set(label.id, label);
        created.push(label);
      }
    }
    if (
      label &&
      (dx ||
        dy ||
        resized ||
        labelText !== undefined ||
        p.color ||
        p.strokeColor)
    ) {
      if (p.color || p.strokeColor) {
        label.strokeColor = el.strokeColor;
      }
      if (el.type !== "arrow" && el.type !== "line") {
        placeLabel(label, el);
      }
      touch(label);
    }

    if (el.type === "arrow" || el.type === "line") {
      if (dx || dy) {
        el.startBinding = null;
        el.endBinding = null;
      }
    } else if (dx || dy || resized) {
      for (const b of el.boundElements ?? []) {
        if (b.type !== "arrow") {
          continue;
        }
        const arrow = byId.get(b.id);
        if (!arrow) {
          continue;
        }
        routeArrow(arrow, byId);
        const arrowLabelId = arrow.boundElements?.find(
          (x) => x.type === "text"
        )?.id;
        const arrowLabel = arrowLabelId ? byId.get(arrowLabelId) : undefined;
        if (arrowLabel) {
          placeLabel(arrowLabel, arrow);
          touch(arrowLabel);
        }
        touch(arrow);
      }
      if (el.type === "frame" && (dx || dy)) {
        for (const child of byId.values()) {
          if (child.frameId !== el.id || child.id === el.id) {
            continue;
          }
          child.x += dx;
          child.y += dy;
          touch(child);
        }
      }
    }
    touch(el);
  }

  for (const el of changed.values()) {
    bump(el);
  }
  return {
    changed: [...changed.values()].filter((e) => !created.includes(e)),
    created,
  };
}

/** Mark elements deleted, along with their labels, and detach arrows from them. */
export function deleteElements(elements: El[], ids: string[]) {
  const byId = new Map(
    elements.filter((e) => !e.isDeleted).map((e) => [e.id, structuredClone(e)])
  );
  const doomed = collectDoomed(byId, ids);
  const changed = new Map<string, El>();
  for (const id of doomed) {
    const el = byId.get(id);
    if (!el) {
      continue;
    }
    el.isDeleted = true;
    changed.set(id, el);
  }
  for (const el of byId.values()) {
    if (!doomed.has(el.id) && detachFrom(el, doomed)) {
      changed.set(el.id, el);
    }
  }
  for (const el of changed.values()) {
    bump(el);
  }
  return [...changed.values()];
}

/** The ids to delete: the requested elements plus their labels. Unhooks deleted labels from their containers. */
function collectDoomed(byId: Map<string, El>, ids: string[]) {
  const doomed = new Set<string>();
  for (const id of ids) {
    const el = byId.get(id);
    if (!el) {
      throw new Error(`No element with id "${id}"`);
    }
    doomed.add(id);
    for (const b of el.boundElements ?? []) {
      if (b.type === "text") {
        doomed.add(b.id);
      }
    }
    if (el.containerId) {
      // Deleting a label: unhook it from its container.
      const c = byId.get(el.containerId);
      if (c) {
        c.boundElements = (c.boundElements ?? []).filter((b) => b.id !== id);
      }
    }
  }
  return doomed;
}

/** Drop `el`'s references to doomed elements. Returns whether anything changed. */
function detachFrom(el: El, doomed: Set<string>) {
  let dirty = false;
  if (el.boundElements?.some((b) => doomed.has(b.id))) {
    el.boundElements = el.boundElements.filter((b) => !doomed.has(b.id));
    dirty = true;
  }
  for (const key of ["startBinding", "endBinding"] as const) {
    if (el[key] && doomed.has(el[key].elementId)) {
      el[key] = null;
      dirty = true;
    }
  }
  if (el.frameId && doomed.has(el.frameId)) {
    el.frameId = null;
    dirty = true;
  }
  return dirty;
}

export function bounds(elements: El[]) {
  const live = elements.filter((e) => !e.isDeleted);
  if (!live.length) {
    return null;
  }
  let minX = Number.POSITIVE_INFINITY,
    minY = Number.POSITIVE_INFINITY,
    maxX = Number.NEGATIVE_INFINITY,
    maxY = Number.NEGATIVE_INFINITY;
  for (const e of live) {
    minX = Math.min(minX, e.x);
    minY = Math.min(minY, e.y);
    maxX = Math.max(maxX, e.x + Math.abs(e.width));
    maxY = Math.max(maxY, e.y + Math.abs(e.height));
  }
  return { maxX, maxY, minX, minY };
}

const r = (n: number) => Math.round(n);
const quote = (s: string) =>
  JSON.stringify(s.length > 80 ? `${s.slice(0, 77)}...` : s);

/** The non-default style and membership of an element, comma-separated. */
function styleOf(el: El) {
  return [
    el.strokeColor && el.strokeColor !== "#1e1e1e"
      ? `stroke ${el.strokeColor}`
      : "",
    el.backgroundColor && el.backgroundColor !== "transparent"
      ? `fill ${el.backgroundColor}`
      : "",
    el.strokeStyle && el.strokeStyle !== "solid" ? el.strokeStyle : "",
    el.frameId ? `in frame#${el.frameId}` : "",
    // biome-ignore lint/suspicious/noUnnecessaryConditions: boards hold unvalidated element JSON from browsers, which may omit groupIds
    el.groupIds?.length ? `group ${el.groupIds.at(-1)}` : "",
    el.locked ? "locked" : "",
    el.link ? `link ${el.link}` : "",
  ]
    .filter(Boolean)
    .join(", ");
}

/** A compact, line-per-element description of the board for agents. */
export function summarize(elements: El[]) {
  const live = elements.filter((e) => !e.isDeleted);
  const byId = new Map(live.map((e) => [e.id, e]));
  const labelOf = (el: El) => {
    const t = el.boundElements?.find((b) => b.type === "text");
    const text = t ? byId.get(t.id)?.text : undefined;
    return text ? ` ${quote(text.replace(/\n/g, " "))}` : "";
  };
  const ref = (id: string | undefined) => {
    const el = id ? byId.get(id) : undefined;
    return el ? `${el.type}#${el.id}${labelOf(el)}` : "nothing";
  };
  const lines: string[] = [];
  for (const el of live) {
    if (el.type === "text" && el.containerId && byId.has(el.containerId)) {
      continue;
    }
    const style = styleOf(el);
    const tail = style ? ` [${style}]` : "";
    switch (el.type) {
      case "text":
        lines.push(
          `text#${el.id} ${quote(el.text)} at (${r(el.x)},${r(el.y)}) size ${el.fontSize}${tail}`
        );
        break;
      case "arrow":
      case "line": {
        const from = el.startBinding
          ? ref(el.startBinding.elementId)
          : `(${r(el.x)},${r(el.y)})`;
        const last = el.points.at(-1) ?? [0, 0];
        const to = el.endBinding
          ? ref(el.endBinding.elementId)
          : `(${r(el.x + last[0])},${r(el.y + last[1])})`;
        lines.push(
          `${el.type}#${el.id}${labelOf(el)} from ${from} to ${to}${tail}`
        );
        break;
      }
      case "frame":
        lines.push(
          `frame#${el.id} ${quote(el.name ?? "")} at (${r(el.x)},${r(el.y)}) ${r(el.width)}x${r(el.height)}`
        );
        break;
      case "freedraw":
        lines.push(
          `freedraw#${el.id} (hand-drawn stroke) bbox (${r(el.x)},${r(el.y)}) ${r(el.width)}x${r(el.height)}${tail}`
        );
        break;
      case "image":
        lines.push(
          `image#${el.id} file ${el.fileId} at (${r(el.x)},${r(el.y)}) ${r(el.width)}x${r(el.height)}${tail}`
        );
        break;
      default:
        lines.push(
          `${el.type}#${el.id}${labelOf(el)} at (${r(el.x)},${r(el.y)}) ${r(el.width)}x${r(el.height)}${tail}`
        );
    }
  }
  return lines;
}
