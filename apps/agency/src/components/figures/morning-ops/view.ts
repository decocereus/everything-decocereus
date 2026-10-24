import {
  boxCorners,
  fitProjection,
  iso,
  type Plan,
  type Point3,
  type Projection,
} from "../../iso/iso-kit.ts";

export const WIDTH = 600;
export const HEIGHT = 330;
export const AZIMUTH = 55;

// World units are about 1 px of the real machine: x runs along the rail, y toward the front, z up.
export const BASE: Plan = { d: 124, r: 10, w: 352, x: -206, y: -58 };
export const BASE_H = 11;
export const FOOT_H = 5;

// Stations stand behind the rail, their fronts on one line.
export const FRONT = 14;

export const CLOCK: Plan = { d: 46, r: 2.5, w: 26, x: -200, y: -36 };
export const CLOCK_TOP = 42;
export const DIAL_C: Point3 = [-187, CLOCK.y + CLOCK.d, 26];
export const DIAL_R = 9.6;

export const DECK: Plan = { d: 60, r: 4, w: 62, x: -162, y: -46 };
export const DECK_TOP = 14;
export const SUPPLY: [number, number] = [-146, -22];
export const TAKEUP: [number, number] = [-116, -22];
export const REEL_R = 12.5;
export const PACK_SMALL = 6;
export const PACK_BIG = 10;
export const PACK_Z = DECK_TOP + 1;
export const PACK_H = 4;
export const TAPE_Z = PACK_Z + PACK_H / 2;
export const POST_A: [number, number] = [-158.4, 6];
export const POST_B: [number, number] = [-127.6, 5];
export const HEAD: Plan = { d: 6, r: 1, w: 10, x: -149, y: 3 };
export const CAPSTAN: [number, number] = [-134, 6.8];

export const CARDS: Plan = { d: 18.8, r: 0.6, w: 13.8, x: -96.4, y: -28.4 };
export const CARD_FLOOR = 1;
export const CARD_T = 0.42;

export const BAL_X = -44;
export const BAL_Y = -18;
export const PIVOT_Z = 38;
export const ARM = 26;
export const BEAM_HALF: [number, number] = [2, 1.6];
export const STEM = 5;
export const PAN_R = 9.5;
export const PAN_H = 1.2;
export const ARREST_ARM = 21;
export const ARREST_X = BAL_X - ARREST_ARM;
export const STOP_X = BAL_X + 21;
export const ARREST_DROP = 5.6;
export const SCALE_FACE = BAL_Y + 5;

export const PRINTER: Plan = { d: 58, r: 3, w: 56, x: -6, y: -44 };
export const PRINTER_Z = 18;
export const PLATEN_Y = 8;
export const PLATEN_Z = 22;
export const PLATEN_R = 4;
export const PLATEN_FROM = PRINTER.x + 4;
export const PLATEN_TO = PRINTER.x + PRINTER.w - 4;
// The paper roll is one slip wide and turns on a core held by two brackets.
export const ROLL = {
  from: PRINTER.x + 16,
  r: 5.5,
  to: PRINTER.x + 40,
  y: -30,
  z: 37.4,
};
export const LIP_Z = 22.4;
export const SLOT_Y = 12;

export const RAIL_FROM = -164;
export const RAIL_TO = 98;
export const RODS = [31, 45];
export const ROD_Z = 5;
export const ROD_R = 2;

// The shuttle is built at x = 0 and moved along the rail.
export const CARRIAGE: Plan = { d: 28, r: 2.5, w: 32, x: -16, y: 24 };
export const CARRIAGE_Z = 8;
export const CARRIAGE_TOP = 11;
export const TOTE_FLOOR = 12;
export const ROLL_Z = 13.4;
export const ROLL_R = 1.1;
export const SLIP_FLOOR = ROLL_Z + ROLL_R;
export const SLIP: Plan = { d: 16, r: 0.6, w: 22, x: -11, y: 30 };
export const SLIP_T = 1.2;
export const TOTE_WALL = 17;

export const GATE_X = 100;
export const GATE_T = 2.5;
export const GATE_Z = SLIP_FLOOR;
export const GATE_H = 23.5;
export const GATE_LIFT = 24;
export const POST_TOP = 64;
export const OUT: Plan = { d: 28, r: 2, w: 32, x: 106, y: 24 };
export const OUT_Z = 12;
export const PUSH = 39.5;

export const LEVER_PIVOT: Point3 = [112, OUT.y + OUT.d, 6.5];
export const LEVER_LEN = 20;
export const LEVER_REST = 50;
export const LEVER_DOWN = -8;

export const P: Projection = fitProjection(
  [
    ...boxCorners(BASE, -BASE_H - FOOT_H, 0),
    ...boxCorners({ d: 36, r: 0, w: 7, x: GATE_X - 2, y: 20 }, 0, POST_TOP + 4),
    ...boxCorners({ d: 20, r: 0, w: 72, x: BAL_X - 36, y: BAL_Y - 10 }, 0, 56),
    ...boxCorners(CLOCK, 0, CLOCK_TOP + 3),
  ],
  WIDTH,
  HEIGHT,
  { azimuth: AZIMUTH, pad: 22 }
);

export const at = (point: Point3) => iso(point, P);

const ORIGIN = at([0, 0, 0]);
const fine = (value: number) => Math.round(value * 100) / 100;
const axis = (point: Point3) => {
  const [x, y] = at(point);
  return [x - ORIGIN[0], y - ORIGIN[1]] as const;
};
export const EX = axis([1, 0, 0]);
export const EY = axis([0, 1, 0]);
export const EZ = axis([0, 0, 1]);

export const shift = (x: number, y = 0, z = 0) =>
  `translate(${fine(EX[0] * x + EY[0] * y + EZ[0] * z)} ${fine(EX[1] * x + EY[1] * y + EZ[1] * z)})`;
