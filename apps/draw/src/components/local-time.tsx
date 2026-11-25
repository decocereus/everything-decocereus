"use client";

import { useSyncExternalStore } from "react";

const fmt = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const subscribe = () => () => undefined;

/** Formats in the viewer's timezone. The server can't know it, so it renders nothing there. */
export function LocalTime({ iso }: { iso: string }) {
  const text = useSyncExternalStore(
    subscribe,
    () => fmt.format(new Date(iso)),
    () => ""
  );
  return <time dateTime={iso}>{text}</time>;
}
