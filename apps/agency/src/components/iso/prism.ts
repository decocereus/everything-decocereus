// Prisms along any axis and smooth balls, ported from the anatomy kit's lathe.mjs
// (prismOf, sphereOf and the vector helpers they need) so TypeScript figures can
// draw rods, rollers, levers and beams that do not stand on the floor.
import {
  cameraOf,
  type Flat,
  iso,
  type Point3,
  type Projection,
  pathOf,
  type SolidPaths,
} from "./iso-kit.ts";

const TAU = Math.PI * 2;
const LIGHT_UP = 1.2;
const BANDS = [0, 0.2, 0.42, 0.62];

export interface Frame3 {
  a: Point3;
  o: Point3;
  u: Point3;
  v: Point3;
}

export const dot3 = (a: Point3, b: Point3) =>
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const add3 = (a: Point3, b: Point3): Point3 => [
  a[0] + b[0],
  a[1] + b[1],
  a[2] + b[2],
];
export const sub3 = (a: Point3, b: Point3): Point3 => [
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2],
];
export const mul3 = (a: Point3, k: number): Point3 => [
  a[0] * k,
  a[1] * k,
  a[2] * k,
];
export const unit3 = (a: Point3): Point3 => {
  const length = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / length, a[1] / length, a[2] / length];
};
export const cross3 = (a: Point3, b: Point3): Point3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

export function viewOf(P: Projection): Point3 {
  const { sinA, cosA, sinE, cosE } = cameraOf(P);
  return [cosA * cosE, sinA * cosE, sinE];
}

export function lightOf(P: Projection): Point3 {
  const { sinA, cosA } = cameraOf(P);
  return unit3([-sinA, cosA, LIGHT_UP]);
}

function bandOf(score: number) {
  let tone = 0;
  while (tone < BANDS.length && score >= (BANDS[tone] ?? 1)) {
    tone += 1;
  }
  return tone;
}

export function frameAlong(o: Point3, a: Point3): Frame3 {
  const axis = unit3(a);
  const helper: Point3 = Math.abs(axis[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
  const u = unit3(cross3(helper, axis));
  return { a: axis, o, u, v: cross3(axis, u) };
}

export const frameOf = (
  o: Point3,
  a: Point3,
  u: Point3,
  v: Point3
): Frame3 => ({ a, o, u, v });

export function pointOf(
  F: Frame3,
  s: number,
  r: number,
  angle: number
): Point3 {
  const c = Math.cos(angle);
  const n = Math.sin(angle);
  return [
    F.o[0] + F.a[0] * s + r * (c * F.u[0] + n * F.v[0]),
    F.o[1] + F.a[1] * s + r * (c * F.u[1] + n * F.v[1]),
    F.o[2] + F.a[2] * s + r * (c * F.u[2] + n * F.v[2]),
  ];
}

export function hullOf(points: Flat[]): Flat[] {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (sorted.length < 3) {
    return sorted;
  }
  const cross = (o: Flat, a: Flat, b: Flat) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Flat[] = [];
  for (const point of sorted) {
    while (
      lower.length >= 2 &&
      cross(lower.at(-2) as Flat, lower.at(-1) as Flat, point) <= 1e-9
    ) {
      lower.pop();
    }
    lower.push(point);
  }
  const upper: Flat[] = [];
  for (let index = sorted.length - 1; index >= 0; index -= 1) {
    const point = sorted[index] as Flat;
    while (
      upper.length >= 2 &&
      cross(upper.at(-2) as Flat, upper.at(-1) as Flat, point) <= 1e-9
    ) {
      upper.pop();
    }
    upper.push(point);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

function area(points: Flat[]) {
  let sum = 0;
  for (let index = 0; index < points.length; index += 1) {
    const [ax, ay] = points[index] as Flat;
    const [bx, by] = points[(index + 1) % points.length] as Flat;
    sum += ax * by - bx * ay;
  }
  return sum / 2;
}

const oriented = (points: Flat[]) =>
  area(points) < 0 ? [...points].reverse() : points;

export const circleOf = (r: number, steps = 24): Flat[] =>
  Array.from(
    { length: steps },
    (_, index) =>
      [
        r * Math.cos((index / steps) * TAU),
        r * Math.sin((index / steps) * TAU),
      ] as Flat
  );

export const boxOf = (hu: number, hv: number): Flat[] => [
  [-hu, -hv],
  [hu, -hv],
  [hu, hv],
  [-hu, hv],
];

// A prism of a convex polygon (in the frame's u, v plane) from s0 to s1 along F.a.
// Facets are shaded by facing; the cap that faces the light most is the "top".
export function prismOf(
  F: Frame3,
  polygon: Flat[],
  s0: number,
  s1: number,
  P: Projection
): SolidPaths {
  const V = viewOf(P);
  const L = lightOf(P);
  const ring = oriented(polygon);
  const n = ring.length;
  const at = (s: number, [x, y]: Flat): Point3 => [
    F.o[0] + F.a[0] * s + F.u[0] * x + F.v[0] * y,
    F.o[1] + F.a[1] * s + F.u[1] * x + F.v[1] * y,
    F.o[2] + F.a[2] * s + F.u[2] * x + F.v[2] * y,
  ];
  const low = ring.map((point) => iso(at(s0, point), P));
  const high = ring.map((point) => iso(at(s1, point), P));
  const buckets: string[][] = [[], [], [], [], []];
  const seen: boolean[] = [];
  for (let j = 0; j < n; j += 1) {
    const [x0, y0] = ring[j] as Flat;
    const [x1, y1] = ring[(j + 1) % n] as Flat;
    const normal = unit3(add3(mul3(F.u, y1 - y0), mul3(F.v, -(x1 - x0))));
    const visible = dot3(normal, V) > 1e-6;
    seen.push(visible);
    if (visible) {
      buckets[bandOf(dot3(normal, L))]?.push(
        pathOf(
          [
            low[j] as Flat,
            low[(j + 1) % n] as Flat,
            high[(j + 1) % n] as Flat,
            high[j] as Flat,
          ],
          true
        )
      );
    }
  }
  const ends: [Flat[], Point3][] = [
    [low, mul3(F.a, -1)],
    [high, F.a],
  ];
  const capSeen = ends.map(([, normal]) => dot3(normal, V) > 1e-6);
  ends.forEach(([points, normal], index) => {
    if (capSeen[index]) {
      buckets[bandOf(dot3(normal, L))]?.push(pathOf(points, true));
    }
  });
  const hull = hullOf([...low, ...high]);
  const creases: string[] = [];
  for (let j = 0; j < n; j += 1) {
    const prev = (j - 1 + n) % n;
    const here = ring[j] as Flat;
    const before = ring[prev] as Flat;
    const after = ring[(j + 1) % n] as Flat;
    const a: Flat = [here[0] - before[0], here[1] - before[1]];
    const b: Flat = [after[0] - here[0], after[1] - here[1]];
    const sharp =
      (a[0] * b[0] + a[1] * b[1]) /
        (Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1]) || 1) <
      Math.cos(0.35);
    if (sharp && seen[j] && seen[prev]) {
      creases.push(pathOf([low[j] as Flat, high[j] as Flat]));
    }
    ends.forEach(([points], index) => {
      if (capSeen[index] && seen[j]) {
        creases.push(pathOf([points[j] as Flat, points[(j + 1) % n] as Flat]));
      }
    });
  }
  return {
    crease: creases.join(""),
    fill: pathOf(hull, true),
    outline: pathOf(hull, true),
    shades: buckets.slice(0, 4).map((list) => list.join("")),
    top: (buckets[4] ?? []).join(""),
  };
}

// A drum (round bar) along a world axis: rods, rollers, knobs, bosses.
export function drumOf(
  from: Point3,
  axis: Point3,
  length: number,
  r: number,
  P: Projection,
  steps = 28
): SolidPaths {
  return prismOf(frameAlong(from, axis), circleOf(r, steps), 0, length, P);
}

// A ball with exact smooth tones: each tone region is the hull of a spherical cap.
export function sphereOf(
  centre: Point3,
  r: number,
  P: Projection,
  steps = 40
): SolidPaths {
  const V = viewOf(P);
  const L = lightOf(P);
  const F = frameAlong(centre, V);
  const flat = (p: Point3) => iso(p, P);
  const rim = Array.from({ length: steps }, (_, index) =>
    pointOf(F, 0, r, (index / steps) * TAU)
  );
  const outline = pathOf(rim.map(flat), true);
  const capOf = (threshold: number) => {
    const points = rim
      .filter((p) => dot3(sub3(p, centre), L) / r >= threshold)
      .map(flat);
    const c = dot3(L, V);
    const LF = frameAlong(add3(centre, mul3(L, r * threshold)), L);
    const radius = r * Math.sqrt(Math.max(0, 1 - threshold * threshold));
    for (let index = 0; index < steps; index += 1) {
      const p = pointOf(LF, 0, radius, (index / steps) * TAU);
      if (dot3(sub3(p, centre), V) >= -1e-9) {
        points.push(flat(p));
      }
    }
    if (c > threshold) {
      points.push(flat(add3(centre, mul3(V, r))));
    }
    return points.length > 2 ? pathOf(hullOf(points), true) : "";
  };
  return {
    crease: "",
    fill: outline,
    outline,
    seamless: true,
    shades: [
      outline,
      capOf(BANDS[1] ?? 0.2),
      capOf(BANDS[2] ?? 0.42),
      capOf(BANDS[3] ?? 0.62),
    ],
    top: "",
  };
}
