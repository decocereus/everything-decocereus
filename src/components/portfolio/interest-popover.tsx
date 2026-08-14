"use client";

import { Popover } from "@base-ui/react/popover";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PORTFOLIO_ANIME, PORTFOLIO_CAT } from "@/lib/constants.ts";
import styles from "./interest-popover.module.css";
import { MusicPlayer } from "./music-player.tsx";

type Interest = "anime" | "cat" | "music";
type Theme = "dark" | "light";
type OpenType = "" | "keyboard" | "mouse" | "pen" | "touch";

const INTEREST_TITLES: Record<Interest, string> = {
  anime: "My top five",
  cat: "Meet the real boss",
  music: "On repeat lately",
};

function focusPopupOnKeyboard(openType: OpenType) {
  return openType === "keyboard";
}

function CatContent() {
  return (
    <figure className={styles.catFigure}>
      <Image
        alt={PORTFOLIO_CAT.alt}
        className={styles.catImage}
        height={1600}
        sizes="(max-width: 480px) calc(100vw - 56px), 300px"
        src={PORTFOLIO_CAT.src}
        width={1200}
      />
      <figcaption>Professional napper. Occasional code reviewer.</figcaption>
    </figure>
  );
}

function AnimeContent() {
  return (
    <ol aria-label="My top five anime" className={styles.animeList}>
      {PORTFOLIO_ANIME.map((anime, index) => (
        <li className={styles.animeItem} key={anime.href}>
          <Link href={anime.href} rel="noreferrer" target="_blank">
            <span className={styles.animeArtwork} data-anime={anime.theme}>
              <Image
                alt={anime.imageAlt}
                height={630}
                loading="lazy"
                src={anime.imageSrc}
                unoptimized
                width={1200}
              />
              <span aria-hidden="true" className={styles.animeNumber}>
                {String(index + 1).padStart(2, "0")}
              </span>
            </span>
            <strong>{anime.title}</strong>
            <span aria-hidden="true" className={styles.animeArrow}>
              ↗
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

function InterestContent({ interest }: { interest: Interest }) {
  if (interest === "cat") {
    return <CatContent />;
  }

  if (interest === "music") {
    return <MusicPlayer />;
  }

  return <AnimeContent />;
}

export function InterestPopover({
  children,
  interest,
  theme,
}: {
  children: ReactNode;
  interest: Interest;
  theme: Theme;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger
        className={styles.trigger}
        closeDelay={120}
        data-interest={interest}
        delay={180}
        openOnHover
      >
        <span className={styles.label}>{children}</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          className={styles.positioner}
          collisionPadding={12}
          positionMethod="fixed"
          sideOffset={10}
        >
          <Popover.Popup
            className={styles.popup}
            data-interest={interest}
            data-theme={theme}
            initialFocus={focusPopupOnKeyboard}
          >
            <div className={styles.header}>
              <Popover.Title className={styles.title}>
                {INTEREST_TITLES[interest]}
              </Popover.Title>
              {interest === "cat" ? null : (
                <Popover.Close
                  aria-label={`Close ${interest}`}
                  className={styles.close}
                >
                  <span aria-hidden="true">×</span>
                </Popover.Close>
              )}
            </div>
            <InterestContent interest={interest} />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
