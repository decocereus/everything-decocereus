"use client";

import {
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { pathOf, type SolidPaths } from "../../iso/iso-kit.ts";
import { IsoFigure } from "../../iso/react/draw.tsx";
import { asksForStillness, useReadout } from "../../iso/react/live.tsx";
import {
  beamOf,
  cardsOf,
  handOf,
  leverOf,
  needleOf,
  packMarks,
  packsOf,
  panRise,
  platenMarks,
  rollMarks,
  spokesOf,
  TAPE_LENGTH,
} from "./frame.ts";
import {
  APPROVAL_FOR,
  ARRESTED,
  arrested,
  BOOKS_AT,
  CALLS_TO,
  callsNoted,
  callsShare,
  clamp,
  DOCK_AT,
  docked,
  handTurn,
  LEVEL_WITHIN,
  leverAt,
  MORNING,
  NIGHT,
  type Night,
  PUSH_FROM,
  pushAt,
  REPORT,
  readoutOf,
  SLIPS_FROM,
  SLIPS_TO,
  STOPS,
  shuttleAt,
  slipAt,
  slipsPrinted,
  spokenOf,
  workingAt,
} from "./model.ts";
import {
  ARREST_ARM,
  ARREST_DROP,
  at,
  GATE_LIFT,
  HEIGHT,
  LIP_Z,
  PUSH,
  ROLL,
  SLIP_FLOOR,
  SLIP_T,
  SLOT_Y,
  shift,
  WIDTH,
} from "./view.ts";

const MOST_DT = 1 / 30;
const TOUR_FIRST = 1.4;
const TOUR_BACK = 3600;
const HOLD = 2.6;
const APPROVE_AT = NIGHT + HOLD;
const RESET_AT = APPROVE_AT + 3.6;
const LOOP = RESET_AT + 2.2;
const STEP = NIGHT / 8;
const BEAM_K = 18;
const BEAM_C = 2.6;
const SHUTTLE_TOP = 175;
const SHUTTLE_ACCEL = 420;
const RADIANS = Math.PI / 180;

interface Look {
  approvalAge: number | null;
  beam: number;
  beamRate: number;
  cards: number;
  carried: number;
  drop: number;
  hand: number;
  handed: boolean;
  platen: number;
  play: number;
  press: Record<"calls" | "books" | "invoices", number>;
  reels: [number, number];
  released: number;
  roll: number;
  sent: number;
  sentShow: number;
  share: number;
  shuttle: number;
  speed: number;
  strike: number;
  t: number;
}

const restLook = (): Look => ({
  approvalAge: null,
  beam: 0,
  beamRate: 0,
  cards: REPORT.calls,
  carried: 0,
  drop: 1,
  hand: handTurn(NIGHT),
  handed: false,
  platen: 0,
  play: 0,
  press: { books: 0, calls: 0, invoices: 0 },
  reels: [0, 0],
  released: 0,
  roll: 0,
  sent: 0,
  sentShow: 0,
  share: 1,
  shuttle: STOPS.dock,
  speed: 0,
  strike: 0,
  t: NIGHT,
});

const follow = (
  value: number,
  target: number,
  dt: number,
  seconds: number,
  calm: boolean,
  near = 1e-3
) => {
  if (calm) {
    return target;
  }
  const next = value + (target - value) * (1 - Math.exp(-dt / seconds));
  return Math.abs(target - next) < near ? target : next;
};

const SLIP_FROM_Y = 3;
const SLIP_TO_Y = 38;

/** The slip in flight from the platen, if any. */
function fallingAt(t: number) {
  for (let index = 0; index < REPORT.invoices; index += 1) {
    const pose = slipAt(
      t,
      index,
      SLIP_FLOOR,
      SLIP_T,
      SLIP_FROM_Y,
      SLIP_TO_Y,
      LIP_Z
    );
    if (pose.shown) {
      return pose;
    }
  }
  return null;
}

/** The screen half-plane in front of the platen's exit, where a slip can be seen. */
const SLOT_CLIP = (() => {
  const z = LIP_Z + SLIP_T / 2;
  const a = at([-400, SLOT_Y, z]);
  const b = at([400, SLOT_Y, z]);
  const c = at([400, SLOT_Y + 400, z]);
  const d = at([-400, SLOT_Y + 400, z]);
  return pathOf([a, b, c, d], true);
})();

/** Rows ticked on the morning report: calls, books, invoices, then the owner's approval. */
const reportDone = (t: number, released: number) =>
  Number(t >= CALLS_TO) +
  Number(t >= BOOKS_AT + 1.6) +
  Number(t >= SLIPS_TO) +
  Number(released > 0);

function nightOf(look: Look, rewinding: boolean): Night {
  const printed = slipsPrinted(look.t);
  return {
    approvalAge: look.approvalAge,
    carried: look.carried,
    level:
      !arrested(look.t) &&
      Math.abs(look.beam) < LEVEL_WITHIN &&
      Math.abs(look.beamRate) < 0.6,
    rewinding,
    sent: look.released,
    t: look.t,
    waiting: docked(look.t) ? Math.max(0, printed - look.released) : 0,
  };
}

/** Shuttle: a speed-limited glide to where the night says it is. */
function moveShuttle(s: Look, want: number, dt: number, calm: boolean) {
  if (calm) {
    s.shuttle = want;
    s.speed = 0;
    return;
  }
  const desired = clamp((want - s.shuttle) / 0.09, -SHUTTLE_TOP, SHUTTLE_TOP);
  s.speed += clamp(desired - s.speed, -SHUTTLE_ACCEL * dt, SHUTTLE_ACCEL * dt);
  s.shuttle += s.speed * dt;
  if (Math.abs(want - s.shuttle) < 0.02 && Math.abs(s.speed) < 1) {
    s.shuttle = want;
    s.speed = 0;
  }
}

/** Tape: the packs follow the share played, a rewind runs at a capped speed, and a card drops per call. */
function moveTape(s: Look, shareWant: number, dt: number, calm: boolean) {
  const oldShare = s.share;
  if (calm) {
    s.share = shareWant;
  } else {
    const moved = follow(s.share, shareWant, dt, 0.08, false, 1e-4) - s.share;
    s.share += clamp(moved, -1.1 * dt, 1.1 * dt);
  }
  const [supply, takeup] = packsOf(s.share).radii;
  const run = (s.share - oldShare) * TAPE_LENGTH;
  s.reels = [s.reels[0] - run / supply, s.reels[1] + run / takeup];
  const noted = callsNoted(s.t);
  s.cards = follow(
    s.cards,
    noted,
    dt,
    s.cards > noted ? 0.22 : 0.05,
    calm,
    0.01
  );
}

/** Beam: always pulled to level by its spring, held off level by the arrest post. */
function moveBeam(s: Look, dt: number, calm: boolean) {
  s.drop = follow(s.drop, arrested(s.t) ? 0 : 1, dt, 0.16, calm, 1e-3);
  const reach =
    (ARREST_DROP * s.drop) / ARREST_ARM - Math.sin(-ARRESTED * RADIANS);
  const most = Math.asin(clamp(reach, -1, 1)) / RADIANS;
  if (calm) {
    s.beam = Math.min(0, most);
    s.beamRate = 0;
    return;
  }
  const steps = Math.max(1, Math.ceil(dt * 240));
  const slice = dt / steps;
  for (let index = 0; index < steps; index += 1) {
    s.beamRate += (-BEAM_K * s.beam - BEAM_C * s.beamRate) * slice;
    s.beam += s.beamRate * slice;
    if (s.beam > most) {
      s.beam = most;
      s.beamRate = Math.min(0, s.beamRate);
    }
  }
  if (Math.abs(s.beam) < 0.01 && Math.abs(s.beamRate) < 0.01 && most >= 0) {
    s.beam = 0;
    s.beamRate = 0;
  }
}

/** Each station's start button is pressed by the shuttle's striker while it works. */
function moveStriker(s: Look, dt: number, calm: boolean, rewinding: boolean) {
  const working = workingAt(s.t);
  const parked =
    working !== null &&
    Math.abs(s.shuttle - STOPS[working]) < 0.6 &&
    !rewinding;
  s.strike = follow(s.strike, parked ? 1 : 0, dt, 0.08, calm);
  for (const key of ["calls", "books", "invoices"] as const) {
    s.press[key] =
      parked && working === key ? clamp((s.strike - 0.6) / 0.4) : 0;
  }
  const playing = s.t >= 0.5 && s.t < CALLS_TO && !rewinding;
  s.play = follow(s.play, playing ? 1 : 0, dt, 0.08, calm);
}

/** The platen and paper roll turn only while slips are printing. */
function movePrinter(s: Look, before: number) {
  const printing = (time: number) =>
    time >= SLIPS_FROM - 0.1 && time <= SLIPS_TO;
  if (printing(s.t) || printing(before)) {
    const moved = s.t - before;
    s.platen += moved * 9;
    s.roll -= moved * 2.6;
  }
}

/** The owner's approval: the slips leave once the gate is up; the sent stack fades when the night restarts. */
function moveApproval(s: Look, dt: number, calm: boolean) {
  if (s.approvalAge !== null) {
    s.approvalAge = calm ? APPROVAL_FOR : s.approvalAge + dt;
    if (!s.handed && s.carried && s.approvalAge >= PUSH_FROM) {
      s.handed = true;
      s.released += s.carried;
      s.sent = s.carried;
      s.sentShow = 1;
    }
    if (s.approvalAge >= APPROVAL_FOR + 1.6) {
      s.approvalAge = null;
    }
  }
  const leaving = s.approvalAge !== null && s.handed;
  if (s.released === 0 && s.sentShow > 0 && !leaving) {
    s.sentShow = follow(s.sentShow, 0, dt, 0.25, calm, 0.01);
  }
}

const settled = (value: number) => value === 0 || value === 1;

function isResting(s: Look, target: number, want: number, shareWant: number) {
  return (
    s.t === target &&
    s.shuttle === want &&
    s.speed === 0 &&
    s.share === shareWant &&
    s.beamRate === 0 &&
    s.approvalAge === null &&
    settled(s.sentShow) &&
    settled(s.drop) &&
    settled(s.strike) &&
    Math.abs(s.cards - callsNoted(s.t)) < 0.02
  );
}

/** Where the arrow keys, Home and End take the night, or null for other keys. */
function keyTarget(key: string, now: number, by: number) {
  if (key === "ArrowRight" || key === "ArrowUp") {
    return Math.round((now + by) / STEP) * STEP;
  }
  if (key === "ArrowLeft" || key === "ArrowDown") {
    return Math.round((now - by) / STEP) * STEP;
  }
  if (key === "Home") {
    return 0;
  }
  if (key === "End") {
    return NIGHT;
  }
  return null;
}

/** The loop's own state: where the night is headed, the tour clock and the frame handles. */
interface Loop {
  approved: boolean;
  clock: number;
  frame: number;
  idle: number;
  last: number;
  rewinding: boolean;
  root: HTMLDivElement | null;
  script: boolean;
  target: number;
}

const loopOf = (): Loop => ({
  approved: false,
  clock: NIGHT + 0.6,
  frame: 0,
  idle: 0,
  last: 0,
  rewinding: false,
  root: null,
  script: false,
  target: NIGHT,
});

type Slot = "supply" | "takeup" | "cards" | "beam" | "arm" | "knob" | "cap";

function writeSolid(group: SVGGElement | null, paths: SolidPaths | null) {
  if (!group) {
    return;
  }
  if (!paths) {
    group.style.display = "none";
    return;
  }
  group.style.display = "";
  for (const node of Array.from(group.children) as SVGPathElement[]) {
    const { part } = node.dataset;
    if (part === "fill") {
      node.setAttribute("d", paths.fill);
    } else if (part === "top") {
      node.setAttribute("d", paths.top);
    } else if (part === "crease") {
      node.setAttribute("d", paths.crease);
    } else if (part === "edge") {
      node.setAttribute("d", paths.outline);
    } else if (part?.startsWith("shade")) {
      node.setAttribute("d", paths.shades[Number(part.slice(5))] ?? "");
    }
  }
}

function LiveSolid({
  nodeRef,
  paths,
  tone = "hi",
  lit = false,
  crease = "faint",
}: {
  nodeRef: (node: SVGGElement | null) => void;
  paths: SolidPaths | null;
  tone?: string;
  lit?: boolean;
  crease?: string;
}) {
  return (
    <g
      className="iso-solid"
      data-lit={lit ? "" : undefined}
      data-seamless={paths?.seamless ? "" : undefined}
      ref={nodeRef}
      style={paths ? undefined : { display: "none" }}
    >
      <path className="iso-fill" d={paths?.fill ?? ""} data-part="fill" />
      {[0, 1, 2, 3].map((shade) => (
        <path
          className="iso-shade"
          d={paths?.shades[shade] ?? ""}
          data-part={`shade${shade}`}
          data-shade={shade}
          key={`shade-${shade.toString()}`}
        />
      ))}
      <path className="iso-top" d={paths?.top ?? ""} data-part="top" />
      <path
        className="iso-line iso-crease"
        d={crease === "none" ? "" : (paths?.crease ?? "")}
        data-part={crease === "none" ? undefined : "crease"}
        data-tone={crease}
      />
      <path
        className="iso-line iso-edge"
        d={paths?.outline ?? ""}
        data-part="edge"
        data-tone={tone}
      />
    </g>
  );
}

interface Props {
  arrest: ReactNode;
  balBack: ReactNode;
  balCap: ReactNode;
  balMid: ReactNode;
  base: ReactNode;
  carriage: ReactNode;
  clock: ReactNode;
  clockHub: ReactNode;
  deckBack: ReactNode;
  deckCap: ReactNode;
  deckFront: ReactNode;
  deckHubs: ReactNode;
  deckKeys: ReactNode;
  falling: ReactNode;
  gate: ReactNode;
  gateBack: ReactNode;
  gateFront: ReactNode;
  gateLow: ReactNode;
  label: string;
  panLeft: ReactNode;
  panRight: ReactNode;
  pin: ReactNode;
  playKey: ReactNode;
  printerBack: ReactNode;
  printerCap: ReactNode;
  printerFront: ReactNode;
  printerRollEnd: ReactNode;
  quadrant: ReactNode;
  rail: ReactNode;
  report: ReactNode;
  reportTicks: ReactNode;
  scale: ReactNode;
  sentStacks: ReactNode;
  striker: ReactNode;
  toteBack: ReactNode;
  toteFront: ReactNode;
  toteStacks: ReactNode;
  trayBack: ReactNode;
  trayFront: ReactNode;
}

const REST = restLook();
const REST_PACKS = packsOf(REST.share);
const REST_LEVER = leverOf(0);
const REST_TEXT = spokenOf(MORNING);

type Node = SVGGElement | SVGPathElement | null;

export function MorningOpsLive(props: Props) {
  const { anchor, say } = useReadout<HTMLDivElement>();
  const loop = useRef<Loop>(loopOf());
  const solids = useRef<Partial<Record<Slot, SVGGElement | null>>>({});
  const nodes = useRef<Record<string, Node>>({});
  const look = useRef<Look>(restLook());
  const drawn = useRef<Record<string, string | number>>({});
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [idle, setIdle] = useState(true);

  const solidRef = (slot: Slot) => (node: SVGGElement | null) => {
    solids.current[slot] = node;
  };

  const bind = (name: string) => (node: Node) => {
    nodes.current[name] = node;
  };

  const put = useCallback((name: string, attribute: string, value: string) => {
    const key = `${name}.${attribute}`;
    if (drawn.current[key] === value) {
      return;
    }
    drawn.current[key] = value;
    const node = nodes.current[name];
    if (!node) {
      return;
    }
    if (attribute === "opacity") {
      (node as SVGGElement).style.opacity = value;
    } else {
      node.setAttribute(attribute, value);
    }
  }, []);

  const showCount = useCallback((name: string, count: number) => {
    const key = `${name}.count`;
    if (drawn.current[key] === count) {
      return;
    }
    drawn.current[key] = count;
    const group = nodes.current[name];
    if (!group) {
      return;
    }
    for (const child of Array.from(group.children) as SVGGElement[]) {
      child.style.display = Number(child.dataset.count) === count ? "" : "none";
    }
  }, []);

  /** True, and remembered, when a rebuilt part's key differs from the last frame's. */
  const changed = useCallback((name: string, key: string) => {
    if (drawn.current[name] === key) {
      return false;
    }
    drawn.current[name] = key;
    return true;
  }, []);

  const approve = useCallback(() => {
    const s = look.current;
    if (s.approvalAge !== null && s.approvalAge < APPROVAL_FOR) {
      return;
    }
    const waiting = docked(s.t)
      ? Math.max(0, slipsPrinted(s.t) - s.released)
      : 0;
    s.approvalAge = 0;
    s.carried = waiting;
    s.handed = false;
  }, []);

  const drawStations = useCallback(
    (s: Look) => {
      const carried = shift(s.shuttle);
      put("shuttle", "transform", carried);
      put("shuttleTote", "transform", carried);
      put("shuttleFront", "transform", carried);
      put("toteStacks", "transform", carried);
      put("striker", "transform", shift(0, -3 * s.strike));
      put("deckCap", "transform", shift(0, -1.2 * s.press.calls));
      put("balCap", "transform", shift(0, -1.2 * s.press.books));
      put("printerCap", "transform", shift(0, -1.2 * s.press.invoices));
      put("playKey", "transform", shift(0, 0, -1.2 * s.play));
      put("hand", "d", handOf(s.hand));

      const packs = packsOf(s.share);
      if (changed("share", s.share.toFixed(4))) {
        writeSolid(solids.current.supply ?? null, packs.supply);
        writeSolid(solids.current.takeup ?? null, packs.takeup);
        put("tape", "d", packs.tape);
      }
      put("spokes", "d", spokesOf(s.reels));
      put("packMarks", "d", packMarks(s.reels, packs.radii));

      if (changed("cards", s.cards.toFixed(2))) {
        const cards = cardsOf(s.cards);
        writeSolid(solids.current.cards ?? null, cards?.paths ?? null);
        put("cardSeams", "d", cards?.seams ?? "");
      }

      if (changed("beam", s.beam.toFixed(3))) {
        writeSolid(solids.current.beam ?? null, beamOf(s.beam));
        put("needle", "d", needleOf(s.beam));
        const [left, right] = panRise(s.beam);
        put("panLeft", "transform", shift(0, 0, left));
        put("panRight", "transform", shift(0, 0, right));
      }
      put("arrest", "transform", shift(0, 0, -ARREST_DROP * s.drop));
      put("platenMarks", "d", platenMarks(s.platen));
      put(
        "rollMarks",
        "d",
        rollMarks(s.roll, ROLL.from, ROLL.to, ROLL.y, ROLL.z, ROLL.r, 8)
      );

      const falling = fallingAt(s.t);
      put("falling", "opacity", falling ? "1" : "0");
      if (falling) {
        put(
          "falling",
          "transform",
          shift(STOPS.invoices, falling.y, falling.z)
        );
      }
    },
    [changed, put]
  );

  const drawOutput = useCallback(
    (s: Look) => {
      showCount("toteStacks", Math.max(0, slipsPrinted(s.t) - s.released));
      showCount("reportTicks", reportDone(s.t, s.released));
      showCount("sentStacks", s.sentShow > 0.01 ? s.sent : 0);
      put(
        "sentStacks",
        "transform",
        shift(STOPS.dock + PUSH * (s.handed ? pushAt(s.approvalAge) : 1))
      );
      put("sentStacks", "opacity", `${Math.round(s.sentShow * 100) / 100}`);

      const share = leverAt(s.approvalAge);
      put("gate", "transform", shift(0, 0, GATE_LIFT * share));
      if (changed("lever", share.toFixed(3))) {
        const lever = leverOf(share);
        writeSolid(solids.current.arm ?? null, lever.arm);
        writeSolid(solids.current.knob ?? null, lever.knob);
        writeSolid(solids.current.cap ?? null, lever.cap);
      }

      const night = nightOf(s, loop.current.rewinding);
      say(readoutOf(night));
      const node = loop.current.root;
      if (node === null || loop.current.script) {
        return;
      }
      const spoken = spokenOf(night);
      if (node.getAttribute("aria-valuetext") !== spoken) {
        node.setAttribute("aria-valuetext", spoken);
      }
      const value = `${Math.round(s.t * 10) / 10}`;
      if (node.getAttribute("aria-valuenow") !== value) {
        node.setAttribute("aria-valuenow", value);
      }
    },
    [changed, put, say, showCount]
  );

  /** The idle tour: a night, a hold at 06:00, the owner's press, then a rewind to 22:00. */
  const advanceTour = useCallback(
    (dt: number) => {
      if (!loop.current.script) {
        loop.current.rewinding = false;
        return;
      }
      loop.current.clock += dt;
      if (loop.current.clock >= LOOP) {
        loop.current.clock -= LOOP;
        loop.current.approved = false;
      }
      const c = loop.current.clock;
      if (c < NIGHT) {
        loop.current.target = c;
        loop.current.rewinding = false;
      } else if (c < RESET_AT) {
        loop.current.target = NIGHT;
        if (c >= APPROVE_AT && !loop.current.approved) {
          loop.current.approved = true;
          approve();
        }
      } else {
        const s = look.current;
        loop.current.target = 0;
        loop.current.rewinding = s.shuttle > STOPS.calls + 1 || s.share > 0.002;
      }
    },
    [approve]
  );

  const step = useCallback(
    (dt: number, calm: boolean) => {
      const s = look.current;
      advanceTour(dt);
      const before = s.t;
      s.t =
        loop.current.script || calm
          ? loop.current.target
          : follow(s.t, loop.current.target, dt, 0.22, calm, 1e-3);
      if (s.t < SLIPS_FROM && s.released) {
        s.released = 0;
      }
      const want = shuttleAt(s.t);
      const shareWant = callsShare(s.t);
      moveShuttle(s, want, dt, calm);
      moveTape(s, shareWant, dt, calm);
      moveBeam(s, dt, calm);
      moveStriker(s, dt, calm, loop.current.rewinding);
      movePrinter(s, before);
      const hand = handTurn(s.t);
      s.hand = follow(
        s.hand,
        hand,
        dt,
        s.hand > hand + 2 ? 0.35 : 0.06,
        calm,
        0.01
      );
      moveApproval(s, dt, calm);

      drawStations(s);
      drawOutput(s);
      return (
        loop.current.script ||
        !isResting(s, loop.current.target, want, shareWant)
      );
    },
    [advanceTour, drawOutput, drawStations]
  );

  const stop = useCallback(() => {
    cancelAnimationFrame(loop.current.frame);
    loop.current.frame = 0;
  }, []);

  const run = useCallback(() => {
    if (loop.current.frame) {
      return;
    }
    loop.current.last = 0;
    const tick = (now: number) => {
      const dt = loop.current.last
        ? Math.min((now - loop.current.last) / 1000, MOST_DT)
        : 1 / 60;
      loop.current.last = now;
      const more = step(dt, asksForStillness());
      loop.current.frame = more ? requestAnimationFrame(tick) : 0;
    };
    loop.current.frame = requestAnimationFrame(tick);
  }, [step]);

  useEffect(() => {
    const node = loop.current.root;
    if (!node) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => setVisible(Boolean(entries.at(-1)?.isIntersecting)),
      { rootMargin: "120px 0px" }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      stop();
    };
  }, [stop]);

  const engaged = hovering || focused;

  /** The tour comes back TOUR_BACK ms after the last touch. */
  const restartIdle = useCallback(() => {
    window.clearTimeout(loop.current.idle);
    loop.current.idle = window.setTimeout(() => setIdle(true), TOUR_BACK);
  }, []);

  useEffect(() => {
    if (engaged) {
      window.clearTimeout(loop.current.idle);
      setIdle(false);
      return;
    }
    restartIdle();
    return () => window.clearTimeout(loop.current.idle);
  }, [engaged, restartIdle]);

  const touring = visible && idle && !engaged;

  useEffect(() => {
    if (!visible) {
      loop.current.script = false;
      stop();
      return;
    }
    if (touring && !asksForStillness()) {
      const timer = window.setTimeout(() => {
        const s = look.current;
        if (s.released && s.t >= DOCK_AT) {
          loop.current.clock = Math.max(loop.current.clock, RESET_AT - 0.8);
          loop.current.approved = true;
        } else if (s.t >= NIGHT) {
          loop.current.clock = Math.min(
            Math.max(loop.current.clock, NIGHT),
            APPROVE_AT - 1.2
          );
          loop.current.approved = false;
        } else {
          loop.current.clock = s.t;
          loop.current.approved = false;
        }
        loop.current.script = true;
        run();
      }, TOUR_FIRST * 1000);
      return () => {
        window.clearTimeout(timer);
        loop.current.script = false;
      };
    }
    loop.current.script = false;
    run();
  }, [visible, touring, run, stop]);

  const wake = useCallback(() => {
    loop.current.script = false;
    setIdle(false);
    restartIdle();
  }, [restartIdle]);

  const scrubTo = useCallback(
    (t: number) => {
      wake();
      loop.current.target = clamp(t, 0, NIGHT);
      run();
    },
    [run, wake]
  );

  const press = useCallback(() => {
    wake();
    loop.current.target = look.current.t;
    approve();
    run();
  }, [approve, run, wake]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        if (!event.repeat) {
          press();
        }
        return;
      }
      const now = loop.current.script ? look.current.t : loop.current.target;
      const next = keyTarget(event.key, now, event.shiftKey ? STEP * 2 : STEP);
      if (next !== null) {
        event.preventDefault();
        scrubTo(next);
      }
    },
    [press, scrubTo]
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const box = loop.current.root
        ?.querySelector("svg")
        ?.getBoundingClientRect();
      if (event.pointerType !== "mouse" || !box?.width) {
        return;
      }
      scrubTo(
        clamp(((event.clientX - box.left) / box.width - 0.1) / 0.8) * NIGHT
      );
    },
    [scrubTo]
  );

  const onPointerEnter = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      setHovering(true);
    }
  }, []);

  const onPointerLeave = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      setHovering(false);
    }
  }, []);

  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => setFocused(false), []);

  const setRoot = useCallback(
    (node: HTMLDivElement | null) => {
      loop.current.root = node;
      anchor.current = node;
    },
    [anchor]
  );

  return (
    <div
      aria-label="Morning Ops Report machine. Left and right arrows move through the night, Space or Enter presses the approval lever."
      aria-valuemax={NIGHT}
      aria-valuemin={0}
      aria-valuenow={NIGHT}
      aria-valuetext={REST_TEXT}
      className="mo"
      onBlur={onBlur}
      onClick={press}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerMove={onPointerMove}
      ref={setRoot}
      role="slider"
      tabIndex={0}
    >
      <IsoFigure height={HEIGHT} label={props.label} width={WIDTH}>
        {props.base}
        {props.report}
        <g ref={bind("reportTicks")}>{props.reportTicks}</g>
        {props.clock}
        <path className="mo-hand" d={handOf(REST.hand)} ref={bind("hand")} />
        {props.clockHub}
        {props.deckBack}
        <g ref={bind("deckCap")}>{props.deckCap}</g>
        <path
          className="iso-line mo-tape"
          d={REST_PACKS.tape}
          data-tone="mid"
          ref={bind("tape")}
        />
        <LiveSolid
          nodeRef={solidRef("supply")}
          paths={REST_PACKS.supply}
          tone="mid"
        />
        <LiveSolid
          nodeRef={solidRef("takeup")}
          paths={REST_PACKS.takeup}
          tone="mid"
        />
        <path
          className="iso-line"
          d={packMarks(REST.reels, REST_PACKS.radii)}
          data-tone="lo"
          ref={bind("packMarks")}
        />
        {props.deckHubs}
        <path
          className="iso-line"
          d={spokesOf(REST.reels)}
          data-tone="mid"
          ref={bind("spokes")}
        />
        {props.deckFront}
        <g ref={bind("playKey")}>{props.playKey}</g>
        {props.deckKeys}
        {props.trayBack}
        <LiveSolid
          nodeRef={solidRef("cards")}
          paths={cardsOf(REST.cards)?.paths ?? null}
          tone="hi"
        />
        <path
          className="iso-line"
          d={cardsOf(REST.cards)?.seams ?? ""}
          data-tone="faint"
          ref={bind("cardSeams")}
        />
        {props.trayFront}
        {props.balBack}
        <g ref={bind("balCap")}>{props.balCap}</g>
        <g ref={bind("arrest")}>{props.arrest}</g>
        {props.balMid}
        <LiveSolid
          nodeRef={solidRef("beam")}
          paths={beamOf(REST.beam)}
          tone="mid"
        />
        <g ref={bind("panLeft")}>{props.panLeft}</g>
        {props.scale}
        <path
          className="mo-needle"
          d={needleOf(REST.beam)}
          ref={bind("needle")}
        />
        {props.pin}
        <g ref={bind("panRight")}>{props.panRight}</g>
        {props.printerBack}
        <path
          className="iso-line"
          d={rollMarks(
            REST.roll,
            ROLL.from,
            ROLL.to,
            ROLL.y,
            ROLL.z,
            ROLL.r,
            8
          )}
          data-tone="lo"
          ref={bind("rollMarks")}
        />
        {props.printerRollEnd}
        <path
          className="iso-line"
          d={platenMarks(REST.platen)}
          data-tone="lo"
          ref={bind("platenMarks")}
        />
        {props.printerFront}
        <g ref={bind("printerCap")}>{props.printerCap}</g>
        {props.rail}
        <g ref={bind("shuttle")} transform={shift(REST.shuttle)}>
          <g ref={bind("striker")}>{props.striker}</g>
          {props.carriage}
        </g>
        {props.gateLow}
        <g ref={bind("shuttleTote")} transform={shift(REST.shuttle)}>
          {props.toteBack}
        </g>
        <g ref={bind("toteStacks")} transform={shift(REST.shuttle)}>
          {props.toteStacks}
        </g>
        <g
          ref={bind("sentStacks")}
          style={{ opacity: 0 }}
          transform={shift(STOPS.dock + PUSH)}
        >
          {props.sentStacks}
        </g>
        <g clipPath="url(#mo-slot)">
          <g ref={bind("falling")} style={{ opacity: 0 }}>
            {props.falling}
          </g>
        </g>
        <g ref={bind("shuttleFront")} transform={shift(REST.shuttle)}>
          {props.toteFront}
        </g>
        {props.gateBack}
        <g ref={bind("gate")}>{props.gate}</g>
        {props.gateFront}
        {props.quadrant}
        <LiveSolid
          lit
          nodeRef={solidRef("arm")}
          paths={REST_LEVER.arm}
          tone="hi"
        />
        <LiveSolid
          lit
          nodeRef={solidRef("cap")}
          paths={REST_LEVER.cap}
          tone="hi"
        />
        <LiveSolid
          lit
          nodeRef={solidRef("knob")}
          paths={REST_LEVER.knob}
          tone="hi"
        />
        <defs>
          <clipPath id="mo-slot">
            <path d={SLOT_CLIP} />
          </clipPath>
        </defs>
      </IsoFigure>
    </div>
  );
}
