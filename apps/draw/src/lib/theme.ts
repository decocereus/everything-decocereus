export type Theme = "light" | "dark";

/** Readable by the server so pages render in the chosen theme without a flash. */
export const THEME_COOKIE = "draw-theme";

export const parseTheme = (value: string | undefined): Theme | undefined =>
  value === "light" || value === "dark" ? value : undefined;

/** The saved choice, or the OS preference until one is made. Browser only. */
export function currentTheme(): Theme {
  const attr = parseTheme(document.documentElement.dataset.theme);
  if (attr) {
    return attr;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Saves the choice for every page on this device. Browser only. */
export function saveTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  // biome-ignore lint/suspicious/noDocumentCookie: one non-sensitive preference; the Cookie Store API isn't in Safari or Firefox
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`;
}
