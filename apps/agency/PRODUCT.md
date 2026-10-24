# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Owner-run businesses with 5 to 50 people in the US and UK: trades, home services, auto shops, clinics and agencies. The owner is busy, not technical, and loses hours a week to busywork and leads to missed calls. They buy hours back and fewer dropped leads, not "AI transformation". They come to the site deciding whether a free intro call is worth their time.

## Product Purpose

We find the hours an owner-run business loses to busywork, then build AI agents that do that work.

The offer:

1. **Intro call.** Free, 30 minutes.
2. **Audit (main path).** Two weeks. We map how their week runs and hand over a ranked list of the tasks that cost the most hours and what fixing each is worth. Guarantee: if it doesn't find 10+ hours a week, the audit is free; if it does and they go ahead, the audit fee comes off the build.
3. **Build.** Two to four weeks. The top two or three agents, on the tools they already use.
4. **Retainer.** Monthly. We keep the agents running, add new ones, and send a weekly hours-saved report.

Secondary path: consulting for teams already using AI tools (ChatGPT, Claude, Zapier, n8n) that aren't getting results. We review the setup and fix it.

Every step is a fixed price, quoted after the intro call. Prices are never shown on the site.

Success for the site is a booked intro call (https://cal.com/decocereus/intro).

## Positioning

- Outcomes over technology. The value is time given back and work that runs without the owner.
- The client stays in control. Agents draft and queue; people approve what reaches customers.
- Founder-led. The person on the call is the engineer who builds the system.

## Operating Context

The flagship illustration is the **Morning Ops Report**. Before the client starts the day, agents have reviewed yesterday's calls into notes, reconciled the books against the job or sales system, drafted the day's invoices, and queued anything that needs approval. It is always presented as an illustrative example of what we build, never as a past client result.

Delivery is remote.

## Capabilities and Constraints

- Hosted at agents.decocereus.com, as `apps/agency` in the everything-decocereus monorepo (Next.js App Router).
- The site speaks in "we", and "I" only in the founder section. Copy is US English, plain, short and specific, written for a busy owner. No hype, no "AI-native", no "leverage", nothing that sounds like crypto.
- The wordmark is "decocereus agents" until a name is chosen (`src/lib/site.ts`).
- Every call to action books the intro call. X (@decocereus) and amartya@decocereus.com appear only in the footer.
- Calls run in UK hours and US Eastern hours. Do not say where the team is based.
- Standard customer messages (such as the missed-call text) go out on wording the owner approved once; everything else waits for their OK.

## Brand Commitments

- Founder: Amartya Singh. Lead with Amadeus (London). Do not name Avail, and do not say the founder is currently employed anywhere. Products he built may be named and described.
- X: @decocereus.
- Black and white for v1. An accent colour may come later.
- Minimal: easy to read and digest, one idea at a time.
- Workflows are explained with detailed isometric drawings of real machines, made with the anatomy skill. Each one is a true breakdown of a workflow we build, starting with the Morning Ops Report.
- Shader effects use Paper Shaders (`@paper-design/shaders-react`).
- The site must not feel like a SaaS template, too techy for non-technical visitors, cheap or small-time, or playful and gimmicky.

## Evidence on Hand

Real, verifiable founder facts, sourced from `docs/about-amartya.md` at the repository root:

- Product engineer, 4+ years: Amadeus (London) and GAMP. Avail stays unnamed.
- BSc Computer Science, King's College London (2022).
- Built the Nexus SDK and UI packages, which have 60K+ npm downloads. The count includes later releases published by teammates.
- Primary technical owner (not sole author) of the coordination layer behind ShieldTX, which has processed $2.3M+ in executed volume, a lower bound. The accepted-open failure rate fell from 19% (July 2026) to 3% (September 2026). October was 8.7%, so always give the date range.

Examples on the site (busywork, audit findings) are labelled illustrative. There are no hour-saved figures to quote yet. There are no agency clients, testimonials, case studies, logos or results yet. Never invent any.

## Product Principles

1. Plain words. If a busy visitor has to reread a line, rewrite it.
2. Show the work, not the technology. Name the work that disappears, not the model or the tool.
3. People approve what reaches their customers, and the site says so.
4. Every claim is true and sourced. Examples are labelled as examples.
5. Founder-led trust stands in for social proof until real results exist.
