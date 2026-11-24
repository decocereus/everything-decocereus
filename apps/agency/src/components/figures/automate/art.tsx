// Static parts, built once on the server. Each station's parts are split into
// layers (a: under the cards, c: the front rails over them, d: above them) so
// the live component can paint the cards and the report between them.
import { Fragment } from "react";
import {
  corners,
  cylinder,
  type Flat,
  haloOf,
  insetPlan,
  lineOnTop,
  onTop,
  type Plan,
  type Point3,
  pathOf,
  planOutline,
  ring,
  sideMatrix,
  sideSeam,
  slabOf,
  topTicks,
} from "../../iso/iso-kit.ts";
import { drumOf, sphereOf } from "../../iso/prism.ts";
import { Dots, FaceText, Line, Solid } from "../../iso/react/draw.tsx";
import {
  AI,
  AI_H,
  at,
  BELT_Z,
  BENCH,
  BENCH_H,
  CARD,
  CARD_T,
  COPY,
  CRANK,
  DRIVE,
  DRIVE_H,
  EXIT_X,
  FOOT_H,
  GATE_H,
  GATE_T,
  GATE_X,
  GATHER,
  HOPPER_TOP,
  HOPPER_W,
  HOPPERS,
  KEY,
  LEDGE,
  P,
  PLATEN,
  PLINTH_H,
  POST_TOP,
  PRESS_X,
  RAIL_TOP,
  REPORT,
  REPORT_T,
  ROLL,
  SEND,
  SOCKET,
  SOCKET_TOP,
  WRITE,
  WRITER,
  WRITER_TOP,
} from "./view.ts";

const Y = [0, 1, 0] as Point3;
const X = [1, 0, 0] as Point3;

/** A closed outline on the vertical face x = c. */
const xFace = (c: number, y0: number, y1: number, z0: number, z1: number) =>
  pathOf(
    [at([c, y0, z0]), at([c, y1, z0]), at([c, y1, z1]), at([c, y0, z1])],
    true
  );

/** A closed outline on the vertical face y = c. */
const yFace = (c: number, x0: number, x1: number, z0: number, z1: number) =>
  pathOf(
    [at([x0, c, z0]), at([x1, c, z0]), at([x1, c, z1]), at([x0, c, z1])],
    true
  );

/** A slot: a closed, rounded-looking outline on the face y = c. */
const ySlot = (c: number, x0: number, x1: number, z: number, h: number) => {
  const r = h / 2;
  const points: Flat[] = [];
  for (let step = 0; step <= 8; step += 1) {
    const a = Math.PI / 2 + (step / 8) * Math.PI;
    points.push(at([x0 + r + r * Math.cos(a), c, z + r * Math.sin(a)]));
  }
  for (let step = 0; step <= 8; step += 1) {
    const a = -Math.PI / 2 + (step / 8) * Math.PI;
    points.push(at([x1 - r + r * Math.cos(a), c, z + r * Math.sin(a)]));
  }
  return pathOf(points, true);
};

const screws = (plan: Plan, inset: number, z: number) =>
  corners(plan, inset).map(([x, y]) => at([x, y, z]));

const span = (plan: Plan): [number, number] => [plan.x, plan.x + plan.w];

// ── Bench ───────────────────────────────────────────────────────────────
const RULER: Plan = { d: 5, r: 1, w: 236, x: -196, y: 44 };
const RULER_TICKS = topTicks(
  RULER.x + 4,
  RULER.x + RULER.w - 4,
  4,
  5,
  RULER.y + 0.6,
  0.6,
  [1.8, 3.2],
  P
);
const LABEL: Plan = { d: 14, r: 1.5, w: 26, x: -224, y: 30 };

const bench = (
  <g key="bench">
    <path className="iso-halo" d={haloOf(BENCH, -BENCH_H - FOOT_H, 8, P)} />
    {corners(BENCH, 16)
      .sort((a, b) => a[0] + a[1] - (b[0] + b[1]))
      .map(([x, y]) => (
        <Fragment key={`foot-${x}-${y}`}>
          <Solid
            crease="none"
            paths={cylinder(x, y, 6, -BENCH_H - FOOT_H, 1.4, P, 28)}
            tone="lo"
          />
          <Solid
            crease="none"
            paths={cylinder(
              x,
              y,
              4.6,
              -BENCH_H - FOOT_H + 1.4,
              FOOT_H - 1.4,
              P,
              24
            )}
            tone="mid"
          />
        </Fragment>
      ))}
    <Solid
      inner={<Line d={sideSeam(BENCH, -4, P, 8)} tone="faint" />}
      paths={slabOf(BENCH, -BENCH_H, BENCH_H, P, 8, 1.4)}
      tone="mid"
    />
    <Line d={planOutline(insetPlan(BENCH, 5), 0, P)} tone="faint" />
    {corners(BENCH, 10).map(([x, y]) => (
      <Line d={ring(x, y, 1.8, 0, P, 14)} key={`ring-${x}-${y}`} tone="lo" />
    ))}
    <Dots points={screws(BENCH, 10, 0)} size={0.5} tone="mid" />
    <Solid crease="none" paths={slabOf(RULER, 0, 0.6, P, 3)} tone="lo" />
    <Line d={RULER_TICKS.minor} tone="lo" />
    <Line d={RULER_TICKS.major} tone="mid" />
    <Solid crease="faint" paths={slabOf(LABEL, 0, 0.8, P, 3)} tone="lo" />
    <Line d={planOutline(insetPlan(LABEL, 1.6), 0.8, P, 3)} tone="faint" />
    <Line
      d={lineOnTop(
        [LABEL.x + 4, LABEL.y + 5],
        [LABEL.x + 20, LABEL.y + 5],
        0.8,
        P
      )}
      free
      tone="lo"
    />
    <Line
      d={lineOnTop(
        [LABEL.x + 4, LABEL.y + 7.5],
        [LABEL.x + 16, LABEL.y + 7.5],
        0.8,
        P
      )}
      free
      tone="lo"
    />
    <Line
      d={lineOnTop(
        [LABEL.x + 4, LABEL.y + 10],
        [LABEL.x + 12, LABEL.y + 10],
        0.8,
        P
      )}
      free
      tone="lo"
    />
  </g>
);

/** The soft shadow each station casts on the bench when it is lifted. */
const stationHalo = (plan: Plan) => (
  <path className="iso-halo" d={haloOf(plan, 0, 2, P)} />
);

// ── A run of belt between two rails ──────────────────────────────────────
function beltBack(x0: number, x1: number) {
  return (
    <Fragment key={`belt-${x0}`}>
      <Solid
        paths={slabOf(
          { d: 4, r: 0.6, w: x1 - x0, x: x0, y: -18 },
          PLINTH_H,
          RAIL_TOP - PLINTH_H,
          P,
          3,
          0.4
        )}
        tone="mid"
      />
      <Solid
        className="am-belt"
        crease="lo"
        paths={slabOf(
          { d: 28, r: 0.4, w: x1 - x0 - 1, x: x0 + 0.5, y: -14 },
          PLINTH_H,
          BELT_Z - PLINTH_H,
          P,
          2
        )}
        tone="mid"
      />
    </Fragment>
  );
}

function beltFront(x0: number, x1: number) {
  const rail: Plan = { d: 4, r: 0.6, w: x1 - x0, x: x0, y: 14 };
  const bosses = [x0 + 5, x1 - 5];
  const dots: Flat[] = [];
  for (let x = x0 + 4; x <= x1 - 4; x += 12) {
    dots.push(at([x, 16, RAIL_TOP]));
  }
  return (
    <Fragment key={`rail-${x0}`}>
      <Solid
        inner={<Line d={sideSeam(rail, PLINTH_H + 4, P, 3)} tone="faint" />}
        paths={slabOf(rail, PLINTH_H, RAIL_TOP - PLINTH_H, P, 3, 0.4)}
        tone="mid"
      />
      <Dots points={dots} size={0.42} tone="mid" />
      {bosses.map((x) => (
        <Fragment key={`boss-${x}`}>
          <Solid
            crease="none"
            paths={drumOf([x, 18, 17], Y, 1.6, 2.6, P, 20)}
            tone="mid"
          />
          <Dots points={[at([x, 19.6, 17])]} size={0.55} tone="hi" />
        </Fragment>
      ))}
    </Fragment>
  );
}

// ── Station 0: the drive and the three hoppers (gather) ─────────────────
const DRIVE_FRONT = DRIVE.y + DRIVE.d;

const driveHousing = (
  <g key="drive">
    <Solid
      inner={<Line d={sideSeam(DRIVE, 6, P, 4)} tone="faint" />}
      paths={slabOf(DRIVE, 0, DRIVE_H, P, 4, 0.8)}
      tone="mid"
    />
    {[0, 1, 2].map((index) => (
      <Line
        d={ySlot(DRIVE_FRONT, DRIVE.x + 2, DRIVE.x + 9, 27 - index * 3.4, 1.6)}
        key={`vent-${index}`}
        tone="lo"
      />
    ))}
    <Line
      d={yFace(DRIVE_FRONT, DRIVE.x + 22, DRIVE.x + 29, 3, 9)}
      tone="faint"
    />
    <Dots
      points={[
        at([DRIVE.x + 23.2, DRIVE_FRONT, 7.8]),
        at([DRIVE.x + 27.8, DRIVE_FRONT, 7.8]),
        at([DRIVE.x + 23.2, DRIVE_FRONT, 4.2]),
        at([DRIVE.x + 27.8, DRIVE_FRONT, 4.2]),
      ]}
      size={0.4}
      tone="mid"
    />
    <Dots points={screws(DRIVE, 3, DRIVE_H)} size={0.45} tone="mid" />
    <Solid
      paths={slabOf(SOCKET, DRIVE_H, SOCKET_TOP - DRIVE_H, P, 3, 0.5)}
      tone="mid"
    />
    <path
      className="am-recess"
      d={slabOf(insetPlan(SOCKET, 2), SOCKET_TOP, 0, P, 3).fill}
    />
    <Line d={planOutline(insetPlan(SOCKET, 2), SOCKET_TOP, P, 3)} tone="lo" />
    <Dots
      points={[-4, -1.4, 1.4, 4].map((dy) =>
        at([SOCKET.x + SOCKET.w / 2, dy, SOCKET_TOP])
      )}
      size={0.5}
      tone="mid"
    />
    <Solid
      crease="none"
      paths={drumOf([DRIVE.x + DRIVE.w, 0, 16], X, 4, 4, P, 24)}
      tone="mid"
    />
    <Solid
      crease="none"
      paths={drumOf([CRANK[0], DRIVE_FRONT, CRANK[2]], Y, 2.6, 5.2, P, 28)}
      tone="mid"
    />
  </g>
);

/** The AI module: an orange cartridge that plugs into the drive's socket. */
const AI_FRONT = AI.y + AI.d;
export const aiModule = (
  <g className="am-ai" key="ai">
    <Solid
      inner={<Line d={sideSeam(AI, SOCKET_TOP + 3, P, 4)} tone="mid" />}
      paths={slabOf(AI, SOCKET_TOP, AI_H, P, 4, 0.8)}
      tone="hi"
    />
    <Solid
      paths={slabOf(insetPlan(AI, 3), SOCKET_TOP + AI_H, 1.6, P, 3, 0.4)}
      tone="hi"
    />
    {[-4, 0, 4].map((dy) => (
      <Line
        d={lineOnTop(
          [AI.x + 3, dy],
          [AI.x + AI.w - 3, dy],
          SOCKET_TOP + AI_H + 1.6,
          P
        )}
        key={`grip-${dy}`}
        tone="mid"
      />
    ))}
    <FaceText
      size={5.2}
      tone="hi"
      transform={sideMatrix(
        [AI.x + 4.2, AI_FRONT],
        SOCKET_TOP + 4.6,
        P,
        "left"
      )}
    >
      AI
    </FaceText>
    <Dots
      points={[at([AI.x + AI.w - 3.4, AI_FRONT, SOCKET_TOP + 8.6])]}
      size={0.7}
      tone="hi"
    />
  </g>
);

/** The crank's hub, shaft and handle, built at angle 0; the arm is rebuilt each frame. */
export const crankShaft = (
  <Solid
    crease="none"
    key="shaft"
    paths={drumOf([CRANK[0], CRANK[1] + 2.6, CRANK[2]], Y, 9, 1.5, P, 20)}
    tone="mid"
  />
);
export const crankHub = (
  <Solid
    crease="none"
    key="hub"
    paths={drumOf([CRANK[0], CRANK[1] + 3, CRANK[2]], Y, 3, 3.4, P, 28)}
    tone="mid"
  />
);
export const crankHandle = (
  <g key="handle">
    <Solid
      crease="none"
      paths={drumOf([CRANK[0], CRANK[1] + 8, CRANK[2]], Y, 2, 1.2, P, 16)}
      tone="mid"
    />
    <Solid
      crease="none"
      paths={drumOf([CRANK[0], CRANK[1] + 10, CRANK[2]], Y, 7, 2.1, P, 24)}
      tone="hi"
    />
    <Solid
      crease="none"
      paths={sphereOf([CRANK[0], CRANK[1] + 17, CRANK[2]], 2.1, P, 24)}
      tone="hi"
    />
  </g>
);

const hopper = (x: number, index: number) => {
  const plan: Plan = {
    d: 32,
    r: 1.2,
    w: HOPPER_W,
    x: x - HOPPER_W / 2,
    y: -16,
  };
  const mouth = insetPlan(plan, 2.4);
  const card = insetPlan(plan, 4.2);
  const marks = Array.from({ length: index + 1 }, (_, dot) =>
    at([plan.x + 3.5 + dot * 2.4, 16, HOPPER_TOP - 5])
  );
  return (
    <g key={`hopper-${index}`}>
      <Solid
        inner={<Line d={sideSeam(plan, HOPPER_TOP - 9, P, 3)} tone="faint" />}
        paths={slabOf(plan, RAIL_TOP, HOPPER_TOP - RAIL_TOP, P, 3, 0.6)}
        tone="mid"
      />
      <path className="am-recess" d={slabOf(mouth, HOPPER_TOP, 0, P, 3).fill} />
      <Line d={planOutline(mouth, HOPPER_TOP, P, 3)} tone="lo" />
      <Solid
        crease="none"
        flat
        paths={slabOf(card, HOPPER_TOP, 0, P, 2)}
        tone="lo"
      />
      <Line
        d={lineOnTop(
          [card.x + 1.6, card.y + 3],
          [card.x + 6, card.y + 3],
          HOPPER_TOP,
          P
        )}
        free
        tone="lo"
      />
      <Solid
        paths={cylinder(x, 0, 3.2, HOPPER_TOP, 2.4, P, 28, 0.4)}
        tone="mid"
      />
      <Solid
        crease="none"
        paths={sphereOf([x, 0, HOPPER_TOP + 4.2], 1.8, P, 24)}
        tone="mid"
      />
      <Line
        d={xFace(plan.x + plan.w, -11, 11, RAIL_TOP + 0.8, RAIL_TOP + 2.8)}
        tone="lo"
      />
      <Dots points={marks} size={0.65} tone="hi" />
      <Solid
        crease="none"
        paths={drumOf([x + 4.5, 16, 31], Y, 2.2, 2.4, P, 24)}
        tone="mid"
      />
      <Dots points={screws(plan, 2, HOPPER_TOP)} size={0.4} tone="mid" />
    </g>
  );
};

// ── Station 1: the copy press ───────────────────────────────────────────
const COLUMN: Plan = { d: 8, r: 1.2, w: 14, x: PRESS_X - 7, y: -28 };
const COLUMN_TOP = 64;
const pressFrame = (
  <g key="press-frame">
    <Solid
      inner={<Line d={sideSeam(COLUMN, 18, P, 3)} tone="faint" />}
      paths={slabOf(COLUMN, PLINTH_H, COLUMN_TOP - PLINTH_H, P, 3, 0.6)}
      tone="mid"
    />
    <Solid
      paths={slabOf(insetPlan(COLUMN, -1.2), COLUMN_TOP, 3, P, 3, 0.5)}
      tone="mid"
    />
    <Solid
      paths={cylinder(
        PRESS_X,
        COLUMN.y + 4,
        3.6,
        COLUMN_TOP + 3,
        5,
        P,
        28,
        0.4
      )}
      tone="mid"
    />
    <Line
      d={ring(PRESS_X, COLUMN.y + 4, 1.4, COLUMN_TOP + 8, P, 16)}
      tone="lo"
    />
    {[COLUMN.x, COLUMN.x + COLUMN.w - 2].map((x) => (
      <Solid
        crease="none"
        key={`gib-${x}`}
        paths={slabOf({ d: 1, r: 0.2, w: 2, x, y: -20 }, 14, 46, P, 2)}
        tone="lo"
      />
    ))}
    <Dots
      points={[20, 30, 40, 50].flatMap((z) => [
        at([COLUMN.x + 1, -19, z]),
        at([COLUMN.x + COLUMN.w - 1, -19, z]),
      ])}
      size={0.35}
      tone="mid"
    />
  </g>
);

const ARM: Plan = { d: 23, r: 1, w: 10, x: PRESS_X - 5, y: -19 };
const HEAD: Plan = { d: 18, r: 1.2, w: 16, x: PRESS_X - 8, y: -9 };
/** The moving part of the press: arm, rod, head and pad, at rest (up). */
export const pressHead = (
  <g key="press-head">
    <Solid paths={slabOf(ARM, 50, 7, P, 3, 0.5)} tone="mid" />
    <Dots
      points={[at([PRESS_X, 1, 57]), at([PRESS_X, -15, 57])]}
      size={0.4}
      tone="mid"
    />
    <Solid
      crease="none"
      paths={cylinder(PRESS_X, -2, 2, 37, 13, P, 20)}
      tone="mid"
    />
    <Solid
      crease="none"
      paths={slabOf(insetPlan(HEAD, 1), 30, 1, P, 3)}
      tone="lo"
    />
    <Solid
      inner={<Line d={sideSeam(HEAD, 34, P, 3)} tone="faint" />}
      paths={slabOf(HEAD, 31, 6, P, 3, 0.6)}
      tone="hi"
    />
  </g>
);

// ── Station 2: the writer ───────────────────────────────────────────────
const WRITER_FRONT = WRITER.y + WRITER.d;
export const writerBody = (
  <g key="writer">
    <Solid
      inner={<Line d={sideSeam(WRITER, RAIL_TOP + 6, P, 4)} tone="faint" />}
      paths={slabOf(WRITER, RAIL_TOP, WRITER_TOP - RAIL_TOP, P, 4, 0.8)}
      tone="mid"
    />
    <Line
      d={yFace(WRITER_FRONT, WRITER.x + 5, WRITER.x + 27, 34, 42)}
      tone="faint"
    />
    <Line
      d={ySlot(WRITER_FRONT, WRITER.x + 5, WRITER.x + 20, 27, 1.6)}
      tone="lo"
    />
    <Dots points={screws(WRITER, 2.4, WRITER_TOP)} size={0.45} tone="mid" />
  </g>
);
export const writerBracketBack = (
  <Solid
    key="roll-back"
    paths={slabOf(
      { d: 4, r: 0.6, w: 10, x: ROLL.x - 5, y: -17 },
      WRITER_TOP,
      ROLL.z - WRITER_TOP + 1,
      P,
      3,
      0.4
    )}
    tone="mid"
  />
);
export const paperRoll = (
  <g key="roll">
    <Solid
      paths={drumOf([ROLL.x, -13, ROLL.z], Y, 26, ROLL.r, P, 36)}
      tone="hi"
    />
  </g>
);
export const rollFrontBracket = (
  <Fragment key="roll-front">
    <Solid
      paths={slabOf(
        { d: 4, r: 0.6, w: 10, x: ROLL.x - 5, y: 13 },
        WRITER_TOP,
        ROLL.z - WRITER_TOP + 1,
        P,
        3,
        0.4
      )}
      tone="mid"
    />
    <Solid
      crease="none"
      paths={drumOf([ROLL.x, 17, ROLL.z], Y, 1.2, 1.8, P, 18)}
      tone="mid"
    />
  </Fragment>
);
/** Three pips on the writer's face: one lights per card it has taken in. */
export const PIPS = [0, 1, 2].map((index) =>
  at([WRITER.x + 9 + index * 5, WRITER_FRONT, 38])
);

const lug = (y: number) => (
  <Solid
    paths={slabOf({ d: 2, r: 0.4, w: 6, x: EXIT_X, y }, BELT_Z, 10, P, 2, 0.3)}
    tone="mid"
  />
);

export const platen = (
  <g key="platen">
    {lug(-17)}
    <Solid
      crease="none"
      paths={drumOf([PLATEN.x, -15, PLATEN.z], Y, 30, PLATEN.r, P, 28)}
      tone="mid"
    />
  </g>
);
/** The near lug goes over the platen's end, with the axle's end on its face. */
export const platenFront = (
  <g key="platen-front">
    {lug(15)}
    <Dots points={[at([PLATEN.x, 17, PLATEN.z])]} size={0.5} tone="hi" />
  </g>
);

// ── Station 3: the out tray, the approval gate and its key ──────────────
const TRAY_Z = BELT_Z;
const TRAY_MAT: Plan = { d: 30, r: 0.6, w: SEND.w - 7, x: SEND.x + 2, y: -15 };
const POST_BACK = -21;
const POST_FRONT = 15;
const post = (y: number) => (
  <Fragment key={`post-${y}`}>
    <Solid
      inner={
        <Line
          d={sideSeam(
            { d: 6, r: 0.8, w: 5, x: GATE_X - 1.5, y },
            TRAY_Z + 8,
            P,
            3
          )}
          tone="faint"
        />
      }
      paths={slabOf(
        { d: 6, r: 0.8, w: 5, x: GATE_X - 1.5, y },
        TRAY_Z,
        POST_TOP - TRAY_Z,
        P,
        3,
        0.5
      )}
      tone="mid"
    />
  </Fragment>
);
const lip = (y: number, x0: number, x1: number) => (
  <Solid
    key={`lip-${y}-${x0}`}
    paths={slabOf({ d: 3, r: 0.4, w: x1 - x0, x: x0, y }, TRAY_Z, 3, P, 2, 0.3)}
    tone="mid"
  />
);

export const sendBase = (
  <g key="send-base">
    <Solid
      inner={<Line d={sideSeam(SEND, 8, P, 4)} tone="faint" />}
      paths={slabOf(SEND, 0, TRAY_Z, P, 4, 0.8)}
      tone="mid"
    />
    <Solid paths={slabOf(LEDGE, 0, PLINTH_H, P, 3, 0.6)} tone="mid" />
    <path className="am-mat" d={slabOf(TRAY_MAT, TRAY_Z, 0, P, 2).fill} />
    <Line d={planOutline(TRAY_MAT, TRAY_Z, P, 2)} tone="faint" />
    {lip(-18, SEND.x + 2, GATE_X - 1.5)}
    {lip(-18, GATE_X + 3.5, SEND.x + SEND.w - 2)}
    {post(POST_BACK)}
    <Solid
      paths={slabOf(
        { d: 30, r: 0.6, w: 3, x: SEND.x + SEND.w - 5, y: -15 },
        TRAY_Z,
        3,
        P,
        2,
        0.3
      )}
      tone="mid"
    />
  </g>
);

/** The gate plate, at rest (down). It lifts only when someone approves. */
export const gate = (
  <g key="gate">
    <Solid
      inner={
        <Line
          d={xFace(GATE_X + GATE_T, -11, 11, TRAY_Z + 9, TRAY_Z + 12)}
          tone="faint"
        />
      }
      paths={slabOf(
        { d: 30, r: 0.4, w: GATE_T, x: GATE_X, y: -15 },
        TRAY_Z,
        GATE_H,
        P,
        2,
        0.4
      )}
      tone="hi"
    />
    <Solid
      crease="none"
      paths={drumOf(
        [GATE_X + GATE_T, 0, TRAY_Z + GATE_H - 4],
        X,
        2.4,
        1.6,
        P,
        18
      )}
      tone="mid"
    />
  </g>
);

export const sendFront = (
  <g key="send-front">
    {lip(15, SEND.x + 2, GATE_X - 1.5)}
    {lip(15, GATE_X + 3.5, SEND.x + SEND.w - 2)}
    {post(POST_FRONT)}
    <Solid
      paths={slabOf(
        { d: 42, r: 1, w: 7, x: GATE_X - 2.5, y: -21 },
        POST_TOP,
        3,
        P,
        3,
        0.5
      )}
      tone="mid"
    />
    <Dots
      points={[
        at([GATE_X + 1, -18, POST_TOP + 3]),
        at([GATE_X + 1, 18, POST_TOP + 3]),
      ]}
      size={0.45}
      tone="mid"
    />
    <Solid
      paths={cylinder(KEY[0], KEY[1], 5, PLINTH_H, 3, P, 32, 0.4)}
      tone="mid"
    />
    <Line d={ring(KEY[0], KEY[1], 3.9, KEY[2] - 1, P, 28)} tone="faint" />
  </g>
);

/** The approval key cap, at rest (up). */
export const keyCap = (
  <g key="key">
    <Solid
      paths={cylinder(KEY[0], KEY[1], 3.6, KEY[2] - 1, 2.6, P, 28, 0.4)}
      tone="hi"
    />
    <Line d={ring(KEY[0], KEY[1], 1.6, KEY[2] + 1.6, P, 18)} tone="mid" />
  </g>
);

// ── Cards and the report, built at x = 0 and moved along the belt ───────
const CARD_Z = BELT_Z;
export const cards = [0, 1, 2].map((source) => (
  <g key={`card-${source}`}>
    <Solid paths={slabOf(CARD, CARD_Z, CARD_T, P, 2)} tone="hi" />
    <Dots
      points={Array.from({ length: source + 1 }, (_, dot) =>
        at([CARD.x + 2.6 + dot * 2.2, CARD.y + 3, CARD_Z + CARD_T])
      )}
      size={0.55}
      tone="hi"
    />
    {[7.5, 10.5, 13.5].map((y, row) => (
      <Line
        d={lineOnTop(
          [CARD.x + 2.5, CARD.y + y],
          [CARD.x + 9.5 - row * 1.5, CARD.y + y],
          CARD_Z + CARD_T,
          P
        )}
        free
        key={`row-${y}`}
        tone="lo"
      />
    ))}
  </g>
));

const REPORT_TOP = BELT_Z + REPORT_T;
const BARS = [5, 8, 6.5, 10];
export const report = (
  <g key="report">
    <Solid paths={slabOf(REPORT, BELT_Z, REPORT_T, P, 2)} tone="hi" />
    <Line
      d={lineOnTop(
        [REPORT.x + 3, REPORT.y + 3.5],
        [REPORT.x + 14, REPORT.y + 3.5],
        REPORT_TOP,
        P
      )}
      free
      tone="hi"
    />
    {[6.5, 9].map((y) => (
      <Line
        d={lineOnTop(
          [REPORT.x + 3, REPORT.y + y],
          [REPORT.x + 20, REPORT.y + y],
          REPORT_TOP,
          P
        )}
        free
        key={`rule-${y}`}
        tone="lo"
      />
    ))}
    {BARS.map((h, index) => {
      const x = REPORT.x + 4 + index * 4.4;
      const y = REPORT.y + REPORT.d - 3;
      return (
        <path
          className="iso-line"
          d={onTop(
            [
              [x, y],
              [x + 2.6, y],
              [x + 2.6, y - h],
              [x, y - h],
            ],
            REPORT_TOP,
            P,
            true
          )}
          data-tone="mid"
          key={`bar-${h}`}
        />
      );
    })}
    <Line
      d={lineOnTop(
        [REPORT.x + 3, REPORT.y + REPORT.d - 3],
        [REPORT.x + 23, REPORT.y + REPORT.d - 3],
        REPORT_TOP,
        P
      )}
      free
      tone="lo"
    />
  </g>
);

/** The report is hidden inside the writer until it passes the exit face. */
export const EXIT_CLIP = pathOf(
  [
    at([EXIT_X, -200, REPORT_TOP]),
    at([EXIT_X, 200, REPORT_TOP]),
    at([EXIT_X + 300, 200, REPORT_TOP]),
    at([EXIT_X + 300, -200, REPORT_TOP]),
  ],
  true
);

// ── The station layers ──────────────────────────────────────────────────
const [gx0, gx1] = span(GATHER);
const [cx0, cx1] = span(COPY);
const [wx0, wx1] = span(WRITE);

export const halos = [GATHER, COPY, WRITE, SEND].map((plan, index) => (
  <g key={`halo-${plan.x}`}>
    {stationHalo(
      index === 0 ? { ...plan, w: plan.w + 36, x: plan.x - 36 } : plan
    )}
  </g>
));

const plinth = (plan: Plan) => (
  <Solid
    inner={<Line d={sideSeam(plan, 3, P, 3)} tone="faint" />}
    paths={slabOf(plan, 0, PLINTH_H, P, 3, 0.6)}
    tone="mid"
  />
);

export const layerA = {
  copy: (
    <g key="copy-a">
      {plinth(COPY)}
      {beltBack(cx0, cx1)}
      {pressFrame}
    </g>
  ),
  drive: driveHousing,
  gather: (
    <g key="gather-a">
      {plinth(GATHER)}
      {beltBack(gx0, gx1)}
    </g>
  ),
  send: sendBase,
  write: (
    <g key="write-a">
      {plinth(WRITE)}
      {beltBack(wx0, wx1)}
    </g>
  ),
};

export const layerC = {
  copy: <g key="copy-c">{beltFront(cx0, cx1)}</g>,
  gather: <g key="gather-c">{beltFront(gx0, gx1)}</g>,
  write: <g key="write-c">{beltFront(wx0, wx1)}</g>,
};

export const hoppers = (
  <g key="hoppers">{HOPPERS.map((x, index) => hopper(x, index))}</g>
);

export const benchArt = bench;
