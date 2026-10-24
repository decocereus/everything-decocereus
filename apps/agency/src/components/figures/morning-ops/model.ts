// The Morning Ops Report machine, as numbers. Everything the figure shows (where the
// shuttle is, how many cards and slips there are, the clock, the readout and the
// caption) comes from these functions of one night clock `t`, in seconds of tour time.
// The counts are an illustrative example, not a client result.

export const REPORT = {
  calls: 24,
  end: 6,
  invoices: 7,
  start: 22,
} as const;

/** Seconds of tour time from 22:00 to 06:00. */
export const NIGHT = 14;
const HOURS = 24 - REPORT.start + REPORT.end;

export const CALLS_FROM = 0.8;
export const CALLS_TO = 4.6;
export const BOOKS_AT = 5.9;
export const SLIPS_FROM = 9.7;
export const SLIP_EVERY = 0.42;
export const SLIP_OUT = 0.28;
export const SLIP_DROP = 0.08;
export const DOCK_AT = 13.5;

const LEGS: {
  from: number;
  to: number;
  a: keyof typeof STOPS;
  b: keyof typeof STOPS;
}[] = [
  { a: "calls", b: "books", from: 4.6, to: 5.6 },
  { a: "books", b: "invoices", from: 8.4, to: 9.3 },
  { a: "invoices", b: "dock", from: 12.75, to: DOCK_AT },
];

export const STOPS = {
  books: -44,
  calls: -131,
  dock: 81.5,
  invoices: 22,
} as const;

/** The beam rests 6° off level on its arrest until the books are checked. */
export const ARRESTED = -6;
/** Beam spring: stiffness and damping per second squared, about ζ 0.3. */
export const LEVEL_WITHIN = 0.25;

export const clamp = (value: number, low = 0, high = 1) =>
  Math.min(high, Math.max(low, value));
const smooth = (value: number) => {
  const u = clamp(value);
  return u * u * (3 - 2 * u);
};
const glide = (value: number) => {
  const u = clamp(value);
  return u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2;
};

export function shuttleAt(t: number) {
  let x: number = STOPS.calls;
  for (const leg of LEGS) {
    if (t >= leg.from) {
      x =
        STOPS[leg.a] +
        (STOPS[leg.b] - STOPS[leg.a]) *
          glide((t - leg.from) / (leg.to - leg.from));
    }
  }
  return x;
}

/** Share of the call tape played, 0 to 1. */
export const callsShare = (t: number) =>
  clamp((t - CALLS_FROM) / (CALLS_TO - CALLS_FROM));
export const callsNoted = (t: number) =>
  Math.floor(callsShare(t) * REPORT.calls + 1e-6);
export const arrested = (t: number) => t < BOOKS_AT;

export interface SlipPose {
  landed: boolean;
  shown: boolean;
  y: number;
  z: number;
}

/** Where slip `index` is at time t: out of the platen along +y, then down onto the stack. */
export function slipAt(
  t: number,
  index: number,
  floor: number,
  thick: number,
  from: number,
  to: number,
  lip: number
): SlipPose {
  const age = t - (SLIPS_FROM + index * SLIP_EVERY);
  if (age <= 0) {
    return { landed: false, shown: false, y: from, z: lip };
  }
  if (age >= SLIP_OUT + SLIP_DROP) {
    return { landed: true, shown: false, y: to, z: floor + index * thick };
  }
  const out = 1 - (1 - clamp(age / SLIP_OUT)) ** 2;
  const drop = clamp((age - SLIP_OUT) / SLIP_DROP) ** 2;
  return {
    landed: false,
    shown: true,
    y: from + (to - from) * out,
    z: lip + (floor + index * thick - lip) * drop,
  };
}

export const slipsPrinted = (t: number) => {
  let count = 0;
  for (let index = 0; index < REPORT.invoices; index += 1) {
    if (t - (SLIPS_FROM + index * SLIP_EVERY) >= SLIP_OUT + SLIP_DROP) {
      count += 1;
    }
  }
  return count;
};

export const docked = (t: number) => t >= DOCK_AT;

export const SLIPS_TO =
  SLIPS_FROM + (REPORT.invoices - 1) * SLIP_EVERY + SLIP_OUT + SLIP_DROP;

/** Which station the shuttle is pressing the start button of, if any. */
export function workingAt(t: number): keyof typeof STOPS | null {
  if (t >= CALLS_FROM - 0.4 && t < CALLS_TO) {
    return "calls";
  }
  if (t >= BOOKS_AT - 0.4 && t < BOOKS_AT + 1.2) {
    return "books";
  }
  if (t >= SLIPS_FROM - 0.4 && t < SLIPS_TO) {
    return "invoices";
  }
  return null;
}

/** The hour hand, unwrapped: 300° at 22:00 to 540° at 06:00. */
export const handTurn = (t: number) => (hoursAt(t) - 12) * 30;

export const hoursAt = (t: number) =>
  REPORT.start + (HOURS * clamp(t, 0, NIGHT)) / NIGHT;

export function clockText(t: number) {
  const minutes = Math.round((hoursAt(t) * 60) / 5) * 5;
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// The owner's approval: the lever goes down, the gate rides up with it, and only
// then do the rollers carry the waiting slips out. Times are seconds after the press.
export const LEVER_DOWN_FOR = 0.35;
export const PUSH_FROM = 0.5;
export const PUSH_TO = 1.4;
export const LEVER_UP_FROM = 1.7;
export const APPROVAL_FOR = 2.2;

export function leverAt(age: number | null) {
  if (age === null || age < 0 || age >= APPROVAL_FOR) {
    return 0;
  }
  if (age < LEVER_DOWN_FOR) {
    return smooth(age / LEVER_DOWN_FOR);
  }
  if (age < LEVER_UP_FROM) {
    return 1;
  }
  return 1 - smooth((age - LEVER_UP_FROM) / (APPROVAL_FOR - LEVER_UP_FROM));
}

export function pushAt(age: number | null) {
  if (age === null) {
    return 1;
  }
  return glide((age - PUSH_FROM) / (PUSH_TO - PUSH_FROM));
}

export interface Night {
  approvalAge: number | null;
  carried: number;
  level: boolean;
  rewinding: boolean;
  sent: number;
  t: number;
  waiting: number;
}

export function readoutOf(night: Night) {
  const { t, level, waiting, sent, approvalAge, carried, rewinding } = night;
  const time = clockText(t);
  if (approvalAge !== null && approvalAge < APPROVAL_FOR + 1.6) {
    if (!carried) {
      return "gate open · nothing waiting yet";
    }
    if (approvalAge < PUSH_FROM) {
      return "lever down · gate open";
    }
    return `approved · ${carried} sent`;
  }
  if (rewinding) {
    return "next night · 22:00";
  }
  if (t < CALLS_FROM) {
    return `${time} · night starts`;
  }
  if (t < CALLS_TO) {
    return `${time} · ${callsNoted(t)} of ${REPORT.calls} calls noted`;
  }
  if (t < BOOKS_AT) {
    return `${time} · ${REPORT.calls} calls noted`;
  }
  if (t < SLIPS_FROM - 0.4) {
    return `${time} · ${level ? "books match" : "checking the books"}`;
  }
  if (t < DOCK_AT) {
    return `${time} · ${slipsPrinted(t)} of ${REPORT.invoices} invoices drafted`;
  }
  if (waiting) {
    return t >= NIGHT
      ? `${time} · ${waiting} waiting for approval`
      : `${time} · ${waiting} in the tray, gate shut`;
  }
  if (sent) {
    return `${time} · ${sent} sent, none waiting`;
  }
  return `${time} · tray empty`;
}

export function spokenOf(night: Night) {
  const { t, waiting, sent } = night;
  const parts = [`${clockText(t)}.`];
  if (t >= CALLS_FROM) {
    parts.push(`${callsNoted(t)} of ${REPORT.calls} calls noted.`);
  }
  if (t >= BOOKS_AT) {
    parts.push(night.level ? "Books match." : "Checking the books.");
  }
  if (t >= SLIPS_FROM) {
    parts.push(`${slipsPrinted(t)} of ${REPORT.invoices} invoices drafted.`);
  }
  if (waiting) {
    parts.push(`${waiting} waiting behind the gate.`);
  } else if (sent) {
    parts.push(`${sent} sent after approval.`);
  } else {
    parts.push("Nothing waiting.");
  }
  return parts.join(" ");
}

export const MORNING: Night = {
  approvalAge: null,
  carried: 0,
  level: true,
  rewinding: false,
  sent: 0,
  t: NIGHT,
  waiting: REPORT.invoices,
};

export const CAPTION = `An illustrative example, not a client result. Overnight, the agents logged ${REPORT.calls} calls, checked the books against your job system, and drafted ${REPORT.invoices} invoices. At 6am the invoices are waiting for your OK. Nothing goes to a customer until you press the lever.`;
