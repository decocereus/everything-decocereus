---
name: decocereus agents
description: A technical spec sheet for a paid AI audit. Warm paper, near-black ink, hairline frame, one signal orange.
colors:
  paper: "#fbfbf9"
  surface: "#ffffff"
  ink: "#0b0b0c"
  ink-soft: "#4a4a50"
  muted: "#6b6b70"
  rule: "rgb(11 11 12 / 0.1)"
  accent: "#e8590c"
  accent-ink: "#b3420a"
  accent-tint: "#fdf1ea"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 5.25rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.045em"
  close:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  lead:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16-18px"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
    letterSpacing: "0.08em"
    textTransform: "uppercase"
rounded:
  block: "4px"
  button: "8px"
  card: "12px"
spacing:
  gutter-mobile: "20px"
  gutter-desktop: "40px"
  section-mobile: "80px"
  section-desktop: "112px"
  container: "1200px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.button}"
    height: "44px"
    padding: "0 20px"
  button-header:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.button}"
    height: "36px"
  button-on-ink:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    border: "1px {colors.rule}"
---

# Design System: decocereus agents

## Overview

**North star: "The spec sheet."** The site sells a fixed-price audit to founders and ops leads at funded startups and mid-size companies. It should read like a precise technical document from a serious engineering shop: calm, exact, and a little bold. The references are Linear, Vercel, Stripe and Anthropic. It does not copy any of them.

**Key characteristics:**
- Warm paper ground, near-black ink, and one signal orange used sparingly.
- Geist for all reading text. Geist Mono only for small uppercase labels and numbers.
- A visible page frame. From 1024px up, the 1200px column has hairline sides, and full-bleed hairlines divide the sections.
- White cards appear twice: the hero week and the offer's price panel. Everything else sits flat on paper.
- One motif, the week. The core idea is giving companies their time back, and the hero figure shows that idea as a calendar.

This replaces the October 2026 "Machine Catalogue" system (black and white, isometric anatomy plates, Paper Shaders grain). That system and its Morning Ops figure were removed with the move to the audit offer. Do not bring them back.

## Colors

All tokens live in `src/app/globals.css` under `@theme`.

- **Paper** `#fbfbf9`: the page ground and the sticky header (at 90% with a blur).
- **Surface** `#ffffff`: the two cards (hero week, offer panel).
- **Ink** `#0b0b0c`: headings, body text, the primary button, the closing band.
- **Ink soft** `#4a4a50`: supporting text, such as intros, details, FAQ answers and nav links at rest.
- **Muted** `#6b6b70`: mono labels, step numbers and axis text. It is about 5:1 on paper, so it is fine for small text but never for paragraphs.
- **Rule** `rgb(11 11 12 / 0.1)`: every hairline, including the page frame.
- **Accent** `#e8590c`: the signal orange. It is used only for the small square before each section label, the first process marker, the check marks in the price panel, the "time back" outlines in the week, and the focus ring. It is about 3.6:1 on paper, so it is for marks, not text.
- **Accent ink** `#b3420a` on **accent tint** `#fdf1ea`: the only orange text, the "Time back" labels inside the week.

### Rules
**One accent.** Orange is the only hue. Do not add a second color, gradients or tinted section backgrounds. The closing band is the one inverted surface (ink ground, paper text).

**Orange means "time back" or "start here".** If a new use of orange doesn't mean one of those, use ink.

## Typography

- **Display** (Geist 500, `clamp(2.75rem, 7vw, 5.25rem)`, 0.98, -0.045em): the hero headline only.
- **Close** (Geist 500, `clamp(2.5rem, 6vw, 4.5rem)`, -0.045em): the closing band headline. `keepTogether()` in `page.tsx` stops it breaking at the hyphen in "15-minute".
- **Headline** (Geist 500, `clamp(2rem, 4vw, 3rem)`, -0.035em): section headings.
- **Lead** (20px): section intros and the About intro (24px from 640px).
- **Body** (16-18px, relaxed): everything else. Measures stay between 36ch and 68ch.
- **Label** (Geist Mono 12px, uppercase, 0.08em): section labels (`■ 02 OFFER`), step durations, spec labels and fact labels. Numbers use tabular figures.

**Weight 500 rule.** Headings are weight 500. The wordmark is the only text at 600.

**Mono is metadata.** Geist Mono marks labels, indices, durations and axes. Sentences are never set in mono.

## Layout

- One 1200px column (`FRAME` in `page.tsx`): 20px gutters on mobile, 40px from 640px, hairline sides from 1024px.
- Sections have 80px vertical padding, 112px from 640px, and a full-bleed hairline on top.
- Every section opens with the same head: a mono label with an orange square and a two-digit index, then the headline.
- The section order is Hero, 01 Problem, 02 Offer (`#offer`), 03 Process (`#process`), 04 About (`#about`), 05 FAQ (`#faq`), then 06 the closing band (`#book`), then the footer.
- Desktop grids use 12 columns with 40px gaps. Most sections put the head in 4-5 columns and the content in 7. Everything stacks below 1024px.
- **Problem**: three ruled columns from 768px, stacked rows below.
- **Offer**: the deliverables list (numbered, ruled rows) takes 7 columns. The price panel takes 5 and is sticky at `top-24` on desktop. Below 1024px the panel follows the list.
- **Process**: a four-step track. From 1024px it is horizontal with a top rule and markers. Below that it is vertical with a left rule. The first marker is solid orange and the rest are hollow.
- **Header**: 64px and sticky. Nav links hide below 768px, leaving the wordmark and the "Book a 15-minute call" button, which fits at 360px.

## Components

- **Primary button**: ink fill, paper text, 44px tall, 8px radius, 15px medium text, a trailing arrow. On hover the fill drops to 85% ink over 150ms. On press it scales to 0.97. On the ink band it inverts to paper with ink text. Every button books the call at `SITE.bookingUrl`.
- **Secondary link**: underlined in 30% ink, which darkens to full ink on hover. Only "See the offer" in the hero uses it.
- **Card**: white surface, 1px rule border, 12px radius, and one soft shadow (`0 1px 2px` plus a `0 12px 32px -16px` drop). Only the hero week and the price panel use it.
- **Ruled rows**: numbered deliverables, founder facts and FAQ items all use hairline rows with a mono label column.
- **FAQ**: native `details`/`summary`. A 16px plus rotates 45° to an × over 200ms.
- **Focus**: a 2px orange outline, offset 3px, on every interactive element.

## The week (signature figure)

`src/components/week.tsx` and the `.hatch`, `.week-work` and `.week-back` rules in `globals.css`.

- A Monday-to-Friday calendar from 9 to 17, built with CSS grid and subgrid. It uses no images, no JS and no library. The data is `WEEK` in `src/lib/content.ts`.
- There are two kinds of block. **Other work** is a flat grey block, such as meetings and calls. **Manual work** is a hatched white block with a label, such as updates, reports, handoffs and follow-ups.
- On load, each manual block clears (opacity and scale) and an orange-outlined "Time back" block fades in, one after another starting at 0.9s. It runs once. Under `prefers-reduced-motion` it is a plain crossfade with no scale.
- It is labeled "One week, illustrative" and carries no numbers. It must never show hours saved or any other metric until there is a real client result.
- It is decorative (`aria-hidden`). The headline and copy carry the meaning.

## Share images

`src/app/opengraph-image.tsx` renders the 1200×630 card at build time with `next/og`, using Geist from the `geist` package. `twitter-image.tsx` reuses it. The card has one job: someone who gets the link should know what we do from the thumbnail alone. It is the one dark surface outside the closing band:

- The wordmark is top left and the domain top right.
- The offer name ("AI Opportunity Audit") is an orange pill.
- The hero line is set at 104px.
- Three numbered steps run along the bottom (`SHARE_STEPS` in `content.ts`): audit how you work, find where AI fits, build what sticks.

It reads `SITE.name`, `SITE.title`, `SITE.url`, `HERO.headline` and `SHARE_STEPS`, so a rename or copy change updates the card and its alt text. Keep every line legible when the card is shrunk to 400px wide. Don't put small figures or illustrations on it.

## Motion

- Motion is subtle and has a purpose. There are four kinds: the week reveal, button press, link and nav color changes, and the FAQ plus.
- Easing is `--ease-out-strong` (`cubic-bezier(0.23, 1, 0.32, 1)`) for the reveal and `ease-out` for UI. Only transform, opacity and color animate.
- Smooth anchor scrolling is on, except under reduced motion.

## Do's and don'ts

**Do**
- Keep orange for "time back" and "start here".
- Use mono labels and indices for structure, and Geist for sentences.
- Keep the page frame and full-bleed section rules.
- Label every example as illustrative.

**Don't**
- Add a second accent, gradients, glows, emoji, stock imagery, fake logos or testimonials.
- Add cards beyond the two that exist. A new block gets a ruled row.
- Bring back the isometric plates, Paper Shaders or any heavy client-side library. The page ships no client JS of its own.
- Show prices for builds or retainers. Only the audit price appears.
