import Link from "next/link";
import type { ReactNode } from "react";
import { SOCIALS } from "./content.ts";
import styles from "./shared.module.css";

export function PrototypeShell({
  children,
  theme,
}: {
  children: ReactNode;
  theme?: "dark" | "light";
}) {
  return (
    <main className={styles.page} data-portfolio-prototype data-theme={theme}>
      <div className={styles.shell}>{children}</div>
    </main>
  );
}

export function Introduction() {
  return (
    <section aria-labelledby="page-title" className={styles.introduction}>
      <div className={styles.identity}>
        <h1 id="page-title">Amartya Singh</h1>
        <p>Product Engineer</p>
      </div>
      <p className={styles.lede}>
        I’m a product engineer at Avail. I work across backend systems, product
        interfaces, and developer tools. I also build products of my own.
      </p>
      <nav aria-label="Elsewhere" className={styles.links}>
        {SOCIALS.map((social) => (
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

export function AboutAndFooter({
  signature,
  footerAction,
}: {
  signature?: ReactNode;
  footerAction?: ReactNode;
} = {}) {
  return (
    <>
      <section aria-labelledby="about-title" className={styles.section}>
        <h2 id="about-title">A little more</h2>
        <div className={styles.aboutCopy}>
          <p>
            I learned to code with Python and later studied Computer Science at
            King’s College London. Away from work, I spend time with my cat,
            play games, watch anime, and follow football. Hala Madrid.
          </p>
          {signature ?? (
            <p>
              The name <span className={styles.handle}>decocereus</span> came
              from an early Python anagram generator. It combined “code” and
              “secure”, and the username stayed.
            </p>
          )}
        </div>
      </section>
      <footer className={styles.footer}>
        <p>Amartya Singh</p>
        <div className={styles.footerActions}>
          {footerAction}
          <Link href="mailto:amartyasinghkings07@gmail.com">Get in touch</Link>
        </div>
      </footer>
    </>
  );
}
