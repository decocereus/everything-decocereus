// The camera and the drawing primitives for a clock whose every part lies in a
// plane across one axis.
//
// The view is orthographic, so the map from a dial plane to the screen is
// affine. The whole figure is drawn flat in dial-plane coordinates (x toward
// three o'clock, y toward six), and one matrix on the outer group turns that
// flat drawing into the view. A step along the clock's axis is a fixed shift
// in those coordinates (OFF), so a disc of thickness t is a circle and the
// same circle shifted by t * OFF, joined by its two tangents. A gear turning
// on its arbor is a plain rotate() in the flat drawing.

export type Flat = [number, number];
type V3 = [number, number, number];

export const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const scale3 = (a: V3, by: number): V3 => [a[0] * by, a[1] * by, a[2] * by];
const sub3 = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unit3 = (a: V3) => scale3(a, 1 / Math.hypot(a[0], a[1], a[2]));
const cross3 = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

// Camera space: x to the right of the screen, y down it, z toward the viewer.
// TILT is the angle between the clock's axis and the line of sight, SLOPE the
// direction the axis runs on screen, below the horizontal.
const TILT = 58 * DEG;
const SLOPE = 27 * DEG;
const AXIS: V3 = [
  Math.sin(TILT) * Math.cos(SLOPE),
  Math.sin(TILT) * Math.sin(SLOPE),
  -Math.cos(TILT),
];
const TWELVE = unit3(sub3([0, -1, 0], scale3(AXIS, -AXIS[1])));
const ACROSS = unit3(cross3(TWELVE, AXIS));
const U: V3 = ACROSS[0] < 0 ? scale3(ACROSS, -1) : ACROSS;
const W: V3 = scale3(TWELVE, -1);
const LIGHT = unit3([-0.55, -0.75, 0.5]);

if (dot3(cross3(U, W), AXIS) > 0) {
  throw new Error("clock plane is mirrored");
}

// Flat dial-plane coordinates to screen: sx = M[0] x + M[1] y, sy = M[2] x + M[3] y.
export const M = [U[0], W[0], U[1], W[1]] as const;
const DET = M[0] * M[3] - M[1] * M[2];
export const OFF: Flat = [
  (M[3] * AXIS[0] - M[1] * AXIS[1]) / DET,
  (-M[2] * AXIS[0] + M[0] * AXIS[1]) / DET,
];
export const PSI = Math.atan2(OFF[1], OFF[0]);
const REACH = Math.hypot(OFF[0], OFF[1]);

// The four kit tones for a surface whose normal lies in the plane at angle th.
export function toneAt(th: number, inward = false) {
  const sign = inward ? -1 : 1;
  const normal: V3 = [
    sign * (Math.cos(th) * U[0] + Math.sin(th) * W[0]),
    sign * (Math.cos(th) * U[1] + Math.sin(th) * W[1]),
    sign * (Math.cos(th) * U[2] + Math.sin(th) * W[2]),
  ];
  const lit = (dot3(normal, LIGHT) + 1) / 2;
  return Math.min(3, Math.max(0, Math.floor(lit * 4)));
}

// How squarely the side of a round part at angle th faces the viewer, 0..1.
export const facing = (th: number) => Math.max(0, Math.cos(th - PSI));

// How much nearer the viewer a point in the plane is, for ties within a layer.
export const nearness = (x: number, y: number) => x * U[2] + y * W[2];

export const at = (x: number, y: number, z: number): Flat => [
  x + z * OFF[0],
  y + z * OFF[1],
];
export const polar = (c: Flat, r: number, th: number): Flat => [
  c[0] + r * Math.cos(th),
  c[1] + r * Math.sin(th),
];

export function num(value: number) {
  const text = (Math.round(value * 10) / 10).toString();
  return text === "-0" ? "0" : text;
}
export const pt = (p: Flat) => `${num(p[0])} ${num(p[1])}`;

// Arc commands from the point at angle a0 to the one at a1, in pieces of at
// most a quarter turn so the flags are never ambiguous.
export function arcs(c: Flat, r: number, a0: number, a1: number) {
  const pieces = Math.max(1, Math.ceil(Math.abs(a1 - a0) / (Math.PI / 2)));
  const sweep = a1 > a0 ? 1 : 0;
  let out = "";
  for (let index = 1; index <= pieces; index += 1) {
    const p = polar(c, r, a0 + ((a1 - a0) * index) / pieces);
    out += `A${num(r)} ${num(r)} 0 0 ${sweep} ${pt(p)}`;
  }
  return out;
}

export const circle = (c: Flat, r: number) =>
  `M${pt(polar(c, r, 0))}${arcs(c, r, 0, TAU)}Z`;

export const arcLine = (c: Flat, r: number, a0: number, a1: number) =>
  `M${pt(polar(c, r, a0))}${arcs(c, r, a0, a1)}`;

export const line = (points: Flat[], closed = false) =>
  `M${points.map(pt).join("L")}${closed ? "Z" : ""}`;

// ---------------------------------------------------------------------------
// Markup as data, rendered by figure.tsx.

export type Tone = "hi" | "mid" | "lo" | "faint";

export interface PathNode {
  cls: string;
  d: string;
  evenodd?: boolean;
  kind: "path";
  opacity?: number;
  shade?: number;
  tone?: Tone;
}
export interface UseNode {
  cls: string;
  href: string;
  kind: "use";
  spin?: string;
}
export interface GroupNode {
  children: Node[];
  cls?: string;
  kind: "g";
  spin?: string;
  transform?: string;
}
export type Node = PathNode | UseNode | GroupNode;

export const path = (
  d: string,
  cls: string,
  extra: Omit<PathNode, "kind" | "d" | "cls"> = {}
): PathNode => ({ cls, d, kind: "path", ...extra });
export const stroke = (d: string, tone: Tone = "lo"): PathNode =>
  path(d, "iso-line", { tone });
export const group = (
  children: Node[],
  extra: Omit<GroupNode, "kind" | "children"> = {}
): GroupNode => ({ children, kind: "g", ...extra });
export const shift = (p: Flat) => `translate(${num(p[0])} ${num(p[1])})`;

// ---------------------------------------------------------------------------
// The screen box of everything drawn, in flat coordinates per circle.

export const bounds = { maxX: -1e9, maxY: -1e9, minX: 1e9, minY: 1e9 };
const SPAN_X = Math.hypot(M[0], M[1]);
const SPAN_Y = Math.hypot(M[2], M[3]);
export function grow(c: Flat, r: number) {
  const sx = M[0] * c[0] + M[1] * c[1];
  const sy = M[2] * c[0] + M[3] * c[1];
  bounds.minX = Math.min(bounds.minX, sx - r * SPAN_X);
  bounds.maxX = Math.max(bounds.maxX, sx + r * SPAN_X);
  bounds.minY = Math.min(bounds.minY, sy - r * SPAN_Y);
  bounds.maxY = Math.max(bounds.maxY, sy + r * SPAN_Y);
}

// ---------------------------------------------------------------------------
// Round solids along the axis. Each takes the centre in the plane and the
// axial span [z0, z1]; z grows away from the viewer, so z0 is the face you see.

interface Band {
  a: number;
  b: number;
  shade: number;
}

// Facets of a round side between angles from and to, merged into runs of
// one tone.
function bandsOf(r: number, from: number, to: number, inward: boolean) {
  const count = Math.max(12, Math.min(72, Math.round(r * 0.7)));
  const bands: Band[] = [];
  for (let index = 0; index < count; index += 1) {
    const a = from + ((to - from) * index) / count;
    const b = from + ((to - from) * (index + 1)) / count;
    const shade = toneAt((a + b) / 2, inward);
    const last = bands.at(-1);
    if (last && last.shade === shade) {
      last.b = b;
    } else {
      bands.push({ a, b, shade });
    }
  }
  return bands;
}

function wall(
  c0: Flat,
  c1: Flat,
  r: number,
  from: number,
  to: number,
  inward = false
) {
  return bandsOf(r, from, to, inward).map((band) =>
    path(
      `M${pt(polar(c0, r, band.a))}${arcs(c0, r, band.a, band.b)}L${pt(polar(c1, r, band.b))}${arcs(c1, r, band.b, band.a)}Z`,
      "iso-shade",
      { shade: band.shade }
    )
  );
}

const EDGE_A = PSI - Math.PI / 2;
const EDGE_B = PSI + Math.PI / 2;

function hull(c0: Flat, c1: Flat, r: number) {
  return `M${pt(polar(c0, r, EDGE_B))}${arcs(c0, r, EDGE_B, EDGE_A + TAU)}L${pt(polar(c1, r, EDGE_A))}${arcs(c1, r, EDGE_A, EDGE_B)}Z`;
}

export interface SolidStyle {
  cls?: string;
  crease?: Tone;
  face?: string;
  inner?: Node[];
  // The back end runs on into another piece of the same rod: no edge there.
  joined?: boolean;
  seams?: number[];
  tone?: Tone;
}

export function cylinder(
  x: number,
  y: number,
  r: number,
  z0: number,
  z1: number,
  style: SolidStyle = {}
): GroupNode {
  const { tone = "hi", crease = "faint", face = "iso-top", inner = [] } = style;
  const c0 = at(x, y, z0);
  const c1 = at(x, y, z1);
  grow(c0, r);
  grow(c1, r);
  const outline = hull(c0, c1, r);
  const edge = style.joined
    ? `${arcLine(c0, r, EDGE_B, EDGE_A + TAU)}L${pt(polar(c1, r, EDGE_A))}M${pt(polar(c1, r, EDGE_B))}L${pt(polar(c0, r, EDGE_B))}`
    : outline;
  const seams = (style.seams ?? []).map((z) =>
    stroke(arcLine(at(x, y, z), r, EDGE_A, EDGE_B), "faint")
  );
  return group(
    [
      path(outline, "iso-fill"),
      ...wall(c0, c1, r, EDGE_A, EDGE_B),
      path(circle(c0, r), face),
      ...seams,
      ...inner,
      stroke(arcLine(c0, r, EDGE_A, EDGE_B), crease),
      stroke(edge, tone),
    ],
    { cls: style.cls ? `iso-solid ${style.cls}` : "iso-solid" }
  );
}

// An annulus with thickness: a bezel, a drum, a plate with a bore.
export function ring(
  x: number,
  y: number,
  inside: number,
  r: number,
  z0: number,
  z1: number,
  style: SolidStyle = {}
): GroupNode {
  const { tone = "hi", crease = "faint", face = "iso-top", inner = [] } = style;
  const c0 = at(x, y, z0);
  const c1 = at(x, y, z1);
  grow(c0, r);
  grow(c1, r);
  const outline = hull(c0, c1, r);
  const gap = Math.min(0.999, ((z1 - z0) * REACH) / (2 * inside));
  const gamma = Math.acos(gap);
  const far = PSI + Math.PI;
  const lens = `M${pt(polar(c0, inside, PSI - gamma))}${arcs(c0, inside, PSI - gamma, PSI + gamma)}${arcs(c1, inside, far - gamma, far + gamma)}Z`;
  const seams = (style.seams ?? []).map((z) =>
    stroke(arcLine(at(x, y, z), r, EDGE_A, EDGE_B), "faint")
  );
  return group(
    [
      path(outline + lens, "iso-fill", { evenodd: true }),
      ...wall(c0, c1, r, EDGE_A, EDGE_B),
      ...wall(c0, c1, inside, EDGE_B, EDGE_A + TAU, true),
      path(circle(c0, r) + circle(c0, inside), face, { evenodd: true }),
      ...seams,
      ...inner,
      // The far rim seen through the hole, unless the hole is nearly shut.
      ...(inside * gamma > 1
        ? [stroke(arcLine(c1, inside, far - gamma, far + gamma), "lo")]
        : []),
      stroke(arcLine(c0, r, EDGE_A, EDGE_B), crease),
      stroke(circle(c0, inside), tone),
      stroke(outline, tone),
    ],
    { cls: style.cls ? `iso-solid ${style.cls}` : "iso-solid" }
  );
}

// Lines across the visible side of a round part, at each angle, fading toward
// the limbs instead of stopping: flutes on a bezel, the knurl on a crown.
export function flutes(
  x: number,
  y: number,
  r: number,
  z0: number,
  z1: number,
  count: number,
  tone: Tone = "lo"
): Node[] {
  const c0 = at(x, y, z0);
  const c1 = at(x, y, z1);
  const buckets = new Map<number, string>();
  for (let index = 0; index < count; index += 1) {
    const th = (index / count) * TAU;
    const alpha = Math.round(smooth(0.08, 0.6, facing(th)) * 20) / 20;
    if (alpha > 0.02) {
      const d = line([polar(c0, r, th), polar(c1, r, th)]);
      buckets.set(alpha, (buckets.get(alpha) ?? "") + d);
    }
  }
  return [...buckets].map(([alpha, d]) =>
    path(d, "iso-line", { opacity: alpha, tone })
  );
}

export function smooth(lo: number, hi: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - lo) / (hi - lo)));
  return t * t * (3 - 2 * t);
}

// A part that turns: one flat outline (a def), stacked along the axis so the
// stack reads as its thickness. The back copy carries the far edge, the
// middle copies fill the side, the front copy is the face. Every copy turns
// together through `spin`.
export function stack(
  href: string,
  x: number,
  y: number,
  z0: number,
  depth: number,
  spin?: string,
  front: Node[] = [],
  kind = "ck-part"
): GroupNode {
  const reach = depth * REACH;
  const count = Math.max(2, Math.ceil(reach / 0.55) + 1);
  const copies: Node[] = [];
  for (let index = count - 1; index >= 0; index -= 1) {
    const z = z0 + (depth * index) / (count - 1);
    let role = "mid";
    if (index === count - 1) {
      role = "back";
    } else if (index === 0) {
      role = "front";
    }
    const turning: Node[] = [
      { cls: `${kind}-${role}`, href, kind: "use", spin },
    ];
    if (index === 0 && front.length > 0) {
      turning.push(group(front, { spin }));
    }
    copies.push(group(turning, { transform: shift(at(x, y, z)) }));
  }
  return group(copies, { cls: kind });
}
