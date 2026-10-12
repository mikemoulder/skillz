# The imagination engine

Design the whole page in words and boxes before writing a line of JSX. Seven passes, about
thirty to forty-five minutes, one output: `DESIGN.md` from `assets/DESIGN.template.md`.

## Why this exists

A model asked for a landing page writes the most probable landing page. The most probable
hero is a centered headline over a purple gradient with two buttons. The most probable
features section is three icons in tinted squares. Each section, generated on its own, is
the average of every section like it, and a page assembled from averages is exactly what
people mean by "AI slop".

Studios do not work that way, and neither did the two hackathon sites this skill is
calibrated against. Before either one had a component, it had an idea:

- **Gloam**: a public blockchain shows every payment like a postcard. Gloam seals the
  envelope. That one sentence produced the signature (readable payment cards sliding
  through a frosted slab and coming out sealed), the palette (graphite with one green
  "sealed" signal), the hero (a dark luminous field with money engraved beneath it, revealed
  under the cursor) and even the copy ("every payment is a postcard").
- **Teampot**: every team runs its own money, and each level holds its own key. That
  produced the key tree diagram with light running from treasury to team to card, the
  four-by-four Fill gauge, the role switcher on a live phone, and a monochrome page where
  color only appears inside the product.

The imagination engine makes that order of operations mandatory: idea, then signature,
then world, then story, then layout, then tokens, then a hostile review of the plan. The
code comes after, and it is mostly transcription.

## The rules of the engine

1. **Words before pixels, boxes before components.** Every pass writes into `DESIGN.md`.
   If it is not written down, it was not decided, and an undecided thing gets the average.
2. **Generate wide, then choose.** Never take the first idea for the metaphor, the
   headline or the hero pattern. Write five, score them, keep one.
3. **Specific beats pretty.** The test for every decision: is this true of this product, or
   of every product in its category? Category-true is template. Product-true is design.
4. **Show, then claim.** Wherever the plan says "fast", "private" or "simple", the page
   must show the product being fast, private or simple. Claims without proof get cut.
5. **One loud thing.** One signature, one accent, one action per section. Everything else
   is quiet so the loud thing can be heard.

---

## Pass 1: Distill (5 minutes)

Answer the eight questions in section 1 of the template. Rules for each answer:

| Question | Rule | Weak | Strong |
|---|---|---|---|
| What it is | 12 words or fewer, no category jargon, a stranger understands it | "An AI-powered compliance platform" | "Speak your site inspection; the report writes itself" |
| For whom | A person with a job title and a moment | "Construction teams" | "A site manager walking a floor at 7am with gloves on" |
| The one action | Verb plus object | "Get started" | "Record an inspection" |
| The mechanism | The true interesting part, the thing an engineer would explain at dinner | "Uses AI" | "Speech is parsed into the inspection schema live, and hazards are matched against the safety code as you talk" |
| Feels | Three adjectives that could fail | "Modern, clean, sleek" (cannot fail, means nothing) | "Sturdy, exact, outdoors" |
| Never feels | Three refusals that rule things out | "Bad, ugly" | "Techy, playful, glossy" |
| Proof | Something real the page can render | "Trusted by teams" | "A real inspection, transcript on the left, structured report on the right" |
| Product noun | One word for the core object, used in UI, README and pitch | report / inspection / audit mixed | "inspection" everywhere |

"Modern, clean, sleek" is the most common answer and it is a non-answer: no design has
ever been chosen against it. If an adjective cannot fail, replace it.

## Pass 2: Signature (10 minutes)

The signature is the one element someone screenshots and sends to a friend. It is not
decoration. It is the mechanism, made visible.

### 2a. Five metaphors

Write five ways to see the mechanism. Pull from different worlds on purpose:

- **Physical objects:** envelope, key ring, ledger, vault, sieve, lens, thermostat
- **Processes:** sealing, filtering, routing, settling, distilling, translating
- **Places:** a floor plan of rooms, a delta, a switchyard, a control tower
- **Instruments:** gauge, meter, tuner, seismograph, scale
- **Before and after:** readable to sealed, noise to signal, speech to structure,
  scattered to settled

### 2b. Score them

Clarity, specificity, buildability, motion and fit, 0 to 3 each (template section 2).
Kill anything under 10. Kill anything that scores 0 on specificity no matter what else
it scores: a globe with arcs is clear, buildable and moving, and it is the signature of
every infrastructure company since 2015.

### 2c. Make it an element

Turn the winner into one concrete component and write its still frame, its motion, its
reduced-motion state, its phone layout and what it proves. The best signatures are made of
the product's own UI (Gloam's sealed cards are real payment cards; Teampot's stage is the
real app in a phone), because then the signature is also the proof.

**Signature archetypes that work** (choose one, then make it specific):

| Archetype | Shape | Example |
|---|---|---|
| Transformation stream | Items flow through a boundary and change state | Gloam: readable payments in, sealed out |
| Live stage | The real product, running, framed, switchable | Teampot: the app in a phone, roles switch on tap |
| Drawn mechanism | A line diagram that draws itself and carries light along a path | Teampot: treasury to team to card, a refused payment stops red |
| Instrument | One custom gauge or meter that reads the product's core number | Teampot's Fill gauge: blocks lit for budget left |
| Reveal | A hidden layer uncovered by the cursor or by scroll | Gloam: engraved banknotes under the hero, revealed by a lens |
| Split truth | The same thing seen two ways, side by side, with a toggle | Gloam: "What you see / What the public sees" |
| Typing proof | Input becomes output live, character by character | A transcript turning into a structured report |

**Never a signature:** floating 3D shapes, a globe with arcs, a particle network, an orb,
a gradient mesh on its own, a bento of icons, a dashboard screenshot tilted in 3D, or a
glowing card with a border animation. None of them say anything about the product.

## Pass 3: Direction and calibration (10 minutes)

### 3a. Choose a direction

Read `references/directions.md`. Six complete visual worlds, each with tokens. Choose by
section 1's feeling and audience, not by taste:

| If the product feels | And the audience is | Start from |
|---|---|---|
| calm, assured, consumer-grade | people who move money or run teams | quiet-monochrome |
| discreet, technical, a little dramatic | crypto, security, AI infrastructure | luminous-dark |
| considered, literate, trustworthy | research, writing, climate, public interest | editorial-paper |
| exact, fast, no-nonsense | developers, operators | technical-grid |
| warm, friendly, human | consumers, health, education, social | soft-product |
| loud, cultural, confident | communities, events, games, onchain culture | bold-signal |

Write "why this and not the runner-up" in one sentence. Then set the six dials. A
direction is a starting point: change any dial with a reason, never without one.

### 3b. Calibrate against references

Pick one or two real sites in the category, or use the ones the user named, and measure
them (`references/calibration.md`):

```bash
node <skill>/assets/measure-reference.mjs https://reference.example --out .design/ref-1
```

Fill the calibration table: component, their measured value, ours, why different. This
is how Teampot's landing page got its proportions: from tempo.xyz's computed styles, not
from guesses. Measured values carry years of somebody else's iteration. Take the
proportions, never the brand: their H1 ratio, not their font; their section rhythm, not
their colors; their button height, not their wording.

## Pass 4: Storyboard (10 minutes)

The page is a story with beats. Each beat has one job, one pattern from
`references/sections.md`, a tone, an alignment and real copy, drafted now.

### The beats

Most product landing pages need six to nine of these, in roughly this order:

| Beat | Job | Common patterns |
|---|---|---|
| Hook | What it is, why it matters, what to do next. In one screen | Statement + stage, atmosphere panel, split proof |
| Orientation | The three things this product is (app, protocol, SDK; or for whom) | Ruled columns |
| Thesis + signature | The idea in one sentence, then the signature showing it | Thesis band with the signature |
| Proof | The real product, interactive if possible | Live product panel, tabbed showcase, live stage |
| Mechanism | How it works, the hard part, shown | Drawn diagram, spotlight split |
| Contrast | Why this and not the alternative | Comparison pair |
| Uses | Who it is for, concretely | Use tiles, index rows |
| Depth | Developers, specs, the API | Developer panel |
| Trust | What is verifiable: audits, open source, real numbers, rules | Stats row, ruled columns, statement band |
| Close | One action | CTA pair, closing statement |

### Rhythm rules

- **Never two identical patterns in a row.** Two card grids back to back is the single
  most common template tell after the purple gradient.
- **Alternate open and contained.** Open text on the ground, then a panel, then open.
- **One inverted band** on a light page (a dark statement or developer band), plus the
  footer. Two inverted bands in a row read as a different site.
- **Center only the hero, the thesis and the close.** Everything else aligns to the
  container's left edge, which is what makes a page feel built on a grid.
- **Density alternates.** A dense comparison after an airy thesis, an airy close after a
  dense developer panel.
- **The signature lands in the first two scrolls.** If it is below the fold of the third
  screen, most visitors never see it.
- **Every beat earns its place.** If two beats have the same job, merge them. If a beat
  has no proof, cut it.

### Draft the copy now

Write the real headline, lead line and button for every beat in the storyboard table.
Copy written after layout gets squeezed into boxes sized for lorem ipsum; layout drawn
around real copy fits it. Use `references/ui-copy.md`. Write five headlines for the hook
and keep the best; the first is almost always the category-true one.

## Pass 5: Wireframe (5 to 10 minutes)

Draw the first viewport at 1440 and at 375, and the signature section at 1440, as text
in the template. Boxes, real copy, sizes as tokens, and the eye path numbered.

```text
1440 x 900 (example: quiet-monochrome, statement + stage)
+--------------------------------------------------------------------------------+
|            ( mark  fieldnote     How it works  Safety codes  Docs  [Record] )   |  nav pill, 52h, floats 16 from top
|                                                                                |
|                                                                                |
|                       Speak the walk-through.                                  |  1. display-xl, 2 lines, centered
|                       The report writes itself.                                |
|                                                                                |
|         Fieldnote turns a site inspection you say out loud into the           |  lead, 17px, fg-mute, 520 max
|         signed report your safety officer needs, hazards flagged.             |
|                                                                                |
|                    [ Record an inspection ]  ( Watch a demo )                  |  3. action pill + quiet pill
|                                                                                |
|  +--------------------------------------------------------------------------+  |
|  | panel, surface, r24                                                      |  |  2. the stage begins at y=640
|  |   transcript streaming  ->  report filling, hazard row lights hi-vis      |  |     (signature, cropped by the fold)
+--------------------------------------------------------------------------------+
```

```text
375 x 812
+-----------------------------------+
| ( mark fieldnote        [Record] )|  nav collapses: mark + one action
|                                   |
|  Speak the                        |  display-xl at 40px, left-aligned on phone
|  walk-through.                    |
|  The report                       |
|  writes itself.                   |
|                                   |
|  Fieldnote turns a site...        |  lead 16px
|                                   |
|  [ Record an inspection      ]    |  full-width action, quiet link below
|    Watch a demo ->                |
|  +-----------------------------+  |
|  | stage: report card only,    |  |  signature simplifies: one card, no stream
+-----------------------------------+
```

Then write three things under the drawings:

- **Alignment anchors.** The edges everything snaps to. Example: "container edge at the
  gutter; hero text column 640px centered; stage spans the container; section copy
  columns at 720px from the left edge."
- **Eye path.** What the eye hits first, second, third. It should be the headline, the
  signature or product, then the action. If the eye path starts on a decoration, move
  weight off the decoration.
- **Squint test.** Blur the wireframe in your head. The darkest, largest mass must be the
  headline or the signature. If it is a button, a badge or a glow, the hierarchy is wrong.

## Pass 6: The system (5 to 10 minutes)

Fill section 6 of the template from the direction's token block, adjusted by the
calibration table. Then sanity-check the numbers against these ratios, which hold across
every well-made site measured for this skill:

| Check | Target | Why |
|---|---|---|
| Hero display size / body size | 3.5 to 5 | Below 3 the hero does not lead; above 6 it shouts |
| Display tracking at 48px and up | -0.02em to -0.045em | Default tracking at display size is the most common unstyled tell |
| Display line height | 0.92 to 1.06 | Large type with body leading falls apart into lines |
| Body line height | 1.4 to 1.65 | |
| Label size and tracking | 10 to 12px, +0.04em to +0.1em, uppercase | Small caps need air |
| Weights in use | 2, at most 3 | Weight is hierarchy; four weights is no hierarchy |
| Text colors in use | 4 strengths of one color, plus state | |
| Accent coverage | under 5% of any screen (10% with an accent action) | More and it stops meaning anything |
| Radii in use | one per component type, 4 to 6 total | |
| Section padding / heading-to-content gap | about 3 : 1 | The rhythm that reads as "designed" |
| Body measure | 45 to 75 characters | |

## Pass 7: Pre-mortem (5 minutes)

Assume the page shipped and someone called it AI-generated. Why?

1. Run `references/slop-audit.md`'s catalogue against the plan and fill the table.
2. Write three things a design director at a company you admire would wince at, and the
   countermeasure for each. Be concrete: "the use-case section is six identical tiles"
   and its fix "index rows with the verb first, a tile only for the one we can demo".
3. **The screenshot sentence.** Describe the hero screenshot in one sentence the way a
   person would when sharing it. "A clean dark landing page with a gradient and a
   dashboard" could describe a thousand sites: go back to pass 2. "Payment cards slide
   through a frosted bar and come out as dots" describes one.

Then write section 0, the thesis, in six lines. It is the summary of everything above and
the first thing anyone (including the next session) reads.

---

## The gate

`DESIGN.md` is done when all of these are true:

- [ ] Section 0 has six lines, and REFUSES names three real things
- [ ] The signature scored 10 or more, with no 0 on specificity
- [ ] The storyboard passes every rhythm check, with real copy in every row
- [ ] Both first-viewport wireframes exist, with an eye path and anchors
- [ ] Every token in section 6 has a value, and the ratios check out
- [ ] The screenshot sentence describes one site, not a category

## Fast path (under six hours of frontend time)

Ten minutes, not forty. Do passes 1, 2, 3a and 4, take the direction's tokens unchanged,
draw only the 1440 first viewport, and write the thesis. Skip calibration and the full
pre-mortem; keep the screenshot sentence, because it is the cheapest test there is.

## Worked example: Fieldnote

A hackathon build: voice-first site inspections for construction crews.

**Distill.** What: speak your site inspection, the report writes itself. For: a site
manager walking a floor at 7am, gloves on. Action: record an inspection. Mechanism: speech
is parsed into the inspection schema live, and every hazard is matched against the safety
code while you talk. Feels: sturdy, exact, outdoors. Never: techy, playful, glossy.
Proof: a real recorded inspection, transcript beside the report. Noun: inspection.

**Signature.** Candidates: a waveform (clarity 3, specific 0: every voice app has one,
killed); a clipboard filling itself (2, 2, 3, 2, 3 = 12); speech becoming structure, the
transcript on the left and the report rows filling on the right as words arrive (3, 3, 2,
3, 3 = 14); a hi-vis vest stripe as a progress bar (1, 2, 3, 1, 2 = 9); a site map with
pins dropping (2, 1, 2, 2, 2 = 9). Chosen: speech becomes structure. Still frame: the
transcript half-read, three report rows filled, one hazard row lit in safety orange.
Motion: words type in at speaking pace, each completed clause slides its value into a
row; a hazard row flashes once and holds. Reduced motion: the finished report with the
hazard row lit. Phone: the report card alone, with the transcript as one quoted line above
it. Proves: it really parses speech into a schema, live.

**Direction.** quiet-monochrome, not technical-grid: the users are not developers, and
the page has to feel like a well-made tool, not an API. Dials: light ground; single
weight 500 type in Inter Tight; balanced density; round tiles, pill controls; flat tones;
monochrome plus one accent. The accent is safety orange `#FF6A13`, and it means one thing:
a hazard. It appears on hazard rows and nowhere in the chrome. Calibrated against a quiet
fintech landing page for proportions; nothing taken but the numbers.

**Storyboard.** 1 nav pill. 2 hook: statement + stage, the stage is the signature, live.
3 orientation: ruled columns (Record, Review, Sign). 4 proof: tabbed showcase of three
real inspections (scaffolding, electrical, fall protection). 5 mechanism: drawn diagram,
speech to schema to code check to report, the hazard path in orange. 6 contrast:
comparison pair, a clipboard afternoon versus a spoken walk-through. 7 trust: stats row
with three numbers measured from the demo data, each labeled with how it was measured.
8 close: CTA pair (try it on a sample site; read how hazards are matched). 9 footer:
black column footer.

**Screenshot sentence.** "A spoken site walk-through turning into a safety report line by
line, with the hazard lit orange." One site. Ship it.
