# DESIGN.md

The design of PROJECT, decided once, before the build. Every component answers to this
file. When the design changes, change this file first, then the code.

Filled by the imagination engine (`references/imagination-engine.md`). Seven passes, in
order. Do not skip to section 6: tokens chosen before the idea are how templates happen.

---

## 0. Thesis

Six lines. Written last, read first. Mirror them in a comment at the top of the root layout.

```text
THESIS      [what this product is, as a design idea, and the one thing the page refuses]
WORLD       [ground, type voice, surfaces, the one accent and where it is allowed]
STORY       [the page in one sentence: hook, proof, mechanism, close]
FIRST VIEW  [exactly what fills 1440x900, and what fills 375x812]
SIGNATURE   [the one element people will screenshot, and what it proves]
REFUSES     [three things this design will not do]
```

---

## 1. Distill

| Question | Answer |
|---|---|
| What it is (12 words, for a stranger) | |
| Who it is for (a person, not a market) | |
| The one action (verb + object) | |
| The mechanism (the true, interesting part) | |
| Feels (three adjectives) | |
| Never feels (three adjectives) | |
| Proof we can show (live UI, a number, a transaction, code) | |
| Product noun (one word, used everywhere) | |

---

## 2. Signature

Five metaphors for the mechanism, scored 0 to 3. Clarity: a stranger gets it in three
seconds. Specific: true of this product and not of its category. Buildable: CSS, SVG or
live UI in under two hours. Motion: it has a natural before and after. Fit: it matches
section 1's feeling.

| Metaphor | Clarity | Specific | Buildable | Motion | Fit | Total |
|---|---|---|---|---|---|---|
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |
| | | | | | | |

**Chosen:**

| | |
|---|---|
| The element | |
| Where it lives | |
| Still frame (what a screenshot shows) | |
| Motion (what changes, how long, how it loops or ends) | |
| Reduced motion (the honest still state) | |
| At 375px | |
| What it proves about the product | |

---

## 3. Direction

**Chosen:** [quiet-monochrome | luminous-dark | editorial-paper | technical-grid |
soft-product | bold-signal] from `references/directions.md`

**Why this and not [runner-up]:**

| Dial | Setting |
|---|---|
| Ground | light / dark / both, with which one first |
| Type voice | single weight / light display / serif display / mono-led / heavy display |
| Density | airy / balanced / dense |
| Corners | sharp (0-8) / soft (12-20) / round (24-32) + pill controls |
| Surfaces | flat tones / hairlines / soft elevation |
| Color strategy | monochrome / monochrome + one tint / one accent / duotone |
| Fonts | display: , body: , mono: (with license: free / owned) |

### Calibration

Measured with `assets/measure-reference.mjs`. Adapt, never copy: their measurements, our brand.

| Reference | URL | Measured on | Why this one |
|---|---|---|---|
| | | | |

| Component | Reference (measured) | Ours | Why different |
|---|---|---|---|
| Page ground / text | | | |
| H1 size / lh / tracking / weight | | | |
| H2 | | | |
| Body | | | |
| Label | | | |
| Nav | | | |
| Primary button | | | |
| Secondary button | | | |
| Card / tile | | | |
| Section rhythm | | | |
| Footer | | | |
| Accent use | | | |

---

## 4. Storyboard

The page as a story. Each beat has one job. Patterns from `references/sections.md`.

| # | Beat | Job (one line) | Pattern | Tone | Align | Content (real copy, drafted now) |
|---|---|---|---|---|---|---|
| 1 | Nav | | | | | |
| 2 | Hook | what, why, what next | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |
| 6 | | | | | | |
| 7 | | | | | | |
| 8 | Close | | | | | |
| 9 | Footer | | | | | |

Rhythm check:

- [ ] No two adjacent beats use the same pattern
- [ ] Open and contained sections alternate
- [ ] At most one inverted band, plus the footer
- [ ] Centered: hero, thesis, closing CTA only. Everything else aligns to the container edge
- [ ] Density alternates: airy, then dense, then airy
- [ ] No two beats share a job (if they do, merge them)
- [ ] Six to nine beats between nav and footer
- [ ] The signature appears once, in the first two scrolls

### Product screens (if the build has an app surface)

| Screen | Its one job | Primary action | States it needs |
|---|---|---|---|
| | | | empty, loading, error, partial, success |

---

## 5. Wireframes

### First viewport, 1440 x 900

```text
[draw it: boxes, real copy, sizes as tokens, the eye path numbered 1-2-3]
```

### First viewport, 375 x 812

```text
```

### The signature section, 1440

```text
```

**Alignment anchors:** [the edges everything snaps to, e.g. container edge at the
gutter; text column 720px; split at 5/7 of 12]

**Eye path:** 1. [ ] 2. [ ] 3. [ ]

**Squint test:** blur the wireframe in your head. The darkest, largest thing is [ ], and
it must be the headline or the signature.

---

## 6. System

Paste-ready values. These become the TOKENS block in `globals.css`.

### Color

| Token | Light | Dark | Use |
|---|---|---|---|
| ground | | | the page |
| surface | | | stages, panels |
| panel / tile | | | cards, blocks |
| fg / fg-soft / fg-mute / fg-faint | | | text strengths |
| line / line-strong | | | hairlines, rules |
| action / on-action | | | the primary button |
| accent / accent-soft | | | meaning only: [what it means] |
| success / warning / danger | | | state only |

Accent rule, in one sentence: [where the accent may appear, and where it may not]

### Type

| Role | Size (375 to 1440) | Line height | Tracking | Weight | Font | Use |
|---|---|---|---|---|---|---|
| display-xl | | | | | | hero only |
| display-l | | | | | | section claims |
| display-m | | | | | | |
| title | | | | | | card and column titles |
| lead | | | | | | the sentence under a heading |
| body | | | | | | |
| small | | | | | | meta, captions |
| label | | | | | | eyebrows |
| num | | | | | | money, stats |

### Space and layout

| Token | Value |
|---|---|
| page max width | |
| gutter (375 / 768 / 1440) | |
| section padding | |
| heading to content | |
| grid gap (tiles / columns) | |
| text column / prose measure | |

### Shape and elevation

| Component | Radius | Border | Shadow |
|---|---|---|---|
| button | | | |
| input | | | |
| chip | | | |
| tile | | | |
| card | | | |
| panel | | | |
| feature card | | | |
| product frame | | | |

### Motion

| Token | Value |
|---|---|
| ease out | |
| ease in-out | |
| micro (hover, press) | |
| UI (sheets, tabs) | |
| reveal | |
| signature loop | |
| reduced motion | |

### Components

| Component | Decision |
|---|---|
| Nav | pattern, height, behavior on scroll, at 375 |
| Buttons | variants used, heights, where the one action button lives per section |
| Surfaces | which content gets a tile, card, panel, or no box at all |
| Inputs | |
| Labels / eyebrows | |
| Status chips | where state is real, nowhere else |
| Footer | pattern, contents, tone |
| Icons | set, stroke width, size, where icons are allowed |
| Imagery | product UI, diagrams, field, generative, photography (from the user only) |

---

## 7. Pre-mortem

Run `references/slop-audit.md` against this plan before any code.

| Tell | In the plan? | Countermeasure |
|---|---|---|
| | | |

**Three things a design director would wince at, and the fix:**

1.
2.
3.

**The screenshot sentence.** Describe the hero screenshot in one sentence, as someone
would when sharing it:

> 

Could that sentence describe a thousand other sites? If yes, go back to section 2.

---

## 8. Critique log

Filled during the build (Step 8). Score with the rubric in `references/slop-audit.md`.

| Round | Date | Score /30 | Lowest dimensions | slop-check | Fixes made |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
