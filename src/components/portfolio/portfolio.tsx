"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { CodexUsage } from "@/lib/codex-usage.ts";
import { PORTFOLIO_WORK } from "@/lib/constants.ts";
import type { GitHubContributions } from "@/lib/github-contributions.ts";
import { CodexActivity } from "./codex-activity.tsx";
import { GitHubContributionGraph } from "./github-contributions.tsx";
import { MusicPlayerProvider } from "./music-player.tsx";
import styles from "./portfolio.module.css";
import { AnagramStory, ThemeToggle } from "./portfolio-interactions.tsx";
import sharedStyles from "./portfolio-shell.module.css";
import {
  Introduction,
  PortfolioHeaderActions,
  PortfolioShell,
} from "./portfolio-shell.tsx";

export function Portfolio({
  codexUsage,
  contributions,
}: {
  codexUsage: CodexUsage;
  contributions: GitHubContributions;
}) {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("portfolio-theme");
    if (storedTheme === "dark") {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === "light" ? "dark" : "light";
    window.localStorage.setItem("portfolio-theme", nextTheme);
    setTheme(nextTheme);
  }, [theme]);

  return (
    <MusicPlayerProvider>
      <PortfolioShell theme={theme}>
        <Introduction
          actions={
            <PortfolioHeaderActions
              action={<ThemeToggle onChange={toggleTheme} theme={theme} />}
            />
          }
          theme={theme}
        />
        <section aria-labelledby="work-title" className={sharedStyles.section}>
          <div className={styles.workHeading}>
            <h2 id="work-title">Selected work</h2>
            <p>
              A few products and systems I’ve built, from solo tools to privacy
              infrastructure.
            </p>
          </div>
          <ol className={styles.workList}>
            {PORTFOLIO_WORK.map((project) => (
              <li key={project.name}>
                <article>
                  <h3>
                    <Link href={project.href} rel="noreferrer" target="_blank">
                      <span>{project.name}</span>
                      <span aria-hidden="true" className={styles.arrow}>
                        ↗
                      </span>
                    </Link>
                  </h3>
                  <div className={styles.workDetails}>
                    <p className={styles.workScope}>{project.scope}</p>
                    <p>
                      {project.summary}
                      {"storeHref" in project ? (
                        <>
                          {" Verified on "}
                          <Link
                            className={styles.summaryLink}
                            href={project.storeHref}
                            rel="noreferrer"
                            target="_blank"
                          >
                            chrome store
                          </Link>
                          .
                        </>
                      ) : null}
                    </p>
                    {"sourceHref" in project ? (
                      <Link
                        className={styles.sourceLink}
                        href={project.sourceHref}
                        rel="noreferrer"
                        target="_blank"
                      >
                        View source ↗
                      </Link>
                    ) : null}
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </section>
        <CodexActivity usage={codexUsage} />
        <GitHubContributionGraph contributions={contributions} />
        <AnagramStory theme={theme} />
      </PortfolioShell>
    </MusicPlayerProvider>
  );
}
