"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PORTFOLIO_WORK } from "@/lib/constants.ts";
import type { GitHubContributions } from "@/lib/github-contributions.ts";
import { GitHubContributionGraph } from "./github-contributions.tsx";
import { MusicPlayerProvider, MusicSection } from "./music-player.tsx";
import styles from "./portfolio.module.css";
import { AnagramStory, ThemeToggle } from "./portfolio-interactions.tsx";
import sharedStyles from "./portfolio-shell.module.css";
import {
  Introduction,
  PortfolioFooter,
  PortfolioShell,
} from "./portfolio-shell.tsx";

export function Portfolio({
  contributions,
}: {
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
        <Introduction theme={theme} />
        <AnagramStory />
        <section aria-labelledby="work-title" className={sharedStyles.section}>
          <h2 id="work-title">Things I’ve built</h2>
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
                  <p>{project.summary}</p>
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
                </article>
              </li>
            ))}
          </ol>
        </section>
        <GitHubContributionGraph contributions={contributions} />
        <MusicSection />
        <PortfolioFooter
          footerAction={<ThemeToggle onChange={toggleTheme} theme={theme} />}
        />
      </PortfolioShell>
    </MusicPlayerProvider>
  );
}
