"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PORTFOLIO_LORE } from "@/lib/constants.ts";
import styles from "./portfolio.module.css";
import sharedStyles from "./portfolio-shell.module.css";

const SCRAMBLE_FRAMES = [
  "codesecure",
  "coedsecure",
  "decoscuree",
  "decoceures",
  "decocereus",
] as const;

function MoonIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="M15.6 12.6A6.6 6.6 0 0 1 7.4 4.4 6.6 6.6 0 1 0 15.6 12.6Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="3.1" />
      <path d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M15.8 4.2l-1.4 1.4M5.6 14.4l-1.4 1.4" />
    </svg>
  );
}

export function ThemeToggle({
  theme,
  onChange,
}: {
  theme: "dark" | "light";
  onChange: () => void;
}) {
  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <button
      aria-label={`Use ${nextTheme} theme`}
      className={styles.themeToggle}
      onClick={onChange}
      type="button"
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
      <span>{nextTheme}</span>
    </button>
  );
}

export function AnagramStory() {
  const [word, setWord] = useState("code + secure");
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const timer of timers.current) {
      window.clearTimeout(timer);
    }
    timers.current = [];
  }, []);

  const play = useCallback(() => {
    clearTimers();
    setWord("code + secure");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setWord("decocereus");
      return;
    }

    for (const [index, frame] of SCRAMBLE_FRAMES.entries()) {
      timers.current.push(
        window.setTimeout(() => setWord(frame), 100 + index * 75)
      );
    }
  }, [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setWord("code + secure");
  }, [clearTimers]);

  useEffect(() => clearTimers, [clearTimers]);

  return (
    <section
      aria-labelledby="lore-title"
      className={`${sharedStyles.section} ${styles.loreSection}`}
    >
      <h2 id="lore-title">{PORTFOLIO_LORE.title}</h2>
      <div className={styles.loreContent}>
        <p className={styles.loreCopy}>{PORTFOLIO_LORE.story}</p>
        <button
          aria-label={PORTFOLIO_LORE.label}
          className={styles.anagramStory}
          onBlur={reset}
          onClick={play}
          onFocus={play}
          onMouseEnter={play}
          onMouseLeave={reset}
          type="button"
        >
          <span aria-hidden="true" className={styles.anagramStage}>
            <span className={styles.animatedAnagram}>{word}</span>
          </span>
        </button>
      </div>
    </section>
  );
}
