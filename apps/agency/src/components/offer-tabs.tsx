"use client";

import { Tabs } from "@base-ui/react/tabs";
import type React from "react";
import { useCallback, useState } from "react";
import { OFFER } from "@/lib/content.ts";
import { useAutoplay } from "./use-autoplay.ts";

type Id = (typeof OFFER.deliverables)[number]["id"];

const pad = (index: number) => String(index + 1).padStart(2, "0");
const ITEMS = OFFER.deliverables;
const FIRST = ITEMS[0].id;

/**
 * The audit's deliverables as tabs, each with a sample of what it looks like. The previews are
 * server-rendered and passed in, so this only adds the switching and the tour.
 */
export function OfferTabs({
  previews,
}: Readonly<{ previews: Record<Id, React.ReactNode> }>) {
  const items = ITEMS;
  const [value, setValue] = useState<Id>(items[0].id);
  const auto = useAutoplay<HTMLDivElement>();
  const { stop } = auto;

  const advance = useCallback(
    () =>
      setValue((current) => {
        const index = ITEMS.findIndex((item) => item.id === current);
        return ITEMS[(index + 1) % ITEMS.length]?.id ?? FIRST;
      }),
    []
  );
  const choose = useCallback(
    (id: Id) => {
      setValue(id);
      stop();
    },
    [stop]
  );

  return (
    <Tabs.Root
      className="grid gap-8 lg:grid-cols-12 lg:gap-10"
      onBlurCapture={auto.release}
      onFocusCapture={auto.hold}
      onPointerEnter={auto.hold}
      onPointerLeave={auto.release}
      onValueChange={choose}
      orientation="vertical"
      ref={auto.ref}
      value={value}
    >
      <Tabs.List className="border-rule border-t lg:col-span-5">
        {items.map((item, index) => (
          <Tabs.Tab
            className="group relative block w-full cursor-pointer border-rule border-b py-4 text-left outline-offset-[-2px]"
            key={item.id}
            value={item.id}
          >
            <span className="flex items-baseline gap-4">
              <span className="w-6 shrink-0 font-mono text-[12px] text-muted tabular-nums transition-colors duration-200 group-data-[active]:text-accent-ink">
                {pad(index)}
              </span>
              <span className="font-medium text-[17px] text-ink-soft tracking-[-0.01em] transition-colors duration-200 group-hover:text-ink group-data-[active]:text-ink sm:text-lg">
                {item.title}
              </span>
            </span>
            {auto.enabled ? (
              <span
                aria-hidden="true"
                className="tour-progress absolute -bottom-px left-0 hidden h-px w-full bg-accent group-data-[active]:block"
                onAnimationEnd={advance}
                style={{
                  animationDuration: "6s",
                  animationPlayState: auto.playing ? "running" : "paused",
                }}
              />
            ) : null}
          </Tabs.Tab>
        ))}
      </Tabs.List>

      <div className="order-first lg:order-none lg:col-span-7 lg:flex lg:flex-col">
        {items.map((item, index) => (
          <Tabs.Panel
            className="lg:flex lg:flex-1 lg:flex-col"
            key={item.id}
            value={item.id}
          >
            <p className="sr-only">{item.detail}</p>
            <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-rule bg-surface shadow-[0_1px_2px_rgb(11_11_12/0.04),0_12px_32px_-16px_rgb(11_11_12/0.16)]">
              <div className="flex items-center justify-between gap-4 border-rule border-b px-5 py-3 font-mono text-[11px] text-muted uppercase tracking-[0.08em]">
                <span className="truncate">{item.title}</span>
                <span className="shrink-0 tabular-nums">
                  {pad(index)} / {pad(items.length - 1)}
                </span>
              </div>
              <div className="min-h-[300px] flex-1 p-5 sm:min-h-[340px] sm:p-7">
                {previews[item.id]}
              </div>
            </div>
          </Tabs.Panel>
        ))}
      </div>
    </Tabs.Root>
  );
}
