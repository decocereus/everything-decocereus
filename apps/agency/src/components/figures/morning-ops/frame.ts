// Paths for the parts that change shape or turn, rebuilt each frame on the client.
import {
  cylinder,
  type Flat,
  onTop,
  type Point3,
  pathOf,
  type SolidPaths,
  sideSeam,
  slabOf,
} from "../../iso/iso-kit.ts";
import {
  boxOf,
  dot3,
  drumOf,
  prismOf,
  sphereOf,
  viewOf,
} from "../../iso/prism.ts";
import {
  ARM,
  at,
  BAL_X,
  BAL_Y,
  BEAM_HALF,
  CAPSTAN,
  CARD_FLOOR,
  CARD_T,
  CARDS,
  DIAL_C,
  DIAL_R,
  HEAD,
  LEVER_DOWN,
  LEVER_LEN,
  LEVER_PIVOT,
  LEVER_REST,
  P,
  PACK_BIG,
  PACK_H,
  PACK_SMALL,
  PACK_Z,
  PIVOT_Z,
  PLATEN_FROM,
  PLATEN_R,
  PLATEN_TO,
  PLATEN_Y,
  PLATEN_Z,
  POST_A,
  POST_B,
  SCALE_FACE,
  SUPPLY,
  TAKEUP,
  TAPE_Z,
} from "./view.ts";

const TAU = Math.PI * 2;
const RADIANS = Math.PI / 180;
const V = viewOf(P);

/** Pack radii for a share of the tape played: the area of tape is conserved. */
export function packRadii(share: number): [number, number] {
  const swing = PACK_BIG ** 2 - PACK_SMALL ** 2;
  return [
    Math.sqrt(PACK_BIG ** 2 - swing * share),
    Math.sqrt(PACK_SMALL ** 2 + swing * share),
  ];
}

/** Tape length that has moved for a share played, in world units along the tape. */
export const TAPE_LENGTH = 72;

function touch(
  from: [number, number],
  centre: [number, number],
  r: number
): [number, number] {
  const dx = from[0] - centre[0];
  const dy = from[1] - centre[1];
  const d = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx) + Math.acos(Math.min(1, r / d));
  return [centre[0] + r * Math.cos(angle), centre[1] + r * Math.sin(angle)];
}

export function packsOf(share: number) {
  const [supply, takeup] = packRadii(share);
  const pack = ([x, y]: [number, number], r: number) =>
    cylinder(x, y, r, PACK_Z, PACK_H, P, 48);
  const start = touch([POST_A[0] - 1.1, POST_A[1] + 0.6], SUPPLY, supply);
  const end = touch([POST_B[0] - 1, POST_B[1] - 0.4], TAKEUP, takeup);
  const z = TAPE_Z;
  const tape = pathOf(
    (
      [
        [start[0], start[1]],
        [POST_A[0] - 1.1, POST_A[1] + 0.6],
        [HEAD.x + 1, HEAD.y + HEAD.d + 0.15],
        [HEAD.x + HEAD.w - 1, HEAD.y + HEAD.d + 0.15],
        [CAPSTAN[0], CAPSTAN[1] + 1.4],
        [POST_B[0] - 1, POST_B[1] - 0.4],
        [end[0], end[1]],
      ] as [number, number][]
    ).map(([x, y]) => at([x, y, z]))
  );
  return {
    radii: [supply, takeup] as const,
    supply: pack(SUPPLY, supply),
    takeup: pack(TAKEUP, takeup),
    tape,
  };
}

/** Three key slots on each hub, turned by `angle`. */
export function spokesOf(angles: readonly [number, number]) {
  const lines: string[] = [];
  [SUPPLY, TAKEUP].forEach(([cx, cy], reel) => {
    for (let index = 0; index < 3; index += 1) {
      const angle = (angles[reel] ?? 0) + (index / 3) * TAU;
      lines.push(
        onTop(
          [
            [cx + 1.2 * Math.cos(angle), cy + 1.2 * Math.sin(angle)],
            [cx + 3.2 * Math.cos(angle), cy + 3.2 * Math.sin(angle)],
          ],
          PACK_Z + PACK_H + 1.6,
          P
        )
      );
    }
  });
  return lines.join("");
}

/** The face-up mark on each pack that shows it turning. */
export function packMarks(
  angles: readonly [number, number],
  radii: readonly [number, number]
) {
  return [SUPPLY, TAKEUP]
    .map(([cx, cy], reel) => {
      const angle = angles[reel] ?? 0;
      const r = radii[reel] ?? 6;
      return onTop(
        [
          [cx + 4.2 * Math.cos(angle), cy + 4.2 * Math.sin(angle)],
          [cx + (r - 0.2) * Math.cos(angle), cy + (r - 0.2) * Math.sin(angle)],
        ],
        PACK_Z + PACK_H,
        P
      );
    })
    .join("");
}

export function cardsOf(count: number) {
  if (count <= 0) {
    return null;
  }
  const height = count * CARD_T;
  const seams: string[] = [];
  for (let index = 2; index < count; index += 2) {
    seams.push(sideSeam(CARDS, CARD_FLOOR + index * CARD_T, P, 2));
  }
  return {
    paths: slabOf(CARDS, CARD_FLOOR, height, P, 2),
    seams: seams.join(""),
  };
}

/** The balance beam at `deg`, right end up for positive angles. */
export function beamOf(deg: number) {
  const angle = deg * RADIANS;
  const a: Point3 = [Math.cos(angle), 0, Math.sin(angle)];
  const v: Point3 = [-Math.sin(angle), 0, Math.cos(angle)];
  const F = {
    a,
    o: [BAL_X, BAL_Y, PIVOT_Z] as Point3,
    u: [0, 1, 0] as Point3,
    v,
  };
  return prismOf(
    F,
    boxOf(BEAM_HALF[0], BEAM_HALF[1]),
    -ARM - 2.5,
    ARM + 2.5,
    P
  );
}

/** How far each pan rises from level, left then right. */
export const panRise = (deg: number): [number, number] => {
  const rise = ARM * Math.sin(deg * RADIANS);
  return [-rise, rise];
};

/** The pointer rises from the pivot and turns with the beam. */
export function needleOf(deg: number) {
  const angle = deg * RADIANS;
  const y = SCALE_FACE + 0.3;
  const point = (along: number, across: number): Flat =>
    at([
      BAL_X + along * Math.sin(angle) + across * Math.cos(angle),
      y,
      PIVOT_Z + along * Math.cos(angle) - across * Math.sin(angle),
    ]);
  return pathOf(
    [
      point(15.2, 0),
      point(0, 0.8),
      point(-2.6, 0.5),
      point(-2.6, -0.5),
      point(0, -0.8),
    ],
    true
  );
}

/** The clock's hour hand, `deg` clockwise from 12. */
export function handOf(deg: number) {
  const angle = deg * RADIANS;
  const [cx, fy, cz] = DIAL_C;
  const y = fy + 1.6 + 0.2;
  const point = (along: number, across: number): Flat =>
    at([
      cx + along * Math.sin(angle) + across * Math.cos(angle),
      y,
      cz + along * Math.cos(angle) - across * Math.sin(angle),
    ]);
  return pathOf(
    [
      point(DIAL_R - 3.4, 0),
      point(0, 0.9),
      point(-2, 0.5),
      point(-2, -0.5),
      point(0, -0.9),
    ],
    true
  );
}

/** Axial marks on the platen and paper roll that show them turning. */
export function rollMarks(
  angle: number,
  from: number,
  to: number,
  cy: number,
  cz: number,
  r: number,
  count: number
) {
  const lines: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const a = angle + (index / count) * TAU;
    const n: Point3 = [0, Math.cos(a), Math.sin(a)];
    if (dot3(n, V) < 0.2) {
      continue;
    }
    const y = cy + r * n[1];
    const z = cz + r * n[2];
    lines.push(pathOf([at([from, y, z]), at([to, y, z])]));
  }
  return lines.join("");
}

export const platenMarks = (angle: number) =>
  rollMarks(
    angle,
    PLATEN_FROM + 0.6,
    PLATEN_TO - 0.6,
    PLATEN_Y,
    PLATEN_Z,
    PLATEN_R,
    6
  );

export interface LeverPaths {
  arm: SolidPaths;
  cap: SolidPaths;
  knob: SolidPaths;
}

/** The lever at `share` of its travel (0 up at rest, 1 pressed down). */
export function leverOf(share: number): LeverPaths {
  const deg = LEVER_REST + (LEVER_DOWN - LEVER_REST) * share;
  const angle = deg * RADIANS;
  const [x, y, z] = LEVER_PIVOT;
  const a: Point3 = [Math.cos(angle), 0, Math.sin(angle)];
  const v: Point3 = [-Math.sin(angle), 0, Math.cos(angle)];
  const plane = y + 2.2 + 0.9;
  const arm = prismOf(
    { a, o: [x, plane, z], u: [0, 1, 0], v },
    boxOf(0.9, 1.1),
    -3.2,
    LEVER_LEN - 1.6,
    P
  );
  const knob = sphereOf(
    [x + LEVER_LEN * a[0], plane, z + LEVER_LEN * a[2]],
    2.5,
    P
  );
  const cap = drumOf([x, plane + 0.9, z], [0, 1, 0], 0.9, 1.6, P, 16);
  return { arm, cap, knob };
}
