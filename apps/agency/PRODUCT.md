# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Anyone who wants AI working in their day-to-day operations: enterprises, small businesses, and creators. They are busy, they have repetitive work that eats their week, and they are not necessarily technical. They come to the site deciding whether this team can take real work off their plate and whether a call is worth their time.

## Product Purpose

An AI consultancy. It helps people save time and automate more of their business by putting AI agents and automations to work in their daily operations: finding where time goes, building the agents and automations that take it back, and showing the hours saved.

Success for the site is a booked call.

## Positioning

- Outcomes over technology. The value is time given back and work that runs without the owner.
- The client stays in control. Agents draft and queue; people approve what reaches customers.
- Founder-led. The person on the call is the engineer who builds the system.

## Operating Context

The flagship illustration is the **Morning Ops Report**. Before the client starts the day, agents have reviewed yesterday's calls into notes, reconciled the books against the job or sales system, drafted the day's invoices, and queued anything that needs approval. It is always presented as an illustrative example of what we build, never as a past client result.

Delivery is remote.

## Capabilities and Constraints

- Hosted at agents.decocereus.com, as `apps/agency` in the everything-decocereus monorepo (Next.js App Router).
- The site speaks in "we". Copy is US English, plain and confident, with no jargon and nothing that sounds like crypto hype.
- The offer is undecided. Earlier drafts used an Audit, Build, Retainer ladder; do not present packages, steps, or pricing as fixed until confirmed.
- Undecided: the name (placeholder "Agency", kept in `src/lib/site.ts`), pricing (not shown), the booking link (likely Cal.com), the contact address (amartya@decocereus.com, not yet provisioned).
- Do not mention where the team is based or the hours it works.

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

There are no agency clients, testimonials, case studies, logos or results yet. Never invent any.

## Product Principles

1. Plain words. If a busy visitor has to reread a line, rewrite it.
2. Show the work, not the technology. Name the work that disappears, not the model or the tool.
3. People approve what reaches their customers, and the site says so.
4. Every claim is true and sourced. Examples are labelled as examples.
5. Founder-led trust stands in for social proof until real results exist.
