"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";
import { BEAT, FORK, RATES, SWING, TICK } from "./model.ts";
import { hairspring } from "./spring.ts";

const STILL = "(prefers-reduced-motion: reduce)";
const LONGEST_FRAME = 1 / 30;
const ease = (t: number) => 1 - (1 - t) ** 3;

// Runs the movement while the clock is on screen: the balance swings, and on
// each beat the escapement lets the whole train step forward together.
export function ClockMotion({
  children,
  className,
  spring,
}: {
  children: ReactNode;
  className: string;
  spring: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const still = window.matchMedia(STILL);
    const node = root.current;
    if (node === null || still.matches) {
      return;
    }
    const spins = new Map<string, Element[]>();
    for (const element of node.querySelectorAll("[data-spin]")) {
      const name = element.getAttribute("data-spin") ?? "";
      spins.set(name, [...(spins.get(name) ?? []), element]);
    }
    const coil = node.querySelector(".ck-hairspring");
    const turn = (name: string, degrees: number) => {
      const value = `rotate(${degrees.toFixed(2)})`;
      for (const element of spins.get(name) ?? []) {
        element.setAttribute("transform", value);
      }
    };

    let elapsed = 0;
    let last = 0;
    let frame = 0;
    let visible = false;

    const draw = () => {
      const beats = elapsed / BEAT;
      const count = Math.floor(beats);
      const step = ease(Math.min(1, ((beats - count) * BEAT) / TICK));
      const progress = count + step;
      for (const [name, rate] of Object.entries(RATES)) {
        turn(name, rate * progress);
      }
      const side = (n: number) => (n % 2 === 0 ? 1 : -1);
      const before = count === 0 ? 0 : side(count - 1);
      turn("fork", FORK * (before + (side(count) - before) * step));
      const swing = SWING * Math.sin(Math.PI * beats);
      turn("balance", swing);
      coil?.setAttribute("d", hairspring((swing * Math.PI) / 180));
    };

    const tick = (now: number) => {
      elapsed += last ? Math.min((now - last) / 1000, LONGEST_FRAME) : 0;
      last = now;
      draw();
      frame = requestAnimationFrame(tick);
    };
    const run = () => {
      if (visible && !still.matches && frame === 0) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visible = Boolean(entries.at(-1)?.isIntersecting);
        if (visible) {
          run();
        } else {
          stop();
        }
      },
      { rootMargin: "120px 0px" }
    );
    observer.observe(node);
    const onStill = () => (still.matches ? stop() : run());
    still.addEventListener("change", onStill);
    return () => {
      stop();
      observer.disconnect();
      still.removeEventListener("change", onStill);
    };
  }, []);

  return (
    <div
      className={className}
      data-theme="light"
      ref={root}
      style={{ "--ck-spring": spring } as CSSProperties}
    >
      {children}
    </div>
  );
}
