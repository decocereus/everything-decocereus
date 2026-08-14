import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PORTFOLIO_BIO, PORTFOLIO_CONTACT } from "@/lib/constants.ts";
import { InterestPopover } from "./interest-popover.tsx";
import { LinkPreviewPopover } from "./link-preview-popover.tsx";
import styles from "./portfolio-shell.module.css";

type BiographySegment = (typeof PORTFOLIO_BIO)[number]["segments"][number];
type Theme = "dark" | "light";

function BiographySegment({
  segment,
  theme,
}: {
  segment: BiographySegment;
  theme: Theme;
}) {
  if ("href" in segment) {
    return (
      <LinkPreviewPopover
        href={segment.href}
        previewKey={segment.preview}
        theme={theme}
      >
        {segment.text}
      </LinkPreviewPopover>
    );
  }

  if ("interest" in segment) {
    return (
      <InterestPopover interest={segment.interest} theme={theme}>
        {segment.text}
      </InterestPopover>
    );
  }

  return segment.text;
}

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

export function Introduction({ theme }: { theme: Theme }) {
  return (
    <header className={styles.introduction}>
      <Image
        alt="A hand-drawn sketchbook of a cat, games, music, gadgets, and connected ideas"
        className={styles.sketchbook}
        height={1024}
        preload
        sizes="(max-width: 768px) calc(100vw - 40px), 720px"
        src="/prototypes/portfolio-directions/sketchbook-world-football-guitar.png"
        width={1536}
      />
      <h1 id="page-title">Amartya Singh</h1>
      <div className={styles.biography}>
        {PORTFOLIO_BIO.map((paragraph) => (
          <p key={paragraph.id}>
            {paragraph.segments.map((segment) => (
              <BiographySegment
                key={`${paragraph.id}-${segment.text}`}
                segment={segment}
                theme={theme}
              />
            ))}
          </p>
        ))}
      </div>
    </header>
  );
}

export function PortfolioFooter({
  footerAction,
}: {
  footerAction?: ReactNode;
}) {
  return (
    <footer className={styles.footer}>
      <nav aria-label="Contact" className={styles.contact}>
        {PORTFOLIO_CONTACT.links.map((social) => (
          <Link href={social.href} key={social.label}>
            {social.label}
          </Link>
        ))}
        <Link href={PORTFOLIO_CONTACT.mailHref}>Email</Link>
      </nav>
      {footerAction}
    </footer>
  );
}
