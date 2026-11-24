// The machine's state and how it looks: one record of attributes per moving
// node, computed from the state. The server renders it for the still pose and
// the live loop writes only what changed.
import type { SolidPaths } from "../../iso/iso-kit.ts";
import {
  beltMarks,
  crankArm,
  handleOffset,
  type Mark,
  platenMarks,
  rollMarks,
} from "./frame.ts";
import {
  approvalAt,
  B_END,
  B_HAND,
  type Beat,
  CARD_GONE,
  CARD_SPAWN,
  cardsIn,
  cardX,
  clamp,
  type Phase,
  REPORT_FROM,
  reportX,
  stampOf,
} from "./model.ts";
import {
  AI_DROP,
  CLUTCH_OUT,
  COPY,
  GATE_LIFT,
  GATHER,
  PLATEN,
  ROLL,
  SPREAD,
  STROKE,
  shift,
  WRITE,
} from "./view.ts";

export interface Spring {
  at: number;
  rate: number;
}

export interface Run {
  b0: number;
  b1: number;
  mode: "hand" | "auto";
  seconds: number;
  t: number;
}

export interface Look {
  ai: Spring;
  b: number;
  beat: Beat;
  beatAge: number;
  clutch: number;
  crank: number;
  phase: Phase;
  phaseAge: number;
  run: Run | null;
  spread: Spring[];
  /** Where each station's spring is headed: 0 home, 1 apart. */
  spreadGoal: number[];
}

const still = (at: number): Spring => ({ at, rate: 0 });

/** The pose each beat shows as a still (reduced motion, and the server's first paint). */
export function stillOf(beat: Beat): Look {
  const assembled = beat !== "split";
  const plugged = beat === "ai" || beat === "auto";
  return {
    ai: still(plugged ? 1 : 0),
    b: beat === "auto" ? B_END : B_HAND,
    beat,
    beatAge: 0,
    clutch: plugged ? 1 : 0,
    crank: 0.9,
    phase: beat === "auto" ? "wait" : "run",
    phaseAge: 0,
    run: null,
    spread: [0, 1, 2, 3].map(() => still(assembled ? 0 : 1)),
    spreadGoal: [0, 1, 2, 3].map(() => (assembled ? 0 : 1)),
  };
}

export type Attrs = Partial<
  Record<"d" | "transform" | "opacity" | "display" | "data-on", string>
>;

export type Pose = Record<string, Attrs>;

const ARM_PARTS = [
  "fill",
  "shade0",
  "shade1",
  "shade2",
  "shade3",
  "top",
  "crease",
  "outline",
] as const;
const armPath = (paths: SolidPaths, part: (typeof ARM_PARTS)[number]) => {
  if (part.startsWith("shade")) {
    return paths.shades[Number(part.slice(5))] ?? "";
  }
  return paths[part as "fill" | "top" | "crease" | "outline"] ?? "";
};
const marksInto = (attrs: Pose, name: string, marks: Mark[]) => {
  marks.forEach((mark, index) => {
    attrs[`${name}${index}`] = { d: mark.d, opacity: fixed(mark.alpha) };
  });
};

const fixed = (value: number) => (Math.round(value * 1000) / 1000).toString();

const stationOfX = (x: number) => {
  if (x < COPY.x) {
    return 0;
  }
  if (x < WRITE.x) {
    return 1;
  }
  return 2;
};

export function poseOf(s: Look): Pose {
  const attrs: Pose = {};
  const offset = (index: number): [number, number, number] => {
    const share = s.spread[index]?.at ?? 0;
    const [x, y, z] = SPREAD[index] ?? [0, 0, 0];
    return [x * share, y * share, z * share];
  };
  const moved = (index: number, dx = 0, dy = 0, dz = 0) => {
    const [x, y, z] = offset(index);
    return shift(x + dx, y + dy, z + dz);
  };
  for (let index = 0; index < 4; index += 1) {
    attrs[`st${index}`] = { transform: moved(index) };
    const [x] = offset(index);
    attrs[`halo${index}`] = {
      opacity: fixed(clamp(s.spread[index]?.at ?? 0)),
      transform: shift(x),
    };
  }

  // Station 0: the AI module drops into the socket; the crank slides off its shaft.
  const ai = clamp(s.ai.at);
  attrs.ai = {
    display: ai > 0.002 ? "" : "none",
    opacity: fixed(clamp(ai * 3)),
    transform: shift(0, 0, AI_DROP * (1 - ai)),
  };
  attrs.crank = { transform: shift(0, CLUTCH_OUT * s.clutch, 0) };
  const [hx, , hz] = handleOffset(s.crank);
  attrs.handle = { transform: shift(hx, 0, hz) };

  // Belt marks on the three runs.
  const runs: [number, number][] = [
    [GATHER.x, GATHER.x + GATHER.w],
    [COPY.x, COPY.x + COPY.w],
    [WRITE.x, WRITE.x + WRITE.w],
  ];
  runs.forEach(([x0, x1], index) => {
    attrs[`belt${index}`] = { d: beltMarks(x0, x1, s.b) };
  });

  // Cards ride the belt, on whichever station they are over.
  for (let index = 0; index < 3; index += 1) {
    const x = cardX(s.b, index);
    const shown = s.b >= (CARD_SPAWN[index] ?? 0) && x < CARD_GONE;
    const station = stationOfX(x);
    attrs[`card${index}`] = shown
      ? { display: "", transform: moved(station, x) }
      : { display: "none" };
  }

  // The press is a cam: its head is down while a card is under it.
  attrs.press = { transform: shift(0, 0, -STROKE * stampOf(s.b)) };

  // The writer: a pip per card taken in, and the paper turning while it drafts.
  const taken = cardsIn(s.b);
  for (let index = 0; index < 3; index += 1) {
    attrs[`pip${index}`] = { "data-on": index < taken ? "true" : "false" };
  }

  // The report and the approval.
  const approval =
    s.phase === "approve"
      ? approvalAt(s.phaseAge)
      : {
          fade: s.phase === "done" ? 1 : 0,
          gate: 0,
          key: 0,
          slide: s.phase === "done" ? 1 : 0,
        };
  const rx = reportX(s.b, approval.slide);
  const shown = s.b >= REPORT_FROM && approval.fade < 0.999;
  const inside = rx < 35;
  // Clipped at the writer's exit face, in the frame of the station it rides.
  attrs.reportStation = { transform: moved(inside ? 2 : 3) };
  attrs.report = shown
    ? {
        display: "",
        opacity: fixed(1 - approval.fade),
        transform: shift(rx + 4 * approval.fade),
      }
    : { display: "none" };
  attrs.gate = { transform: shift(0, 0, GATE_LIFT * approval.gate) };
  attrs.key = { transform: shift(0, 0, -1.5 * approval.key) };

  const drafted = Math.max(0, s.b - (REPORT_FROM - 14));
  marksInto(attrs, "platen", platenMarks(-drafted / PLATEN.r));
  marksInto(attrs, "roll", rollMarks(-drafted / ROLL.r));
  const arm = crankArm(s.crank);
  for (const part of ARM_PARTS) {
    attrs[`arm-${part}`] = { d: armPath(arm, part) };
  }
  return attrs;
}
