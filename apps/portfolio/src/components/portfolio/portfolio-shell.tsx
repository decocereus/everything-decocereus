import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PORTFOLIO_BIO, PORTFOLIO_CONTACT } from "@/lib/constants.ts";
import { InterestPopover } from "./interest-popover.tsx";
import { LinkPreviewPopover } from "./link-preview-popover.tsx";
import styles from "./portfolio-shell.module.css";

type BiographySegment = (typeof PORTFOLIO_BIO)[number]["segments"][number];
type ContactLabel = (typeof PORTFOLIO_CONTACT.links)[number]["label"];
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

export function Introduction({
  actions,
  theme,
}: {
  actions: ReactNode;
  theme: Theme;
}) {
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
      <div className={styles.nameRow}>
        <h1 id="page-title">Amartya Singh</h1>
        {actions}
      </div>
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

function GitHubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.58 2 12.22c0 4.51 2.87 8.34 6.84 9.69.5.09.68-.22.68-.49l-.01-1.92c-2.78.62-3.37-1.2-3.37-1.2-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.64-1.36-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.4 9.4 0 0 1 12 6.92a9.4 9.4 0 0 1 2.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.56 5.06.36.32.68.94.68 1.89l-.01 2.8c0 .27.18.59.69.49A10.24 10.24 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M18.9 2h3.68l-8.04 9.19L24 22h-7.41l-5.8-7.58L4.16 22H.48l8.59-9.82L0 2h7.59l5.24 6.93L18.9 2Zm-1.29 18.1h2.04L6.48 3.8H4.29L17.61 20.1Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5.34 7.5H1.67V22h3.67V7.5ZM3.5 2A2.15 2.15 0 1 0 3.5 6.3 2.15 2.15 0 0 0 3.5 2ZM22.33 13.68c0-4.37-2.33-6.4-5.45-6.4a4.72 4.72 0 0 0-4.28 2.35V7.5H8.93V22h3.67v-7.18c0-1.9.36-3.74 2.72-3.74 2.33 0 2.36 2.18 2.36 3.86V22h3.67l.98-8.32Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect height="14" rx="2" width="18" x="3" y="5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function ResumeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M6 2.75h8l4 4V21.25H6z" />
      <path d="M14 2.75v4h4M9 12h6M9 16h6" />
    </svg>
  );
}

function SocialIcon({ label }: { label: ContactLabel }) {
  if (label === "GitHub") {
    return <GitHubIcon />;
  }
  if (label === "X") {
    return <XIcon />;
  }
  if (label === "LinkedIn") {
    return <LinkedInIcon />;
  }
  const unreachable: never = label;
  return unreachable;
}

export function PortfolioHeaderActions({ action }: { action?: ReactNode }) {
  return (
    <div className={styles.topBar}>
      <nav aria-label="Contact" className={styles.contact}>
        {PORTFOLIO_CONTACT.links.map((social) => (
          <Link
            aria-label={social.label}
            href={social.href}
            key={social.label}
            rel="noreferrer"
            target="_blank"
            title={social.label}
          >
            <SocialIcon label={social.label} />
          </Link>
        ))}
        <Link
          aria-label="Email"
          href={PORTFOLIO_CONTACT.mailHref}
          title="Email"
        >
          <MailIcon />
        </Link>
        <Link
          aria-label="Resume"
          href={PORTFOLIO_CONTACT.resumeHref}
          title="Resume"
        >
          <ResumeIcon />
        </Link>
      </nav>
      {action}
    </div>
  );
}
