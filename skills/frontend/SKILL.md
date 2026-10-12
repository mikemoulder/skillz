---
name: frontend
description: Design and build a startup-grade frontend that does not look AI generated, for a landing page, a product UI or both. Runs an imagination engine before any code (distill the product, find its signature visual, pick a direction, storyboard the page, wireframe the first screen, write the token system), calibrates against measured reference sites, builds on Next.js + Tailwind v4 with tokens, primitives, motion and the five screen states, then closes with a screenshot critique loop and an automated slop audit. Use when scaffolding, designing or redesigning a hackathon UI or landing page, when asked to make it look professional, premium or like a real startup, when a UI looks generic, templated or AI made, when choosing type, color, layout, cards, nav, footer or motion, when given reference sites to learn from, or when the frontend must be triaged with hours left. Read CONFIG.md first.
---

# Frontend

Judges, users and investors decide whether a product is serious in about ten seconds, from
one screen. The hackathon projects that win now ship frontends that look like funded
startups. This skill is calibrated against two of them, measured: [Teampot](https://teampot.vercel.app)
(quiet, monochrome, the product in a phone) and [Gloam](https://gloam.trade) (graphite,
light type, a luminous field, payments that seal as they pass). Neither looks like a
template, and neither got there by styling components one at a time.

Three engines do the work:

1. **The imagination engine** designs the whole page in words and boxes before code, and
   writes `DESIGN.md`.
2. **The system** turns those decisions into tokens and primitives, so every component
   inherits them and nothing is styled on its own.
3. **The critique loop** screenshots the build at real widths, measures it, scores it,
   scans it for slop, and fixes it until it passes.

**Read `CONFIG.md` before anything else.** If the hackathon repo has a `hackathon.yml` at
its root, read that first; the values in `CONFIG.md` are defaults. Fill what you can infer
from the brief and the repo, state your assumptions in one line, and keep moving.

## The rule that governs everything

> Decide everything once, then build. Slop is what you get when every component is
> designed on its own.

A model asked for a landing page writes the most probable one: each section the average of
every section like it. Averages of averages are exactly what "generic" means. Better
components do not fix that. One idea, written down before the first component, that
every component must answer to, does.

## Build order

| # | Phase | Wall clock | Done when |
|---|---|---|---|
| 0 | Deploy a blank page | 20 min | A public URL exists. **Deploy before you build** |
| 1 | Imagination engine | 30 to 45 min (fast path 10) | `DESIGN.md` passes its gate |
| 2 | Tokens, primitives, system sheet | 30 min | `/system` looks like the brand at 1440 and 390 |
| 3 | First viewport and the signature | 90 min | The hero screenshot passes the squint test and the screenshot sentence |
| 4 | The rest of the storyboard | 2 to 4 h | Every beat built, with real copy, against seed data |
| 5 | Real data, the five states, interaction states | 60 to 90 min | Nothing visual moved; every state exists |
| 6 | Motion pass | 30 min | Within the motion budget, reduced motion honest |
| 7 | Responsive pass | 45 min | Designed transforms at 375, 768, 1024, 1440 |
| 8 | Critique loop | 45 to 90 min | Rubric 24/30, nothing below 2, slop-check clean |
| 9 | Demo-proofing and deploy | 30 min | The deployed URL passes `references/demo-proofing.md` |

`time.frontend_hours` under 6 means SALVAGE MODE (below). Phase 0 first is not optional:
`references/deploy.md`.

## Step 0: Ground truth and a URL

Check what is installed before trusting any syntax (`references/scaffold.md`), then deploy
an empty page. Every later push is a one minute deploy instead of an unknown risk.

## Step 1: The imagination engine → `DESIGN.md`

Read `references/imagination-engine.md` and follow it. Copy
`assets/DESIGN.template.md` to `DESIGN.md` at the project root and fill it in order:

1. **Distill.** What it is in twelve words, for whom, the one action, the mechanism, three
   adjectives it must feel and three it must never feel, the proof the page can show.
2. **Signature.** Five metaphors for the mechanism, scored; the winner becomes one element
   people will screenshot, made from the product's own UI where possible.
3. **Direction and calibration.** Choose one of six worlds in `references/directions.md`
   (quiet-monochrome, luminous-dark, editorial-paper, technical-grid, soft-product,
   bold-signal) and set its dials. Measure one or two references with
   `assets/measure-reference.mjs` and write the calibration table
   (`references/calibration.md`). Take proportions, never brand.
4. **Storyboard.** Six to nine beats, each with one job, a pattern from
   `references/sections.md`, a tone, an alignment and real copy drafted now.
5. **Wireframe.** The first viewport at 1440 and 375 and the signature section, in text,
   with alignment anchors, the eye path and the squint test.
6. **System.** Tokens for color, type, space, shape, elevation and motion, from the
   direction and adjusted by calibration, checked against the ratios in the engine.
7. **Pre-mortem.** Run `references/slop-audit.md` on the plan, name three things a design
   director would wince at, and write the screenshot sentence. Then the six-line thesis.

When the user gives reference sites, they are calibration, not templates: measure them,
learn their proportions and composition, and build an original system for this product.

**Gate:** the checklist at the end of the engine. Most importantly, the screenshot sentence
describes one site, not a category.

## Step 2: Tokens, primitives and the system sheet

```bash
cp <skill>/assets/globals.css     src/app/globals.css     # then paste the direction's TOKENS block
cp <skill>/assets/primitives.tsx  src/components/primitives.tsx
cp <skill>/assets/motion.tsx      src/components/motion.tsx
cp <skill>/assets/states.tsx      src/components/states.tsx
cp <skill>/assets/seed.ts         src/lib/data.ts
cp <skill>/assets/system-page.tsx src/app/system/page.tsx
```

Wire the fonts, `MOTION_BOOT`, `MotionRoot` and `Toaster` in the root layout, with the
thesis as a comment at the top (`references/scaffold.md` has the file). `globals.css`
removes Tailwind's default palette and shadow scale: a color or shadow that is not a token
does not render. Radius is named by component (`rounded-tile`, `rounded-panel`,
`rounded-button`).

Open `/system` and shoot it:

```bash
node <skill>/assets/measure-reference.mjs http://localhost:3000/system --out .design/system
```

`.design/` holds screenshots and measurements, not product: add it to `.gitignore`.

**Gate:** the system sheet, at 1440 and 390, already feels like the product in DESIGN.md.
If it does not, fix the tokens now. Every section built on wrong tokens is built twice.

### The system, condensed

The full reasoning lives in the references. These are the rules that catch the most:

- **Type** (`references/typography.md`). One family, two weights (three at most). Display
  tracking -0.02 to -0.045em, display line height 0.92 to 1.06, hero 3.5 to 5 times the
  body. Labels 10 to 12px, uppercase, +0.04 to +0.1em. Secondary text is a weaker strength,
  not a smaller size. `text-wrap: balance` on headings, `tabular-nums` on numbers.
- **Color** (`references/color.md`). Hierarchy from value, not hue: it must survive
  grayscale. One accent with one written meaning, under 5% of any screen. Gradients only
  as the atmosphere field, mixed from the field tokens. Never pure black or pure white.
- **Layout** (`references/layout.md`). Everything snaps to the container edge; the nav
  aligns with the content. Section padding to heading gap about 3 to 1. Two to four left
  edges on the whole page.
- **Surfaces** (`references/components.md`). Most content needs no box: open text, ruled
  columns, rows. Tiles for parallel items, cards for objects you act on, panels for stages.
  One signal per box: tone, or hairline, or soft shadow.
- **Buttons.** 36, 44, 48px. One action button per section; the rest quiet, ghost, or an
  arrow link. Labels are verb plus object.
- **Nav and footer** are part of the identity: pick the direction's pattern and build it
  once. Every link goes somewhere real.

## Step 3: The first viewport and the signature

Build the hero and the signature first, with hardcoded seed data, exactly as wireframed.
This is the screenshot that will be shared, judged and put in the og:image.

- The product is visible at second zero (stage, split proof or signature).
- The eye path is headline, then product or signature, then action.
- The signature has its still frame, its motion, its reduced-motion state and its phone
  layout, all built now, not "later".

**Gate:** shoot it at 1440 and 390. Squint: the largest, darkest mass is the headline or
the signature. Say the screenshot sentence out loud while looking at it. If the image
does not match the sentence, fix the image.

## Step 4: The rest of the storyboard

One file per section in `src/components/landing/`, in storyboard order, each from its
pattern in `references/sections.md`, each with the copy drafted in the engine
(`references/ui-copy.md`). Product mocks are built from the real product components with
seed data (`references/imagery.md`): the landing page and the app cannot drift apart if
they are the same components.

Build against hardcoded data that already looks like a successful demo. If the backend
never lands, there is still a demo; when it lands, one module changes and nothing visual
moves. That is what `assets/seed.ts` is for.

For product screens: a page header with a title, one sentence saying what the screen is
for and one primary action; one job per home screen; rows before cards; tasks in sheets.
`references/sections.md` has the product-screen rules.

## Step 5: Real data, the five states and interaction states

Swap the seed for the real source behind the same components, then give every screen that
can fetch, filter or submit all five states from `assets/states.tsx`:

| State | Ship |
|---|---|
| Empty | what goes here, why it is empty, the action that fills it |
| Loading | a skeleton in the shape of the content; a sentence after two seconds |
| Error | a sentence a person wrote, then Try again |
| Partial | what arrived, skeletons for the rest |
| Success | a toast or an inline change, in the past tense |

And every interactive element gets rest, hover, focus-visible, active, disabled, and busy
where it submits. Judges double-click and tab; both must be handled.

## Step 6: Motion

`references/motion.md`. The budget per page: one ambient, one signature, section reveals
once, reactive states everywhere, one delight moment at the money shot. `transform` and
`opacity` only, loops paused offscreen, reduced motion gets the final state. Use
`Reveal`, `LineArt`, `Marquee`, `CountUp` and `PauseOffscreen` from `assets/motion.tsx`;
content stays visible without JavaScript.

## Step 7: Responsive

Design the transforms in `references/layout.md`; do not shrink. At 375: nav collapses to
wordmark plus action, one action visible without scrolling, the signature simplified but
present, grids become stacks or snap scrollers, no horizontal overflow, 44px touch targets.
Check 375, 768, 1024 and 1440 on the production build.

## Step 8: The critique loop

`references/slop-audit.md` has the full loop and the rubric. Up to three rounds:

```bash
npm run build && npm start
node <skill>/assets/measure-reference.mjs http://localhost:3000 --out .design/round-1
bash <skill>/assets/slop-check.sh src
```

1. Look at every 1440 and 390 slice, one at a time. Write what the eye hits first.
2. Score the ten dimensions 0 to 3: identity, hierarchy, typography, color, layout,
   surfaces, signature and proof, copy, motion and states, responsive.
3. Read `summary.md` against DESIGN.md: sizes off the scale, radii off the tokens, too
   many left edges, overflow, console errors.
4. Fix the three lowest things. Re-shoot.

Log each round in DESIGN.md section 8.

**Gate:** 24 or more out of 30, no dimension below 2, `slop-check.sh` exits 0. Below the
gate after three rounds, take the weakest dimension back to its pass in the engine
instead of polishing around it.

## Step 9: Demo-proofing and deploy

Run `references/demo-proofing.md` against the deployed URL: cold load, offline hero, the
projector (`projector` class on `<html>` raises muted text to about 7:1), 150% zoom,
console clean, tab order, og:image renders when pasted, favicon and title are yours.
Screen-record the working flow as the fallback.

## Copy, in brief

The words are the interface (`references/ui-copy.md`). The hero names the outcome in two
lines or fewer. Section headings are claims, not labels ("Rules that hold even if the app
doesn't", not "Security"). Sentence case, no exclamation marks, no em dashes, no
seamless, empower, unlock or revolutionize. Buttons are verb plus object. Seed data is
copy: plausible names, odd amounts, real dates. No fake logos, testimonials or stats.

## Images, in brief

The best image is the product (`references/imagery.md`). Live UI in light frames, line
diagrams drawn from the tokens, one atmosphere field, a generative motif from the
metaphor. Never stock photos, illustration packs or AI images. Ask the user once, in hour
two, for the logo, the favicon and any images the product shows, each with a size and a
fallback. Generate the og:image from the hero with `next/og`.

## SALVAGE MODE

When `time.frontend_hours < 6`, or in the final two hours with no demoable UI:

1. Run the engine's fast path: distill, signature, a direction with its tokens unchanged,
   a six-beat storyboard, the 1440 first viewport, the thesis. Ten minutes.
2. Pick the one screen in the demo script. Delete every route that is not it.
3. Copy the assets, paste the direction block, build the hero with the product in it and
   hardcoded data.
4. One section of ruled columns, one stats row of real numbers, the footer. Stop.
5. Empty and loading states, the copy pass, one critique round, deploy.
6. Screen-record the working flow.

One finished screen in a coherent system beats four screens in four styles, in every
rubric.

## What not to do

- **Do not write JSX before `DESIGN.md` passes its gate.** That is how templates happen.
- **Do not style a component in isolation.** If it needs a value the tokens lack, add a
  token and say why in DESIGN.md.
- **Do not copy a reference's brand.** Measure proportions; build an original system.
- **Do not add a second accent, a second display face, or a second corner language.**
- **Do not ship a section without proof** for its claim.
- **Do not fake the product.** Mocks are real components with seed data; screenshots are
  of things that exist.
- **Do not let the page depend on JavaScript to be visible,** or on the network to render
  the hero when `demo.offline_safe` is true.

## Time traps

- **Iterating on the hero font for an hour.** The direction picked one. Ship it.
- **A WebGL field before the page exists.** The CSS field is fine until the critique loop
  says otherwise.
- **Building every section in the storyboard when the clock says three.** Build in
  storyboard order and cut from the bottom.
- **Auth UI.** Hardcode a signed-in user. Nobody scores the login page.
- **A dark mode toggle.** Ship the direction's mode. Add the other only if it is tested
  at every breakpoint.
- **Pixel-pushing before the critique loop.** Score first, then fix the three lowest.

## Report

```text
FRONTEND

Direction    quiet-monochrome (dials: light, single weight, balanced, round, flat, mono + 1)
Thesis       [the THESIS line from DESIGN.md]
Signature    [the element, and what it proves]
Calibrated   [reference URLs measured, or "fast path, uncalibrated"]
Built        [sections and screens], states: 5/5 on [screens]
Critique     round 2: 26/30 (lowest: motion 2, responsive 2), slop-check 0 fail / 1 warn
Deployed     [url], og:image renders, offline hero: yes

Unverified   [anything not checked, e.g. "not tested on a real phone"]
Next         /skillz:polish, then /skillz:readme
```

## Handoff

When the UI passes the gate: `/skillz:polish` to make the engineering discoverable,
`/skillz:readme` for the judge-facing README (use the hero screenshot and the thesis), and
`/skillz:demo-video`, which takes the brand straight from `globals.css`. If the judge
pass finds the UI weak, come back to Step 8 with its notes as round N+1.
