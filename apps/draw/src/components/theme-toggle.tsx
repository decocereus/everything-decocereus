"use client";

import { currentTheme, saveTheme } from "@/lib/theme.ts";

const toggle = () => saveTheme(currentTheme() === "dark" ? "light" : "dark");

/** Both icons render; CSS shows the one for the theme you'd switch to. */
export function ThemeToggle() {
  return (
    <button
      aria-label="Switch between light and dark"
      className="icon-btn theme-toggle"
      onClick={toggle}
      title="Switch theme"
      type="button"
    >
      <svg aria-hidden className="moon" viewBox="0 0 20 20">
        <title>Dark</title>
        <path d="M16.5 12.2A7 7 0 0 1 7.8 3.5a7 7 0 1 0 8.7 8.7Z" />
      </svg>
      <svg aria-hidden className="sun" viewBox="0 0 20 20">
        <title>Light</title>
        <circle cx="10" cy="10" r="3.5" />
        <path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6 16 16M4 16l1.4-1.4M14.6 5.4 16 4" />
      </svg>
    </button>
  );
}
