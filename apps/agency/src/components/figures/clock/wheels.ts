// Flat outlines of the parts that turn, centred on their arbor, at rest.

import { arcs, type Flat, num, pt, TAU } from "./plane.ts";

const at = (r: number, th: number): Flat => [
  r * Math.cos(th),
  r * Math.sin(th),
];

interface Teeth {
  addendum?: number;
  count: number;
  dedendum?: number;
  module: number;
  phase?: number;
  pitch: number;
  // Half-widths of each tooth as a share of one pitch, at the root and the tip.
  root?: number;
  tip?: number;
}

// Wheel teeth and pinion leaves with rounded tips, the way clock trains are cut.
export function teeth({
  count,
  pitch,
  module,
  phase = 0,
  root = 0.3,
  tip = 0.15,
  addendum = 0.95,
  dedendum = 1.25,
}: Teeth) {
  const step = TAU / count;
  const outer = pitch + addendum * module;
  const inner = pitch - dedendum * module;
  const shoulder = outer - 0.45 * module;
  const crown = outer + 0.3 * module;
  const origin: Flat = [0, 0];
  let d = `M${pt(at(inner, phase - step / 2))}`;
  for (let index = 0; index < count; index += 1) {
    const a = phase + index * step;
    d += arcs(origin, inner, a - step / 2, a - root * step);
    d += `L${pt(at(shoulder, a - tip * step))}`;
    d += `Q${pt(at(crown, a))} ${pt(at(shoulder, a + tip * step))}`;
    d += `L${pt(at(inner, a + root * step))}`;
    d += arcs(origin, inner, a + root * step, a + step / 2);
  }
  return `${d}Z`;
}

// Club teeth of an escape wheel, leaning the way it turns (clockwise).
export function clubTeeth(
  count: number,
  outer: number,
  inner: number,
  phase = 0
) {
  const step = TAU / count;
  const origin: Flat = [0, 0];
  let d = `M${pt(at(inner, phase - 0.42 * step))}`;
  for (let index = 0; index < count; index += 1) {
    const a = phase + index * step;
    d += `L${pt(at(outer, a + 0.06 * step))}`;
    d += `L${pt(at(outer - 1.6, a + 0.17 * step))}`;
    d += `L${pt(at(inner + 1.2, a + 0.1 * step))}`;
    d += `L${pt(at(inner, a + 0.12 * step))}`;
    d += arcs(origin, inner, a + 0.12 * step, a + 0.58 * step);
  }
  return `${d}Z`;
}

// Windows between the crossings (spokes) of a wheel, cut with evenodd.
export function windows(
  spokes: number,
  rim: number,
  hub: number,
  half: number,
  phase = 0
) {
  const origin: Flat = [0, 0];
  const atRim = Math.asin(half / rim);
  const atHub = Math.asin(half / hub);
  let d = "";
  for (let index = 0; index < spokes; index += 1) {
    const a = phase + (index * TAU) / spokes;
    const b = phase + ((index + 1) * TAU) / spokes;
    d += `M${pt(at(rim, a + atRim))}${arcs(origin, rim, a + atRim, b - atRim)}`;
    d += `L${pt(at(hub, b - atHub))}${arcs(origin, hub, b - atHub, a + atHub)}Z`;
  }
  return d;
}

// A flat bar with round ends from a to b: a lever, a yoke, a spring.
export function capsule(a: Flat, b: Flat, half: number) {
  const th = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const side = th + Math.PI / 2;
  const off = (p: Flat, s: number): Flat => [
    p[0] + s * half * Math.cos(side),
    p[1] + s * half * Math.sin(side),
  ];
  return `M${pt(off(a, 1))}L${pt(off(b, 1))}${arcs(b, half, side, side - Math.PI)}L${pt(off(a, -1))}${arcs(a, half, side - Math.PI, side - 2 * Math.PI)}Z`;
}

export const disc = (r: number) => `M${num(r)} 0${arcs([0, 0], r, 0, TAU)}Z`;

// A watch hand pointing at angle th (0 is three o'clock, clockwise): a hub
// with a tapered blade, and an optional counterweight tail.
export function hand({
  length,
  width,
  hub,
  tail,
  th,
}: {
  length: number;
  width: number;
  hub: number;
  tail: number;
  th: number;
}) {
  const turn = (p: Flat): Flat => [
    p[0] * Math.cos(th) - p[1] * Math.sin(th),
    p[0] * Math.sin(th) + p[1] * Math.cos(th),
  ];
  // Drawn pointing along +x, then turned.
  const root = 0.55 * hub;
  const base = Math.sqrt(hub * hub - root * root);
  const belly = Math.min(width, hub * 0.95);
  const blade: Flat[] = [
    [base, -root],
    [length * 0.45, -belly],
    [length * 0.86, -belly * 0.62],
    [length, 0],
    [length * 0.86, belly * 0.62],
    [length * 0.45, belly],
    [base, root],
  ];
  const origin: Flat = [0, 0];
  const a = Math.atan2(root, base);
  let d = `M${blade.map((p) => pt(turn(p))).join("L")}`;
  if (tail > 0) {
    const waist = 0.42 * hub;
    const leave = Math.PI - Math.asin(waist / hub);
    d += arcRound(origin, hub, a, leave, th);
    d += `L${pt(turn([-tail, waist * 0.8]))}`;
    d += `Q${pt(turn([-tail - waist * 1.4, 0]))} ${pt(turn([-tail, -waist * 0.8]))}`;
    d += `L${pt(turn([hub * Math.cos(leave), -hub * Math.sin(leave)]))}`;
    d += arcRound(origin, hub, TAU - leave, TAU - a, th);
  } else {
    d += arcRound(origin, hub, a, TAU - a, th);
  }
  return `${d}Z`;
}

function arcRound(c: Flat, r: number, a0: number, a1: number, th: number) {
  return arcs(c, r, a0 + th, a1 + th);
}

// The pallet fork: two arms reaching to the escape wheel and a lever with a
// notch for the balance's impulse pin. Pivot at the origin; the lever points
// along th, the lower arm ends at `arm` (in the lever's frame) and the upper
// arm mirrors it.
export function fork(th: number, arm: Flat, lever: number) {
  const turn = (p: Flat): Flat => [
    p[0] * Math.cos(th) - p[1] * Math.sin(th),
    p[0] * Math.sin(th) + p[1] * Math.cos(th),
  ];
  const w = 1.9;
  const len = Math.hypot(arm[0], arm[1]);
  const u: Flat = [arm[0] / len, arm[1] / len];
  const out: Flat = [u[1], -u[0]];
  const along = (s: number, side: number): Flat => [
    s * u[0] + side * w * out[0],
    s * u[1] + side * w * out[1],
  ];
  const mirror = (p: Flat): Flat => [p[0], -p[1]];
  const join = along((w * (1 + u[0])) / u[1], 1);
  const crotch = along((-w * u[0]) / u[1], -1);
  const outerEnd = along(len, 1);
  const innerEnd = along(len, -1);
  const points: Flat[] = [
    mirror(join),
    [lever - 6, -w],
    [lever - 6, -3.6],
    [lever, -3.6],
    [lever, -1.2],
    [lever - 3.8, -1.2],
    [lever - 3.8, 1.2],
    [lever, 1.2],
    [lever, 3.6],
    [lever - 6, 3.6],
    [lever - 6, w],
    join,
    outerEnd,
    innerEnd,
    [crotch[0], 0],
    mirror(innerEnd),
    mirror(outerEnd),
  ];
  return `M${points.map((p) => pt(turn(p))).join("L")}Z`;
}
