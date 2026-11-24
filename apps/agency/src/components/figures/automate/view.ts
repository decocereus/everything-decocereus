import {
  boxCorners,
  fitProjection,
  iso,
  type Plan,
  type Point3,
  type Projection,
} from "../../iso/iso-kit.ts";

export const WIDTH = 760;
export const HEIGHT = 380;
export const AZIMUTH = 60;

// World units are about 1 px of the real machine: x runs along the belt, y toward the front, z up.
export const BENCH: Plan = { d: 100, r: 8, w: 382, x: -234, y: -46 };
export const BENCH_H = 8;
export const FOOT_H = 5;

// The four stations stand in a row and come apart along x.
export const GAP = 14;
export const LIFT = 12;
export const STATIONS = 4;
/** Each station's offset when the machine is taken apart. */
export const SPREAD: Point3[] = Array.from({ length: STATIONS }, (_, index) => [
  (index - 1.5) * GAP,
  0,
  LIFT,
]);

export const BELT_Z = 22;
export const RAIL_TOP = 24;
export const PLINTH_H = 10;

export const GATHER: Plan = { d: 40, r: 2, w: 84, x: -154, y: -20 };
export const COPY: Plan = { d: 50, r: 2, w: 46, x: -70, y: -30 };
export const WRITE: Plan = { d: 40, r: 2, w: 52, x: -24, y: -20 };
export const SEND: Plan = { d: 40, r: 2.5, w: 90, x: 28, y: -20 };
export const LEDGE: Plan = { d: 16, r: 2, w: 28, x: 84, y: 20 };

export const DRIVE: Plan = { d: 40, r: 3, w: 32, x: -190, y: -20 };
export const DRIVE_H = 32;
export const SOCKET: Plan = { d: 24, r: 2, w: 20, x: -184, y: -12 };
export const SOCKET_TOP = DRIVE_H + 3;
export const AI: Plan = { d: 20, r: 2.5, w: 16, x: -182, y: -10 };
export const AI_H = 12;
export const AI_DROP = 26;

export const CRANK: Point3 = [-174, 20, 16];
export const CRANK_ARM = 14;
export const CLUTCH_OUT = 5;

export const HOPPERS = [-140, -114, -88] as const;
export const HOPPER_W = 16;
export const HOPPER_TOP = 50;

export const PRESS_X = -48;
export const STROKE = 7;

export const WRITER: Plan = { d: 40, r: 2.5, w: 38, x: -16, y: -20 };
export const WRITER_TOP = 46;
export const EXIT_X = WRITER.x + WRITER.w;
export const ROLL = { r: 5.5, x: 3, z: 52 };
export const PLATEN = { r: 3, x: 25, z: 27 };

export const GATE_X = 73.5;
export const GATE_T = 2;
export const GATE_H = 16;
export const GATE_LIFT = 14;
export const POST_TOP = 56;
export const KEY: Point3 = [98, 28, 14];

export const CARD: Plan = { d: 18, r: 0.8, w: 12, x: -6, y: -9 };
export const CARD_T = 1;
export const REPORT: Plan = { d: 22, r: 0.8, w: 26, x: -13, y: -11 };
export const REPORT_T = 0.8;

export const P: Projection = fitProjection(
  [
    ...boxCorners(BENCH, -BENCH_H - FOOT_H, 0),
    ...boxCorners(
      { d: 40, r: 0, w: 32, x: DRIVE.x - 21, y: -20 },
      0,
      SOCKET_TOP + AI_H + LIFT + 4
    ),
    ...boxCorners({ d: 40, r: 0, w: 20, x: -66, y: -30 }, 0, 70 + LIFT),
    ...boxCorners({ d: 40, r: 0, w: 40, x: 90, y: -20 }, 0, POST_TOP + 6),
  ],
  WIDTH,
  HEIGHT,
  { azimuth: AZIMUTH, pad: 18 }
);

export const at = (point: Point3) => iso(point, P);

const ORIGIN = at([0, 0, 0]);
const fine = (value: number) => Math.round(value * 100) / 100;
const axis = (point: Point3) => {
  const [x, y] = at(point);
  return [x - ORIGIN[0], y - ORIGIN[1]] as const;
};
const EX = axis([1, 0, 0]);
const EY = axis([0, 1, 0]);
const EZ = axis([0, 0, 1]);

/** A screen translate for a world offset. */
export const shift = (x: number, y = 0, z = 0) =>
  x === 0 && y === 0 && z === 0
    ? ""
    : `translate(${fine(EX[0] * x + EY[0] * y + EZ[0] * z)} ${fine(EX[1] * x + EY[1] * y + EZ[1] * z)})`;
