import Link from "next/link";
import type { ReactNode } from "react";
import { PORTFOLIO_SOCIALS } from "@/lib/constants.ts";
import styles from "./portfolio-shell.module.css";

export function PortfolioShell({
  children,
  theme,
}: {
  children: ReactNode;
  theme?: "dark" | "light";
}) {
  return (
    <main className={styles.page} data-theme={theme}>
      <div className={styles.shell}>{children}</div>
    </main>
  );
}

export function Introduction() {
  return (
    <section aria-labelledby="page-title" className={styles.introduction}>
      <div className={styles.identity}>
        <h1 id="page-title">Amartya Singh</h1>
      </div>
      <p className={styles.lede}>
        I build products across backend systems, interfaces, and developer
        tools. Sometimes I build things of my own too.
      </p>
      <nav aria-label="Elsewhere" className={styles.links}>
        {PORTFOLIO_SOCIALS.map((social) => (
          <Link
            href={social.href}
            key={social.label}
            rel="noreferrer"
            target="_blank"
          >
            {social.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}

export function Interests() {
  return (
    <section aria-labelledby="interests-title" className={styles.section}>
      <h2 id="interests-title">Away from work</h2>
      <div className={styles.aboutCopy}>
        <p>
          I’m usually with my cat, playing games, watching anime, or following
          football. Hala Madrid.
        </p>
      </div>
    </section>
  );
}

export function PortfolioFooter({
  footerAction,
}: {
  footerAction?: ReactNode;
}) {
  return (
    <footer className={styles.footer}>
      <p>Amartya Singh</p>
      <div className={styles.footerActions}>
        {footerAction}
        <Link href="mailto:amartyasinghkings07@gmail.com">Get in touch</Link>
      </div>
    </footer>
  );
}
