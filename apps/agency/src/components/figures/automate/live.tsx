"use client";

import {
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { asksForStillness, useInView } from "../../iso/react/live.tsx";
import { PLATEN_MARKS, ROLL_MARKS } from "./frame.ts";
import {
  APPROVE_SECONDS,
  autoB,
  autoSeconds,
  B_END,
  B_HAND,
  BEATS,
  type Beat,
  handB,
  readoutOf,
  STEPS,
  SVG_LABEL,
  TOUR,
  TURNS_PER_B,
} from "./model.ts";
import {
  type Attrs,
  type Look,
  type Pose,
  poseOf,
  type Run,
  stillOf,
} from "./pose.ts";
import { HEIGHT, WIDTH } from "./view.ts";

const LONGEST_FRAME = 1 / 30;
const HAND_SPEED = 30;
const WAIT: Record<Run["mode"], number> = { auto: 1.3, hand: 0.5 };
const NEXT_CYCLE = 0.7;
const RESUME_AFTER = 9;
const STIFFNESS = 70;
const DAMPING = 2 * Math.sqrt(STIFFNESS);
const AI_DELAY = 0.45;
const TOUR_TOTAL = BEATS.reduce((sum, beat) => sum + TOUR[beat], 0);
const ARM_PARTS = [
  ["fill", "iso-fill", undefined, undefined],
  ["shade0", "iso-shade", "0", undefined],
  ["shade1", "iso-shade", "1", undefined],
  ["shade2", "iso-shade", "2", undefined],
  ["shade3", "iso-shade", "3", undefined],
  ["top", "iso-top", undefined, undefined],
  ["crease", "iso-line iso-crease", undefined, "faint"],
  ["outline", "iso-line iso-edge", undefined, "hi"],
] as const;

/** Which beat the tour shows at a clock time, and how far into it. */
function tourAt(clock: number): { age: number; beat: Beat } {
  let left = ((clock % TOUR_TOTAL) + TOUR_TOTAL) % TOUR_TOTAL;
  for (const beat of BEATS) {
    if (left < TOUR[beat]) {
      return { age: left, beat };
    }
    left -= TOUR[beat];
  }
  return { age: 0, beat: "task" };
}

const tourStartOf = (beat: Beat) => {
  let clock = 0;
  for (const each of BEATS) {
    if (each === beat) {
      return clock;
    }
    clock += TOUR[each];
  }
  return 0;
};

function spring(state: Look["ai"], target: number, dt: number) {
  const steps = Math.max(1, Math.ceil(dt * 240));
  const slice = dt / steps;
  for (let step = 0; step < steps; step += 1) {
    state.rate +=
      ((target - state.at) * STIFFNESS - state.rate * DAMPING) * slice;
    state.at += state.rate * slice;
  }
  if (Math.abs(target - state.at) < 5e-4 && Math.abs(state.rate) < 5e-4) {
    state.at = target;
    state.rate = 0;
  }
}

const follow = (value: number, target: number, dt: number, seconds: number) => {
  const next = value + (target - value) * (1 - Math.exp(-dt / seconds));
  return Math.abs(target - next) < 1e-3 ? target : next;
};

function runFor(s: Look, beat: Beat, held: Beat | null): Run {
  if (beat === "auto") {
    return {
      b0: s.b,
      b1: B_END,
      mode: "auto",
      seconds: autoSeconds(s.b),
      t: 0,
    };
  }
  const b1 = held === "task" || s.b >= B_HAND ? B_END : B_HAND;
  return {
    b0: s.b,
    b1,
    mode: "hand",
    seconds: Math.max(0.6, (b1 - s.b) / HAND_SPEED),
    t: 0,
  };
}

function newCycle(s: Look, beat: Beat, held: Beat | null) {
  s.b = 0;
  s.phase = "run";
  s.phaseAge = 0;
  s.run = runFor(s, beat, held);
}

function enter(s: Look, beat: Beat, held: Beat | null) {
  s.beat = beat;
  s.beatAge = 0;
  if (beat !== "task" && beat !== "auto") {
    return;
  }
  if (s.phase === "done") {
    newCycle(s, beat, held);
  } else if (s.phase === "run") {
    s.run = runFor(s, beat, held);
  }
}

/** The stations part and close, the AI module drops in or lifts out, the clutch follows. */
function moveParts(s: Look, dt: number) {
  const apart = s.beat === "split";
  s.spread.forEach((station, index) => {
    const delay = apart ? 0.1 + index * 0.09 : (3 - index) * 0.07;
    if (s.beatAge >= delay) {
      s.spreadGoal[index] = apart ? 1 : 0;
    }
    spring(station, s.spreadGoal[index] ?? 0, dt);
  });
  if (s.beat === "task") {
    spring(s.ai, 0, dt);
  } else if (s.beat === "auto" || (s.beat === "ai" && s.beatAge > AI_DELAY)) {
    spring(s.ai, 1, dt);
  }
  s.clutch = follow(s.clutch, s.ai.at > 0.85 ? 1 : 0, dt, 0.14);
}

/** The belt runs once the machine is whole and driven the way the run needs. */
function runBelt(s: Look, run: Run, dt: number) {
  const assembled = s.spread.every((station) => station.at < 0.01);
  const driven =
    run.mode === "hand"
      ? s.ai.at < 0.04 && s.clutch < 0.06
      : s.ai.at > 0.98 && s.clutch > 0.96;
  if (!(assembled && driven)) {
    return;
  }
  run.t = Math.min(run.seconds, run.t + dt);
  s.b = run.mode === "hand" ? handB(run, run.t) : autoB(run.b0, run.t);
  if (run.t < run.seconds) {
    return;
  }
  s.b = run.b1;
  s.run = null;
  if (s.b >= B_END) {
    s.phase = "wait";
    s.phaseAge = 0;
  }
}

/** How long the phase after the run lasts. */
function phaseSeconds(s: Look) {
  if (s.phase === "wait") {
    return WAIT[s.beat === "auto" ? "auto" : "hand"];
  }
  return s.phase === "approve" ? APPROVE_SECONDS : NEXT_CYCLE;
}

/** Wait, then approve, then start a new cycle when the beat asks for one. */
function stepPhase(s: Look, dt: number, held: Beat | null) {
  if (s.phase === "run") {
    return;
  }
  s.phaseAge += dt;
  if (s.phaseAge < phaseSeconds(s)) {
    return;
  }
  if (s.phase === "wait") {
    s.phase = "approve";
    s.phaseAge = 0;
  } else if (s.phase === "approve") {
    s.phase = "done";
    s.phaseAge = 0;
  } else if (held === s.beat || s.beat === "task") {
    newCycle(s, s.beat, held);
  }
}

/** One step of the machine: springs, belt and approval. */
function advance(s: Look, dt: number, held: Beat | null) {
  s.beatAge += dt;
  moveParts(s, dt);
  if (s.beat !== "task" && s.beat !== "auto") {
    return;
  }
  const before = s.b;
  if (s.phase === "run" && s.run) {
    runBelt(s, s.run, dt);
  } else {
    stepPhase(s, dt, held);
  }
  if (s.beat === "task" && s.clutch < 0.5) {
    s.crank += (s.b - before) * TURNS_PER_B * Math.PI * 2;
  }
}

/** True once every station spring has come to rest on its goal. */
function stationsSettled(s: Look) {
  for (const [index, each] of s.spread.entries()) {
    if (each.rate !== 0 || each.at !== s.spreadGoal[index]) {
      return false;
    }
  }
  return true;
}

/** True once nothing will move again without new input. */
const resting = (s: Look) =>
  stationsSettled(s) &&
  s.ai.rate === 0 &&
  (s.clutch === 0 || s.clutch === 1) &&
  s.run === null &&
  (s.phase === "run" || (s.phase === "done" && s.beat !== "task"));

const toProps = (attrs: Attrs | undefined) => ({
  d: attrs?.d,
  "data-on": attrs?.["data-on"],
  display: attrs?.display || undefined,
  opacity: attrs?.opacity,
  transform: attrs?.transform || undefined,
});

interface Art {
  aiModule: ReactNode;
  bench: ReactNode;
  cards: ReactNode[];
  crankHandle: ReactNode;
  crankHub: ReactNode;
  crankShaft: ReactNode;
  exitClip: string;
  gate: ReactNode;
  halos: ReactNode[];
  hoppers: ReactNode;
  keyCap: ReactNode;
  layerA: Record<"copy" | "drive" | "gather" | "send" | "write", ReactNode>;
  layerC: Record<"copy" | "gather" | "write", ReactNode>;
  paperRoll: ReactNode;
  pips: [number, number][];
  platen: ReactNode;
  platenFront: ReactNode;
  pressHead: ReactNode;
  report: ReactNode;
  rollFrontBracket: ReactNode;
  sendFront: ReactNode;
  writerBody: ReactNode;
  writerBracketBack: ReactNode;
}

/** Write only the attributes that changed since the last frame. */
function writePose(nodes: Map<string, Element[]>, before: Pose, pose: Pose) {
  for (const [name, attrs] of Object.entries(pose)) {
    const list = nodes.get(name) ?? [];
    const old = before[name] ?? {};
    for (const [key, value] of Object.entries(attrs) as [
      keyof Attrs,
      string,
    ][]) {
      if (old[key] !== value) {
        for (const node of list) {
          setOrRemove(node, key, value);
        }
      }
    }
  }
}

const setOrRemove = (node: Element, key: string, value: string) => {
  if (value === "") {
    node.removeAttribute(key);
  } else {
    node.setAttribute(key, value);
  }
};

/** The progress rule under the active step: how far the tour is through it. */
function writeBars(bars: Map<Beat, HTMLElement>, s: Look, holding: boolean) {
  for (const [beat, bar] of bars) {
    let share = 0;
    if (beat === s.beat) {
      share =
        holding || asksForStillness() ? 1 : Math.min(1, s.beatAge / TOUR[beat]);
    }
    const value = `scaleX(${share.toFixed(4)})`;
    if (bar.style.transform !== value) {
      bar.style.transform = value;
    }
  }
}

interface Loop {
  /** Seconds into the tour. */
  clock: number;
  /** The pending animation frame, 0 when none. */
  frame: number;
  held: Beat | null;
  /** Seconds since the reader last chose a step. */
  idle: number;
  /** The previous frame's timestamp, 0 after a pause. */
  last: number;
  started: boolean;
}

/** The beat to show now: the held one, or the tour's. Resumes the tour after a pause. */
function beatAt(l: Loop, s: Look, dt: number): Beat {
  if (l.held === null) {
    l.clock += dt;
    return tourAt(l.clock).beat;
  }
  const holding = l.held;
  l.idle += dt;
  if (l.idle > RESUME_AFTER) {
    l.clock = tourStartOf(holding) + s.beatAge;
    l.held = null;
  }
  return holding;
}

const freshLoop = (): Loop => ({
  clock: 0,
  frame: 0,
  held: null,
  idle: 0,
  last: 0,
  started: false,
});

const FIRST = stillOf("auto");
const FIRST_POSE = poseOf(FIRST);
const FIRST_READOUT = readoutOf(FIRST);

/** The machine's state and the tour's clock: mutated every frame, never rendered. */
const freshMachine = () => ({ look: stillOf("auto"), loop: freshLoop() });

/** Props for a moving node: its name, and its pose in the first paint. */
const n = (name: string) => ({
  "data-node": name,
  ...toProps(FIRST_POSE[name]),
});
const stationGroup = (index: number, children: ReactNode) => (
  <g {...n(`st${index}`)}>{children}</g>
);

/** The machine itself: static art, with every moving part named for the loop to write. */
function Drawing({ art, clip }: { art: Art; clip: string }) {
  return (
    <svg
      aria-label={SVG_LABEL}
      className="iso-svg"
      focusable="false"
      role="img"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
    >
      <defs>
        <clipPath id={clip}>
          <path d={art.exitClip} />
        </clipPath>
      </defs>
      {art.bench}
      {art.halos.map((halo, index) => (
        <g key={`halo-${index.toString()}`} {...n(`halo${index}`)}>
          {halo}
        </g>
      ))}

      {stationGroup(
        0,
        <>
          {art.layerA.drive}
          <g {...n("ai")}>{art.aiModule}</g>
          <g {...n("crank")}>
            {art.crankShaft}
            {art.crankHub}
            <g className="iso-solid">
              {ARM_PARTS.map(([part, className, shade, tone]) => (
                <path
                  className={className}
                  data-shade={shade}
                  data-tone={tone}
                  key={part}
                  {...n(`arm-${part}`)}
                />
              ))}
            </g>
            <g {...n("handle")}>{art.crankHandle}</g>
          </g>
          {art.layerA.gather}
          <path className="iso-line" data-tone="lo" {...n("belt0")} />
        </>
      )}
      {stationGroup(
        1,
        <>
          {art.layerA.copy}
          <path className="iso-line" data-tone="lo" {...n("belt1")} />
        </>
      )}
      {stationGroup(
        2,
        <>
          {art.layerA.write}
          <path className="iso-line" data-tone="lo" {...n("belt2")} />
        </>
      )}
      {stationGroup(3, art.layerA.send)}

      {art.cards.map((card, index) => (
        <g key={`card-${index.toString()}`} {...n(`card${index}`)}>
          {card}
        </g>
      ))}

      {stationGroup(0, art.layerC.gather)}
      {stationGroup(1, art.layerC.copy)}
      {stationGroup(2, art.layerC.write)}

      {stationGroup(0, art.hoppers)}
      {stationGroup(1, <g {...n("press")}>{art.pressHead}</g>)}
      {stationGroup(
        2,
        <>
          {art.writerBody}
          {art.writerBracketBack}
          {art.paperRoll}
          {Array.from({ length: ROLL_MARKS }, (_, index) => (
            <path
              className="iso-line"
              data-tone="lo"
              key={`roll-${index.toString()}`}
              {...n(`roll${index}`)}
            />
          ))}
          {art.rollFrontBracket}
          {art.pips.map(([x, y], index) => (
            <circle
              className="am-pip"
              cx={x}
              cy={y}
              key={`pip-${index.toString()}`}
              r={0.9}
              {...n(`pip${index}`)}
            />
          ))}
        </>
      )}
      <g {...n("reportStation")}>
        <g clipPath={`url(#${clip})`}>
          <g {...n("report")}>{art.report}</g>
        </g>
      </g>
      {stationGroup(
        2,
        <>
          {art.platen}
          {Array.from({ length: PLATEN_MARKS }, (_, index) => (
            <path
              className="iso-line"
              data-tone="lo"
              key={`platen-${index.toString()}`}
              {...n(`platen${index}`)}
            />
          ))}
          {art.platenFront}
        </>
      )}
      {stationGroup(
        3,
        <>
          <g {...n("gate")}>{art.gate}</g>
          {art.sendFront}
          <g {...n("key")}>{art.keyCap}</g>
        </>
      )}
    </svg>
  );
}

/** The four step buttons, each with a progress rule the loop fills. */
function Steps({
  held,
  onChoose,
  shown,
}: {
  held: Beat | null;
  onChoose: (event: MouseEvent<HTMLButtonElement>) => void;
  shown: Beat;
}) {
  return (
    <fieldset className="m-0 grid min-w-0 grid-cols-2 border-0 p-0 sm:grid-cols-4">
      <legend className="sr-only">Steps</legend>
      {BEATS.map((beat, index) => (
        <button
          aria-pressed={held === beat}
          className="am-step group relative flex min-h-11 flex-col items-start gap-1 border-rule px-5 py-4 text-left transition-colors duration-150 ease-out sm:px-6"
          data-active={shown === beat ? "" : undefined}
          data-index={index}
          key={beat}
          onClick={onChoose}
          type="button"
          value={beat}
        >
          <span className="font-mono text-[12px] text-muted uppercase tabular-nums tracking-[0.08em]">
            {STEPS[beat].index}
          </span>
          <span className="am-step-label font-medium text-[15px] tracking-[-0.01em]">
            {STEPS[beat].label}
          </span>
          <span aria-hidden="true" className="am-bar">
            <span className="am-bar-fill" data-bar={beat} />
          </span>
        </button>
      ))}
    </fieldset>
  );
}

export function AutomateLive({ art }: { art: Art }) {
  const root = useRef<HTMLDivElement>(null);
  const bars = useRef<Map<Beat, HTMLElement>>(new Map());
  const nodes = useRef<Map<string, Element[]>>(new Map());
  const drawn = useRef<Pose>(FIRST_POSE);
  const [machine] = useState(freshMachine);
  const visible = useInView(root);
  const clip = useId().replace(/:/g, "");
  const [shown, setShown] = useState<Beat>("auto");
  const [held, setHeld] = useState<Beat | null>(null);
  const [said, setSaid] = useState("");

  const draw = useCallback(() => {
    const s = machine.look;
    const pose = poseOf(s);
    writePose(nodes.current, drawn.current, pose);
    drawn.current = pose;
    const text = readoutOf({ b: s.b, beat: s.beat, phase: s.phase });
    for (const line of nodes.current.get("readout") ?? []) {
      if (line.textContent !== text) {
        line.textContent = text;
      }
    }
    writeBars(bars.current, s, machine.loop.held !== null);
  }, [machine]);

  const tick = useCallback(
    (now: number) => {
      const l = machine.loop;
      const dt = l.last
        ? Math.min((now - l.last) / 1000, LONGEST_FRAME)
        : 1 / 60;
      l.last = now;
      if (asksForStillness()) {
        machine.look = stillOf(l.held ?? "auto");
        draw();
        setShown(machine.look.beat);
        l.frame = 0;
        return;
      }
      const s = machine.look;
      const wasHeld = l.held;
      const beat = beatAt(l, s, dt);
      if (wasHeld && !l.held) {
        setHeld(null);
      }
      if (beat !== s.beat) {
        enter(s, beat, l.held);
        setShown(beat);
      }
      advance(s, dt, l.held);
      draw();
      const more = l.held === null || !resting(s);
      l.frame = more ? requestAnimationFrame(tick) : 0;
    },
    [draw, machine]
  );

  const kick = useCallback(() => {
    const l = machine.loop;
    if (l.frame !== 0) {
      return;
    }
    l.last = 0;
    l.frame = requestAnimationFrame(tick);
  }, [tick, machine]);

  useEffect(() => {
    const map = new Map<string, Element[]>();
    const container = root.current;
    for (const node of container?.querySelectorAll("[data-node]") ?? []) {
      const name = node.getAttribute("data-node") ?? "";
      map.set(name, [...(map.get(name) ?? []), node]);
    }
    nodes.current = map;
    const rules = new Map<Beat, HTMLElement>();
    for (const bar of container?.querySelectorAll<HTMLElement>("[data-bar]") ??
      []) {
      const beat = BEATS.find((each) => each === bar.dataset.bar);
      if (beat) {
        rules.set(beat, bar);
      }
    }
    bars.current = rules;
  }, []);

  // Start the tour from its first beat. Offscreen, jump there so nobody sees the rewind.
  useEffect(() => {
    const l = machine.loop;
    if (l.started) {
      return;
    }
    l.started = true;
    const box = root.current?.getBoundingClientRect();
    const onScreen =
      box !== undefined && box.bottom > 0 && box.top < window.innerHeight;
    if (!(onScreen || asksForStillness())) {
      const s: Look = { ...stillOf("task"), b: 0, phase: "run" };
      enter(s, "task", null);
      machine.look = s;
      setShown("task");
      draw();
    }
  }, [draw, machine]);

  useEffect(() => {
    const l = machine.loop;
    const stop = () => {
      cancelAnimationFrame(l.frame);
      l.frame = 0;
    };
    if (visible) {
      kick();
    } else {
      stop();
    }
    return stop;
  }, [visible, kick, machine]);

  const choose = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const beat = BEATS.find((each) => each === event.currentTarget.value);
      if (!beat) {
        return;
      }
      const l = machine.loop;
      l.held = beat;
      l.idle = 0;
      setHeld(beat);
      setSaid(`${STEPS[beat].label}. ${STEPS[beat].caption}`);
      if (asksForStillness()) {
        machine.look = stillOf(beat);
        setShown(beat);
        draw();
        return;
      }
      const s = machine.look;
      if (s.beat !== beat) {
        enter(s, beat, beat);
        setShown(beat);
      } else if (s.run?.mode === "hand" && beat === "task") {
        s.run = {
          ...s.run,
          b1: B_END,
          seconds: s.run.seconds + (B_END - s.run.b1) / HAND_SPEED,
        };
      }
      kick();
    },
    [draw, kick, machine]
  );

  return (
    <div ref={root}>
      <div className="am-stage">
        <Drawing art={art} clip={clip} />
      </div>

      <div className="border-rule border-t">
        <Steps held={held} onChoose={choose} shown={shown} />
        <div className="grid gap-3 border-rule border-t px-5 py-5 sm:px-6 md:grid-cols-[1fr_auto] md:items-baseline md:gap-10">
          <p className="max-w-[62ch] text-[16px] text-ink-soft leading-relaxed">
            {STEPS[shown].caption}
          </p>
          <p
            aria-hidden="true"
            className="font-mono text-[12px] text-muted uppercase tabular-nums tracking-[0.08em]"
            data-node="readout"
          >
            {FIRST_READOUT}
          </p>
        </div>
        <p aria-live="polite" className="sr-only">
          {said}
        </p>
      </div>
    </div>
  );
}
