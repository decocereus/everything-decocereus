"use client";

import type { KeyboardEvent } from "react";
import { useCallback, useState } from "react";
import type { CodexUsage, CodexUsageDay } from "@/lib/codex-usage.ts";
import { PORTFOLIO_CODEX } from "@/lib/constants.ts";
import styles from "./codex-activity.module.css";

type ActivityMetric = "runs" | "tokens";

const DAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});
const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});
const UPDATED_FORMATTER = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "Asia/Kolkata",
  year: "numeric",
});
const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function compactNumber(value: number) {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString("en-US");
}

function dateFromDay(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

function formatDay(value: string) {
  return DAY_FORMATTER.format(dateFromDay(value));
}

function totalRuns(day: CodexUsageDay) {
  return day.directRuns + day.subagentRuns;
}

function totalTokens(day: CodexUsageDay) {
  return day.directTokens + day.subagentTokens;
}

function activityValue(day: CodexUsageDay, metric: ActivityMetric) {
  return metric === "tokens" ? totalTokens(day) : totalRuns(day);
}

function activityThresholds(values: number[]) {
  const nonZero = values.filter(Boolean).sort((left, right) => left - right);
  const at = (fraction: number) =>
    nonZero[Math.floor((nonZero.length - 1) * fraction)] ?? 0;
  return [at(0.25), at(0.5), at(0.75)];
}

function activityLevel(value: number, thresholds: number[]) {
  if (value === 0) {
    return 0;
  }
  const level = thresholds.findIndex((threshold) => value <= threshold);
  return level === -1 ? 4 : level + 1;
}

function dayLabel(day: CodexUsageDay) {
  const runs = totalRuns(day);
  const tokens = totalTokens(day);
  const runNoun = runs === 1 ? "run" : "runs";
  const delegatedRunNoun = day.subagentRuns === 1 ? "run" : "runs";
  return `${formatDay(day.date)}: ${tokens.toLocaleString("en-US")} processed tokens, ${runs.toLocaleString("en-US")} ${runNoun}, ${day.subagentRuns.toLocaleString("en-US")} delegated ${delegatedRunNoun}`;
}

function lastActiveDay(days: CodexUsageDay[]) {
  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (totalRuns(days[index]) > 0) {
      return days[index];
    }
  }
  return days.at(-1);
}

function monthLabels(days: CodexUsageDay[], leadingDays: number) {
  const labels: { label: string; week: number }[] = [];
  let previousMonth = "";
  days.forEach((day, index) => {
    const month = day.date.slice(0, 7);
    if (month !== previousMonth) {
      labels.push({
        label: MONTH_FORMATTER.format(dateFromDay(day.date)),
        week: Math.floor((leadingDays + index) / 7),
      });
      previousMonth = month;
    }
  });
  return labels;
}

function ActivityDayButton({
  day,
  index,
  label,
  level,
  moveSelection,
  selected,
  setSelectedDate,
}: {
  day: CodexUsageDay;
  index: number;
  label: string;
  level: number;
  moveSelection: (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => void;
  selected: boolean;
  setSelectedDate: (date: string) => void;
}) {
  const selectDay = useCallback(() => {
    setSelectedDate(day.date);
  }, [day.date, setSelectedDate]);
  const moveDay = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      moveSelection(event, index);
    },
    [index, moveSelection]
  );

  return (
    <button
      aria-label={label}
      aria-pressed={selected}
      className={styles.day}
      data-activity-day=""
      data-level={level}
      onClick={selectDay}
      onFocus={selectDay}
      onKeyDown={moveDay}
      onPointerEnter={selectDay}
      tabIndex={selected ? 0 : -1}
      title={label}
      type="button"
    />
  );
}

export function CodexActivity({ usage }: { usage: CodexUsage }) {
  const initialDay = lastActiveDay(usage.daily) ?? usage.daily[0];
  const [metric, setMetric] = useState<ActivityMetric>("tokens");
  const [selectedDate, setSelectedDate] = useState(initialDay.date);
  const selectedDay =
    usage.daily.find((day) => day.date === selectedDate) ?? initialDay;
  const values = usage.daily.map((day) => activityValue(day, metric));
  const thresholds = activityThresholds(values);
  const leadingDays = dateFromDay(usage.daily[0].date).getUTCDay();
  const weeks = Math.ceil((leadingDays + usage.daily.length) / 7);
  const months = monthLabels(usage.daily, leadingDays);
  const subagentShare =
    (usage.totals.subagentProcessedTokens / usage.totals.processedTokens) * 100;
  const updated = UPDATED_FORMATTER.format(new Date(usage.generatedAt));

  const scrollToLatest = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      element.scrollLeft = element.scrollWidth;
    }
  }, []);

  const selectTokens = useCallback(() => setMetric("tokens"), []);
  const selectRuns = useCallback(() => setMetric("runs"), []);
  const moveSelection = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const offset = {
        ArrowDown: 1,
        ArrowLeft: -7,
        ArrowRight: 7,
        ArrowUp: -1,
        End: usage.daily.length - 1 - index,
        Home: -index,
      }[event.key];
      if (offset === undefined) {
        return;
      }
      event.preventDefault();
      const nextIndex = Math.max(
        0,
        Math.min(usage.daily.length - 1, index + offset)
      );
      const nextDay = usage.daily[nextIndex];
      setSelectedDate(nextDay.date);
      const buttons = event.currentTarget.parentElement?.querySelectorAll(
        "button[data-activity-day]"
      );
      (buttons?.[nextIndex] as HTMLButtonElement | undefined)?.focus();
    },
    [usage.daily]
  );

  return (
    <section aria-labelledby="codex-title" className={styles.section}>
      <div className={styles.heading}>
        <div>
          <h2 id="codex-title">{PORTFOLIO_CODEX.title}</h2>
          <p>{PORTFOLIO_CODEX.description}</p>
        </div>
        <p className={styles.updated}>Updated {updated}</p>
      </div>

      <dl className={styles.metrics}>
        <div>
          <dt>Processed tokens</dt>
          <dd>{compactNumber(usage.totals.processedTokens)}</dd>
        </div>
        <div>
          <dt>Total runs</dt>
          <dd>{usage.totals.runs.toLocaleString("en-US")}</dd>
        </div>
        <div>
          <dt>Total delegated runs</dt>
          <dd>{usage.totals.subagentRuns.toLocaleString("en-US")}</dd>
        </div>
        <div>
          <dt>Active days</dt>
          <dd>{usage.insights.activeDays.toLocaleString("en-US")}</dd>
        </div>
      </dl>

      <p className={styles.summary}>
        {subagentShare.toFixed(1)}% ran through subagents ·{" "}
        {compactNumber(usage.last30Days.processedTokens)} tokens in the last 30
        days
      </p>

      <figure className={styles.figure}>
        <div className={styles.chartHeading}>
          <figcaption>
            <strong>Daily activity</strong>
            <span className={styles.captionRange}>
              Since {formatDay(usage.since)}
            </span>
          </figcaption>
          <fieldset className={styles.metricToggle} data-metric={metric}>
            <legend className={styles.srOnly}>Activity measure</legend>
            <span aria-hidden="true" className={styles.metricIndicator} />
            <button
              aria-pressed={metric === "tokens"}
              onClick={selectTokens}
              type="button"
            >
              Tokens
            </button>
            <button
              aria-pressed={metric === "runs"}
              onClick={selectRuns}
              type="button"
            >
              Runs
            </button>
          </fieldset>
        </div>

        <p aria-atomic="true" aria-live="polite" className={styles.dayDetail}>
          <strong className={styles.detailDate}>
            {formatDay(selectedDay.date)}
          </strong>
          <span className={styles.detailValue}>
            {compactNumber(totalTokens(selectedDay))} tokens
          </span>
          <span className={styles.detailValue}>
            {totalRuns(selectedDay).toLocaleString("en-US")} runs
          </span>
          <span className={styles.detailValue}>
            {selectedDay.subagentRuns.toLocaleString("en-US")} delegated
          </span>
        </p>

        <div className={styles.scroller} ref={scrollToLatest}>
          <div
            aria-hidden="true"
            className={styles.months}
            style={{ gridTemplateColumns: `repeat(${weeks}, 12px)` }}
          >
            {months.map((month) => (
              <span
                className={styles.monthLabel}
                key={`${month.label}-${month.week}`}
                style={{ gridColumnStart: month.week + 1 }}
              >
                {month.label}
              </span>
            ))}
          </div>
          <fieldset className={styles.graph}>
            <legend className={styles.srOnly}>
              Daily Codex activity from {formatDay(usage.since)}. Use arrow keys
              to inspect days.
            </legend>
            {WEEKDAYS.slice(0, leadingDays).map((weekday) => (
              <span
                aria-hidden="true"
                className={styles.emptyDay}
                key={weekday}
              />
            ))}
            {usage.daily.map((day, index) => {
              const label = dayLabel(day);
              return (
                <ActivityDayButton
                  day={day}
                  index={index}
                  key={day.date}
                  label={label}
                  level={activityLevel(values[index], thresholds)}
                  moveSelection={moveSelection}
                  selected={day.date === selectedDay.date}
                  setSelectedDate={setSelectedDate}
                />
              );
            })}
          </fieldset>
        </div>

        <div aria-hidden="true" className={styles.legend}>
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <i className={styles.day} data-level={level} key={level} />
          ))}
          <span>More</span>
        </div>
      </figure>
    </section>
  );
}
