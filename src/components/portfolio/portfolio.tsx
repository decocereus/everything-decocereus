"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  PORTFOLIO_CURRENT_WORK,
  PORTFOLIO_PLACES,
  PORTFOLIO_SIDE_PROJECTS,
} from "@/lib/constants.ts";
import styles from "./portfolio.module.css";
import { AnagramSignature, ThemeToggle } from "./portfolio-interactions.tsx";
import sharedStyles from "./portfolio-shell.module.css";
import {
  Interests,
  Introduction,
  PortfolioFooter,
  PortfolioShell,
} from "./portfolio-shell.tsx";

export function Portfolio() {
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
    <PortfolioShell theme={theme}>
      <section
        aria-label="The decocereus story"
        className={styles.anagramSection}
      >
        <AnagramSignature />
      </section>
      <Introduction />
      <section aria-labelledby="current-title" className={sharedStyles.section}>
        <h2 id="current-title">Current</h2>
        <div>
          <div className={styles.currentRole}>
            <span className={styles.company}>
              <span>{PORTFOLIO_CURRENT_WORK.company}</span>
              <span>{PORTFOLIO_CURRENT_WORK.role}</span>
            </span>
            <time>{PORTFOLIO_CURRENT_WORK.dates}</time>
          </div>
          <div className={styles.embeddedProjects}>
            {PORTFOLIO_CURRENT_WORK.projects.map((project) => (
              <article key={project.name}>
                <div className={styles.projectHeading}>
                  <h3>{project.name}</h3>
                  {"href" in project && project.href ? (
                    <Link href={project.href} rel="noreferrer" target="_blank">
                      Open ↗
                    </Link>
                  ) : null}
                </div>
                <p>{project.summary}</p>
                <p>{project.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section aria-labelledby="places-title" className={sharedStyles.section}>
        <h2 id="places-title">Previously</h2>
        <div className={styles.history}>
          {PORTFOLIO_PLACES.map((item) => (
            <details key={item.company}>
              <summary>
                <span className={styles.company}>
                  <span>{item.company}</span>
                  <span>{item.role}</span>
                </span>
                <time>{item.dates}</time>
                <span aria-hidden="true" className={styles.disclosure}>
                  +
                </span>
              </summary>
              <div className={styles.companyDetail}>
                <p>{item.summary}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
      <Interests />
      <section
        aria-labelledby="independent-title"
        className={sharedStyles.section}
      >
        <h2 id="independent-title">After hours</h2>
        <article className={styles.independent}>
          <div className={styles.independentHeading}>
            <h3>{PORTFOLIO_SIDE_PROJECTS.highlight.name}</h3>
            <Link
              href={PORTFOLIO_SIDE_PROJECTS.highlight.href}
              rel="noreferrer"
              target="_blank"
            >
              Website ↗
            </Link>
          </div>
          <p className={styles.independentSummary}>
            {PORTFOLIO_SIDE_PROJECTS.highlight.summary}
          </p>
          <p className={styles.independentDetail}>
            {PORTFOLIO_SIDE_PROJECTS.highlight.detail}
          </p>
        </article>
        <ul aria-label="Smaller projects" className={styles.smallProjects}>
          {PORTFOLIO_SIDE_PROJECTS.smaller.map((project) => (
            <li key={project.name}>
              <div>
                <span>{project.name}</span>
                <span>{project.description}</span>
              </div>
              <span className={styles.projectLinks}>
                <Link href={project.href} rel="noreferrer" target="_blank">
                  Open ↗
                </Link>
                <Link
                  href={project.sourceHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  Source ↗
                </Link>
              </span>
            </li>
          ))}
        </ul>
      </section>
      <PortfolioFooter
        footerAction={<ThemeToggle onChange={toggleTheme} theme={theme} />}
      />
    </PortfolioShell>
  );
}
