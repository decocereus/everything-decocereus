"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { EXPERIENCE, FEATURED_WORK, SMALL_PROJECTS } from "../content.ts";
import sharedStyles from "../shared.module.css";
import { AboutAndFooter, Introduction, PrototypeShell } from "../shared.tsx";
import styles from "./integrated.module.css";
import { AnagramSignature, ThemeToggle } from "./integrated-interactions.tsx";

const AVAIL_PROJECTS = FEATURED_WORK.filter((project) =>
  ["shieldtx", "nexus"].includes(project.id)
);

export function IntegratedVariant() {
  const volt = FEATURED_WORK.find((project) => project.id === "volt");
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
    <PrototypeShell theme={theme}>
      <Introduction />
      <section aria-labelledby="history-title" className={sharedStyles.section}>
        <h2 id="history-title">Places</h2>
        <div className={styles.history}>
          {EXPERIENCE.map((item, index) =>
            index === 0 ? (
              <details key={item.company} open>
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
                  <div className={styles.embeddedProjects}>
                    {AVAIL_PROJECTS.map((project) => (
                      <article key={project.name}>
                        <div className={styles.projectHeading}>
                          <h3>{project.name}</h3>
                          {"href" in project && project.href ? (
                            <Link
                              href={project.href}
                              rel="noreferrer"
                              target="_blank"
                            >
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
              </details>
            ) : (
              <div className={styles.placeRow} key={item.company}>
                <span className={styles.company}>
                  <span>{item.company}</span>
                  <span>{item.role}</span>
                </span>
                <time>{item.dates}</time>
              </div>
            )
          )}
        </div>
      </section>
      {volt ? (
        <section
          aria-labelledby="independent-title"
          className={sharedStyles.section}
        >
          <h2 id="independent-title">Built outside work</h2>
          <article className={styles.independent}>
            <div className={styles.independentHeading}>
              <h3>{volt.name}</h3>
              <Link href={volt.href} rel="noreferrer" target="_blank">
                Website ↗
              </Link>
            </div>
            <p className={styles.independentSummary}>{volt.summary}</p>
            <p className={styles.independentDetail}>{volt.detail}</p>
          </article>
          <ul aria-label="Smaller projects" className={styles.smallProjects}>
            {SMALL_PROJECTS.map((project) => (
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
      ) : null}
      <section
        aria-label="The decocereus story"
        className={styles.anagramSection}
      >
        <AnagramSignature />
      </section>
      <AboutAndFooter
        footerAction={<ThemeToggle onChange={toggleTheme} theme={theme} />}
        signature={false}
      />
    </PrototypeShell>
  );
}
