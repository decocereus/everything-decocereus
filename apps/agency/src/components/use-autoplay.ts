"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/**
 * Drives a tour that steps through tabs on its own. It runs only while the element is on
 * screen and nobody is pointing at or focused inside it, stops for good once someone picks a
 * tab, and never runs under reduced motion. The caller advances on its progress bar's
 * `animationend`, so `playing` only has to pause that animation.
 */
export function useAutoplay<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const [held, setHeld] = useState(false);
  const [stopped, setStopped] = useState(false);
  const reduced = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED).matches,
    () => true
  );

  useEffect(() => {
    const element = ref.current;
    // biome-ignore lint/suspicious/noUnnecessaryConditions: the ref is null until the element mounts.
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.35 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const hold = useCallback(() => setHeld(true), []);
  const release = useCallback(() => setHeld(false), []);
  const stop = useCallback(() => setStopped(true), []);
  const enabled = !(stopped || reduced);
  return {
    enabled,
    hold,
    playing: enabled && inView && !held,
    ref,
    release,
    stop,
  };
}
