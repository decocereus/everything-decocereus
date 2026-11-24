// Paths for the parts that turn, rebuilt each frame on the client.
import {
  type Flat,
  lineOnTop,
  type Point3,
  pathOf,
  type SolidPaths,
} from "../../iso/iso-kit.ts";
import {
  circleOf,
  dot3,
  frameOf,
  hullOf,
  prismOf,
  viewOf,
} from "../../iso/prism.ts";
import { at, BELT_Z, CRANK, CRANK_ARM, P, PLATEN, ROLL } from "./view.ts";

const V = viewOf(P);
const TAU = Math.PI * 2;
const MARK_PITCH = 8;

/** Cross lines on a belt run, carried along by the belt's travel b. */
export function beltMarks(x0: number, x1: number, b: number) {
  const lines: string[] = [];
  const first =
    x0 + 1.5 + ((((b - x0) % MARK_PITCH) + MARK_PITCH) % MARK_PITCH);
  for (let x = first; x <= x1 - 1.5; x += MARK_PITCH) {
    lines.push(lineOnTop([x, -14], [x, 14], BELT_Z, P));
  }
  return lines.join("");
}

// The crank arm: a flat link from the hub to the handle, in the plane y = const.
const ARM_SHAPE: Flat[] = (() => {
  const points: Flat[] = [];
  for (const [cx, r] of [
    [0, 3.4],
    [CRANK_ARM, 2.4],
  ] as const) {
    for (const [u, v] of circleOf(r, 20)) {
      points.push([cx + u, v]);
    }
  }
  return hullOf(points);
})();

/** The arm turned to angle θ (0 points along +x, turning toward +z). */
export function crankArm(angle: number): SolidPaths {
  const u: Point3 = [Math.cos(angle), 0, Math.sin(angle)];
  const v: Point3 = [-Math.sin(angle), 0, Math.cos(angle)];
  const F = frameOf([CRANK[0], CRANK[1] + 6, CRANK[2]], [0, 1, 0], u, v);
  return prismOf(F, ARM_SHAPE, 0, 2, P);
}

/** Where the handle sits for an arm angle, as a world offset from the hub. */
export const handleOffset = (angle: number): Point3 => [
  CRANK_ARM * Math.cos(angle),
  0,
  CRANK_ARM * Math.sin(angle),
];

export interface Mark {
  alpha: number;
  d: string;
}

/**
 * Lines along a drum lying on y, turned by `turn`. Each line fades out as it
 * turns toward the limb, so none of them pops on or off.
 */
function drumMarks(
  cx: number,
  cz: number,
  r: number,
  y0: number,
  y1: number,
  turn: number,
  count: number
): Mark[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = turn + (index / count) * TAU;
    const normal: Point3 = [Math.cos(angle), 0, Math.sin(angle)];
    const facing = dot3(normal, V);
    const t = Math.min(1, Math.max(0, (facing - 0.15) / 0.45));
    return {
      alpha: t * t * (3 - 2 * t),
      d: pathOf([
        at([cx + r * normal[0], y0, cz + r * normal[2]]),
        at([cx + r * normal[0], y1, cz + r * normal[2]]),
      ]),
    };
  });
}

export const ROLL_MARKS = 6;
export const PLATEN_MARKS = 5;

export const rollMarks = (turn: number) =>
  drumMarks(ROLL.x, ROLL.z, ROLL.r, -13, 13, turn, ROLL_MARKS);

export const platenMarks = (turn: number) =>
  drumMarks(PLATEN.x, PLATEN.z, PLATEN.r, -15, 15, turn, PLATEN_MARKS);
