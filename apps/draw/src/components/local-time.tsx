"use client";

import { useSyncExternalStore } from "react";

const full = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});
const day = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
});
const dayYear = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });
const relative = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** "Just now", "5 minutes ago", "Yesterday", then a plain date after a week. */
function ago(date: Date, now: number) {
  const ms = now - date.getTime();
  if (ms < MINUTE) {
    return "Just now";
  }
  if (ms < HOUR) {
    return relative.format(-Math.floor(ms / MINUTE), "minute");
  }
  if (ms < DAY) {
    return relative.format(-Math.floor(ms / HOUR), "hour");
  }
  if (ms < 7 * DAY) {
    const text = relative.format(-Math.floor(ms / DAY), "day");
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  return date.getFullYear() === new Date(now).getFullYear()
    ? day.format(date)
    : dayYear.format(date);
}

const subscribe = () => () => undefined;

/** Formats in the viewer's timezone. The server can't know it, so it renders nothing there. */
export function LocalTime({ iso }: { iso: string }) {
  const date = new Date(iso);
  const text = useSyncExternalStore(
    subscribe,
    () => ago(date, Date.now()),
    () => ""
  );
  const title = useSyncExternalStore(
    subscribe,
    () => full.format(date),
    () => undefined
  );
  return (
    <time dateTime={iso} title={title}>
      {text}
    </time>
  );
}
