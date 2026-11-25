import Link from "next/link";
import type React from "react";
import { AutomateFigure } from "@/components/figures/automate/figure.tsx";
import { ClockFigure } from "@/components/figures/clock/figure.tsx";
import { OFFER_PREVIEWS } from "@/components/offer-previews.tsx";
import { OfferTabs } from "@/components/offer-tabs.tsx";
import { ProcessTrack } from "@/components/process-track.tsx";
import {
  ABOUT,
  CLOSE,
  CTA,
  FAQ,
  HERO,
  NAV,
  OFFER,
  PROBLEM,
  PROCESS,
} from "@/lib/content.ts";
import { getAuditPrice, withPrice } from "@/lib/price.ts";
import { SITE } from "@/lib/site.ts";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  areaServed: ["US", "GB"],
  description: SITE.description,
  email: SITE.email,
  founder: {
    "@type": "Person",
    name: ABOUT.heading,
    sameAs: ABOUT.links.map((link) => link.href),
  },
  image: `${SITE.url}/opengraph-image`,
  name: SITE.name,
  sameAs: ABOUT.links.map((link) => link.href),
  url: SITE.url,
};

/** The page frame: one 1200px column with hairline sides from desktop up. */
const FRAME = "mx-auto w-full max-w-[1200px] px-5 sm:px-10 lg:border-x";
const pad = (index: number) => String(index + 1).padStart(2, "0");

const HYPHENATED = /(\S+-\S+)/;

/** Stops a display line from breaking at the hyphen in "15-minute". */
const keepTogether = (text: string) =>
  text.split(HYPHENATED).map((part, index) =>
    index % 2 === 1 ? (
      <span className="whitespace-nowrap" key={part}>
        {part}
      </span>
    ) : (
      part
    )
  );

function BookLink({
  className = "",
  tone = "ink",
}: Readonly<{ className?: string; tone?: "ink" | "paper" }>) {
  const colors =
    tone === "ink"
      ? "bg-ink text-paper hover:bg-ink/85"
      : "bg-paper text-ink hover:bg-paper/85";
  return (
    <a
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 font-medium text-[15px] transition-[background-color,scale] duration-150 ease-out active:scale-[0.97] ${colors} ${className}`}
      href={SITE.bookingUrl}
    >
      {CTA}
      <Arrow />
    </a>
  );
}

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 14 14"
    >
      <path d="M2 7h10M8 3l4 4-4 4" />
    </svg>
  );
}

/** A small mono label above a section heading, such as "02 Offer". */
function Label({
  children,
  index,
  tone = "ink",
}: Readonly<{
  children: React.ReactNode;
  index: number;
  tone?: "ink" | "paper";
}>) {
  return (
    <p
      className={`flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.08em] ${tone === "ink" ? "text-muted" : "text-paper/60"}`}
    >
      <span className="size-1.5 bg-accent" />
      <span className="tabular-nums">{pad(index)}</span>
      <span>{children}</span>
    </p>
  );
}

function Heading({
  children,
  className = "",
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <h2
      className={`mt-5 font-medium text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.035em] ${className}`}
    >
      {children}
    </h2>
  );
}

function Section({
  children,
  className = "",
  id,
}: Readonly<{ children: React.ReactNode; className?: string; id?: string }>) {
  return (
    <section className={`border-rule border-t ${className}`} id={id}>
      <div className={`${FRAME} border-rule py-20 sm:py-28`}>{children}</div>
    </section>
  );
}

function Hero() {
  return (
    <section>
      <div
        className={`${FRAME} grid gap-6 border-rule pt-14 pb-10 sm:gap-10 sm:pt-24 sm:pb-24 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-28`}
      >
        <div className="lg:col-span-6">
          <h1 className="font-medium text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.98] tracking-[-0.045em]">
            {HERO.headline}
          </h1>
          <p className="mt-6 max-w-[42ch] text-ink-soft text-lg leading-relaxed sm:text-xl">
            {HERO.lead}
          </p>
          <div className="mt-7">
            <p className="font-mono text-[12px] text-muted uppercase tracking-[0.08em]">
              {HERO.choresLabel}
            </p>
            <ul
              aria-label={HERO.choresLabel}
              className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[17px] text-ink-soft sm:text-lg"
            >
              {HERO.chores.map((chore, index) => (
                <li
                  className="struck"
                  key={chore}
                  style={{ "--i": index } as React.CSSProperties}
                >
                  {chore}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-8 max-w-[40ch] border-accent border-l-2 pl-4 font-medium text-[18px] leading-snug tracking-[-0.01em] sm:text-[20px]">
            {HERO.promise}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <BookLink />
            <a
              className="font-medium text-[15px] underline decoration-1 decoration-ink/30 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-ink"
              href="#offer"
            >
              {HERO.secondary}
            </a>
          </div>
        </div>
        <div className="lg:col-span-6">
          <ClockFigure className="mx-auto w-full max-w-[520px] lg:max-w-none" />
        </div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <Section id="problem">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Label index={0}>{PROBLEM.label}</Label>
          <Heading>{PROBLEM.heading}</Heading>
        </div>
        <p className="max-w-[36ch] text-ink-soft text-lg leading-relaxed lg:col-span-6 lg:col-start-7 lg:self-end lg:text-xl">
          {PROBLEM.intro}
        </p>
      </div>
      <AutomateFigure className="mt-14" />
      <ol className="mt-14">
        {PROBLEM.items.map((item, index) => (
          <li
            className="reveal group grid gap-3 border-rule border-t py-8 sm:py-10 lg:grid-cols-12 lg:gap-10"
            key={item.title}
          >
            <div className="flex gap-5 sm:gap-8 lg:col-span-7">
              <span className="pt-[0.6em] font-mono text-[12px] text-muted tabular-nums transition-colors duration-200 group-hover:text-accent">
                {pad(index)}
              </span>
              <h3 className="max-w-[22ch] font-medium text-[clamp(1.5rem,3vw,2.125rem)] leading-[1.12] tracking-[-0.03em]">
                {item.title}
              </h3>
            </div>
            <p className="max-w-[46ch] pl-[2.6rem] text-[17px] text-ink-soft leading-relaxed sm:pl-[3.35rem] lg:col-span-5 lg:pt-1.5 lg:pl-0">
              {item.detail}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Offer({ price }: Readonly<{ price: string }>) {
  return (
    <Section id="offer">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col lg:col-span-7">
          <Label index={1}>{OFFER.label}</Label>
          <Heading>{OFFER.heading}</Heading>
          <p className="mt-6 max-w-[50ch] text-ink-soft text-lg leading-relaxed lg:text-xl">
            {OFFER.intro}
          </p>
          <dl className="mt-10 grid grid-cols-2 border-rule border-y lg:mt-auto">
            {OFFER.specs.map((spec, index) => (
              <div
                className={`py-5 ${index ? "border-rule border-l pl-5 sm:pl-7" : "pr-5"}`}
                key={spec.label}
              >
                <dt className="font-mono text-[12px] text-muted uppercase tracking-[0.08em]">
                  {spec.label}
                </dt>
                <dd className="mt-2 font-medium text-[clamp(1.25rem,2.4vw,1.625rem)] tracking-[-0.02em]">
                  {spec.value}
                </dd>
                <dd className="mt-1 text-[14px] text-ink-soft">
                  {spec.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <aside
          aria-label={OFFER.price.label}
          className="lg:col-span-5 lg:col-start-8"
        >
          <div className="flex h-full flex-col rounded-xl bg-ink p-6 text-paper sm:p-8">
            <p className="font-mono text-[12px] text-paper/60 uppercase tracking-[0.08em]">
              {OFFER.price.label}
            </p>
            <p className="mt-3 font-medium text-[clamp(3rem,6vw,4.25rem)] tabular-nums leading-none tracking-[-0.045em]">
              {price}
            </p>
            <ul className="mt-7 mb-8 space-y-3 text-[15px] text-paper/75 leading-relaxed">
              {OFFER.price.terms.map((term) => (
                <li className="grid grid-cols-[1.25rem_1fr] gap-2" key={term}>
                  <svg
                    aria-hidden="true"
                    className="mt-[0.3em] size-4 text-accent"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 8.5l3 3 7-7" />
                  </svg>
                  {term}
                </li>
              ))}
            </ul>
            <BookLink className="mt-8 w-full lg:mt-auto" tone="paper" />
            <p className="mt-3 text-center text-[13px] text-paper/60">
              {OFFER.price.capacity}
            </p>
          </div>
        </aside>
      </div>

      <h3 className="mt-20 mb-6 font-medium text-[clamp(1.5rem,3vw,2rem)] tracking-[-0.03em] sm:mt-24">
        {OFFER.deliverablesHeading}
      </h3>
      <OfferTabs previews={OFFER_PREVIEWS} />
    </Section>
  );
}

function Process() {
  return (
    <Section id="process">
      <Label index={2}>{PROCESS.label}</Label>
      <Heading>{PROCESS.heading}</Heading>
      <ProcessTrack />
      <div className="reveal mt-16 grid gap-6 rounded-xl bg-ink/[0.035] p-6 sm:p-10 lg:grid-cols-12 lg:items-end lg:gap-10">
        <p className="max-w-[30ch] font-medium text-[clamp(1.5rem,3vw,2.125rem)] leading-[1.15] tracking-[-0.03em] lg:col-span-8">
          {PROCESS.more.lead}
        </p>
        <p className="max-w-[34ch] text-ink-soft text-lg leading-relaxed lg:col-span-4">
          {PROCESS.more.body}
        </p>
      </div>
    </Section>
  );
}

function About() {
  return (
    <Section id="about">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Label index={3}>{ABOUT.label}</Label>
          <Heading>{ABOUT.heading}</Heading>
          <p className="mt-6 text-[15px] text-ink-soft">{ABOUT.studied}</p>
        </div>
        <div className="lg:col-span-7">
          <p className="max-w-[30ch] font-medium text-[clamp(1.5rem,3vw,2.125rem)] leading-[1.15] tracking-[-0.03em]">
            {ABOUT.intro}
          </p>
          <nav
            aria-label={ABOUT.linksLabel}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px]"
          >
            <span className="font-mono text-[12px] text-muted uppercase tracking-[0.08em]">
              {ABOUT.linksLabel}
            </span>
            {ABOUT.links.map((link) => (
              <a
                className="group inline-flex items-center gap-1 font-medium underline decoration-ink/30 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-ink"
                href={link.href}
                key={link.href}
                rel="noopener"
                target="_blank"
              >
                {link.label}
                <svg
                  aria-hidden="true"
                  className="size-3 text-muted transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 12 12"
                >
                  <path d="M3.5 8.5l5-5M4.5 3.5h4v4" />
                </svg>
              </a>
            ))}
          </nav>
        </div>
      </div>

      <dl className="mt-16 grid grid-cols-2 border-rule border-t lg:grid-cols-4">
        {ABOUT.stats.map((stat, index) => (
          <div
            className={`reveal border-rule border-b py-8 pr-4 lg:border-b-0 lg:px-8 lg:first:pl-0 ${index % 2 ? "border-l pl-4 sm:pl-6" : ""} ${index ? "lg:border-l" : ""}`}
            key={stat.value}
          >
            <dt className="sr-only">{stat.label}</dt>
            <dd className="font-medium text-[clamp(2.25rem,5vw,3.5rem)] tabular-nums leading-none tracking-[-0.045em]">
              {stat.value}
            </dd>
            <dd className="mt-4 max-w-[26ch] text-[15px] text-ink-soft leading-snug">
              {stat.label}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-16">
        <h3 className="font-mono text-[12px] text-muted uppercase tracking-[0.08em]">
          {ABOUT.rulesLabel}
        </h3>
        <ul className="mt-4 grid border-rule border-t sm:grid-cols-2">
          {ABOUT.rules.map((rule) => (
            <li
              className="reveal grid grid-cols-[1.75rem_1fr] border-rule border-b py-5 text-[17px] leading-relaxed sm:pr-8 sm:even:border-l sm:even:pl-8"
              key={rule}
            >
              <svg
                aria-hidden="true"
                className="mt-[0.35em] size-4 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                viewBox="0 0 16 16"
              >
                <path d="M3 8.5l3 3 7-7" />
              </svg>
              {rule}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[60ch] text-[15px] text-ink-soft leading-relaxed">
          {ABOUT.note}
        </p>
      </div>
    </Section>
  );
}

function Faq({ price }: Readonly<{ price: string }>) {
  return (
    <Section id="faq">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <Label index={4}>{FAQ.label}</Label>
          <Heading>{FAQ.heading}</Heading>
          <div className="mt-8 hidden flex-col items-start gap-4 lg:flex">
            <BookLink />
            <a
              className="text-[15px] text-ink-soft underline decoration-ink/30 underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-ink hover:decoration-ink"
              href={`mailto:${SITE.email}`}
            >
              {SITE.email}
            </a>
          </div>
        </div>
        <div className="border-rule border-t lg:col-span-7 lg:col-start-6">
          {FAQ.items.map((item) => (
            <details className="group border-rule border-b" key={item.question}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-medium text-[17px] tracking-[-0.01em] transition-colors duration-150 hover:text-ink-soft [&::-webkit-details-marker]:hidden">
                {item.question}
                <svg
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted transition-transform duration-200 ease-out group-open:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 2v12M2 8h12" />
                </svg>
              </summary>
              <p className="max-w-[60ch] pb-6 text-[16px] text-ink-soft leading-relaxed">
                {withPrice(item.answer, price)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default async function Home() {
  const price = await getAuditPrice();
  return (
    <>
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD from static constants, escaped as the Next.js guide shows.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <header className="sticky top-0 z-10 border-rule border-b bg-paper/90 backdrop-blur-md">
        <div
          className={`${FRAME} flex h-16 items-center justify-between gap-4 border-rule`}
        >
          <Link
            className="font-semibold text-[16px] tracking-[-0.02em] sm:text-[17px]"
            href="/"
          >
            {SITE.name}
          </Link>
          <nav aria-label="Main" className="flex items-center gap-8">
            <ul className="hidden items-center gap-7 text-[14px] md:flex">
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
            <a
              className="inline-flex h-9 items-center rounded-lg bg-ink px-3.5 font-medium text-[13px] text-paper transition-[background-color,scale] duration-150 ease-out hover:bg-ink/85 active:scale-[0.97] sm:px-4 sm:text-[14px]"
              href={SITE.bookingUrl}
            >
              {CTA}
            </a>
          </nav>
        </div>
      </header>

      <main>
        <Hero />
        <Problem />
        <Offer price={price} />
        <Process />
        <About />
        <Faq price={price} />

        <section className="bg-ink text-paper" id="book">
          <div className={`${FRAME} border-paper/10 py-24 sm:py-32`}>
            <div>
              <Label index={5} tone="paper">
                Next step
              </Label>
              <h2 className="mt-5 max-w-[16ch] font-medium text-[clamp(2.5rem,7vw,5.25rem)] leading-[1] tracking-[-0.045em]">
                {keepTogether(CLOSE.headline)}
              </h2>
              <p className="mt-6 max-w-[46ch] text-lg text-paper/70 leading-relaxed">
                {CLOSE.body}
              </p>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              <BookLink tone="paper" />
              <a
                className="text-[15px] text-paper/70 underline decoration-paper/30 underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-paper hover:decoration-paper"
                href={`mailto:${SITE.email}`}
              >
                {SITE.email}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-rule border-t">
        <div
          className={`${FRAME} flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-rule py-6 text-[14px] text-ink-soft`}
        >
          <span className="font-semibold text-ink tracking-[-0.02em]">
            {SITE.name}
          </span>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-1">
            {NAV.map((item) => (
              <a
                className="transition-colors duration-150 hover:text-ink"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <a
              className="underline decoration-ink/30 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-ink"
              href={`mailto:${SITE.email}`}
            >
              {SITE.email}
            </a>
            <span aria-hidden="true">·</span>
            <a
              className="underline decoration-ink/30 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-ink"
              href={SITE.x.url}
            >
              {SITE.x.handle} on X
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
