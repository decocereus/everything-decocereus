import type React from "react";

/*
 * Made-up samples of each audit deliverable, shown in the offer tabs under a
 * "Sample, illustrative" label. They show the shape of the work, never a client
 * result. Children with `rise` enter one after another (`--i`) when a tab opens.
 */

const MONO = "font-mono text-[11px] text-muted uppercase tracking-[0.08em]";

const rise = (index: number) => ({ "--i": index }) as React.CSSProperties;

function Row({
  children,
  index,
  className = "",
}: Readonly<{ children: React.ReactNode; index: number; className?: string }>) {
  return (
    <div className={`rise ${className}`} style={rise(index)}>
      {children}
    </div>
  );
}

const DAYS = Array.from({ length: 10 }, (_, day) => day + 1);

const CALLS = [
  { from: 1, label: "Kickoff call", to: 1, tone: "ink" },
  {
    from: 2,
    label: "Short calls with the people who do the work",
    to: 4,
    tone: "ink",
  },
  {
    from: 2,
    label: "Mapping, ranking, and testing, async",
    to: 9,
    tone: "hatch",
  },
  { from: 10, label: "Walkthrough of the report", to: 10, tone: "accent" },
] as const;

const CALL_TONE = {
  accent: "bg-accent",
  hatch: "hatch border border-rule",
  ink: "bg-ink",
} as const;

function CallsPreview() {
  return (
    <div>
      <Row className="grid grid-cols-10 gap-1" index={0}>
        {DAYS.map((day) => (
          <span className={`${MONO} text-center`} key={day}>
            D{day}
          </span>
        ))}
      </Row>
      <div className="mt-4 space-y-4">
        {CALLS.map((row, index) => (
          <Row index={index + 1} key={row.label}>
            <p className="text-[14px] text-ink-soft">{row.label}</p>
            <div className="mt-1.5 grid grid-cols-10 gap-1">
              <span
                className={`h-6 rounded-[4px] ${CALL_TONE[row.tone]}`}
                style={{ gridColumn: `${row.from} / ${row.to + 1}` }}
              />
            </div>
          </Row>
        ))}
      </div>
      <Row
        className="mt-6 flex flex-wrap items-baseline justify-between gap-2 border-rule border-t pt-4 text-[14px]"
        index={6}
      >
        <span className="text-ink-soft">Your team's time</span>
        <span className="font-medium">About 4-6 hours</span>
      </Row>
    </div>
  );
}

const NODES = [
  { label: "Inbox", x: 16, y: 24 },
  { label: "CRM", x: 148, y: 24 },
  { label: "Spreadsheet", x: 280, y: 24 },
  { label: "Weekly report", x: 148, y: 164 },
] as const;

const NODE = { h: 44, w: 104 };

const mid = (node: (typeof NODES)[number]) => ({
  x: node.x + NODE.w / 2,
  y: node.y + NODE.h / 2,
});

function MapPreview() {
  const [inbox, crm, sheet, report] = NODES;
  const edges = [
    { a: inbox, b: crm, handoff: false },
    { a: crm, b: sheet, handoff: true },
    { a: sheet, b: report, handoff: true },
  ];
  return (
    <div>
      <svg
        aria-label="A sample map: inbox to CRM to spreadsheet to weekly report, with two handoffs done by hand."
        className="rise w-full"
        role="img"
        style={rise(0)}
        viewBox="0 0 400 230"
      >
        {edges.map(({ a, b, handoff }) => {
          const from = mid(a);
          const to = mid(b);
          const path =
            from.y === to.y
              ? `M${a.x + NODE.w} ${from.y} H${b.x}`
              : `M${from.x} ${a.y + NODE.h} V${from.y + 70} H${to.x} V${b.y}`;
          const point =
            from.y === to.y
              ? { x: (a.x + NODE.w + b.x) / 2, y: from.y }
              : { x: from.x, y: from.y + 70 };
          return (
            <g key={`${a.label}-${b.label}`}>
              <path
                className="flow"
                d={path}
                fill="none"
                stroke="var(--color-ink)"
                strokeOpacity="0.45"
                strokeWidth="1.25"
              />
              {handoff ? (
                <circle
                  cx={point.x}
                  cy={point.y}
                  fill="var(--color-accent)"
                  r="5"
                />
              ) : null}
            </g>
          );
        })}
        {NODES.map((node) => (
          <g key={node.label}>
            <rect
              fill="var(--color-surface)"
              height={NODE.h}
              rx="6"
              stroke="var(--color-ink)"
              strokeOpacity="0.2"
              width={NODE.w}
              x={node.x}
              y={node.y}
            />
            <text
              dominantBaseline="central"
              fill="var(--color-ink)"
              fontSize="14"
              textAnchor="middle"
              x={node.x + NODE.w / 2}
              y={node.y + NODE.h / 2}
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
      <Row
        className="mt-4 flex items-center gap-2 text-[14px] text-ink-soft"
        index={1}
      >
        <span className="size-2.5 rounded-full bg-accent" />
        Handoffs done by hand, where time goes missing
      </Row>
    </div>
  );
}

const RANKED = [
  { gives: 0.92, label: "Automate", work: "Weekly report" },
  { gives: 0.74, label: "Adopt", work: "Inbox triage" },
  { gives: 0.56, label: "Build", work: "Quote builder" },
  { gives: 0, label: "Skip", work: "Old CRM fields" },
] as const;

const TAG = {
  Adopt: "border border-ink/25 text-ink",
  Automate: "bg-ink text-paper",
  Build: "bg-accent-tint text-accent-ink",
  Skip: "border border-rule text-muted",
} as const;

function RankedPreview() {
  return (
    <div>
      <Row
        className={`grid grid-cols-[1.75rem_1fr_5.5rem] gap-3 pb-3 ${MONO}`}
        index={0}
      >
        <span>#</span>
        <span>Work</span>
        <span className="text-right">Label</span>
      </Row>
      {RANKED.map((row, index) => (
        <Row
          className="grid grid-cols-[1.75rem_1fr_5.5rem] items-center gap-3 border-rule border-t py-3.5"
          index={index + 1}
          key={row.work}
        >
          <span className="font-mono text-[12px] text-muted tabular-nums">
            {index + 1}
          </span>
          <span className="min-w-0">
            <span
              className={`block text-[15px] ${row.gives ? "" : "text-muted line-through decoration-accent"}`}
            >
              {row.work}
            </span>
            {row.gives ? (
              <span className="mt-2 block h-1 overflow-hidden rounded-full bg-ink/[0.07]">
                <span
                  className="block h-full grow-x rounded-full bg-ink/70"
                  style={{ width: `${row.gives * 100}%` }}
                />
              </span>
            ) : null}
          </span>
          <span
            className={`justify-self-end rounded-full px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.06em] ${TAG[row.label]}`}
          >
            {row.label}
          </span>
        </Row>
      ))}
      <Row className="mt-3 text-[13px] text-muted" index={6}>
        Bars show what each change gives back, relative to the others.
      </Row>
    </div>
  );
}

const TERMS = [
  { source: "A fixed quote", term: "Build cost" },
  {
    source: "Your calls, checked in the live test",
    term: "Hours back each week",
  },
  { source: "From you", term: "What an hour costs you" },
] as const;

function EstimatesPreview() {
  return (
    <div>
      <Row className="flex gap-2" index={0}>
        {["#1 Weekly report", "#2", "#3"].map((tab, index) => (
          <span
            className={`rounded-full px-3 py-1 text-[13px] ${index === 0 ? "bg-ink text-paper" : "border border-rule text-muted"}`}
            key={tab}
          >
            {tab}
          </span>
        ))}
      </Row>
      <Row
        className="mt-6 rounded-lg bg-paper px-4 py-4 text-[15px] leading-relaxed"
        index={1}
      >
        <span className="font-medium">Payback</span>
        <span className="text-muted"> = </span>
        Build cost
        <span className="text-muted"> ÷ </span>( Hours back each week
        <span className="text-muted"> × </span>What an hour costs you )
      </Row>
      <Row className={`mt-6 ${MONO}`} index={2}>
        Assumptions
      </Row>
      {TERMS.map((row, index) => (
        <Row
          className="grid gap-1 border-rule border-b py-3 sm:grid-cols-[1fr_auto] sm:gap-4"
          index={index + 3}
          key={row.term}
        >
          <span className="text-[15px]">{row.term}</span>
          <span className="text-[14px] text-ink-soft">{row.source}</span>
        </Row>
      ))}
    </div>
  );
}

const RUNS = [
  { ok: true, week: "Week 31" },
  { ok: true, week: "Week 32" },
  { ok: false, week: "Week 33" },
  { ok: true, week: "Week 34" },
] as const;

function TestPreview() {
  return (
    <div>
      <Row className={MONO} index={0}>
        Weekly report, run on your past examples
      </Row>
      <div className="mt-4">
        {RUNS.map((run, index) => (
          <Row
            className="grid grid-cols-[1fr_auto] items-center gap-4 border-rule border-t py-3.5 last:border-b"
            index={index + 1}
            key={run.week}
          >
            <span className="flex items-baseline gap-3">
              <span className="font-mono text-[12px] text-muted tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[15px]">{run.week}</span>
            </span>
            {run.ok ? (
              <span className="flex items-center gap-1.5 text-[14px] text-ink-soft">
                <svg
                  aria-hidden="true"
                  className="size-3.5 text-accent"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 16 16"
                >
                  <path d="M3 8.5l3 3 7-7" />
                </svg>
                Matches the sent version
              </span>
            ) : (
              <span className="text-[14px] text-ink">Flagged for a person</span>
            )}
          </Row>
        ))}
      </div>
      <Row className="mt-4 text-[14px] text-ink-soft" index={6}>
        Anything the system isn't sure about goes to a person, not to your
        customers.
      </Row>
    </div>
  );
}

const PLAN = [
  { from: 1, label: "Build the first workflow", to: 4 },
  { from: 3, label: "Test with the people who do the work", to: 6 },
  { from: 6, label: "Hand it over", to: 7 },
  { dashed: true, from: 8, label: "Next workflow", to: 12 },
] as const;

function PlanPreview() {
  return (
    <div>
      <Row className={`grid grid-cols-3 ${MONO}`} index={0}>
        <span>Month 1</span>
        <span>Month 2</span>
        <span>Month 3</span>
      </Row>
      <div className="mt-4 space-y-3.5">
        {PLAN.map((row, index) => (
          <Row index={index + 1} key={row.label}>
            <p className="text-[14px] text-ink-soft">{row.label}</p>
            <div className="mt-1.5 grid grid-cols-12 gap-1">
              <span
                className={`h-5 rounded-[4px] ${"dashed" in row ? "border border-ink/30 border-dashed" : "bg-ink"}`}
                style={{ gridColumn: `${row.from} / ${row.to + 1}` }}
              />
            </div>
          </Row>
        ))}
      </div>
      <Row className="mt-6 flex flex-wrap gap-2" index={6}>
        <span className="inline-flex items-center gap-2 rounded-lg border border-rule px-3 py-2 text-[14px]">
          <svg
            aria-hidden="true"
            className="size-3.5 text-muted"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 16 16"
          >
            <path d="M4 1.5h5.5L13 5v9.5H4z M9.5 1.5V5H13" />
          </svg>
          Audit report
        </span>
        <span className="inline-flex items-center gap-2 rounded-lg border border-rule px-3 py-2 text-[14px]">
          <svg
            aria-hidden="true"
            className="size-3.5 text-accent"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M5 3.5v9l7-4.5z" />
          </svg>
          Walkthrough, 45-60 min
        </span>
      </Row>
    </div>
  );
}

export const OFFER_PREVIEWS = {
  calls: <CallsPreview />,
  estimates: <EstimatesPreview />,
  map: <MapPreview />,
  plan: <PlanPreview />,
  ranked: <RankedPreview />,
  test: <TestPreview />,
};
