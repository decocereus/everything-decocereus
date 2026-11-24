import Image from "next/image";
import Link from "next/link";
import type React from "react";
import clock from "@/assets/clock.png";
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
import { SITE } from "@/lib/site.ts";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  areaServed: ["US", "GB"],
  description: SITE.description,
  email: SITE.email,
  founder: { "@type": "Person", name: "Amartya Singh" },
  image: `${SITE.url}/opengraph-image`,
  name: SITE.name,
  sameAs: [SITE.x.url],
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

export default function Home() {
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
        <section>
          <div
            className={`${FRAME} grid gap-14 border-rule pt-16 pb-20 sm:pt-24 sm:pb-28 lg:grid-cols-12 lg:items-center lg:gap-10`}
          >
            <div className="lg:col-span-6">
              <h1 className="font-medium text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.98] tracking-[-0.045em]">
                {HERO.headline}
              </h1>
              <ul
                aria-label={HERO.choresLabel}
                className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[17px] text-ink-soft sm:text-lg"
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
              <p className="mt-7 max-w-[50ch] text-[17px] text-ink-soft leading-relaxed sm:text-lg">
                {HERO.body}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <BookLink />
                <a
                  className="font-medium text-[15px] underline decoration-1 decoration-ink/30 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-ink"
                  href="#offer"
                >
                  {HERO.secondary}
                </a>
              </div>
              <p className="mt-6 max-w-[50ch] text-[14px] text-muted leading-relaxed">
                {HERO.note}
              </p>
            </div>
            <div className="lg:col-span-6">
              <Image
                alt=""
                className="mx-auto h-auto w-full max-w-[520px] lg:max-w-none"
                fetchPriority="high"
                loading="eager"
                sizes="(min-width: 1024px) 560px, (min-width: 640px) 520px, 100vw"
                src={clock}
              />
            </div>
          </div>
        </section>

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
          <ol className="mt-14 grid border-rule border-t md:grid-cols-3">
            {PROBLEM.items.map((item, index) => (
              <li
                className="border-rule border-b py-8 last:border-b-0 md:border-b-0 md:border-l md:px-8 md:last:pr-0 md:first:border-l-0 md:first:pl-0"
                key={item.title}
              >
                <span className="font-mono text-[12px] text-muted tabular-nums">
                  {pad(index)}
                </span>
                <h3 className="mt-4 font-medium text-lg leading-snug tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[16px] text-ink-soft leading-relaxed">
                  {item.detail}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="offer">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <Label index={1}>{OFFER.label}</Label>
              <Heading>{OFFER.heading}</Heading>
              <p className="mt-6 max-w-[54ch] text-ink-soft text-lg leading-relaxed lg:text-xl">
                {OFFER.intro}
              </p>

              <h3 className="mt-14 font-mono text-[12px] text-muted uppercase tracking-[0.08em]">
                {OFFER.deliverablesHeading}
              </h3>
              <ol className="mt-4 border-rule border-t">
                {OFFER.deliverables.map((item, index) => (
                  <li
                    className="grid grid-cols-[2.5rem_1fr] border-rule border-b py-4 text-[16px] leading-relaxed sm:text-[17px]"
                    key={item}
                  >
                    <span className="pt-[0.2em] font-mono text-[12px] text-muted tabular-nums">
                      {pad(index)}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            <aside
              aria-label="Price and timeline"
              className="lg:col-span-5 lg:col-start-8"
            >
              <div className="rounded-xl border border-rule bg-surface p-6 shadow-[0_1px_2px_rgb(11_11_12/0.04),0_12px_32px_-16px_rgb(11_11_12/0.16)] sm:p-8 lg:sticky lg:top-24">
                <p className="font-mono text-[12px] text-muted uppercase tracking-[0.08em]">
                  Fixed price
                </p>
                <p className="mt-4 font-medium text-[2.75rem] tabular-nums leading-none tracking-[-0.04em]">
                  {OFFER.price.amount}
                </p>
                <p className="mt-3 text-ink-soft">{OFFER.price.after}</p>

                <dl className="mt-7 grid gap-px overflow-hidden rounded-lg border border-rule bg-rule sm:grid-cols-2">
                  {OFFER.specs.map((spec) => (
                    <div className="bg-surface p-4" key={spec.label}>
                      <dt className="font-mono text-[11px] text-muted uppercase tracking-[0.08em]">
                        {spec.label}
                      </dt>
                      <dd className="mt-2 font-medium tracking-[-0.01em]">
                        {spec.value}
                      </dd>
                      <dd className="mt-1 text-[13px] text-ink-soft leading-snug">
                        {spec.detail}
                      </dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-7 space-y-3 text-[15px] text-ink-soft leading-relaxed">
                  {OFFER.price.terms.map((term) => (
                    <li
                      className="grid grid-cols-[1.25rem_1fr] gap-2"
                      key={term}
                    >
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

                <BookLink className="mt-8 w-full" />
              </div>
            </aside>
          </div>
        </Section>

        <Section id="process">
          <Label index={2}>{PROCESS.label}</Label>
          <Heading>{PROCESS.heading}</Heading>
          <ol className="mt-14 grid gap-0 lg:grid-cols-4 lg:gap-10">
            {PROCESS.steps.map((step, index) => (
              <li
                className="relative border-ink/15 border-l pb-10 pl-7 last:pb-0 lg:border-t lg:border-l-0 lg:pt-8 lg:pb-0 lg:pl-0"
                key={step.title}
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-0 -left-[5px] size-[9px] rounded-full border-[1.5px] lg:-top-[5px] lg:left-0 ${index === 0 ? "border-accent bg-accent" : "border-ink/40 bg-paper"}`}
                />
                <p className="font-mono text-[12px] text-muted uppercase tracking-[0.08em]">
                  <span className="tabular-nums">{pad(index)}</span>
                  <span className="mx-2">·</span>
                  {step.length}
                </p>
                <h3 className="mt-3 font-medium text-xl tracking-[-0.015em]">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-[48ch] text-[16px] text-ink-soft leading-relaxed">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-16 max-w-[68ch] border-rule border-t pt-6 text-[16px] text-ink-soft leading-relaxed">
            {PROCESS.more}
          </p>
        </Section>

        <Section id="about">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Label index={3}>{ABOUT.label}</Label>
              <Heading>{ABOUT.heading}</Heading>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <p className="max-w-[46ch] text-xl leading-relaxed sm:text-2xl sm:leading-snug sm:tracking-[-0.01em]">
                {ABOUT.intro}
              </p>
              <dl className="mt-10 border-rule border-t">
                {ABOUT.facts.map((fact) => (
                  <div
                    className="grid gap-1 border-rule border-b py-5 sm:grid-cols-[9rem_1fr] sm:gap-6"
                    key={fact.label}
                  >
                    <dt className="pt-[0.2em] font-mono text-[12px] text-muted uppercase tracking-[0.08em]">
                      {fact.label}
                    </dt>
                    <dd className="text-[17px] leading-relaxed">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 max-w-[60ch] text-[15px] text-ink-soft leading-relaxed">
                {ABOUT.note}
              </p>
            </div>
          </div>
        </Section>

        <Section id="faq">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Label index={4}>{FAQ.label}</Label>
              <Heading>{FAQ.heading}</Heading>
            </div>
            <div className="border-rule border-t lg:col-span-7 lg:col-start-6">
              {FAQ.items.map((item) => (
                <details
                  className="group border-rule border-b"
                  key={item.question}
                >
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
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Section>

        <section className="bg-ink text-paper" id="book">
          <div
            className={`${FRAME} border-paper/10 py-24 sm:py-32 lg:grid lg:grid-cols-12 lg:items-end lg:gap-10`}
          >
            <div className="lg:col-span-8">
              <Label index={5} tone="paper">
                Next step
              </Label>
              <h2 className="mt-5 max-w-[16ch] font-medium text-[clamp(2.5rem,6vw,4.5rem)] leading-[1] tracking-[-0.045em]">
                {keepTogether(CLOSE.headline)}
              </h2>
              <p className="mt-6 max-w-[46ch] text-lg text-paper/70 leading-relaxed">
                {CLOSE.body}
              </p>
            </div>
            <div className="mt-10 lg:col-span-4 lg:mt-0 lg:justify-self-end">
              <BookLink tone="paper" />
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
