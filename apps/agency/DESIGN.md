---
name: Agency
description: A catalogue of working machines. White paper, black ink, isometric plates.
colors:
  ink: "#0a0a0a"
  ink-soft: "#3d3d3d"
  paper: "#ffffff"
  rule: "rgb(10 10 10 / 0.12)"
  plate-card: "#fbfbfa"
  plate-frame: "#8a8a8f"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5.4vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 2.6vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  body-lead:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.556
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.4
  small:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.43
  plate-mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "10.5px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.1em"
rounded:
  none: "0px"
  focus: "2px"
  sm: "6px"
spacing:
  gutter-mobile: "24px"
  gutter-desktop: "40px"
  row: "20px"
  grid-gap: "40px"
  section-mobile: "80px"
  section-desktop: "112px"
  container: "1200px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.ink-soft}"
    textColor: "{colors.paper}"
  link-underlined:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  nav-link:
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
  nav-link-hover:
    textColor: "{colors.ink}"
  top-bar:
    backgroundColor: "{colors.paper}"
    height: "64px"
  figure-plate:
    backgroundColor: "{colors.plate-card}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.none}"
    padding: "52px 24px"
---

# Design System: Agency

## Overview

**Creative North Star: "The Machine Catalogue"**

The site reads like a printed catalogue of machines. Each workflow is drawn as a real isometric machine on its own plate, and the words beside it are plain. The page is white paper with black ink. Hairline rules divide it into entries, and grey appears only in supporting text and in the drawings' tone ramp. The figure carries the visual weight. The type, buttons and rules stay quiet so the figure can be the one thing that looks crafted.

The page is spare and readable. Each section holds one idea: a heading in the left third and content in the right two-thirds, separated from the next section by a full-bleed hairline. There is no accent colour in v1. The one moment of emphasis is inside the figure, where a single part is lit in pure black.

**Key Characteristics:**
- Pure white ground and near-black ink. No accent colour.
- Geist for all reading text, set large. Geist Mono only for figure measurement.
- Hairline rules (12% ink) in place of cards, fills or shadows.
- Isometric anatomy plates as the only illustration, rendered as SVG in code.
- A faint Paper Shaders grain, used once on the closing band and never as colour.

## Colors

The palette is monochrome: ink on paper, with grey only where text steps back or a drawing needs tone.

### Neutral
- **Ink** (`ink`): headings, body text, the primary button fill, the focus ring and the text-selection background.
- **Soft Ink** (`ink-soft`): supporting text such as subcopy, row details, nav links at rest, the FAQ answers, the footer and the figure legend. Also the hover fill of the primary button.
- **Paper** (`paper`): the page ground, the sticky top bar, and the text on the primary button.
- **Hairline** (`rule`): every divider, including the top-bar and footer edges, section tops, row separators and FAQ separators. It is translucent ink so it stays neutral on both paper and grain.
- **Plate Card** (`plate-card`) and **Plate Frame** (`plate-frame`): the figure plate's near-white ground and its 1px frame. Both come from the anatomy kit's light theme, with the kit's grey ramp underneath (see the sidecar). They belong to figures only.

### Named Rules
**The Ink-Only Rule.** v1 is black and white. The anatomy kit defines red, green and blue tones, but no shipped surface uses them. Introducing one is a brand change, not a styling choice.

**The One Lit Part Rule.** Inside a figure, pure black ("lit") is reserved for the one part the visitor should look at. In Fig 1 that is the approval gate and its lever. Everything else uses the kit's mid and low greys.

## Typography

**Display Font:** Geist (with ui-sans-serif, system-ui)
**Label/Mono Font:** Geist Mono (with ui-monospace), used only inside figures

**Character:** One neo-grotesque at medium weight, with tight tracking at large sizes. It reads as calm and engineered. The mono is reserved for the plates, where it reads as measurement.

### Hierarchy
- **Display** (500, `clamp(2.5rem, 5.4vw, 4.5rem)`, 1.02, -0.035em): the hero headline only.
- **Headline** (500, `clamp(2.25rem, 4.5vw, 3.75rem)`, 1.05, -0.03em): the closing band's headline, capped at 18ch.
- **Title** (500, `clamp(1.75rem, 2.6vw, 2.25rem)`, tight, -0.025em): section headings in the left column.
- **Body lead** (400, 20px, relaxed): the founder intro, capped at 52ch.
- **Body** (400, 18px): nearly all reading text, including subcopy, row details, approach items and FAQ answers. Subheads use the same size at weight 500. Measures are capped between 44ch and 60ch.
- **Label** (500, 15px): button text and text links. Nav links use 15px at weight 400.
- **Small** (400, 14px): the footer, the closing band's pending note, and the figure legend and caption.
- **Plate mono** (Geist Mono, 10.5px, uppercase, 0.1em tracking): the plate's corner title and hint. The Fig number and readout use the same size in sentence case with tabular numerals.

### Named Rules
**The Weight 500 Rule.** Headings are weight 500, never bold. Hierarchy comes from size and tracking. The wordmark is the only text at weight 600.

**The Mono Is Measurement Rule.** Geist Mono and uppercase tracking appear only on the plate's corners and readout. Page text never borrows them.

## Layout

The content sits in one 1200px container with 24px gutters, widening to 40px from 640px. From 1024px each section is a 12-column grid with a 40px gap: the heading takes 4 columns and the content takes 8. Below 1024px they stack with a 32px gap. Sections have 80px of vertical padding, 112px from 640px. The closing band uses 96px, then 128px. Sections are separated by a full-bleed hairline on their top edge, not by background changes.

The hero is a single text row. On desktop the headline takes 7 columns and the subcopy with its actions takes 5, aligned to the bottom. The figure follows at the full container width as the dominant element. Definition-list rows use a fixed label column (15rem for services, 10rem for founder facts) from 640px, with 20px of vertical padding and a hairline between rows. The top bar is 64px, sticky, and paper-backed, with a hairline bottom edge. Nav links hide below 768px, leaving the wordmark and the primary button. Anchors scroll smoothly with a 5rem offset, and smooth scrolling is turned off under reduced motion.

## Elevation & Depth

The page is flat. It has no box shadows, no tonal surface layers and no cards. Depth exists only inside the figures, where the anatomy kit gives solids shaded faces and a soft blurred halo underneath. The closing band's paper grain is texture, not elevation.

### Named Rules
**The Flat Page Rule.** Separation comes from hairlines and whitespace. If a new block seems to need a shadow or a filled card, use a hairline-topped row instead.

## Shapes

The page uses square, ruled edges. Hairlines are 1px. Plates have square corners and a 1px frame. The only rounding is a modest 6px on the primary button and on the figure's interactive surface, plus 2px on the focus ring.

## Components

### Buttons
- **Character:** a solid black rectangle that is plain and firm.
- **Shape:** gently rounded (`rounded.sm`), 44px tall, 20px horizontal padding.
- **Primary:** ink fill, paper text, label type.
- **Hover / Active:** the fill eases to soft ink over 150ms ease-out. On press the button scales to 0.97.
- **Focus:** a 2px ink outline, offset 3px. This is the global focus style.
- There is one button style. A secondary action is an underlined link, not a second button.

### Links
- **Inline and secondary actions:** ink, label type, with a 1px underline offset 4px. Links are always underlined.
- **Nav links:** soft ink at rest and ink on hover, without an underline. They appear in the top bar only.

### Rows (definition lists)
- Each row has a medium-weight term in a fixed left column and a soft-ink detail, with a hairline between rows. The first row has no top rule or top padding. This pattern serves services and founder facts.

### FAQ disclosure
- Native `details`/`summary` with the same hairline rows. The question is medium 18px. A drawn 16px plus (1.5 stroke, currentColor) rotates 45° to an × over 200ms ease-out. The answer is soft ink, capped at 60ch.

### Navigation
- The top bar holds the wordmark (600, 17px, -0.01em) on the left. On the right are the text links and the primary button, 28px apart. It is sticky on paper with a hairline bottom edge.

### Figure Plate (signature)
- **Pattern:** every figure is an anatomy-kit `Plate` in the light theme (`.iso[data-theme="light"]`). Its four mono corners are the Fig number (top left), the uppercase title (top right), an uppercase interaction hint (bottom left) and a live readout (bottom right). Below the plate sits a key legend of swatch marks, then a caption.
- **Drawing:** isometric SVG generated in code from the kit. It uses grey solids and lines, with exactly one part lit in pure black. Fig 1 lights the gate and lever.
- **Caption:** 14px soft ink, capped at 68ch. It describes truthfully what the machine does. When the machine is a sample rather than a client result, the caption opens by saying it is an illustrative example.
- **Interaction:** the drawing can be scrubbed and pressed. The interactive surface has a 6px radius and a 1px muted focus ring offset 6px, and it allows vertical page panning on touch. Below 640px the drawing bleeds slightly past the plate padding so the machine stays legible.
- **Future figures (Fig 2 onward)** follow the same pattern: an anatomy Plate in light theme, one lit accent, and a true caption that says "illustrative example".

### Paper Grain
- A Paper Shaders `PaperTexture` sits behind the closing band only. It is white on white with #efefef shadow, fibre 0.2, roughness 0.25 and every other effect at 0. It is static, hidden from assistive technology and does not take pointer events.

## Do's and Don'ts

### Do:
- **Do** separate content with hairline rules (`rule`) and whitespace.
- **Do** set reading text at 18px or larger in Geist, with measures between 44ch and 60ch.
- **Do** draw every workflow as an anatomy Plate in the light theme, with one lit part and a true caption.
- **Do** keep pure black inside a figure for the single part that carries the point.
- **Do** underline links, and use the single black button for the primary action.

### Don't:
- **Don't** add an accent colour or use the kit's red, green or blue tones while v1 is black and white.
- **Don't** add box shadows, filled cards or tinted section backgrounds to the page.
- **Don't** use Geist Mono or uppercase tracked labels outside the figure plates.
- **Don't** use Paper Shaders as a colour or motion effect. The grain stays faint, static and confined to the closing band.
- **Don't** ship raster figures. Plates are SVG generated in code. The PNGs in `.impeccable/mocks` are abandoned comps, not assets.
