import type { CodexUsage, CodexUsageDay } from "@/lib/codex-usage.ts";
import { PORTFOLIO_CODEX } from "@/lib/constants.ts";
import styles from "./codex-activity.module.css";

const SINCE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

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

const MONTH_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

function dateFromDay(value: string) {
  return new Date(`${value}T00:00:00Z`);
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

export function CodexActivity({ usage }: { usage: CodexUsage }) {
  const since = SINCE_FORMATTER.format(new Date(`${usage.since}T00:00:00Z`));

  const leadingDays = dateFromDay(usage.since).getUTCDay();
  const weeks = Math.ceil((leadingDays + usage.daily.length) / 7);
  const months = monthLabels(usage.daily, leadingDays);
  const values = usage.daily.map(
    (day) => day.directTokens + day.subagentTokens
  );
  const thresholds = activityThresholds(values);

  return (
    <section aria-labelledby="codex-title" className={styles.section}>
      <div className={styles.heading}>
        <h2 id="codex-title">{PORTFOLIO_CODEX.title}</h2>
        <p>{PORTFOLIO_CODEX.description}</p>
      </div>
      <dl className={styles.metrics}>
        <div>
          <dt>Processed tokens</dt>
          <dd>{compactNumber(usage.totals.processedTokens)}</dd>
        </div>
        <div>
          <dt>Agent runs</dt>
          <dd>{usage.totals.runs.toLocaleString("en-US")}</dd>
        </div>
        <div>
          <dt>Active days</dt>
          <dd>{usage.insights.activeDays.toLocaleString("en-US")}</dd>
        </div>
      </dl>
      <figure className={styles.figure}>
        <figcaption className={styles.caption}>
          Daily Codex activity since {since}
        </figcaption>
        <div className={styles.scroller}>
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
          <div
            aria-label={`Daily processed tokens since ${since}. Darker squares mean more activity.`}
            className={styles.graph}
            role="img"
          >
            {usage.daily.map((day, index) => (
              <time
                aria-hidden="true"
                className={styles.day}
                data-level={activityLevel(values[index], thresholds)}
                dateTime={day.date}
                key={day.date}
                style={
                  index === 0 ? { gridRowStart: leadingDays + 1 } : undefined
                }
                title={`${day.date}: ${compactNumber(values[index])} tokens`}
              />
            ))}
          </div>
        </div>
        <div aria-hidden="true" className={styles.legend}>
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span className={styles.day} data-level={level} key={level} />
          ))}
          <span>More</span>
        </div>
      </figure>
    </section>
  );
}
