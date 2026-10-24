import {
  corners,
  cylinder,
  type Flat,
  insetPlan,
  onTop,
  type Plan,
  type Point3,
  pathOf,
  planOutline,
  ring,
  sideArc,
  sideSeam,
  slabOf,
  topTicks,
} from "../../iso/iso-kit.ts";
import { drumOf, prismOf } from "../../iso/prism.ts";
import { STOPS } from "./model.ts";
import {
  ARM,
  ARREST_X,
  at,
  BAL_X,
  BAL_Y,
  BASE,
  BASE_H,
  CAPSTAN,
  CARD_FLOOR,
  CARRIAGE,
  CARRIAGE_TOP,
  CARRIAGE_Z,
  CLOCK,
  CLOCK_TOP,
  DECK,
  DECK_TOP,
  DIAL_C,
  DIAL_R,
  FOOT_H,
  FRONT,
  GATE_H,
  GATE_T,
  GATE_X,
  GATE_Z,
  HEAD,
  LEVER_PIVOT,
  LIP_Z,
  OUT,
  OUT_Z,
  P,
  PACK_H,
  PACK_Z,
  PAN_H,
  PAN_R,
  PIVOT_Z,
  PLATEN_FROM,
  PLATEN_R,
  PLATEN_TO,
  PLATEN_Y,
  PLATEN_Z,
  POST_A,
  POST_B,
  POST_TOP,
  PRINTER,
  PRINTER_Z,
  RAIL_FROM,
  RAIL_TO,
  REEL_R,
  ROD_R,
  ROD_Z,
  RODS,
  ROLL,
  ROLL_R,
  ROLL_Z,
  SCALE_FACE,
  SLIP,
  SLIP_FLOOR,
  SLIP_T,
  STEM,
  STOP_X,
  SUPPLY,
  TAKEUP,
  TOTE_FLOOR,
  TOTE_WALL,
} from "./view.ts";

const slab = (plan: Plan, z: number, h: number, steps = 4, bevel = 0) =>
  slabOf(plan, z, h, P, steps, bevel);
const cyl = (
  cx: number,
  cy: number,
  r: number,
  z: number,
  h: number,
  steps = 28
) => cylinder(cx, cy, r, z, h, P, steps);
const seg = (a: Point3, b: Point3) => pathOf([at(a), at(b)]);
const poly = (points: Point3[], closed = false) =>
  pathOf(points.map(at), closed);
const join = (paths: string[]) => paths.join("");
const ALONG_X: Point3 = [1, 0, 0];
const ALONG_Y: Point3 = [0, 1, 0];
const TAU = Math.PI * 2;

/** A closed rounded slot drawn on a vertical face at y (in x, z). */
function slotOnY(
  y: number,
  x0: number,
  x1: number,
  z0: number,
  z1: number,
  steps = 3
) {
  const r = Math.min(x1 - x0, z1 - z0) / 2;
  return planOutlineOn(
    { d: z1 - z0, r, w: x1 - x0, x: x0, y: z0 },
    steps,
    ([u, v]) => [u, y, v]
  );
}

/** A closed rounded slot on a vertical face at x (in y, z). */
function slotOnX(
  x: number,
  y0: number,
  y1: number,
  z0: number,
  z1: number,
  steps = 3
) {
  const r = Math.min(y1 - y0, z1 - z0) / 2;
  return planOutlineOn(
    { d: z1 - z0, r, w: y1 - y0, x: y0, y: z0 },
    steps,
    ([u, v]) => [x, u, v]
  );
}

function planOutlineOn(
  plan: Plan,
  steps: number,
  place: (point: Flat) => Point3
) {
  const { x, y, w, d, r } = plan;
  const points: Point3[] = [];
  const arcs: [number, number, number][] = [
    [x + w - r, y + r, -Math.PI / 2],
    [x + w - r, y + d - r, 0],
    [x + r, y + d - r, Math.PI / 2],
    [x + r, y + r, Math.PI],
  ];
  for (const [cx, cy, start] of arcs) {
    for (let step = 0; step <= steps; step += 1) {
      const angle = start + (step / steps) * (Math.PI / 2);
      points.push(place([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]));
    }
  }
  return poly(points, true);
}

/** A circle on a vertical face at y. */
const circleOnY = (cx: number, y: number, cz: number, r: number, steps = 32) =>
  poly(
    Array.from({ length: steps }, (_, index) => {
      const angle = (index / steps) * TAU;
      return [cx + r * Math.cos(angle), y, cz + r * Math.sin(angle)] as Point3;
    }),
    true
  );

const dotsAt = (points: Point3[]) => points.map(at);

// ——— Base ———————————————————————————————————————————————————————————————

const FEET = corners(BASE, 24);
const SCREWS = corners(BASE, 9);
const LABEL: Plan = { d: 13, r: 1.4, w: 24, x: -198, y: 30 };
export const RULER: Plan = { d: 6, r: 1, w: 254, x: -160, y: 57.6 };
const RULER_TICKS = topTicks(
  RULER.x + 3,
  RULER.x + RULER.w - 3,
  5,
  5,
  RULER.y + 0.6,
  0.6,
  [1.8, 3.4],
  P
);
const byDepth = (points: [number, number][]) =>
  [...points].sort(
    (a, b) => a[0] * 0.57 + a[1] * 0.82 - (b[0] * 0.57 + b[1] * 0.82)
  );

export const BASE_ART = {
  feet: byDepth(FEET).map(([x, y]) => [
    cyl(x, y, 7.4, -BASE_H - FOOT_H, 1.6, 30),
    cyl(x, y, 5.6, -BASE_H - FOOT_H + 1.6, FOOT_H - 1.6, 30),
  ]),
  groove: planOutline(insetPlan(BASE, 4.5), 0, P, 8),
  halo: slab(BASE, -BASE_H - FOOT_H, BASE_H, 8).fill,
  label: slab(LABEL, 0, 0.8, 3),
  labelLine: planOutline(insetPlan(LABEL, 1.4), 0.8, P, 3),
  labelRules: join(
    [16, 11, 14].map((w, row) =>
      onTop(
        [
          [LABEL.x + 3.6, LABEL.y + 3.6 + row * 2.6],
          [LABEL.x + 3.6 + w, LABEL.y + 3.6 + row * 2.6],
        ],
        0.8,
        P
      )
    )
  ),
  labelScrews: dotsAt([
    [LABEL.x + LABEL.w - 2.6, LABEL.y + 2.6, 0.8],
    [LABEL.x + LABEL.w - 2.6, LABEL.y + LABEL.d - 2.6, 0.8],
  ]),
  ruler: slab(RULER, 0, 0.6, 3),
  rulerMajor: RULER_TICKS.major,
  rulerMarks: join(
    Object.values(STOPS).map((x) =>
      onTop(
        [
          [x, RULER.y + 0.6],
          [x, RULER.y + RULER.d - 0.6],
        ],
        0.6,
        P
      )
    )
  ),
  rulerMinor: RULER_TICKS.minor,
  screwRings: join(SCREWS.map(([x, y]) => ring(x, y, 2.2, 0, P, 16))),
  screws: dotsAt(SCREWS.map(([x, y]) => [x, y, 0])),
  seam: sideSeam(BASE, -BASE_H + 3.2, P, 8),
  slab: slab(BASE, -BASE_H, BASE_H, 8, 1.6),
};

// ——— Night clock ————————————————————————————————————————————————————————

const [DCX, DFY, DCZ] = DIAL_C;
const BEZEL_T = 1.6;
const FACE_Y = DFY + BEZEL_T;
const dial = (angle: number, r: number): Point3 => [
  DCX + r * Math.sin(angle),
  FACE_Y + 0.05,
  DCZ + r * Math.cos(angle),
];
const hourAngle = (hour: number) => ((hour % 12) / 12) * TAU;

function hourTicks() {
  const minor: string[] = [];
  const major: string[] = [];
  for (let hour = 0; hour < 12; hour += 1) {
    const big = hour % 3 === 0;
    const angle = hourAngle(hour);
    (big ? major : minor).push(
      seg(dial(angle, DIAL_R - 0.9), dial(angle, DIAL_R - (big ? 3.1 : 2.2)))
    );
  }
  return { major: join(major), minor: join(minor) };
}

const TICKS = hourTicks();
const NIGHT_ARC = (() => {
  const from = hourAngle(10);
  const span = (8 / 12) * TAU;
  const points: Point3[] = [];
  for (let step = 0; step <= 48; step += 1) {
    points.push(dial(from + (step / 48) * span, DIAL_R - 2.2));
  }
  return poly(points);
})();
const DOOR: Plan = { d: 9, r: 1.2, w: CLOCK.w - 8, x: CLOCK.x + 4, y: 4 };

export const CLOCK_ART = {
  bezel: drumOf([DCX, DFY, DCZ], ALONG_Y, BEZEL_T, DIAL_R + 0.8, P, 48),
  body: slab(CLOCK, 3, CLOCK_TOP - 3, 4, 0.6),
  bodySeam: sideSeam(CLOCK, 17, P, 4),
  cap: slab(insetPlan(CLOCK, -1.4), CLOCK_TOP, 3, 4, 0.6),
  capInset: planOutline(insetPlan(CLOCK, 2.6), CLOCK_TOP + 3, P, 4),
  crown: drumOf([CLOCK.x + CLOCK.w, -10, 30], ALONG_X, 2.2, 1.4, P, 16),
  crownHead: drumOf(
    [CLOCK.x + CLOCK.w + 2.2, -10, 30],
    ALONG_X,
    2.4,
    2.6,
    P,
    24
  ),
  door: planOutlineOn(DOOR, 3, ([u, v]) => [u, CLOCK.y + CLOCK.d, v]),
  doorKnob: dotsAt([[CLOCK.x + CLOCK.w - 6.4, CLOCK.y + CLOCK.d, 8.5]]),
  face: circleOnY(DCX, FACE_Y + 0.05, DCZ, DIAL_R - 0.9, 48),
  halo: slab(insetPlan(CLOCK, -3), 0, 2, 4).fill,
  hub: at([DCX, FACE_Y + 0.4, DCZ]),
  major: TICKS.major,
  minor: TICKS.minor,
  night: NIGHT_ARC,
  plinth: slab(insetPlan(CLOCK, -1.6), 0, 3, 4, 0.5),
  screws: dotsAt([
    [CLOCK.x + 3, CLOCK.y + CLOCK.d, 38],
    [CLOCK.x + CLOCK.w - 3, CLOCK.y + CLOCK.d, 38],
  ]),
};

// ——— Station 1: call tape deck and its card stack ————————————————————————

const DECK_SCREWS = corners(DECK, 4.6);
const PINCH: [number, number] = [-134, 11.6];
const KEYS: Plan[] = [0, 1, 2].map((index) => ({
  d: 7.5,
  r: 0.8,
  w: 5.2,
  x: -121 + index * 6.2,
  y: 3.5,
}));
export const DECK_BUTTON_X = STOPS.calls;
const CARD_TRAY: Plan = { d: 22, r: 1, w: 17, x: -98, y: -30 };

export const DECK_ART = {
  boss: drumOf([DECK_BUTTON_X, FRONT, 7], ALONG_Y, 1.6, 2.2, P, 20),
  cap: drumOf([DECK_BUTTON_X, FRONT + 1.6, 7], ALONG_Y, 2, 2.8, P, 24),
  capstan: cyl(CAPSTAN[0], CAPSTAN[1], 1.4, DECK_TOP, 6.6, 16),
  case: slab(DECK, 0, DECK_TOP, 6, 1),
  caseSeam: sideSeam(DECK, 4, P, 6),
  flangeRings: join(
    [SUPPLY, TAKEUP].map(([x, y]) => ring(x, y, REEL_R - 1.4, PACK_Z, P, 48))
  ),
  flanges: [SUPPLY, TAKEUP].map(([x, y]) =>
    cyl(x, y, REEL_R, DECK_TOP, PACK_Z - DECK_TOP, 56)
  ),
  groove: planOutline(insetPlan(DECK, 3.6), DECK_TOP, P, 6),
  halo: slab(insetPlan(DECK, -2), 0, 2, 6).fill,
  head: slab(HEAD, DECK_TOP, 6, 3, 0.4),
  headGap: seg(
    [HEAD.x + HEAD.w / 2, HEAD.y + HEAD.d, DECK_TOP + 1.2],
    [HEAD.x + HEAD.w / 2, HEAD.y + HEAD.d, DECK_TOP + 6]
  ),
  headShield: slab(
    { d: 2.2, r: 0.6, w: HEAD.w - 2.8, x: HEAD.x + 1.4, y: HEAD.y - 2.2 },
    DECK_TOP,
    7.4,
    3
  ),
  hubRings: join(
    [SUPPLY, TAKEUP].map(([x, y]) =>
      ring(x, y, 1, PACK_Z + PACK_H + 1.6, P, 14)
    )
  ),
  hubs: [SUPPLY, TAKEUP].map(([x, y]) =>
    cyl(x, y, 3.4, PACK_Z, PACK_H + 1.6, 28)
  ),
  keys: KEYS.map((plan) => slab(plan, DECK_TOP, 2, 3, 0.3)),
  keyWell: planOutline(
    { d: 9.9, r: 1.2, w: 19.8, x: -122.2, y: 2.3 },
    DECK_TOP,
    P,
    3
  ),
  pinch: cyl(PINCH[0], PINCH[1], 2.4, DECK_TOP + 1.4, 4.4, 24),
  pinchArm: slab(
    { d: 2.4, r: 0.8, w: 9, x: PINCH[0] - 1.2, y: PINCH[1] },
    DECK_TOP,
    1.4,
    3
  ),
  pinchRing: ring(PINCH[0], PINCH[1], 1, DECK_TOP + 5.8, P, 12),
  postCaps: [POST_A, POST_B].map(([x, y]) =>
    cyl(x, y, 2, DECK_TOP + 6, 0.8, 18)
  ),
  posts: [POST_A, POST_B].map(([x, y]) => cyl(x, y, 1.3, DECK_TOP, 6, 16)),
  screws: dotsAt(DECK_SCREWS.map(([x, y]) => [x, y, DECK_TOP])),
  slot: slotOnX(DECK.x + DECK.w, -26.5, -11.5, 10.6, 12),
  trayBack: slab(
    { d: 1.2, r: 0.4, w: CARD_TRAY.w, x: CARD_TRAY.x, y: CARD_TRAY.y },
    CARD_FLOOR,
    4,
    2
  ),
  trayFloor: slab(CARD_TRAY, 0, CARD_FLOOR, 3),
  trayFront: slab(
    {
      d: 1.2,
      r: 0.4,
      w: CARD_TRAY.w,
      x: CARD_TRAY.x,
      y: CARD_TRAY.y + CARD_TRAY.d - 1.2,
    },
    CARD_FLOOR,
    4,
    2
  ),
  trayLeft: slab(
    {
      d: CARD_TRAY.d - 2.4,
      r: 0.4,
      w: 1.2,
      x: CARD_TRAY.x,
      y: CARD_TRAY.y + 1.2,
    },
    CARD_FLOOR,
    4,
    2
  ),
  trayNotch: seg(
    [CARD_TRAY.x + 6, CARD_TRAY.y + CARD_TRAY.d, CARD_FLOOR + 4],
    [CARD_TRAY.x + 6, CARD_TRAY.y + CARD_TRAY.d, CARD_FLOOR]
  ),
  trayRight: slab(
    {
      d: CARD_TRAY.d - 2.4,
      r: 0.4,
      w: 1.2,
      x: CARD_TRAY.x + CARD_TRAY.w - 1.2,
      y: CARD_TRAY.y + 1.2,
    },
    CARD_FLOOR,
    4,
    2
  ),
  vents: join(
    [0, 1, 2, 3, 4].map((index) =>
      slotOnY(FRONT, -159 + index * 3.4, -157.8 + index * 3.4, 3, 10.5)
    )
  ),
};

// ——— Station 2: books balance ————————————————————————————————————————————

const PLINTH: Plan = { d: 58, r: 3, w: 60, x: BAL_X - 30, y: -44 };
const CHEEK_Z = PIVOT_Z - 5;
const SCALE_R = 17;
const SCALE_SPAN = (22 * Math.PI) / 180;
const scaleFrame = (y: number) => ({
  a: ALONG_Y,
  o: [BAL_X, y, PIVOT_Z] as Point3,
  u: ALONG_X,
  v: [0, 0, 1] as Point3,
});
const SECTOR: Flat[] = [
  [-5, -5],
  [5, -5],
  ...Array.from({ length: 13 }, (_, index) => {
    const angle = SCALE_SPAN - (index / 12) * 2 * SCALE_SPAN;
    return [SCALE_R * Math.sin(angle), SCALE_R * Math.cos(angle)] as Flat;
  }),
];
const scalePoint = (angle: number, r: number): Point3 => [
  BAL_X + r * Math.sin(angle),
  SCALE_FACE + 0.05,
  PIVOT_Z + r * Math.cos(angle),
];

function scaleTicks() {
  const minor: string[] = [];
  const major: string[] = [];
  for (let step = -8; step <= 8; step += 1) {
    const angle = (step / 8) * (SCALE_SPAN - 0.05);
    const big = step % 4 === 0;
    (big ? major : minor).push(
      seg(
        scalePoint(angle, SCALE_R - 0.4),
        scalePoint(angle, SCALE_R - (big ? 3.6 : 2.2))
      )
    );
  }
  return { major: join(major), minor: join(minor) };
}

const SCALE_TICKS = scaleTicks();

function ledgers(cx: number, shifts: [number, number][]) {
  return shifts.map(([dx, dy], index) => {
    const plan: Plan = {
      d: 10,
      r: 0.8,
      w: 14,
      x: cx - 7 + dx,
      y: BAL_Y - 5 + dy,
    };
    const z = PIVOT_Z + BEAM_TOP + STEM + PAN_H + index * 2.2;
    return {
      paths: slab(plan, z, 2.2, 2),
      plan,
      seam: sideSeam(insetPlan(plan, 0.6), z + 1.1, P, 2),
      z,
    };
  });
}

const BEAM_TOP = 1.6;
export const PAN_Z = PIVOT_Z + BEAM_TOP + STEM;

export const BALANCE_ART = {
  arrestSleeve: cyl(ARREST_X, BAL_Y, 2, 6, 22, 18),
  backCheek: slab(
    { d: 2.6, r: 0.6, w: 8, x: BAL_X - 4, y: BAL_Y - 5 },
    CHEEK_Z,
    8.6,
    2
  ),
  books: [
    ledgers(BAL_X - ARM, [
      [0, 0],
      [0.8, -0.4],
      [-0.5, 0.3],
    ]),
    ledgers(BAL_X + ARM, [
      [0, 0],
      [-0.7, 0.4],
      [0.4, -0.3],
    ]),
  ],
  boss: drumOf([BAL_X, FRONT, 3.2], ALONG_Y, 1.6, 2, P, 20),
  cap: drumOf([BAL_X, FRONT + 1.6, 3.2], ALONG_Y, 2, 2.6, P, 24),
  collar: cyl(BAL_X, BAL_Y, 6, 6, 3, 32),
  collarScrews: dotsAt([
    [BAL_X - 3.6, BAL_Y + 3.6, 9],
    [BAL_X + 3.6, BAL_Y + 3.6, 9],
  ]),
  frontCheek: prismOf(scaleFrame(BAL_Y + 2.4), SECTOR, 0, 2.6, P),
  halo: slab(insetPlan(PLINTH, -2), 0, 2, 4).fill,
  panRims: [-1, 1].map((side) =>
    ring(BAL_X + side * ARM, BAL_Y, PAN_R - 1.2, PAN_Z + PAN_H, P, 40)
  ),
  pans: [-1, 1].map((side) =>
    cyl(BAL_X + side * ARM, BAL_Y, PAN_R, PAN_Z, PAN_H, 48)
  ),
  pillar: cyl(BAL_X, BAL_Y, 3.2, 9, CHEEK_Z - 9, 28),
  pillarSeam: sideArc(BAL_X, BAL_Y, 3.2, 21, P, 20),
  pin: drumOf([BAL_X, SCALE_FACE, PIVOT_Z], ALONG_Y, 0.9, 1.5, P, 16),
  plinth: slab(PLINTH, 0, 6, 4, 0.8),
  plinthGroove: planOutline(insetPlan(PLINTH, 3.2), 6, P, 4),
  plinthScrews: dotsAt(corners(PLINTH, 4.2).map(([x, y]) => [x, y, 6])),
  saddle: slab(
    { d: 12, r: 1.4, w: 12, x: BAL_X - 6, y: BAL_Y - 6 },
    CHEEK_Z - 2,
    2,
    3,
    0.4
  ),
  scaleMajor: SCALE_TICKS.major,
  scaleMinor: SCALE_TICKS.minor,
  scaleZero: seg(scalePoint(0, SCALE_R - 0.4), scalePoint(0, SCALE_R - 4.6)),
  stems: [-1, 1].map((side) =>
    cyl(BAL_X + side * ARM, BAL_Y, 1, PIVOT_Z + BEAM_TOP, STEM, 12)
  ),
  stopPad: cyl(STOP_X, BAL_Y, 2.4, 30, 1.2, 18),
  stopSleeve: cyl(STOP_X, BAL_Y, 2, 6, 24, 18),
};

const ARREST_TOP =
  PIVOT_Z + (BAL_X - ARREST_X) * Math.sin((6 * Math.PI) / 180) - BEAM_TOP;
export const ARREST_ART = {
  pad: cyl(ARREST_X, BAL_Y, 2.2, ARREST_TOP - 0.8, 0.8, 18),
  rod: cyl(ARREST_X, BAL_Y, 1.05, 20, ARREST_TOP - 20 - 0.8, 12),
};

// ——— Station 3: invoice printer ——————————————————————————————————————————

const COVER: Plan = { d: 42, r: 3, w: PRINTER.w, x: PRINTER.x, y: -40 };
const COVER_TOP = 31;
const FEED_Y = -18;
const LIP = { d: 13.6, r: 1, w: 26, x: STOPS.invoices - 13, y: 12 };

function webOf() {
  // The paper leaves the roll on its front and runs down into the feed slot.
  const q: Flat = [FEED_Y + 0.4, COVER_TOP];
  const c: Flat = [ROLL.y, ROLL.z];
  const dy = q[0] - c[0];
  const dz = q[1] - c[1];
  const d = Math.hypot(dy, dz);
  const base = Math.atan2(dz, dy);
  const turn = Math.acos(ROLL.r / d);
  const angle = base + turn;
  const touch: Flat = [
    c[0] + ROLL.r * Math.cos(angle),
    c[1] + ROLL.r * Math.sin(angle),
  ];
  const x0 = ROLL.from + 1;
  const x1 = ROLL.to - 1;
  return [
    [x0, touch[0], touch[1]],
    [x1, touch[0], touch[1]],
    [x1, q[0], q[1]],
    [x0, q[0], q[1]],
  ] as Point3[];
}

const WEB = webOf();

export const PRINTER_ART = {
  axle: drumOf(
    [PRINTER.x + PRINTER.w - 4, ROLL.y, ROLL.z],
    ALONG_X,
    1.2,
    1.2,
    P,
    12
  ),
  body: slab(PRINTER, 0, PRINTER_Z, 4, 1),
  bodySeam: sideSeam(PRINTER, 5, P, 4),
  boss: drumOf([STOPS.invoices, FRONT, 9], ALONG_Y, 1.6, 2.2, P, 20),
  brackets: [PRINTER.x + 4, PRINTER.x + PRINTER.w - 7].map((x) =>
    slab(
      { d: 8, r: 0.8, w: 3, x, y: ROLL.y - 4 },
      COVER_TOP,
      ROLL.z - COVER_TOP + 1.4,
      2
    )
  ),
  cap: drumOf([STOPS.invoices, FRONT + 1.6, 9], ALONG_Y, 2, 2.8, P, 24),
  cheeks: [PRINTER.x, PRINTER.x + PRINTER.w - 4].map((x) =>
    slab({ d: 12, r: 1, w: 4, x, y: 2 }, PRINTER_Z, 10, 3, 0.4)
  ),
  cores: [
    drumOf(
      [PRINTER.x + 7, ROLL.y, ROLL.z],
      ALONG_X,
      ROLL.from - PRINTER.x - 7,
      1.8,
      P,
      16
    ),
    drumOf(
      [ROLL.to, ROLL.y, ROLL.z],
      ALONG_X,
      PRINTER.x + PRINTER.w - 7 - ROLL.to,
      1.8,
      P,
      16
    ),
  ],
  cover: slab(COVER, PRINTER_Z, COVER_TOP - PRINTER_Z, 4, 1),
  coverScrews: dotsAt([
    [COVER.x + 3, COVER.y + 3, COVER_TOP],
    [COVER.x + COVER.w - 3, COVER.y + 3, COVER_TOP],
    [COVER.x + 3, COVER.y + COVER.d - 3, COVER_TOP],
    [COVER.x + COVER.w - 3, COVER.y + COVER.d - 3, COVER_TOP],
  ]),
  coverSeam: sideSeam(COVER, 24, P, 4),
  feed: planOutline(
    {
      d: 1.6,
      r: 0.8,
      w: ROLL.to - ROLL.from + 2,
      x: ROLL.from - 1,
      y: FEED_Y - 0.6,
    },
    COVER_TOP,
    P,
    3
  ),
  gussets: [LIP.x + 2, LIP.x + LIP.w - 3.4].map((x) =>
    prismOf(
      { a: ALONG_X, o: [x, 0, 0], u: ALONG_Y, v: [0, 0, 1] },
      [
        [FRONT, PRINTER_Z - 6],
        [FRONT + 7, LIP_Z - 1],
        [FRONT, LIP_Z - 1],
      ],
      0,
      1.4,
      P
    )
  ),
  halo: slab(insetPlan(PRINTER, -2), 0, 2, 4).fill,
  knob: drumOf(
    [PRINTER.x + PRINTER.w, PLATEN_Y, PLATEN_Z],
    ALONG_X,
    4,
    4.4,
    P,
    40
  ),
  knobHub: drumOf(
    [PRINTER.x + PRINTER.w + 4, PLATEN_Y, PLATEN_Z],
    ALONG_X,
    0.8,
    1.6,
    P,
    16
  ),
  knobKnurl: (() => {
    const lines: string[] = [];
    for (let index = 0; index < 28; index += 1) {
      const angle = (index / 28) * TAU;
      const n: Point3 = [0, Math.cos(angle), Math.sin(angle)];
      if (n[1] * 0.82 * 0.866 + n[2] * 0.5 < 0.12) {
        continue;
      }
      const y = PLATEN_Y + 4.4 * n[1];
      const z = PLATEN_Z + 4.4 * n[2];
      lines.push(
        seg(
          [PRINTER.x + PRINTER.w + 0.5, y, z],
          [PRINTER.x + PRINTER.w + 3.5, y, z]
        )
      );
    }
    return join(lines);
  })(),
  lip: slab(LIP, LIP_Z - 1, 1, 3, 0.3),
  lipRule: planOutline(
    { d: 1.4, r: 0.7, w: LIP.w - 5, x: LIP.x + 2.5, y: LIP.y + LIP.d - 3 },
    LIP_Z,
    P,
    3
  ),
  platen: drumOf(
    [PLATEN_FROM, PLATEN_Y, PLATEN_Z],
    ALONG_X,
    PLATEN_TO - PLATEN_FROM,
    PLATEN_R,
    P,
    40
  ),
  roll: drumOf(
    [ROLL.from, ROLL.y, ROLL.z],
    ALONG_X,
    ROLL.to - ROLL.from,
    ROLL.r,
    P,
    40
  ),
  vents: join(
    [0, 1, 2, 3, 4, 5].map((index) =>
      slotOnY(
        FRONT,
        PRINTER.x + 36 + index * 2.8,
        PRINTER.x + 37.1 + index * 2.8,
        4,
        13
      )
    )
  ),
  web: poly(WEB, true),
};

// ——— Rail —————————————————————————————————————————————————————————————————

const END_BLOCK: Plan = { d: 32, r: 1.5, w: 8, x: RAIL_FROM - 8, y: 22 };

export const RAIL_ART = {
  bedScrews: dotsAt(
    RODS.flatMap((y) =>
      [-120, -80, -10, 50].map((x) => [x, y + 2.3, ROD_Z - ROD_R] as Point3)
    )
  ),
  beds: RODS.map((y) =>
    slab(
      { d: 6, r: 1, w: RAIL_TO - RAIL_FROM, x: RAIL_FROM, y: y - 3 },
      0,
      ROD_Z - ROD_R,
      3
    )
  ),
  block: slab(END_BLOCK, 0, 11, 3, 0.6),
  blockScrews: dotsAt([
    [END_BLOCK.x + 4, 25, 11],
    [END_BLOCK.x + 4, 51, 11],
  ]),
  bumper: drumOf([RAIL_FROM, 38, 6], ALONG_X, 3, 2.6, P, 24),
  rods: RODS.map((y) =>
    slab(
      {
        d: ROD_R * 2,
        r: ROD_R - 0.15,
        w: RAIL_TO - RAIL_FROM,
        x: RAIL_FROM,
        y: y - ROD_R,
      },
      ROD_Z - ROD_R,
      ROD_R * 2,
      4
    )
  ),
};

// ——— Shuttle, built at x = 0 ———————————————————————————————————————————————

const BUSHES: Plan[] = [-1, 1].flatMap((side) =>
  RODS.map((y) => ({ d: 9, r: 1.6, w: 9, x: side < 0 ? -16 : 7, y: y - 4.5 }))
);
const TOTE: Plan = { d: 22.8, r: 1, w: 30, x: -15, y: 26.6 };
const ROLLERS = [-11, -5.5, 0, 5.5, 11];

export const SHUTTLE_ART = {
  axles: dotsAt(ROLLERS.map((x) => [x, TOTE.y + TOTE.d, ROLL_Z] as Point3)),
  back: slab(
    { d: 1.4, r: 0.5, w: TOTE.w, x: TOTE.x, y: TOTE.y },
    TOTE_FLOOR,
    TOTE_WALL - TOTE_FLOOR,
    2,
    0.3
  ),
  bushes: BUSHES.sort((a, b) => a.y - b.y).map((plan) =>
    slab(plan, ROD_Z - 1.5, CARRIAGE_Z - ROD_Z + 1.5, 3, 0.4)
  ),
  bushRings: join(
    RODS.map((y) =>
      planOutlineOn(
        { d: 5.2, r: 2.6, w: 5.2, x: y - 2.6, y: ROD_Z - 2.6 },
        4,
        ([u, v]) => [16, u, v]
      )
    )
  ),
  end: slab(
    { d: TOTE.d - 2.8, r: 0.4, w: 1.4, x: TOTE.x, y: TOTE.y + 1.4 },
    TOTE_FLOOR,
    TOTE_WALL - TOTE_FLOOR,
    2,
    0.3
  ),
  floor: slab(TOTE, CARRIAGE_TOP, TOTE_FLOOR - CARRIAGE_TOP, 3),
  front: slab(
    { d: 1.4, r: 0.5, w: TOTE.w, x: TOTE.x, y: TOTE.y + TOTE.d - 1.4 },
    TOTE_FLOOR,
    TOTE_WALL - TOTE_FLOOR,
    2,
    0.3
  ),
  halo: slab(insetPlan(CARRIAGE, 2), 0, 1, 4).fill,
  plate: slab(CARRIAGE, CARRIAGE_Z, CARRIAGE_TOP - CARRIAGE_Z, 5, 0.6),
  plateScrews: dotsAt([
    [-13.5, 25.4, CARRIAGE_TOP],
    [13.5, 25.4, CARRIAGE_TOP],
  ]),
  plateSeam: sideSeam(CARRIAGE, CARRIAGE_Z + 1.2, P, 5),
  rivets: dotsAt(
    [-12, -6, 0, 6, 12].map((x) => [x, 50.7, CARRIAGE_TOP] as Point3)
  ),
  rollers: ROLLERS.map((x) =>
    drumOf([x, 28, ROLL_Z], ALONG_Y, 20, ROLL_R, P, 14)
  ),
  striker: drumOf([0, 27, 9.5], [0, -1, 0], 7.6, 1.2, P, 14),
};

/** A stack of `count` slips, built at x = 0. */
export function stackOf(count: number) {
  const height = count * SLIP_T;
  const seams: string[] = [];
  for (let index = 1; index < count; index += 1) {
    seams.push(sideSeam(SLIP, SLIP_FLOOR + index * SLIP_T, P, 2));
  }
  return {
    lines: onTop(
      [
        [SLIP.x + 3, SLIP.y + 4],
        [SLIP.x + 14, SLIP.y + 4],
      ],
      SLIP_FLOOR + height,
      P
    ),
    paths: slab(SLIP, SLIP_FLOOR, height, 2),
    seams: join(seams),
  };
}

export const STACKS = Array.from({ length: 8 }, (_, count) =>
  count ? stackOf(count) : null
);
export const FALLING = slab({ ...SLIP, y: -SLIP.d / 2 }, 0, SLIP_T, 2);

// ——— Gate, out-deck and lever ——————————————————————————————————————————————

const PEDESTAL: Plan = { d: 40, r: 1.5, w: 8, x: RAIL_TO, y: 18 };
const OUT_ROLLERS = [109, 114, 119, 124, 129, 134];
const GATE: Plan = { d: 25, r: 0.4, w: GATE_T, x: GATE_X, y: 25.5 };
const POST_PLANS: Plan[] = [
  { d: 4.5, r: 0.8, w: 4.5, x: GATE_X - 1, y: 21.5 },
  { d: 4.5, r: 0.8, w: 4.5, x: GATE_X - 1, y: 50 },
];
const QUADRANT: Flat[] = [
  [0, 0],
  ...Array.from({ length: 10 }, (_, index) => {
    const angle = ((-14 + (index / 9) * 78) * Math.PI) / 180;
    return [9.5 * Math.cos(angle), 9.5 * Math.sin(angle)] as Flat;
  }),
];
const [LX, LY, LZ] = LEVER_PIVOT;

/** Hold stripes across the gate's front face, below its rib: black bands at 45°, cut at the band's edges. */
const BAND = {
  y0: GATE.y + 1,
  y1: GATE.y + GATE.d - 1,
  z0: GATE_Z + 3.9,
  z1: GATE_Z + 8.3,
};
function hazardOf() {
  const face = GATE_X + GATE_T + 0.05;
  const rise = BAND.z1 - BAND.z0;
  const clip = (polygon: Flat[], edge: number, keep: 1 | -1) => {
    const out: Flat[] = [];
    polygon.forEach((a, index) => {
      const b = polygon[(index + 1) % polygon.length] as Flat;
      const inA = (a[0] - edge) * keep >= 0;
      const inB = (b[0] - edge) * keep >= 0;
      if (inA) {
        out.push(a);
      }
      if (inA !== inB) {
        out.push([
          edge,
          a[1] + ((edge - a[0]) * (b[1] - a[1])) / (b[0] - a[0]),
        ]);
      }
    });
    return out;
  };
  const stripes: string[] = [];
  for (let y = BAND.y0 - rise; y < BAND.y1; y += 3.2) {
    const quad: Flat[] = [
      [y, BAND.z0],
      [y + 1.6, BAND.z0],
      [y + 1.6 + rise, BAND.z1],
      [y + rise, BAND.z1],
    ];
    const cut = clip(clip(quad, BAND.y0, 1), BAND.y1, -1);
    if (cut.length > 2) {
      stripes.push(
        poly(
          cut.map(([u, v]) => [face, u, v] as Point3),
          true
        )
      );
    }
  }
  const outline = poly(
    [
      [face, BAND.y0, BAND.z0],
      [face, BAND.y1, BAND.z0],
      [face, BAND.y1, BAND.z1],
      [face, BAND.y0, BAND.z1],
    ],
    true
  );
  return { outline, stripes: join(stripes) };
}

export const GATE_ART = {
  backPost: slab(POST_PLANS[0] as Plan, OUT_Z, POST_TOP - OUT_Z, 2, 0.4),
  boss: drumOf([LX, LY + 0.8, LZ], ALONG_Y, 1.4, 2.6, P, 24),
  frontPost: slab(POST_PLANS[1] as Plan, OUT_Z, POST_TOP - OUT_Z, 2, 0.4),
  gate: slab(GATE, GATE_Z, GATE_H, 2, 0.3),
  gateBolts: dotsAt([
    [GATE_X + GATE_T, 28.5, GATE_Z + 2],
    [GATE_X + GATE_T, 47.5, GATE_Z + 2],
    [GATE_X + GATE_T, 28.5, GATE_Z + GATE_H - 3],
    [GATE_X + GATE_T, 47.5, GATE_Z + GATE_H - 3],
  ]),
  gateLug: slab(
    { d: 4, r: 0.5, w: 1.8, x: GATE_X + GATE_T, y: 35.5 },
    GATE_Z + 16,
    3,
    2,
    0.2
  ),
  gateRib: slab(
    { d: 23, r: 0.3, w: 0.9, x: GATE_X + GATE_T, y: 26.5 },
    GATE_Z + 9.5,
    2.2,
    2
  ),
  halo: slab(
    {
      d: 36,
      r: 2,
      w: OUT.x + OUT.w - PEDESTAL.x + 2,
      x: PEDESTAL.x - 1,
      y: 20,
    },
    0,
    2,
    4
  ).fill,
  hazard: hazardOf(),
  lintel: slab(
    { d: 36, r: 1, w: 7.5, x: GATE_X - 2, y: 20 },
    POST_TOP,
    4,
    3,
    0.5
  ),
  lintelScrews: dotsAt([
    [GATE_X + 1.75, 23.8, POST_TOP + 4],
    [GATE_X + 1.75, 52.2, POST_TOP + 4],
  ]),
  out: slab(OUT, 0, OUT_Z, 4, 0.8),
  outAxles: dotsAt(
    OUT_ROLLERS.map((x) => [x, OUT.y + OUT.d, ROLL_Z - 0.6] as Point3)
  ),
  outRails: [OUT.y, OUT.y + OUT.d - 2].map((y) =>
    slab({ d: 2, r: 0.5, w: OUT.w, x: OUT.x, y }, OUT_Z, GATE_Z - OUT_Z, 2, 0.3)
  ),
  outRollers: OUT_ROLLERS.map((x) =>
    drumOf([x, OUT.y + 2, ROLL_Z], ALONG_Y, OUT.d - 4, ROLL_R, P, 14)
  ),
  outSeam: sideSeam(OUT, 4, P, 4),
  outStop: slab(
    { d: OUT.d - 4, r: 0.4, w: 2, x: OUT.x + OUT.w - 2, y: OUT.y + 2 },
    GATE_Z,
    3,
    2,
    0.3
  ),
  pedestal: slab(PEDESTAL, 0, OUT_Z, 3, 0.6),
  pedestalScrews: dotsAt([
    [PEDESTAL.x + 4, PEDESTAL.y + 2.4, OUT_Z],
    [PEDESTAL.x + 4, PEDESTAL.y + PEDESTAL.d - 2.4, OUT_Z],
  ]),
  postGroove: seg(
    [GATE_X + 3.5, 50, OUT_Z + 1],
    [GATE_X + 3.5, 50, POST_TOP - 1]
  ),
  quadrant: prismOf(
    { a: ALONG_Y, o: [LX, LY, LZ], u: ALONG_X, v: [0, 0, 1] },
    QUADRANT,
    0,
    0.8,
    P
  ),
  quadrantPins: dotsAt(
    [-8, 50].map((deg) => {
      const angle = (deg * Math.PI) / 180;
      return [
        LX + 7.6 * Math.cos(angle),
        LY + 0.85,
        LZ + 7.6 * Math.sin(angle),
      ] as Point3;
    })
  ),
  sill: slab(
    { d: 24, r: 0.4, w: OUT.x - RAIL_TO, x: RAIL_TO, y: 26 },
    OUT_Z,
    GATE_Z - OUT_Z,
    2
  ),
};

// ——— The morning report, clipped to a board behind the gate ————————————————

const BOARD: Plan = { d: 44, r: 2, w: 34, x: 88, y: -50 };
const BOARD_H = 1.6;
const SHEET: Plan = { d: 36, r: 0.3, w: 29, x: 90.5, y: -44 };
const SHEET_TOP = BOARD_H + 0.3;
const CLIP: Plan = { d: 8, r: 1.2, w: 16, x: 97, y: -49 };
const CLIP_TOP = BOARD_H + 1.2;
/** One row per station: calls, books, invoices, then the owner's approval. */
const ROWS = [-31, -24.5, -18, -11.5];
const BOX = 3.2;
const BOX_X = SHEET.x + 2.6;
const RULES = [16, 12, 14, 9];

const tickOf = (y: number) =>
  onTop(
    [
      [BOX_X + 0.7, y - 0.1],
      [BOX_X + 1.3, y + 0.9],
      [BOX_X + 2.6, y - 1.1],
    ],
    SHEET_TOP,
    P
  );

export const REPORT_ART = {
  board: slab(BOARD, 0, BOARD_H, 4, 0.4),
  boardScrews: dotsAt([
    [BOARD.x + 2.4, BOARD.y + BOARD.d - 2.4, BOARD_H],
    [BOARD.x + BOARD.w - 2.4, BOARD.y + BOARD.d - 2.4, BOARD_H],
  ]),
  boxes: join(
    ROWS.map((y) =>
      planOutline(
        { d: BOX, r: 0.3, w: BOX, x: BOX_X, y: y - BOX / 2 },
        SHEET_TOP,
        P,
        2
      )
    )
  ),
  clip: slab(CLIP, BOARD_H, CLIP_TOP - BOARD_H, 3, 0.3),
  clipBar: drumOf(
    [CLIP.x + 2, CLIP.y + CLIP.d - 2.4, CLIP_TOP + 0.7],
    ALONG_X,
    CLIP.w - 4,
    0.9,
    P,
    16
  ),
  clipRivets: dotsAt([
    [CLIP.x + 2.6, CLIP.y + 2.4, CLIP_TOP],
    [CLIP.x + CLIP.w - 2.6, CLIP.y + 2.4, CLIP_TOP],
  ]),
  halo: slab(insetPlan(BOARD, -1), 0, 1, 4).fill,
  header: onTop(
    [
      [SHEET.x + 2.6, -38],
      [SHEET.x + SHEET.w - 2.6, -38],
    ],
    SHEET_TOP,
    P
  ),
  rules: join(
    ROWS.map((y, row) =>
      onTop(
        [
          [BOX_X + BOX + 2.2, y],
          [BOX_X + BOX + 2.2 + (RULES[row] ?? 10), y],
        ],
        SHEET_TOP,
        P
      )
    )
  ),
  sheet: slab(SHEET, BOARD_H, SHEET_TOP - BOARD_H, 2),
  /** Tick sets: entry k holds the first k ticks, so one count shows the report so far. */
  ticks: ROWS.map((_, count) => join(ROWS.slice(0, count + 1).map(tickOf))),
};
