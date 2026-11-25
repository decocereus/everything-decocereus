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
- Few surfaces. The offer's price panel is the one ink card, the deliverable previews sit in one white frame, and everything else sits flat on paper or in ruled rows.
- One motif, time taken apart. The hero shows an exploded clock that runs, with the manual chores struck through in orange beside it. The Problem section shows one task taken apart and automated, with nothing else in the section but its head. Both are anatomy figures: isometric machines built from many small parts.
- The page moves. Figures run while on screen, the offer tours through its tabs on its own, and rows rise in as they scroll into view. All of it is calm, pauses offscreen, and stops under reduced motion.

The October 2026 "Machine Catalogue" system (black and white plates, Paper Shaders grain) and its Morning Ops figure are gone. Anatomy figures came back in November 2026 at the owner's request, in this light system with orange as the only accent.

## Colors

All tokens live in `src/app/globals.css` under `@theme`.

- **Paper** `#fbfbf9`: the page ground and the sticky header (at 90% with a blur).
- **Surface** `#ffffff`: the frame around the deliverable previews.
- **Ink** `#0b0b0c`: headings, body text, the primary button, the closing band.
- **Ink soft** `#4a4a50`: supporting text, such as intros, details, FAQ answers and nav links at rest.
- **Muted** `#6b6b70`: mono labels, step numbers and axis text. It is about 5:1 on paper, so it is fine for small text but never for paragraphs.
- **Rule** `rgb(11 11 12 / 0.1)`: every hairline, including the page frame.
- **Accent** `#e8590c`: the signal orange. It is used only for the small square before each section label, the first process marker and its stretch of the rail, the first audience rule, the check marks, the strikes through the hero chores and the regular price, the clock hands, the AI module in the automation figure, the active tab number, the handoff dots in the map preview, and the focus ring. It is about 3.6:1 on paper, so it is for marks, not text.
- **Accent ink** `#b3420a` and **accent tint** `#fdf1ea`: reserved. Nothing uses them today; reach for them only if orange text is ever needed.

### Rules
**One accent.** Orange is the only hue. Do not add a second color, gradients or tinted section backgrounds. The closing band and the price panel are the inverted surfaces (ink ground, paper text).

**Orange means "time back" or "start here".** A strike through a chore counts as time back. If a new use of orange doesn't mean one of those, use ink.

## Typography

- **Display** (Geist 500, `clamp(2.75rem, 7vw, 5.25rem)`, 0.98, -0.045em): the hero headline only.
- **Close** (Geist 500, `clamp(2.5rem, 6vw, 4.5rem)`, -0.045em): the closing band headline. The headline asks "What do you do by hand every week?" next to the button. `keepTogether()` in `page.tsx` stops a heading breaking at a hyphen.
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
- The section order is Hero, the track record strip, 01 Problem, 02 Who it's for (`#who`), 03 Offer (`#offer`), 04 Process (`#process`), 05 About (`#about`), 06 FAQ (`#faq`), then 07 the closing band (`#book`), then the footer.
- Desktop grids use 12 columns with 40px gaps. Most sections put the head in 4-5 columns and the content in 7. Everything stacks below 1024px.
- **Track record**: directly under the hero, inside the frame. A hairline, the mono label "My track record as an engineer" with a "More about me →" link to `#about`, then four numbers in a ruled row (2×2 on mobile). The numbers are 24-30px in ink soft with 14px muted labels, so they read as background, not as the headline.
- **Problem**: the head only, with a two-line heading (`clamp(2.25rem, 5.5vw, 4rem)`, one sentence per line) and the intro, then the automation figure with plenty of room. No rows.
- **Who it's for**: the heading, then three audiences in columns (stacked on mobile), each under a 2px top rule, orange for the first and ink for the rest. Below them, the fit list: "Works well when" with orange checks (wider column) beside "Not a fit when" with muted crosses in ink soft.
- **Offer**: the head (label, heading, intro, then timeline and team time as two large specs pinned to the bottom) takes 7 columns, and the ink price panel takes 5 at the same height. Below that, "What you get" as a headline, then a tab list (5 columns) beside the preview frame (7), which stretches to the list's height. Below 1024px the preview sits above the list.
- **Process**: an open list, no tabs. Each step is a ruled row: a dot on a 1px rail, then the mono meta (index, length, price), then "Name: promise" at 22-26px with the promise in ink soft, then a "You leave with" note on the right (a fixed 18rem column from 1024px, under the step below that). The first dot, its stretch of rail and its note's left rule are orange. Then the "I also build" note in a softly tinted block (`ink` at 3.5%).
- **About**: name and intro, links to GitHub, LinkedIn, X and decocereus.com, then the short ground rules as a 2×2 grid of checked rows across the full width. The numbers live in the track record strip, not here.
- **FAQ**: the head column is sticky on desktop and holds the call button and the email under the heading. The questions take 7 columns.
- **Closing band**: one left-aligned stack: label, the question at display size, the body, then the button beside the email.
- **Footer**: wordmark, the nav links, then email and X.
- **Header**: 64px and sticky. Nav links hide below 768px, leaving the wordmark and the "Book a 15-minute call" button, which fits at 360px.

## Components

- **Primary button**: ink fill, paper text, 44px tall, 8px radius, 15px medium text, a trailing arrow. On hover the fill drops to 85% ink over 150ms. On press it scales to 0.97. On the ink band it inverts to paper with ink text. Every button books the call at `SITE.bookingUrl`.
- **Secondary link**: underlined in 30% ink, which darkens to full ink on hover. Only "See the offer" in the hero uses it.
- **Price panel**: ink card, 12px radius, paper text, the price at `clamp(3rem, 6vw, 4.25rem)`, orange checks, and the paper button.
- **Preview frame**: white surface, 1px rule border, 12px radius, one soft shadow (`0 1px 2px` plus a `0 12px 32px -16px` drop), and a mono header with the deliverable's name and its place in the list ("03 / 06"). Each preview is one object filling the frame: a call list with a quote from the finance call, the lead-to-cash map with the handoffs done by hand, the ranked list ending in a skip, the payback worksheet, a drafted reminder with its test run, and the 90-day plan with the report and walkthrough. They follow one made-up business that chases invoices by hand and show no outcome numbers.
- **Tabs** (`offer-tabs.tsx`): Base UI `Tabs`. Each tab shows only its title; the detail is in the panel for screen readers. While in view they tour on their own: a 1-2px orange bar fills (`.tour-progress`) and its `animationend` moves to the next tab. The tour pauses on hover or focus, stops for good once someone picks a tab, and never runs under reduced motion (`use-autoplay.ts`).
- **Ruled rows**: the fit list, deliverable tabs, process steps, ground rules and FAQ items all use hairline rows.
- **FAQ**: native `details`/`summary`. A 16px plus rotates 45° to an × over 200ms.
- **Focus**: a 2px orange outline, offset 3px, on every interactive element.

## The hero

- Left: the headline, the lead (what I do, in ink soft at 18-20px), the chores under a mono "Off your plate" label, the fixed-price line (ink, 19-21px medium), and the two calls to action. Right: the clock. Below 1024px the clock follows the copy.
- **Chores** (`HERO.chores` in `content.ts`): each item gets a 2px orange strike (`.struck` in `globals.css`), drawn left to right with `scaleX`, one after another from 450ms. Under `prefers-reduced-motion` they start struck. CSS only.
- **Clock** (`src/components/figures/clock/`): an anatomy figure of an exploded watch, from crystal to case back along one diagonal, grey line work with orange hands. The settled pose is server-rendered SVG. On load the parts spread from a near-assembled pose (a sampled spring run as a CSS `linear()` curve, about 1.5 s). While on screen the train steps each 1.1 s beat at the true ratios from its tooth counts, the balance swings and the hands advance. It pauses offscreen and is still under reduced motion. Decorative (`aria-hidden`).

## The automation figure

`src/components/figures/automate/`: an anatomy figure of a desk machine that makes the Monday report, labeled "Example". Four beats, toured on their own and picked with four step buttons: Task (hand-cranked), Break it down (the stations slide apart), Add AI (the orange module drops in, the crank comes off) and Automated (it runs itself; the draft waits at a gate until a person approves). A readout under the drawing follows the same model that moves the parts. Copy lives in its `model.ts`. Under reduced motion it shows the chosen beat as a still.

Both figures use the anatomy kit copied verbatim into `src/components/iso/` (excluded from lint formatting in `biome.jsonc` and from `react-doctor.config.json`). Update it by copying the skill's kit again.

## Share images

`src/app/opengraph-image.tsx` renders the 1200×630 card at build time with `next/og`, using Geist from the `geist` package. `twitter-image.tsx` reuses it. The card has one job: someone who gets the link should know what this is from the thumbnail alone. It matches the hero:

- Paper ground, the headline at 100px on the left and the first four chores struck through in orange beneath it. Nothing else: no audit line, no price.
- On the right, the raster clock `src/assets/clock.png` (made with GPT-6.2 Sol, keyed to transparency). It is only used here; the site uses the anatomy clock.
- No wordmark, no offer pill, no domain. The link preview already shows the domain.

It reads `HERO.headline` and `HERO.chores`, so a copy change updates the card and its alt text. Keep every line legible when the card is shrunk to 400px wide.

## Motion

- Motion has a purpose: it shows time coming back. The kinds are the chore strikes, the two figures, the offer tab tour, scroll reveals (`.reveal`, scroll-driven, no JS), panel entrances (`.rise`, staggered by `--i`), button press, color changes and the FAQ plus.
- Easing is `--ease-out-strong` (`cubic-bezier(0.23, 1, 0.32, 1)`) for entrances and `ease-out` for UI. Animate transform and opacity; the map preview's flowing dashes are the one exception.
- Everything that loops pauses offscreen. Under `prefers-reduced-motion` nothing moves: figures show a still pose, tours don't start, reveals and entrances are off, and anchor scrolling is instant.

## Do's and don'ts

**Do**
- Keep orange for "time back" and "start here".
- Use mono labels and indices for structure, and Geist for sentences.
- Keep the page frame and full-bleed section rules.
- Keep the struck chores to plain, real kinds of manual work.
- Samples use a made-up business and no outcome numbers, never a client's name or result.

**Don't**
- Add a second accent, gradients, glows, emoji, stock imagery, fake logos or testimonials.
- Add more cards. A new block gets a ruled row.
- Bring back Paper Shaders or add a heavy client-side library. Client JS is limited to the two figures' motion layers and the two tab components.
- Show prices for builds or retainers. Only the audit price appears.
