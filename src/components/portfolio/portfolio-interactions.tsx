"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./portfolio.module.css";

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

export function AnagramSignature() {
  const [word, setWord] = useState("code + secure");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      setWord("decocereus");
      return;
    }

    const play = () => {
      for (const timer of timers.current) {
        window.clearTimeout(timer);
      }
      timers.current = [];
      setWord("code + secure");
      for (const [index, frame] of SCRAMBLE_FRAMES.entries()) {
        timers.current.push(
          window.setTimeout(() => setWord(frame), 1200 + index * 90)
        );
      }
    };

    play();
    const cycle = window.setInterval(play, 3600);
    return () => {
      window.clearInterval(cycle);
      for (const timer of timers.current) {
        window.clearTimeout(timer);
      }
      timers.current = [];
    };
  }, []);

  return (
    <div className={styles.anagramBlock}>
      <p className={styles.anagramLabel}>
        My first Python project gave me a name
      </p>
      <div
        aria-label="Code plus secure becomes decocereus"
        className={styles.anagram}
        role="img"
      >
        <span aria-hidden="true">{word}</span>
      </div>
    </div>
  );
}
