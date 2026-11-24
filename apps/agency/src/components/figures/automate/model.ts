// The story the machine tells, as pure functions of time: no DOM, no React.
// Belt travel `b` (world units) places every card and the report, so the
// readout, the stamp and the gate all come from the same number.

export const BEATS = ["task", "split", "ai", "auto"] as const;
export type Beat = (typeof BEATS)[number];

export const STEPS: Record<
  Beat,
  { caption: string; index: string; label: string }
> = {
  ai: {
    caption:
      "We add AI to the steps that are only copying and drafting. The hand crank comes off.",
    index: "03",
    label: "Add AI",
  },
  auto: {
    caption:
      "The report is drafted before Monday starts. Someone checks it and sends it.",
    index: "04",
    label: "Automated",
  },
  split: {
    caption:
      "We take the job apart into its steps: gather, copy, write up, send.",
    index: "02",
    label: "Break it down",
  },
  task: {
    caption:
      "Every Monday, someone copies numbers from three tools into a report and sends it round.",
    index: "01",
    label: "Task",
  },
};

export const FIGURE_LABEL = "Example, illustrative";
export const FIGURE_TITLE = "The Monday report";
export const SVG_LABEL =
  "An isometric drawing of a desk machine that makes a weekly report. Three hoppers feed cards onto a belt, a press copies them, a writer turns them into one report, and an out tray holds it behind a gate until a person approves it. It is first cranked by hand, then taken apart into its four steps, then an orange AI module is plugged into its drive and it runs on its own.";

// The tour: how long each beat holds while nobody is touching the figure.
export const TOUR: Record<Beat, number> = {
  ai: 2.4,
  auto: 5.8,
  split: 2.6,
  task: 5.8,
};

/** Where each card sits along x for a belt travel b (centre of the card). */
export const CARD_OFFSETS = [140, 166, 192] as const;
/** Belt travel at which each card leaves its hopper. */
export const CARD_SPAWN = [0, 52, 104] as const;
/** A card is inside the writer, out of sight, past this x. */
export const CARD_GONE = 0;
/** Belt travel when the draft starts to come out of the writer, and when it reaches the gate. */
export const REPORT_FROM = 205;
export const B_END = 248;
export const REPORT_START_X = 7;
export const REPORT_TRAY_X = 50;
export const REPORT_SENT_X = 96;
/** Where the press stands, and the belt travel that brings each card under it. */
export const PRESS_X = -48;
/** Belt travel where the tour's hand crank stops: no card straddles two stations. */
export const B_HAND = 130;

export const cardX = (b: number, index: number) =>
  b - (CARD_OFFSETS[index] ?? 0);

/** 0 to 1: how far the press head is down. A cam: down while a card is under it. */
export function stampOf(b: number) {
  let most = 0;
  for (let index = 0; index < CARD_OFFSETS.length; index += 1) {
    const off = Math.abs(cardX(b, index) - PRESS_X);
    const reach = 1 - smooth(1.5, 7, off);
    most = Math.max(most, reach);
  }
  return most;
}

export const clamp = (value: number, low = 0, high = 1) =>
  Math.min(high, Math.max(low, value));

export function smooth(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

const easeInOut = (t: number) => {
  const u = clamp(t);
  return u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2;
};

// By hand: the crank turns n times and the hand slows on every upstroke.
// g(u) = u - 0.7 sin(2πnu) / (2πn) rises the whole way, with one slow patch per turn.
const unevenly = (u: number, turns: number) =>
  u - (0.7 * Math.sin(2 * Math.PI * turns * u)) / (2 * Math.PI * turns);

/** Crank turns per unit of belt travel. */
export const TURNS_PER_B = 1 / 32;

export interface HandRun {
  b0: number;
  b1: number;
  seconds: number;
}

/** Belt travel after t seconds of cranking from b0 to b1. */
export function handB({ b0, b1, seconds }: HandRun, t: number) {
  const turns = Math.max(1, Math.round((b1 - b0) * TURNS_PER_B));
  const u = easeInOut(t / seconds);
  return b0 + (b1 - b0) * unevenly(u, turns);
}

// On its own: the belt indexes one card pitch at a time and dwells, so the
// press stamps a card that is standing still.
export const PITCH = 26;
const GRID = 14;
const MOVE = 0.24;
const DWELL = 0.16;

/** The next dwell position at or after b. */
const nextStop = (b: number) =>
  GRID + Math.ceil((b - GRID - 1e-6) / PITCH) * PITCH;

/** Belt travel after t seconds of running on its own from b0. */
export function autoB(b0: number, t: number) {
  let b = b0;
  let left = t;
  while (b < B_END) {
    const stop = Math.min(B_END, nextStop(b + 1e-3));
    const move = (MOVE * (stop - b)) / PITCH + 0.04;
    if (left < move) {
      return b + (stop - b) * easeInOut(left / move);
    }
    left -= move;
    b = stop;
    if (left < DWELL) {
      return b;
    }
    left -= DWELL;
  }
  return B_END;
}

/** Seconds the belt needs to run on its own from b0 to the gate. */
export function autoSeconds(b0: number) {
  let b = b0;
  let total = 0;
  while (b < B_END) {
    const stop = Math.min(B_END, nextStop(b + 1e-3));
    total += (MOVE * (stop - b)) / PITCH + 0.04 + DWELL;
    b = stop;
  }
  return total;
}

// The approval at the gate, as a function of its age in seconds.
export const APPROVE_SECONDS = 2;
export function approvalAt(age: number) {
  const a = Math.max(0, age);
  return {
    fade: smooth(1.35, 1.85, a),
    gate: smooth(0.2, 0.6, a) * (1 - smooth(1.15, 1.55, a)),
    key: smooth(0, 0.12, a) * (1 - smooth(0.3, 0.45, a)),
    slide: easeInOut((a - 0.5) / 0.6),
  };
}

/** The report's x for a belt travel b and an approval slide 0 to 1. */
export function reportX(b: number, slide: number) {
  const out = REPORT_START_X + Math.max(0, b - REPORT_FROM);
  return out + (REPORT_SENT_X - REPORT_TRAY_X) * slide;
}

export const cardsCopied = (b: number) =>
  CARD_OFFSETS.filter((_, index) => cardX(b, index) > PRESS_X + 2).length;

export const cardsIn = (b: number) =>
  CARD_OFFSETS.filter((_, index) => cardX(b, index) >= CARD_GONE).length;

export type Phase = "run" | "wait" | "approve" | "done";

export interface Reading {
  b: number;
  beat: Beat;
  phase: Phase;
}

/** The live readout, from the same numbers that place the parts. */
export function readoutOf({ b, beat, phase }: Reading) {
  if (beat === "split") {
    return "4 steps: gather, copy, write up, send";
  }
  if (beat === "ai") {
    return "AI module in · crank off";
  }
  if (phase === "approve" || phase === "done") {
    return "Checked · sent";
  }
  if (phase === "wait" || b >= B_END) {
    return beat === "auto"
      ? "Draft ready · waiting for approval"
      : "Draft in the tray";
  }
  const who = beat === "auto" ? "On its own" : "By hand";
  if (b > REPORT_FROM - 6) {
    return `${who} · writing the draft`;
  }
  return `${who} · ${cardsCopied(b)} of 3 copied`;
}
