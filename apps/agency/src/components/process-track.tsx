"use client";

import { Tabs } from "@base-ui/react/tabs";
import type React from "react";
import { useCallback, useState } from "react";
import { PROCESS } from "@/lib/content.ts";
import { useAutoplay } from "./use-autoplay.ts";

const pad = (index: number) => String(index + 1).padStart(2, "0");

/**
 * The four steps as a track you can click through. Steps already passed have a solid orange
 * rail, the current one fills in while the tour runs, and the panel below shows its detail.
 */
export function ProcessTrack() {
  const { steps } = PROCESS;
  const [value, setValue] = useState(0);
  const auto = useAutoplay<HTMLDivElement>();
  const { stop } = auto;

  const advance = useCallback(
    () => setValue((current) => (current + 1) % PROCESS.steps.length),
    []
  );
  const choose = useCallback(
    (index: number) => {
      setValue(index);
      stop();
    },
    [stop]
  );

  return (
    <Tabs.Root
      className="mt-14"
      onBlurCapture={auto.release}
      onFocusCapture={auto.hold}
      onPointerEnter={auto.hold}
      onPointerLeave={auto.release}
      onValueChange={choose}
      ref={auto.ref}
      value={value}
    >
      <Tabs.List className="grid grid-cols-4">
        {steps.map((step, index) => (
          <Tabs.Tab
            className="group relative cursor-pointer pt-7 pr-3 pb-2 text-left outline-offset-2"
            key={step.title}
            value={index}
          >
            <span
              aria-hidden="true"
              className="absolute top-[5px] right-0 left-0 h-px bg-ink/15"
            />
            <span
              aria-hidden="true"
              className={`absolute top-[4.5px] left-0 h-0.5 w-full origin-left bg-accent transition-transform duration-500 ease-[var(--ease-out-strong)] ${index < value ? "scale-x-100" : "scale-x-0"}`}
            />
            {auto.enabled && index === value ? (
              <span
                aria-hidden="true"
                className="tour-progress absolute top-[4.5px] left-0 h-0.5 w-full bg-accent"
                onAnimationEnd={advance}
                style={{
                  animationDuration: "5s",
                  animationPlayState: auto.playing ? "running" : "paused",
                }}
              />
            ) : null}
            <span
              aria-hidden="true"
              className={`absolute top-0 left-0 size-[11px] rounded-full border-[1.5px] transition-[background-color,border-color,scale] duration-300 ease-out group-hover:scale-125 ${index <= value ? "border-accent" : "border-ink/35"} ${index === value ? "bg-accent" : "bg-paper"}`}
            />
            <span className="block font-mono text-[12px] text-muted tabular-nums">
              {pad(index)}
            </span>
            <span className="mt-1.5 block font-medium text-[15px] text-ink-soft tracking-[-0.01em] transition-colors duration-200 group-hover:text-ink group-data-[active]:text-ink sm:text-xl">
              {step.title}
            </span>
            <span className="mt-1 hidden font-mono text-[12px] text-muted uppercase tracking-[0.08em] sm:block">
              {step.length}
            </span>
          </Tabs.Tab>
        ))}
      </Tabs.List>

      <div className="mt-8 min-h-[14rem] border-rule border-t pt-8 sm:min-h-[10rem] sm:pt-10">
        {steps.map((step, index) => (
          <Tabs.Panel
            className="grid gap-4 lg:grid-cols-12 lg:gap-10"
            key={step.title}
            value={index}
          >
            <div
              className="rise lg:col-span-5"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              <p className="font-mono text-[12px] text-muted uppercase tracking-[0.08em]">
                Step {pad(index)} · {step.length}
              </p>
              <h3 className="mt-3 font-medium text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.035em]">
                {step.title}
              </h3>
            </div>
            <p
              className="rise max-w-[52ch] text-ink-soft text-lg leading-relaxed lg:col-span-6 lg:col-start-7 lg:self-end lg:text-xl"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              {step.detail}
            </p>
          </Tabs.Panel>
        ))}
      </div>
    </Tabs.Root>
  );
}
