import type React from "react";

/*
 * Samples of each audit deliverable, shown in the offer tabs. They show the shape of the work
 * on a made-up business that chases invoices by hand, never a client result, so they carry no
 * outcome numbers. Children with `rise` enter one after another (`--i`) when a tab opens.
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

function Check({ className = "" }: Readonly<{ className?: string }>) {
  return (
    <svg
      aria-hidden="true"
      className={`size-3.5 shrink-0 text-accent ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 16 16"
    >
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}

/** A grey placeholder line, for text the sample doesn't need to spell out. */
function Line({ width }: Readonly<{ width: string }>) {
  return (
    <span
      className="block h-1.5 rounded-full bg-ink/[0.08]"
      style={{ width }}
    />
  );
}

const CALLS = [
  { length: "45 min", who: "Kickoff, with you" },
  { length: "30 min", who: "Sales" },
  { length: "30 min", quote: true, who: "Finance" },
  { length: "30 min", who: "Support" },
] as const;

function CallsPreview() {
  return (
    <div className="flex h-full flex-col">
      <div>
        {CALLS.map((call, index) => (
          <Row
            className="border-rule border-b py-3 first:pt-0"
            index={index}
            key={call.who}
          >
            <div className="flex items-center gap-3">
              <span
                className={`grid size-7 shrink-0 place-items-center rounded-full font-mono text-[11px] ${"quote" in call ? "bg-ink text-paper" : "bg-ink/[0.06] text-ink-soft"}`}
              >
                {call.who[0]}
              </span>
              <span className="flex-1 text-[15px]">{call.who}</span>
              <span className="font-mono text-[12px] text-muted tabular-nums">
                {call.length}
              </span>
            </div>
            {"quote" in call ? (
              <div className="mt-3 ml-10 border-accent border-l-2 pl-3">
                <p className="text-[15px] text-ink leading-snug">
                  "Every Friday afternoon goes on chasing invoices."
                </p>
                <p className="mt-1.5 font-mono text-[11px] text-accent-ink uppercase tracking-[0.08em]">
                  Noted: chasing invoices
                </p>
              </div>
            ) : null}
          </Row>
        ))}
      </div>
      <Row
        className="mt-auto flex items-baseline justify-between gap-4 pt-6"
        index={5}
      >
        <span className="text-[14px] text-ink-soft">
          Your team's time, all in
        </span>
        <span className="font-medium text-[28px] tabular-nums leading-none tracking-[-0.03em]">
          4-6 hours
        </span>
      </Row>
    </div>
  );
}

const STEPS = [
  { step: "A lead comes in", tool: "Inbox" },
  { handoff: true, step: "Qualify it", tool: "CRM" },
  { step: "Write the proposal", tool: "Docs" },
  { handoff: true, step: "Send the invoice", tool: "Accounting" },
  { handoff: true, step: "Chase payment", tool: "Email" },
] as const;

function MapPreview() {
  return (
    <div className="flex h-full flex-col">
      <Row className={`flex justify-between pb-3 ${MONO}`} index={0}>
        <span>Lead to cash</span>
        <span>Tool</span>
      </Row>
      <div>
        {STEPS.map((item, index) => (
          <Row index={index + 1} key={item.step}>
            {"handoff" in item ? (
              <div className="flex items-center gap-3 py-1 pl-[5px]">
                <span className="relative block h-7 w-px bg-accent">
                  <span className="absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-2 ring-surface" />
                </span>
                <span className="pl-2 font-mono text-[11px] text-accent-ink uppercase tracking-[0.08em]">
                  Copied by hand
                </span>
              </div>
            ) : (
              index > 0 && (
                <div className="py-1 pl-[5px]">
                  <span className="block h-7 w-px bg-ink/20" />
                </div>
              )
            )}
            <div className="flex items-center gap-3">
              <span className="size-[11px] shrink-0 rounded-full border-[1.5px] border-ink/40 bg-surface" />
              <span className="flex-1 text-[15px]">{item.step}</span>
              <span className="rounded-md border border-rule px-2 py-0.5 text-[13px] text-ink-soft">
                {item.tool}
              </span>
            </div>
          </Row>
        ))}
      </div>
      <Row
        className="mt-auto flex items-center gap-2 pt-5 text-[14px] text-ink-soft"
        index={7}
      >
        <span className="size-2.5 rounded-full bg-accent" />
        Where time goes missing
      </Row>
    </div>
  );
}

const RANKED = [
  { gives: 0.92, label: "Automate", work: "Chasing invoices" },
  { gives: 0.74, label: "Build", work: "Qualifying leads" },
  { gives: 0.58, label: "Adopt", work: "Drafting proposals" },
  { gives: 0.4, label: "Automate", work: "Updating the CRM" },
  { gives: 0, label: "Skip", work: "A chatbot for customers" },
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
        className={`grid grid-cols-[1.5rem_1fr_5.5rem] gap-3 pb-3 ${MONO}`}
        index={0}
      >
        <span>#</span>
        <span>Ranked by what it gives back</span>
        <span className="text-right">Label</span>
      </Row>
      {RANKED.map((row, index) => (
        <Row
          className="grid grid-cols-[1.5rem_1fr_5.5rem] items-center gap-3 border-rule border-t py-3.5"
          index={index + 1}
          key={row.work}
        >
          <span className="font-mono text-[12px] text-muted tabular-nums">
            {row.gives ? index + 1 : "–"}
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
                  className={`block h-full grow-x rounded-full ${index === 0 ? "bg-ink" : "bg-ink/40"}`}
                  style={{ width: `${row.gives * 100}%` }}
                />
              </span>
            ) : (
              <span className="mt-1 block text-[13px] text-muted">
                Looks automatable, isn't worth it
              </span>
            )}
          </span>
          <span
            className={`justify-self-end rounded-full px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.06em] ${TAG[row.label]}`}
          >
            {row.label}
          </span>
        </Row>
      ))}
    </div>
  );
}

const WORKSHEET = [
  { op: "", source: "A fixed quote", term: "Build cost" },
  {
    op: "÷",
    source: "Your calls, checked in the live test",
    term: "Hours back each week",
  },
  { op: "×", source: "From you", term: "What an hour costs you" },
] as const;

const TOP_THREE = [
  "Chasing invoices",
  "Qualifying leads",
  "Drafting proposals",
] as const;

function EstimatesPreview() {
  return (
    <div className="flex h-full flex-col">
      <Row className="flex flex-wrap gap-2" index={0}>
        {TOP_THREE.map((name, index) => (
          <span
            className={`rounded-full px-3 py-1 text-[13px] ${index === 0 ? "bg-ink text-paper" : "border border-rule text-muted"}`}
            key={name}
          >
            #{index + 1}
          </span>
        ))}
      </Row>
      <Row className="mt-6" index={1}>
        <p className="font-medium text-[22px] leading-tight tracking-[-0.02em]">
          {TOP_THREE[0]}
        </p>
        <p className={`mt-1 ${MONO}`}>Automate · ranked first</p>
      </Row>
      <div className="mt-4">
        {WORKSHEET.map((row, index) => (
          <Row
            className="grid grid-cols-[1.25rem_1fr] gap-x-3 border-rule border-b py-3"
            index={index + 2}
            key={row.term}
          >
            <span className="text-[17px] text-muted leading-none">
              {row.op}
            </span>
            <span className="grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-4">
              <span className="text-[15px]">{row.term}</span>
              <span className="text-[14px] text-ink-soft">{row.source}</span>
            </span>
          </Row>
        ))}
        <Row className="grid grid-cols-[1.25rem_1fr] gap-x-3 pt-4" index={5}>
          <span className="text-[17px] text-accent leading-none">=</span>
          <span className="grid gap-1 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-4">
            <span className="font-medium text-[17px] leading-none">
              Payback, in weeks
            </span>
            <span className="text-[14px] text-ink-soft">
              Every assumption written down
            </span>
          </span>
        </Row>
      </div>
    </div>
  );
}

const RUNS = [
  { id: "INV-1038", ok: true },
  { id: "INV-1041", ok: true },
  { current: true, id: "INV-1042", ok: true },
  { id: "INV-1047", note: "Disputed amount, sent to a person", ok: false },
] as const;

function TestPreview() {
  return (
    <div>
      <Row className="rounded-lg border border-rule bg-paper p-4" index={0}>
        <span className={MONO}>Draft reminder · INV-1042</span>
        <p className="mt-3 text-[15px]">Invoice 1042 is now 14 days overdue</p>
        <div className="mt-3 space-y-2">
          <Line width="92%" />
          <Line width="78%" />
          <Line width="55%" />
        </div>
        <p className="mt-4 flex items-center gap-1.5 border-rule border-t pt-3 text-[13px] text-ink-soft">
          <Check />
          Matches the reminder you sent
        </p>
      </Row>
      <Row className={`mt-5 ${MONO}`} index={1}>
        Run on your past invoices
      </Row>
      <div className="mt-2">
        {RUNS.map((run, index) => (
          <Row
            className="flex items-center gap-3 border-rule border-b py-2.5"
            index={index + 2}
            key={run.id}
          >
            <span
              className={`font-mono text-[12px] tabular-nums ${"current" in run ? "text-ink" : "text-muted"}`}
            >
              {run.id}
            </span>
            {run.ok ? (
              <span className="ml-auto flex items-center gap-1.5 text-[14px] text-ink-soft">
                <Check />
                Matches
              </span>
            ) : (
              <span className="ml-auto text-right text-[14px] text-ink">
                {run.note}
              </span>
            )}
          </Row>
        ))}
      </div>
    </div>
  );
}

const PLAN = [
  { from: 1, label: "Build: chasing invoices", to: 4, tone: "accent" },
  { from: 3, label: "Test with the finance team", to: 6, tone: "ink" },
  { from: 6, label: "Hand it over", to: 7, tone: "ink" },
  { from: 8, label: "Next: qualifying leads", to: 12, tone: "dashed" },
] as const;

const PLAN_TONE = {
  accent: "bg-accent",
  dashed: "border border-ink/30 border-dashed",
  ink: "bg-ink/70",
} as const;

function PlanPreview() {
  return (
    <div className="flex h-full flex-col">
      <Row className={`grid grid-cols-3 ${MONO}`} index={0}>
        <span>Month 1</span>
        <span>Month 2</span>
        <span>Month 3</span>
      </Row>
      <div className="mt-3 space-y-3">
        {PLAN.map((row, index) => (
          <Row index={index + 1} key={row.label}>
            <p
              className={`text-[14px] ${row.tone === "accent" ? "text-ink" : "text-ink-soft"}`}
            >
              {row.label}
            </p>
            <div className="mt-1.5 grid grid-cols-12 gap-1">
              <span
                className={`h-2 rounded-full ${PLAN_TONE[row.tone]}`}
                style={{ gridColumn: `${row.from} / ${row.to + 1}` }}
              />
            </div>
          </Row>
        ))}
      </div>
      <Row className="mt-auto grid grid-cols-2 gap-3 pt-6" index={5}>
        <div className="rounded-lg border border-rule bg-paper p-3">
          <span className="block font-medium text-[14px]">Audit report</span>
          <span className="mt-0.5 block text-[13px] text-muted">
            Yours to keep
          </span>
          <span className="mt-3 block space-y-1.5">
            <Line width="85%" />
            <Line width="62%" />
            <Line width="74%" />
          </span>
        </div>
        <div className="relative flex flex-col justify-between overflow-hidden rounded-lg bg-ink p-3 text-paper">
          <span className="block font-medium text-[14px]">Walkthrough</span>
          <span className="flex items-end justify-between gap-2">
            <span className="text-[13px] text-paper/60">45-60 min</span>
            <span className="grid size-8 place-items-center rounded-full bg-accent">
              <svg
                aria-hidden="true"
                className="ml-0.5 size-3 text-white"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M4 2.5v11l9-5.5z" />
              </svg>
            </span>
          </span>
        </div>
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
