import Link from "next/link";
import { PORTFOLIO_GITHUB } from "@/lib/constants.ts";
import type { GitHubContributions } from "@/lib/github-contributions.ts";
import styles from "./github-contributions.module.css";

function contributionLabel(count: number, date: string) {
  const noun = count === 1 ? "contribution" : "contributions";
  return `${count} ${noun} on ${date}`;
}

export function GitHubContributionGraph({
  contributions,
}: {
  contributions: GitHubContributions;
}) {
  const firstDay = contributions.days.at(0)?.date;
  const lastDay = contributions.days.at(-1)?.date;
  const range =
    firstDay && lastDay ? `${firstDay} to ${lastDay}` : "the last year";
  const summary = `${contributions.totalContributions.toLocaleString("en-US")} contributions from ${range}`;

  return (
    <section aria-labelledby="github-title" className={styles.section}>
      <div className={styles.heading}>
        <div>
          <h2 id="github-title">On GitHub</h2>
          <p>
            {contributions.totalContributions.toLocaleString("en-US")}{" "}
            contributions in the last year
          </p>
        </div>
        <Link
          className={styles.profileLink}
          href={PORTFOLIO_GITHUB.href}
          rel="noreferrer"
          target="_blank"
        >
          View profile <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className={styles.scroller}>
        <div aria-label={summary} className={styles.graph} role="img">
          {contributions.days.map((day) => (
            <time
              aria-hidden="true"
              className={styles.day}
              data-level={day.level}
              dateTime={day.date}
              key={day.date}
              title={contributionLabel(day.count, day.date)}
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
    </section>
  );
}
