import type React from "react";
import { WEEK } from "@/lib/content.ts";

const [START, END] = WEEK.hours;
const HOURS = Array.from({ length: END - START }, (_, index) => START + index);

const swatch = {
  back: "border border-accent bg-accent-tint",
  manual: "hatch border border-ink/25",
  meeting: "bg-ink/[0.06]",
} as const;

/** A Mon-Fri calendar. The hatched manual blocks clear once on load and come back as time. */
export function Week() {
  let manualIndex = 0;

  return (
    <figure className="rounded-xl border border-rule bg-surface p-4 shadow-[0_1px_2px_rgb(11_11_12/0.04),0_12px_32px_-16px_rgb(11_11_12/0.16)] sm:p-5">
      <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-4 font-mono text-[11px] text-muted uppercase tracking-[0.08em]">
        <span>{WEEK.title}</span>
        <span aria-hidden="true" className="flex gap-3">
          {(["manual", "back"] as const).map((key) => (
            <span className="flex items-center gap-1.5" key={key}>
              <span className={`size-2.5 rounded-[2px] ${swatch[key]}`} />
              {WEEK.legend[key]}
            </span>
          ))}
        </span>
      </figcaption>

      <div
        aria-hidden="true"
        className="grid grid-cols-[1.75rem_repeat(5,minmax(0,1fr))] gap-x-1 sm:grid-cols-[2.25rem_repeat(5,minmax(0,1fr))] sm:gap-x-1.5"
      >
        <span />
        {WEEK.days.map((day) => (
          <span
            className="pb-2 font-mono text-[11px] text-muted tracking-[0.04em]"
            key={day}
          >
            {day}
          </span>
        ))}

        <div className="col-span-6 grid grid-cols-subgrid">
          <div
            className="grid"
            style={{ gridTemplateRows: `repeat(${HOURS.length}, 1fr)` }}
          >
            {HOURS.map((hour) => (
              <span
                className="-translate-y-[0.4em] font-mono text-[10px] text-muted tabular-nums leading-none"
                key={hour}
              >
                {hour}
              </span>
            ))}
          </div>

          <div
            className="col-span-5 grid grid-cols-subgrid border-rule border-b bg-[linear-gradient(to_bottom,var(--color-rule)_1px,transparent_1px)] [--hour:2.25rem] sm:[--hour:1.875rem]"
            style={{
              backgroundSize: `100% calc(100% / ${HOURS.length})`,
              gridTemplateRows: `repeat(${HOURS.length}, var(--hour))`,
            }}
          >
            {WEEK.blocks.map((block) => {
              const place: React.CSSProperties = {
                gridColumn: block.day + 1,
                gridRow: `${block.from - START + 1} / ${block.to - START + 1}`,
              };
              const box =
                "overflow-hidden rounded-[4px] px-1.5 py-1 text-[10px] leading-tight sm:text-[11px]";

              if (block.kind === "meeting") {
                return (
                  <span
                    className={`${box} mt-px mb-0.5 text-ink-soft ${swatch.meeting}`}
                    key={`${block.day}-${block.from}`}
                    style={place}
                  >
                    {block.label}
                  </span>
                );
              }

              const order = { "--i": manualIndex } as React.CSSProperties;
              manualIndex += 1;
              return (
                <span
                  className="mt-px mb-0.5 grid"
                  key={`${block.day}-${block.from}`}
                  style={place}
                >
                  <span
                    className={`${box} week-back col-start-1 row-start-1 font-medium text-accent-ink ${swatch.back}`}
                    style={order}
                  >
                    {WEEK.legend.back}
                  </span>
                  <span
                    className={`${box} week-work col-start-1 row-start-1 text-ink ${swatch.manual}`}
                    style={order}
                  >
                    {block.label}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </figure>
  );
}
