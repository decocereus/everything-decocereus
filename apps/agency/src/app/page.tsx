import Link from "next/link";
import type React from "react";
import { MorningOpsFigure } from "@/components/figures/morning-ops/figure.tsx";
import { PaperGrain } from "@/components/paper-grain.tsx";
import {
  APPROACH,
  CLOSE,
  CONTROL,
  FAQ,
  FOUNDER,
  HERO,
  NAV,
  WORK,
} from "@/lib/content.ts";
import { CONTACT, SITE } from "@/lib/site.ts";

const CONTAINER = "mx-auto w-full max-w-[1200px] px-6 sm:px-10";

function PrimaryLink({
  children,
  href,
}: Readonly<{ children: React.ReactNode; href: string }>) {
  return (
    <a
      className="inline-flex h-11 items-center rounded-md bg-ink px-5 font-medium text-[15px] text-paper transition-[background-color,scale] duration-150 ease-out hover:bg-ink-soft active:scale-[0.97]"
      href={href}
    >
      {children}
    </a>
  );
}

function Section({
  children,
  heading,
  id,
}: Readonly<{ children: React.ReactNode; heading: string; id?: string }>) {
  return (
    <section className="border-rule border-t" id={id}>
      <div
        className={`${CONTAINER} grid gap-8 py-20 sm:py-28 lg:grid-cols-12 lg:gap-10`}
      >
        <h2 className="font-medium text-[clamp(1.75rem,2.6vw,2.25rem)] leading-tight tracking-[-0.025em] lg:col-span-4">
          {heading}
        </h2>
        <div className="lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}

function Rows({
  items,
}: Readonly<{ items: readonly { title: string; detail: string }[] }>) {
  return (
    <dl>
      {items.map((item) => (
        <div
          className="grid gap-1 border-rule border-t py-5 text-lg first:border-t-0 first:pt-0 sm:grid-cols-[15rem_1fr] sm:gap-8"
          key={item.title}
        >
          <dt className="font-medium">{item.title}</dt>
          <dd className="text-ink-soft">{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 border-rule border-b bg-paper">
        <div className={`${CONTAINER} flex h-16 items-center justify-between`}>
          <Link
            className="font-semibold text-[17px] tracking-[-0.01em]"
            href="/"
          >
            {SITE.name}
          </Link>
          <nav aria-label="Main" className="flex items-center gap-7">
            <ul className="hidden items-center gap-7 text-[15px] md:flex">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    className="text-ink-soft transition-colors duration-150 hover:text-ink"
                    href={item.href}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <PrimaryLink href={CONTACT.href}>{CONTACT.label}</PrimaryLink>
          </nav>
        </div>
      </header>

      <main>
        <section className={`${CONTAINER} pt-14 pb-12 lg:pt-12`}>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
            <h1 className="font-medium text-[clamp(2.5rem,5.4vw,4.5rem)] leading-[1.02] tracking-[-0.035em] lg:col-span-7">
              {HERO.headline}
            </h1>
            <div className="lg:col-span-5">
              <p className="max-w-[44ch] text-ink-soft text-lg leading-relaxed">
                {HERO.body}
              </p>
              <div className="mt-6 flex items-center gap-6">
                <PrimaryLink href={CONTACT.href}>{CONTACT.label}</PrimaryLink>
                <a
                  className="font-medium text-[15px] underline decoration-1 underline-offset-4"
                  href="#example"
                >
                  {HERO.secondary}
                </a>
              </div>
            </div>
          </div>
          <div className="mt-10 lg:mt-8" id="example">
            <MorningOpsFigure />
          </div>
        </section>

        <Section heading={WORK.heading} id="work">
          <p className="mb-8 max-w-[52ch] text-ink-soft text-lg">
            {WORK.intro}
          </p>
          <Rows items={WORK.items} />
        </Section>

        <Section heading={APPROACH.heading}>
          <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {APPROACH.items.map((item) => (
              <div key={item.title}>
                <h3 className="font-medium text-lg">{item.title}</h3>
                <p className="mt-2 text-ink-soft text-lg">{item.detail}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section heading={CONTROL.heading}>
          <div className="grid gap-10 sm:grid-cols-2 sm:gap-8">
            {CONTROL.items.map((item) => (
              <div key={item.title}>
                <h3 className="font-medium text-lg">{item.title}</h3>
                <p className="mt-2 text-ink-soft text-lg">{item.detail}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section heading={FOUNDER.heading} id="about">
          <p className="mb-10 max-w-[52ch] text-xl leading-relaxed">
            {FOUNDER.intro}
          </p>
          <dl>
            {FOUNDER.facts.map((fact) => (
              <div
                className="grid gap-1 border-rule border-t py-5 text-lg sm:grid-cols-[10rem_1fr] sm:gap-8"
                key={fact.label}
              >
                <dt className="text-ink-soft">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section heading={FAQ.heading} id="faq">
          <div>
            {FAQ.items.map((item) => (
              <details
                className="group border-rule border-t first:border-t-0"
                key={item.question}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-medium text-lg group-first:pt-0 [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <svg
                    aria-hidden="true"
                    className="size-4 shrink-0 transition-transform duration-200 ease-out group-open:rotate-45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 2v12M2 8h12" />
                  </svg>
                </summary>
                <p className="max-w-[60ch] pb-6 text-ink-soft text-lg">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Section>

        <section className="relative isolate border-rule border-t" id="book">
          <PaperGrain />
          <div className={`${CONTAINER} py-24 sm:py-32`}>
            <h2 className="max-w-[18ch] font-medium text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.05] tracking-[-0.03em]">
              {CLOSE.headline}
            </h2>
            <p className="mt-5 max-w-[48ch] text-ink-soft text-lg">
              {CLOSE.body}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              {SITE.bookingUrl ? (
                <PrimaryLink href={SITE.bookingUrl}>Book a call</PrimaryLink>
              ) : (
                <>
                  <PrimaryLink href={SITE.x.url}>Message us on X</PrimaryLink>
                  <p className="max-w-[44ch] text-ink-soft text-sm">
                    {CLOSE.pending}
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-rule border-t">
        <div
          className={`${CONTAINER} flex h-16 items-center justify-between text-ink-soft text-sm`}
        >
          <span>
            © {new Date().getFullYear()} {SITE.name}
          </span>
          <a
            className="underline decoration-1 underline-offset-4"
            href={SITE.x.url}
          >
            {SITE.x.handle}
          </a>
        </div>
      </footer>
    </>
  );
}
