# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Founders and ops leads at funded startups and mid-size companies in the US and UK. Their teams already use AI tools, but they still lose hours every week to manual operational work (status updates, handoffs, reports, follow-ups) or to AI tools that don't fit how the work runs. They are deciding whether a paid audit from an independent engineer is worth USD 999-1,500. Most arrive from an outbound DM, so the page has to earn trust quickly.

## Product purpose

We give companies their time back. The offer starts with a paid audit of how one team actually works, then builds only what will stick.

The offer, in order:

1. **Intro call.** Free, 15 minutes. If the visitor already knows exactly what to build, we skip the audit and quote the build.
2. **AI Opportunity Audit (the main path).** 7-10 days from kickoff to walkthrough, and about 4-6 hours of the client team's time. It includes a kickoff and 3-5 interviews, a workflow map, ranked opportunities labeled Adopt, Automate or Build (including what to skip), cost, timeline and payback estimates for the top three, a live test of the top opportunity on real examples, a 90-day plan, a written report and a recorded 45-60 minute walkthrough.
   - Price: USD 999 for the first two teams, then USD 1,500.
   - The fee is credited in full toward a build started within 60 days.
   - If the audit finds nothing worth more than its fee, the fee is refunded. The report is the client's either way.
3. **Build.** Usually 2-4 weeks. The first workflow, built in the tools the client already uses. Fixed price, quoted after the audit.
4. **Retainer.** Monthly. Keep the system running, make small improvements, and take on the next workflow. Quoted after the build.

Side work, quoted separately: internal tools, and fixing vibe-coded software so it is stable enough for production. The audit stays the usual starting point.

Success for the site is a booked 15-minute call at https://cal.com/decocereus/intro.

## Positioning

- Time back is the outcome. AI is the means, not the headline.
- Diagnosis before building. A ranked plan with written assumptions and a live test comes before any build. The plan includes what to skip.
- Founder-led. The person on the call does the work, with no hand-off to sales.
- The client owns everything: the report, the accounts, the setup and the data.

## Voice

- US English, plain words, no hype. No "AI-native", "leverage", "transform" or "unlock".
- Use "we" for the work. "I" belongs in About. The approved hero, process and FAQ copy also uses "I" where Amartya speaks directly, and that copy stays as written.
- Short and specific. If a busy ops lead has to reread a line, rewrite it.

## Pricing rules

- Show the audit price (USD 999 for the first two teams, then USD 1,500), the 60-day credit and the refund rule.
- Never show build or retainer price ranges. Say "fixed price, quoted after the audit" (build) and "quoted after the build" (retainer).
- The old offer is retired. That means no free 30-minute intro, no "10+ hours or it's free" guarantee, and no pitch to trades or owner-run small businesses. Don't bring any of it back.

## Capabilities and constraints

- Hosted at agents.decocereus.com as `apps/agency` in the everything-decocereus monorepo (Next.js App Router, Vercel project `decocereus-agents`).
- The brand name is temporary. It lives in one place, `SITE.name` in `src/lib/site.ts`, and the page, metadata and share images all read it.
- All copy lives in `src/lib/content.ts` and `src/lib/site.ts`.
- Nav: Offer, Process, About, FAQ. Every button reads "Book a 15-minute call" and books the intro call.
- Contact appears only in the footer: amartya@decocereus.com and @decocereus on X.
- Calls run in UK hours and US Eastern hours. Delivery is remote. Do not say where the team is based.
- Customer-facing messages go out only on wording the client approved. Standard messages are signed off once, and everything else waits for their OK.
- Client data is never used to train AI models. Access stays at what the work needs.

## Brand commitments

- Founder: Amartya Singh. Lead with Amadeus (London). Never name Avail, and never imply he is currently employed anywhere.
- Calm, premium, technical, with a little boldness. See `DESIGN.md`.
- One accent color (signal orange). No emoji, no stock or AI-gradient look, no fake logos.

## Evidence on hand

These founder facts are real and verifiable. They come from `docs/about-amartya.md` at the repository root:

- Started as an engineer at Amadeus in London, on an airport-operations app used by 20+ airlines.
- Built systems that have handled $2.3M+ in transactions, with failures cut from 19% to 3%. This is the wording Amartya approved. Leave out dates and the words "trading" and "crypto".
- Built developer tools that have been downloaded 60,000+ times.
- Studied Computer Science at King's College London.

There are no agency clients, case studies, testimonials, logos or results yet. Never invent any. Until there is a published client result, the audit's live test on the client's own examples stands in for proof, and the site says so. The hero shows no hours saved or other numbers, only the chores that get struck through.

## Product principles

1. Plain words over impressive ones.
2. Name the work that disappears, not the model or the tool.
3. Every claim is true and sourced. Examples are labeled as examples.
4. People approve what reaches their customers.
5. Founder-led trust and the live test stand in for social proof until real results exist.
