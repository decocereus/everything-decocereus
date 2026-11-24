// The exploded clock, built once on the server: every part as flat markup in
// dial-plane coordinates, grouped into the assemblies the clock comes apart into.

import { HANDS, TEETH } from "./model.ts";
import {
  at,
  bounds,
  circle,
  cylinder,
  type Flat,
  flutes,
  group,
  line,
  M,
  type Node,
  nearness,
  OFF,
  path,
  polar,
  ring,
  stack,
  stroke,
  TAU,
  type Tone,
} from "./plane.ts";
import { hairspring, SPRING_INNER, SPRING_OUTER } from "./spring.ts";
import {
  capsule,
  clubTeeth,
  disc,
  fork,
  hand,
  teeth,
  windows,
} from "./wheels.ts";

const DEG = Math.PI / 180;
const ORIGIN: Flat = [0, 0];
const toward = (from: Flat, th: number, d: number): Flat => [
  from[0] + d * Math.cos(th),
  from[1] + d * Math.sin(th),
];
const angleOf = (from: Flat, to: Flat) =>
  Math.atan2(to[1] - from[1], to[0] - from[0]);
const frac = (value: number) => value - Math.floor(value);

// ---------------------------------------------------------------------------
// The movement's plan: where each arbor stands in the plane. Angles are
// clockwise from three o'clock, as seen from the dial.

const TRAIN_MODULE = 1.6;
const MOTION_MODULE = 2;
const BARREL_MODULE = 1.4;
const pitchOf = (count: number, module: number) => (count * module) / 2;

const CENTER = ORIGIN;
const THIRD = toward(
  CENTER,
  -20 * DEG,
  pitchOf(TEETH.centerWheel + TEETH.thirdPinion, TRAIN_MODULE)
);
const ESCAPE = toward(
  THIRD,
  40 * DEG,
  pitchOf(TEETH.thirdWheel + TEETH.escapePinion, TRAIN_MODULE)
);
const ESCAPE_TIP = 20;
const FORK_TH = 125 * DEG;
const FORK_PIVOT = toward(ESCAPE, FORK_TH, 27);
const LEVER = 26.5;
const BALANCE = toward(FORK_PIVOT, FORK_TH, LEVER + 3.4);
const MINUTE_WHEEL = toward(
  CENTER,
  32 * DEG,
  pitchOf(TEETH.cannonPinion + TEETH.minuteWheel, MOTION_MODULE)
);
const BARREL = toward(
  CENTER,
  18 * DEG,
  pitchOf(TEETH.centerPinion + TEETH.barrel, BARREL_MODULE)
);
const JEWELS: Flat[] = [CENTER, THIRD, ESCAPE, FORK_PIVOT, BALANCE];
// Keyless works on the dial side of the plate: the stem comes in at half past
// one, a crown wheel at its end and a setting lever beside it.
const STEM_TH = -45 * DEG;
const CROWN_WHEEL = toward(ORIGIN, STEM_TH, 56);
const LEVER_A = toward(ORIGIN, -58 * DEG, 63);
const LEVER_B = toward(ORIGIN, -86 * DEG, 74);

// Phase that makes gear B mesh with gear A (A's teeth at phaseA) along the
// line between their centres.
function meshPhase(
  a: Flat,
  countA: number,
  phaseA: number,
  b: Flat,
  countB: number
) {
  const th = angleOf(a, b);
  const fa = frac((th - phaseA) / (TAU / countA));
  return th + Math.PI - (0.5 - fa) * (TAU / countB);
}

const PHASE = (() => {
  const centerWheel = 0;
  const thirdPinion = meshPhase(
    CENTER,
    TEETH.centerWheel,
    centerWheel,
    THIRD,
    TEETH.thirdPinion
  );
  const thirdWheel = 0.07;
  const escapePinion = meshPhase(
    THIRD,
    TEETH.thirdWheel,
    thirdWheel,
    ESCAPE,
    TEETH.escapePinion
  );
  const cannon = 0;
  const minuteWheel = meshPhase(
    CENTER,
    TEETH.cannonPinion,
    cannon,
    MINUTE_WHEEL,
    TEETH.minuteWheel
  );
  const minutePinion = 0.1;
  const hourWheel = meshPhase(
    MINUTE_WHEEL,
    TEETH.minutePinion,
    minutePinion,
    CENTER,
    TEETH.hourWheel
  );
  const centerPinion = 0;
  const barrelGear = meshPhase(
    CENTER,
    TEETH.centerPinion,
    centerPinion,
    BARREL,
    TEETH.barrel
  );
  return {
    barrel: barrelGear,
    cannon,
    centerPinion,
    centerWheel,
    escapePinion,
    hourWheel,
    minutePinion,
    minuteWheel,
    thirdPinion,
    thirdWheel,
  };
})();

// ---------------------------------------------------------------------------
// Flat outlines of every turning part, shared by their stacked copies.

export interface Def {
  d: string;
  id: string;
}

const wheel = (
  count: number,
  module: number,
  phase: number,
  spokes: number,
  rim: number,
  hub: number,
  half: number
) =>
  teeth({ count, module, phase, pitch: pitchOf(count, module) }) +
  (spokes > 0 ? windows(spokes, rim, hub, half, phase + 0.3) : "");

const pinion = (count: number, module: number, phase: number) =>
  teeth({
    addendum: 1.1,
    count,
    dedendum: 1.15,
    module,
    phase,
    pitch: pitchOf(count, module),
    root: 0.22,
    tip: 0.16,
  });

const balanceRim = 21;
const balance = () =>
  disc(balanceRim) + windows(2, balanceRim - 3, 4.2, 1.7, 10 * DEG);

export const DEFS: Def[] = [
  {
    d: wheel(
      TEETH.centerWheel,
      TRAIN_MODULE,
      PHASE.centerWheel,
      4,
      22.6,
      5.6,
      2
    ),
    id: "ck-center-wheel",
  },
  {
    d: pinion(TEETH.centerPinion, BARREL_MODULE, PHASE.centerPinion),
    id: "ck-center-pinion",
  },
  {
    d: pinion(TEETH.thirdPinion, TRAIN_MODULE, PHASE.thirdPinion),
    id: "ck-third-pinion",
  },
  {
    d: wheel(TEETH.thirdWheel, TRAIN_MODULE, PHASE.thirdWheel, 5, 19.6, 5, 1.7),
    id: "ck-third-wheel",
  },
  {
    d: pinion(TEETH.escapePinion, TRAIN_MODULE, PHASE.escapePinion),
    id: "ck-escape-pinion",
  },
  {
    d:
      clubTeeth(TEETH.escapeWheel, ESCAPE_TIP, 15.5, 0.1) +
      windows(4, 13, 4, 1.2, 0.5),
    id: "ck-escape-wheel",
  },
  { d: fork(FORK_TH, [-10.8, 11.8], LEVER), id: "ck-fork" },
  { d: disc(4.6), id: "ck-roller" },
  { d: capsule(LEVER_A, LEVER_B, 3.3), id: "ck-lever" },
  { d: pinion(9, 1.3, 0.2), id: "ck-crown-wheel" },
  { d: balance(), id: "ck-balance" },
  {
    d: pinion(TEETH.cannonPinion, MOTION_MODULE, PHASE.cannon),
    id: "ck-cannon",
  },
  {
    d: wheel(
      TEETH.minuteWheel,
      MOTION_MODULE,
      PHASE.minuteWheel,
      4,
      22.5,
      6,
      2.2
    ),
    id: "ck-minute-wheel",
  },
  {
    d: pinion(TEETH.minutePinion, MOTION_MODULE, PHASE.minutePinion),
    id: "ck-minute-pinion",
  },
  {
    d: wheel(
      TEETH.hourWheel,
      MOTION_MODULE,
      PHASE.hourWheel,
      5,
      24.5,
      8.5,
      2.4
    ),
    id: "ck-hour-wheel",
  },
  {
    d:
      teeth({
        count: TEETH.barrel,
        module: BARREL_MODULE,
        phase: PHASE.barrel,
        pitch: pitchOf(TEETH.barrel, BARREL_MODULE),
      }) + disc(38.5),
    id: "ck-barrel-gear",
  },
  {
    d: hand({
      hub: 6.2,
      length: 80,
      tail: 15,
      th: HANDS.minute * DEG - Math.PI / 2,
      width: 2.9,
    }),
    id: "ck-minute-hand",
  },
  {
    d: hand({
      hub: 7.4,
      length: 54,
      tail: 0,
      th: HANDS.hour * DEG - Math.PI / 2,
      width: 4.4,
    }),
    id: "ck-hour-hand",
  },
];

// ---------------------------------------------------------------------------
// Items: pieces of markup with the axial span they occupy, painted far to near.

interface Item {
  near: number;
  node: Node;
  rank: number;
  z: number;
}

class Layer {
  items: Item[] = [];
  readonly base: number;
  constructor(base: number) {
    this.base = base;
  }
  put(z0: number, z1: number, where: Flat, node: Node, rank = 1) {
    this.items.push({
      near: nearness(where[0], where[1]),
      node,
      rank,
      z: (z0 + z1) / 2,
    });
  }
  nodes() {
    return [...this.items]
      .sort((a, b) => b.z - a.z || a.near - b.near || a.rank - b.rank)
      .map((item) => item.node);
  }
}

// A rod along the axis: arbor, pillar, stud, pipe. Split at the given depths
// so each piece sorts with what lies beside it.
function rod(
  layer: Layer,
  c: Flat,
  r: number,
  z0: number,
  z1: number,
  tone: Tone = "hi",
  cuts: number[] = []
) {
  const stops = [z0, ...cuts.filter((z) => z > z0 && z < z1), z1];
  for (let index = 0; index < stops.length - 1; index += 1) {
    const a = layer.base + (stops[index] ?? 0);
    const b = layer.base + (stops[index + 1] ?? 0);
    const joined = index < stops.length - 2;
    // A joined piece reaches a hair under the next one so no seam shows.
    const reach = joined ? b + 0.25 : b;
    layer.put(
      a,
      b,
      c,
      cylinder(c[0], c[1], r, a, reach, { crease: "lo", joined, tone }),
      0
    );
  }
}

function turning(
  layer: Layer,
  id: string,
  c: Flat,
  z0: number,
  depth: number,
  spin: string | undefined,
  front: Node[] = [],
  kind = "ck-part"
) {
  const z = layer.base + z0;
  layer.put(
    z,
    z + depth,
    c,
    stack(`#${id}`, c[0], c[1], z, depth, spin, front, kind)
  );
}

// A slotted screw head standing on a face at z.
function screw(layer: Layer, c: Flat, r: number, z: number, slot: number) {
  const top = layer.base + z - 1.3;
  const face = at(c[0], c[1], top);
  const slotLine = stroke(
    line([polar(face, r, slot), polar(face, r, slot + Math.PI)]),
    "mid"
  );
  layer.put(
    top,
    layer.base + z,
    c,
    cylinder(c[0], c[1], r, top, layer.base + z, {
      crease: "lo",
      inner: [slotLine],
      tone: "mid",
    })
  );
}

// A jewel in its setting, flush on a face at z: chaton ring, stone, hole.
function jewel(c: Flat, z: number): Node[] {
  const p = at(c[0], c[1], z);
  return [
    stroke(circle(p, 7), "faint"),
    stroke(circle(p, 4.4), "lo"),
    stroke(circle(p, 2.6), "mid"),
    path(circle(p, 2.3), "ck-stone"),
    path(circle(p, 0.6), "iso-fill"),
  ];
}

// ---------------------------------------------------------------------------
// Assemblies, front (nearest the viewer) to back.

export interface Assembly {
  name: string;
  near: number;
  nodes: Node[];
  z: number;
}

function crystal(z: number) {
  const layer = new Layer(z);
  const r = 88;
  const face = at(0, 0, z);
  const streaks: Node[] = [];
  for (const [th, offset] of [
    [-128, 0.62],
    [-120, 0.8],
    [52, 0.84],
  ] as const) {
    // Glare: full chords across the glass, ending on its inner ring.
    const rim = r - 4;
    const mid = polar(face, rim * offset, th * DEG);
    const half = rim * Math.sqrt(1 - offset * offset);
    const dir = (th + 90) * DEG;
    streaks.push(
      stroke(line([polar(mid, -half, dir), polar(mid, half, dir)]), "faint")
    );
  }
  layer.put(
    z,
    z + 3,
    ORIGIN,
    cylinder(0, 0, r, z, z + 3, {
      cls: "ck-glass",
      crease: "faint",
      inner: [stroke(circle(face, r - 4), "faint"), ...streaks],
      tone: "mid",
    })
  );
  return layer;
}

function bezel(z: number) {
  const layer = new Layer(z);
  layer.put(
    z + 3,
    z + 10,
    ORIGIN,
    ring(0, 0, 84.5, 88.5, z + 3, z + 10, { crease: "lo", tone: "mid" })
  );
  layer.put(
    z,
    z + 10,
    ORIGIN,
    ring(0, 0, 88.5, 101, z, z + 10, {
      crease: "lo",
      inner: [
        ...flutes(0, 0, 101, z + 2.2, z + 10, 120),
        stroke(circle(at(0, 0, z), 95), "faint"),
      ],
      seams: [z + 2.2],
      tone: "mid",
    })
  );
  return layer;
}

function hands(z: number) {
  const layer = new Layer(z);
  rod(layer, CENTER, 4.1, 7.6, 13, "mid");
  turning(layer, "ck-hour-hand", CENTER, 6.2, 1.4, "hour", [], "ck-hand");
  rod(layer, CENTER, 2.7, 3.4, 6.2, "mid");
  turning(layer, "ck-minute-hand", CENTER, 2.2, 1.2, "minute", [], "ck-hand");
  rod(layer, CENTER, 3.4, 1, 2.2, "mid");
  const cap = at(0, 0, z + 1);
  layer.put(z, z + 1, CENTER, group([path(circle(cap, 1), "ck-stone")]));
  return layer;
}

function dial(z: number) {
  const layer = new Layer(z);
  const face = at(0, 0, z);
  const marks: Node[] = [
    stroke(circle(face, 87), "mid"),
    stroke(circle(face, 81.5), "lo"),
  ];
  let ticks = "";
  let bars = "";
  for (let index = 0; index < 60; index += 1) {
    const th = (index / 60) * TAU - Math.PI / 2;
    if (index % 5 !== 0) {
      ticks += line([polar(face, 81.5, th), polar(face, 87, th)]);
    }
  }
  for (let hour = 0; hour < 12; hour += 1) {
    const th = (hour / 12) * TAU - Math.PI / 2;
    const offsets = hour === 0 ? [-2.8, 2.8] : [0];
    for (const offset of offsets) {
      const side = th + Math.PI / 2;
      const half = hour % 3 === 0 ? 1.7 : 1.25;
      const a = polar(polar(face, 79, th), offset, side);
      const b = polar(polar(face, 62, th), offset, side);
      bars += line(
        [
          polar(a, -half, side),
          polar(a, half, side),
          polar(b, half, side),
          polar(b, -half, side),
        ],
        true
      );
    }
  }
  marks.push(stroke(ticks, "mid"), path(bars, "ck-ink"));
  marks.push(stroke(circle(face, 9), "faint"));
  for (const th of [64, 244]) {
    rod(layer, toward(ORIGIN, th * DEG, 76), 1.5, 3, 13, "mid");
  }
  layer.put(
    z,
    z + 3,
    ORIGIN,
    ring(0, 0, 4.2, 90, z, z + 3, { crease: "lo", inner: marks, tone: "hi" })
  );
  return layer;
}

function motionWorks(z: number) {
  const layer = new Layer(z);
  // Back level: cannon pinion on the centre, minute wheel on its stud.
  rod(layer, MINUTE_WHEEL, 3.2, 11, 13, "hi");
  turning(layer, "ck-minute-wheel", MINUTE_WHEEL, 9, 2, "minuteWheel", [
    stroke(circle(ORIGIN, 6), "faint"),
  ]);
  turning(layer, "ck-cannon", CENTER, 8.5, 3.6, "minute");
  rod(layer, MINUTE_WHEEL, 3.2, 3.6, 9, "hi");
  rod(layer, CENTER, 3.5, -12, -8, "hi");
  rod(layer, CENTER, 3.5, 2.2, 8.5, "hi");
  // Front level: hour wheel on the cannon pinion's pipe, minute pinion.
  turning(layer, "ck-minute-pinion", MINUTE_WHEEL, 0, 3.6, "minuteWheel");
  turning(layer, "ck-hour-wheel", CENTER, 0, 2.2, "hourWheel", [
    stroke(circle(ORIGIN, 8.5), "faint"),
  ]);
  rod(layer, CENTER, 5.6, -8, 0, "hi");
  rod(layer, MINUTE_WHEEL, 3.2, -1.4, 0, "hi");
  return layer;
}

function plate(z: number) {
  const layer = new Layer(z);
  const face = at(0, 0, z);
  // The winding stem's channel runs in from the rim to the crown wheel.
  const along: Flat = [Math.cos(STEM_TH), Math.sin(STEM_TH)];
  const across: Flat = [-along[1], along[0]];
  const channel = [-2.6, 2.6].map((s) => {
    const rim = Math.sqrt(94 * 94 - s * s);
    const point = (r: number): Flat => [
      face[0] + along[0] * r + across[0] * s,
      face[1] + along[1] * r + across[1] * s,
    ];
    return line([point(rim), point(Math.sqrt(64 - s * s) + 56)]);
  });
  const inner: Node[] = [
    stroke(circle(face, 47), "lo"),
    stroke(circle(face, 44.5), "faint"),
    stroke(channel.join(""), "lo"),
    stroke(circle(at(CROWN_WHEEL[0], CROWN_WHEEL[1], z), 8), "lo"),
  ];
  for (const c of JEWELS.slice(1)) {
    inner.push(...jewel(c, z));
  }
  for (const th of [64, 244]) {
    const p = toward(ORIGIN, th * DEG, 76);
    inner.push(stroke(circle(at(p[0], p[1], z), 2.1), "mid"));
  }
  layer.put(
    z,
    z + 8,
    ORIGIN,
    ring(0, 0, 4.4, 94, z, z + 8, {
      crease: "lo",
      inner,
      seams: [z + 4],
      tone: "hi",
    })
  );
  for (const [index, th] of [22, 112, 200, 292].entries()) {
    screw(layer, toward(ORIGIN, th * DEG, 84), 3.6, 0, (index * 47 + 20) * DEG);
  }
  rod(layer, MINUTE_WHEEL, 2.4, -11, 0, "mid");
  turning(layer, "ck-crown-wheel", CROWN_WHEEL, -2.4, 2.4, undefined);
  rod(layer, CROWN_WHEEL, 1.6, -3.4, -2.4, "mid");
  turning(layer, "ck-lever", ORIGIN, -1.4, 1.4, undefined);
  screw(layer, LEVER_B, 2.5, -1.4, 30 * DEG);
  rod(layer, LEVER_A, 1.1, -3.6, -1.4, "mid");
  return layer;
}

const TRAIN_CUTS = [
  0, 2, 3, 7.5, 8, 10, 10.5, 12.4, 13, 13.6, 15.5, 16, 18, 18.5, 22, 25,
];

function train(z: number) {
  const layer = new Layer(z);
  // Arbors show only where no wheel or pinion covers them.
  const arbor = (c: Flat, r: number, spans: [number, number][]) => {
    for (const [z0, z1] of spans) {
      rod(layer, c, r, z0, z1, "hi", TRAIN_CUTS);
    }
  };
  // Front level: escape wheel and pallet fork, with the roller behind.
  turning(layer, "ck-escape-wheel", ESCAPE, 0, 2, "escape");
  turning(layer, "ck-fork", FORK_PIVOT, 0, 2, "fork", [
    ...[-1, 1].map((side) =>
      path(
        circle(
          polar(ORIGIN, 14.9, FORK_TH + Math.PI - side * 47.5 * DEG),
          1.25
        ),
        "ck-stone"
      )
    ),
  ]);
  for (const side of [-1, 1]) {
    const pin = polar(
      polar(FORK_PIVOT, 11, FORK_TH),
      side * 4.8,
      FORK_TH + Math.PI / 2
    );
    rod(layer, pin, 0.9, -2, 2, "mid", TRAIN_CUTS);
  }
  turning(layer, "ck-roller", BALANCE, 2, 1, "balance", [
    path(circle(polar(ORIGIN, 3.4, FORK_TH + Math.PI), 0.9), "ck-stone"),
  ]);
  // Middle level: balance, third wheel and escape pinion; hairspring behind.
  turning(layer, "ck-balance", BALANCE, 8, 2, "balance", [
    ...Array.from({ length: 8 }, (_, index) =>
      path(
        circle(
          polar(ORIGIN, balanceRim - 1.5, (index + 0.5) * (TAU / 8)),
          0.75
        ),
        "ck-stone"
      )
    ),
  ]);
  const springPlane = at(BALANCE[0], BALANCE[1], z + 13);
  layer.put(
    z + 13,
    z + 13,
    BALANCE,
    group([path(hairspring(0), "iso-line ck-hairspring", { tone: "mid" })], {
      transform: `translate(${springPlane[0].toFixed(2)} ${springPlane[1].toFixed(2)})`,
    }),
    0
  );
  // The collet holds the spring's inner end, the stud its outer end.
  layer.put(
    z + 12.4,
    z + 13.6,
    BALANCE,
    cylinder(BALANCE[0], BALANCE[1], SPRING_INNER, z + 12.4, z + 13.6, {
      crease: "lo",
      tone: "hi",
    })
  );
  rod(
    layer,
    [BALANCE[0] + SPRING_OUTER + 1.1, BALANCE[1]],
    1.3,
    11.5,
    16,
    "mid",
    TRAIN_CUTS
  );
  turning(layer, "ck-third-wheel", THIRD, 8, 2, "third");
  turning(layer, "ck-escape-pinion", ESCAPE, 7.5, 3, "escape");
  // Back level: centre wheel and third pinion; centre pinion behind.
  turning(layer, "ck-center-wheel", CENTER, 16, 2, "center");
  turning(layer, "ck-third-pinion", THIRD, 15.5, 3, "third");
  turning(layer, "ck-center-pinion", CENTER, 22, 3, "center");
  arbor(CENTER, 1.7, [
    [-8, 16],
    [18, 22],
    [25, 28],
  ]);
  arbor(THIRD, 1.4, [
    [-4, 8],
    [10, 15.5],
    [18.5, 24],
  ]);
  arbor(ESCAPE, 1.2, [
    [-4, 0],
    [2, 7.5],
    [10.5, 18],
  ]);
  arbor(FORK_PIVOT, 1.2, [
    [-4, 0],
    [2, 9],
  ]);
  arbor(BALANCE, 1.3, [
    [-4, 2],
    [3, 8],
    [10, 18],
  ]);
  return layer;
}

function bridge(z: number) {
  const layer = new Layer(z);
  const face = at(0, 0, z);
  const inner: Node[] = [
    stroke(circle(face, 89), "lo"),
    stroke(circle(at(BARREL[0], BARREL[1], z), 7.5), "lo"),
    stroke(circle(at(BARREL[0], BARREL[1], z), 4.2), "mid"),
  ];
  for (const c of JEWELS) {
    inner.push(...jewel(c, z));
  }
  layer.put(
    z,
    z + 7,
    ORIGIN,
    cylinder(0, 0, 94, z, z + 7, {
      crease: "lo",
      inner,
      seams: [z + 3.5],
      tone: "hi",
    })
  );
  for (const th of [40, 130, 220, 310]) {
    const c = toward(ORIGIN, th * DEG, 84);
    const cap = at(c[0], c[1], z - 24);
    layer.put(
      z - 24,
      z,
      c,
      cylinder(c[0], c[1], 3.8, z - 24, z, {
        crease: "lo",
        inner: [stroke(circle(cap, 1.3), "lo")],
        seams: [z - 21],
        tone: "hi",
      })
    );
  }
  for (const [index, th] of [-8, 170, 262].entries()) {
    screw(layer, toward(ORIGIN, th * DEG, 66), 3.4, 0, (index * 61 + 35) * DEG);
  }
  return layer;
}

function barrel(z: number) {
  const layer = new Layer(z);
  turning(layer, "ck-barrel-gear", BARREL, 15, 3, "barrel");
  const floor = at(BARREL[0], BARREL[1], z + 14);
  layer.put(
    z + 14,
    z + 14,
    BARREL,
    group([
      path(circle(floor, 38.5), "iso-shade", { shade: 2 }),
      group(
        [
          group([path(mainspring(), "iso-line", { tone: "mid" })], {
            spin: "barrel",
          }),
        ],
        {
          transform: `translate(${floor[0].toFixed(2)} ${floor[1].toFixed(2)})`,
        }
      ),
    ])
  );
  rod(layer, BARREL, 5.2, 2, 14, "hi");
  layer.put(
    z,
    z + 15,
    BARREL,
    ring(BARREL[0], BARREL[1], 38.5, 41.5, z, z + 15, {
      crease: "lo",
      tone: "hi",
    })
  );
  rod(layer, BARREL, 3.6, -5, 2, "hi");
  return layer;
}

function mainspring() {
  const turns = 9;
  const inner = 5.2;
  const outer = 38.5;
  const steps = turns * 36;
  const points: Flat[] = [];
  for (let index = 0; index <= steps; index += 1) {
    const t = index / steps;
    const th = t * turns * TAU;
    points.push(polar(ORIGIN, inner + (outer - inner) * t, th));
  }
  return line(points);
}

function caseBack(z: number) {
  const layer = new Layer(z);
  const floor = at(0, 0, z + 4);
  const engraving: Node[] = [
    stroke(circle(floor, 84), "lo"),
    stroke(circle(floor, 32), "faint"),
    stroke(circle(floor, 28.5), "faint"),
    stroke(circle(floor, 4), "faint"),
  ];
  layer.put(
    z + 4,
    z + 10,
    ORIGIN,
    cylinder(0, 0, 88, z + 4, z + 10, {
      crease: "lo",
      inner: engraving,
      tone: "hi",
    })
  );
  const rim = at(0, 0, z);
  layer.put(
    z,
    z + 10,
    ORIGIN,
    ring(0, 0, 88, 101, z, z + 10, {
      crease: "lo",
      inner: [
        stroke(circle(rim, 91.5), "faint"),
        ...flutes(0, 0, 101, z + 6, z + 10, 150, "faint"),
      ],
      seams: [z + 6],
      tone: "hi",
    })
  );
  for (let index = 0; index < 6; index += 1) {
    screw(
      layer,
      toward(ORIGIN, (index * 60 + 30) * DEG, 96),
      2.6,
      0,
      (index * 37 + 10) * DEG
    );
  }
  return layer;
}

// ---------------------------------------------------------------------------
// The exploded pose (Z) and the near-assembled pose the clock opens from.

const PLAN: Array<{
  name: string;
  z: number;
  span: [number, number];
  build: (z: number) => Layer;
}> = [
  { build: crystal, name: "crystal", span: [0, 3], z: 0 },
  { build: bezel, name: "bezel", span: [0, 10], z: 50 },
  { build: hands, name: "hands", span: [0, 13], z: 134 },
  { build: dial, name: "dial", span: [0, 13], z: 156 },
  { build: motionWorks, name: "motion", span: [-12, 13], z: 225 },
  { build: plate, name: "plate", span: [-11, 8], z: 285 },
  { build: train, name: "train", span: [-8, 28], z: 358 },
  { build: bridge, name: "bridge", span: [-24, 7], z: 446 },
  { build: barrel, name: "barrel", span: [-5, 18], z: 514 },
  { build: caseBack, name: "caseBack", span: [0, 10], z: 585 },
];

const GAP = 3;

function nearPose() {
  const near: number[] = [];
  PLAN.forEach((part, index) => {
    const previous = PLAN[index - 1];
    const before = near[index - 1];
    near.push(
      previous && before !== undefined
        ? before + previous.span[1] - part.span[0] + GAP
        : 0
    );
  });
  const shift =
    PLAN.reduce((sum, part) => sum + part.z, 0) / PLAN.length -
    near.reduce((sum, z) => sum + z, 0) / near.length;
  return near.map((z) => z + shift);
}

export const ASSEMBLIES: Assembly[] = (() => {
  const near = nearPose();
  return PLAN.map((part, index) => ({
    name: part.name,
    near: near[index] ?? part.z,
    nodes: part.build(part.z).nodes(),
    z: part.z,
  }));
})();

// Fit everything into the figure's box.
export const WIDTH = 1040;
export const HEIGHT = 807;
const PAD = 14;

export const FIT = (() => {
  const scale = Math.min(
    (WIDTH - PAD * 2) / (bounds.maxX - bounds.minX),
    (HEIGHT - PAD * 2) / (bounds.maxY - bounds.minY)
  );
  const x =
    (WIDTH - (bounds.maxX - bounds.minX) * scale) / 2 - bounds.minX * scale;
  const y =
    (HEIGHT - (bounds.maxY - bounds.minY) * scale) / 2 - bounds.minY * scale;
  return {
    matrix: [M[0] * scale, M[2] * scale, M[1] * scale, M[3] * scale, x, y],
    scale,
  };
})();

// The flat shift that moves an assembly from its exploded place to depth z.
export const shiftFor = (from: number, to: number): Flat => [
  (to - from) * OFF[0],
  (to - from) * OFF[1],
];
