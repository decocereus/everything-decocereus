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
  contributions: GitHubContributions | null;
}) {
  const summary = contributions
    ? `${contributions.totalContributions.toLocaleString("en-US")} contributions in the last year`
    : "Contribution activity is temporarily unavailable.";

  return (
    <section aria-labelledby="github-title" className={styles.section}>
      <div className={styles.heading}>
        <div>
          <h2 id="github-title">On GitHub</h2>
          <p>{summary}</p>
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
      {contributions ? (
        <>
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
        </>
      ) : null}
    </section>
  );
}
