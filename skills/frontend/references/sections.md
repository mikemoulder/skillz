# Sections

The pattern library the storyboard draws from. Each pattern has a job, a structure, its
spacing and its phone behavior. Patterns marked with a source were measured on a live
site; the rest are composites. Patterns are vocabulary, not a template: the storyboard
decides the order, the copy and which three or four patterns this page actually needs.

## Composition rules

These decide whether a set of good sections becomes a good page.

1. **One job per section.** Name it in the storyboard. Two sections, one job: merge.
2. **Never the same pattern twice in a row.** Two grids of tiles back to back is a
   template on sight.
3. **Alternate open and contained.** Open text on the ground, then a panel, then open.
4. **One inverted band** on a light page (plus the footer). On a dark page, one lighter
   panel does the same job.
5. **Center the hero, the thesis and the close.** Left-align the rest to the container.
6. **One action button per section.** Everything else is quiet, ghost or an arrow link.
7. **The signature in the first two scrolls.**
8. **Proof follows every claim.** A section that claims something the page cannot show
   is cut or rewritten until it can.
9. **Density alternates.** Airy, dense, airy.
10. **Six to nine sections.** Fewer feels thin; more is a page nobody finishes.

---

## Heroes

### H1 Statement and stage (Tempo, Teampot)

```text
                 ( nav pill )
           Work money that's
            actually yours                 display-xl, centered, 2 lines, max 640
    Your pay, your team's budget and your  lead, 520 max, fg-soft
    perks land in one app on Tempo.
        [ Try the live demo ] ( Take the tour )      action + quiet, gap 8
              Get notified when we launch ->        text link, 18px below
   ......... marquee of real features, faint, masked edges .........
 +----------------------------------------------------------------------+
 |  panel (surface, r24), 520 to 640 tall                               |
 |      [phone]      [ LIVE phone, the real app ]      [phone]          |
 |   side phones lowered 64px, role switcher above the middle one       |
 +----------------------------------------------------------------------+
```

Hero padding-top 200px (140 on phones). Use when the product UI is the proof. Phone: one
live phone, role switcher wraps to two rows, marquee slows.

### H2 Atmosphere panel (Gloam)

```text
 ( wordmark      links centered           [quiet pill] [tint pill] )   sticky 64
 +----------------------------------------------------------------------+
 |  panel r24, inset to the nav container, calc(100svh - 8rem) tall     |
 |  .field drifting, optional hidden layer revealed under the cursor    |
 |                                                                      |
 |  Private money                                display-xl, 300 weight |
 |  on public chains                             bottom-left, 720 col   |
 |  For people and teams paid in stablecoins...  lead 18/1.55, 46ch     |
 |  [ Open app ]  Read the docs ->                          ( Scroll ) |
 +----------------------------------------------------------------------+
```

Use when there is no single screen to show (protocols, infrastructure) and the brand has
an atmosphere. Content bottom-left is the move: it leaves the panel's upper area for the
field to breathe. Phone: panel nearly full height, copy still bottom-left.

### H3 Split proof

```text
 +---------------------------+------------------------------------------+
 | EYEBROW                   |                                          |
 | Speak the walk-through.   |   [ real product, running on seed data,  |
 | The report writes itself. |     bleeding off the right edge,         |
 | lead, 46ch                |     frame or no frame ]                  |
 | [ Record ] Watch demo ->  |                                          |
 +---------------------------+------------------------------------------+
   5 columns                     7 columns
```

The default for most hackathon apps: the product is on screen at second zero. Phone:
copy first, product below cropped to its most important region.

### H4 Editorial headline

```text
 The quiet ledger for                                   display-xl serif,
 public money.                                          left, 10 of 12 cols
 ------------------------------------------------------------------
 Founded 2026     |  Open source      |  Used by 14 city councils   meta row, rules
 ------------------------------------------------------------------
 [ full-width figure: annotated product screenshot or diagram       ]
```

### H5 Terminal

```text
 Ship private payments            |  +---------------------------------+
 in one import.                   |  | $ npm i @acme/sdk          [cp] |
 lead                             |  |---------------------------------|
 [ Read the docs ] ( GitHub )     |  | const tx = await pay(...)       |
 $ npm i @acme/sdk  [copy]        |  | > settled in 812ms              |
                                  |  +---------------------------------+
```

The code runs on load (typed output, real timings from a recorded run).

### H6 Live number

One real, live number as the hero (total settled, proofs verified today) with the
sentence that makes it mean something. Only when the number is real and moving; a fake
counter is worse than no hero.

---

## Body patterns

### B1 Ruled columns (Gloam, Teampot stats)

```text
 ________________   ________________   ________________   1px fg rule
 THE APP            THE PROTOCOL       THE SDK            label
 Use it today       Open contracts     Build on it        title 19px
 Hold, pay and...   Settlement stays   Add private...     small, fg-mute, 38ch
 Open app ->        Verify ->          Explore ->         arrow link, pushed to bottom
```

The best replacement for a row of identical cards. Grid gap 40 to 48 (Gloam `gap-10`).
Phone: stacked, rules stay.

### B2 Thesis and signature (Gloam)

```text
          On a public chain, every payment is a          display-l, centered, 900 max
          postcard. Gloam seals the envelope.
          Public blockchains show every amount...        lead, 58ch
 ~~~~~~~~ [card][card][card] | slab | [sealed][sealed] ~~~~~~~~   the signature, full bleed,
 What a payment normally reveals        What Gloam lets the world see   12px captions
```

The idea in one sentence, then the idea working. Padding 144 top.

### B3 Live product panel (Gloam)

A `surface` panel (r24, padding 64) with a soft field, a centered heading and lead, a
segmented toggle ("What you see / What the public sees"), then three interactive product
cards built from real components, each with a label and an arrow link under it. A line of
help text: "Try the controls. The buttons open the real app."

### B4 Tabbed showcase (Tempo, Teampot)

```text
 _______________________          +-------------------------------------+
 Pay                     <- fg     |  panel r32, #EBEBEB                 |
 Pick a vendor and...              |                                     |
 _______________________           |      [ white mock of the real UI ]  |
 Invest                  <- 40%    |                                     |
 _______________________           |                                     |
 Payday                  <- 40%    +-------------------------------------+
   405px list, 30px titles            the rest, min-height 520
```

Inactive titles at 40% strength, active at full; hover previews. Phone: an accordion
with the panel under the open item.

### B5 Comparison pair (Gloam)

Two tiles side by side. Left, neutral: label ("Committee model"), a small line of who
does it, a 22 to 24px statement, the consequence in `fg-mute`. Right, the same structure
on `accent-soft` (or `success-soft`) with the label in the accent. A footnote paragraph
under both with an arrow link ("How Gloam compares ->"). Honest: name the alternative
and its real trade-off.

### B6 Use tiles

Three by two `tile`s, min-height 220, a line icon top-left, title and body pushed to the
bottom. Each tile links to a real page. Phone: horizontal snap scroller, tiles at 78%
width, scrollbar hidden. Use sparingly; it is the pattern closest to a template, and it is
redeemed only by specific copy ("Freelancers: get paid by every client without each one
seeing what the others pay you").

### B7 Spotlight split (Gloam payroll)

```text
 +------------------------------+  +-----------------------------------+
 | tile r24, padding 40         |  | panel with field                  |
 | Run payroll in one upload    |  |    [ live payroll card, rows      |
 | lead                         |  |      settling one by one ]        |
 | ---------------------------- |  |                                   |
 | Upload a CSV     Name, ...   |  |                                   |
 | Check what...    No names... |  |                                   |
 | Pay everyone     About 8 s   |  |                                   |
 | ---------------------------- |  |                                   |
 | [ Run a test payroll ] How ->|  |                                   |
 +------------------------------+  +-----------------------------------+
```

One feature, explained in three ruled steps, demonstrated live beside it.

### B8 Stats row (Tempo, Teampot)

Three stats with top rules (`Stat` primitive). Number 54/400, label 14px muted. Only
measured numbers, each label saying what was measured.

### B9 Statement band (Teampot)

Full-bleed inverse band, 160px padding, one line in display type (Teampot sets it in
Instrument Serif at 64px), one small caption. Optional single soft glow toward the brand
hue at 15 to 20%. One per page.

### B10 Drawn mechanism (Teampot)

```text
 _______________________          +-------------------------------------+
 Company treasury                  |   line art, 1px strokes in line,   |
 Finance holds it...               |   one path in fg at 1.5px,          |
 _______________________           |   nodes as small pills,             |
 Department account                |   paths draw in on view (0.9s),     |
 _______________________           |   light travels the main path,      |
 Card                              |   a refused path stops in danger    |
```

Steps as ruled rows left, the diagram right. The light along the path is the motion; the
diagram must be legible as a still.

### B11 Developer panel (Gloam)

A `theme-dark` panel (r24, padding 48 to 64) on a light page: label, display-l title,
lead, an action and an arrow link on the left; a code block with a copy button on the
right; a row of real links (npm, MCP server, API reference) under the code.

### B12 Index rows

A list instead of a grid: title, one line of detail, meta, arrow; hairlines between;
the row fills with `fill` on hover. For docs links, changelogs, use cases, FAQs.

### B13 Marquee strip (Teampot)

Words, not logos: the standards, chains or features the product actually uses, 18px at
`fg-faint`, 40px apart, masked edges, 40s loop, paused offscreen and on hover. Never a
row of logos the team has no relationship with.

### B14 Close

Either a CTA pair (two `feature` cards, r48 to 64, padding 64: eyebrow, 22px title, muted
body, one pill each; Teampot: "Try every role" and "Read how it's built"), or a single
centered closing line with one action. One close, not three.

### B15 FAQ

Ruled disclosure rows (`<details>`), question at 18px, answer in `fg-mute` at 65ch, a
plus that rotates 45 degrees. Real questions judges and users ask, answered plainly.

---

## Product screens

When the build has an app surface, the same system applies with denser rules.

**The shell.** Sidebar (240px, links with icons at 20px, the current page on `fill`) at
1024 and up; a bottom tab bar on phones with at most four single-word tabs. Actions are
buttons on screens, never tabs.

**The page header.** Title (display-m or title), one sentence under it saying what the
screen is for, one primary action right-aligned. This sentence is the most valuable
string in an app and the most often missing.

```tsx
<header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
  <div>
    <h1 className="t-display-m">Review queue</h1>
    <p className="t-small mt-2 text-fg-mute">Everything flagged in the last 24 hours, highest risk first.</p>
  </div>
  <Button>New review</Button>
</header>
```

**One job per home screen.** The most important thing at the top ("3 requests need you",
a balance), the primary action, then a short list. Everything else one tap away
(progressive disclosure), not stacked below.

**Data as rows before cards.** A list of payments is rows with tabular numbers aligned
right, not a grid of cards. Cards are for objects with several actions.

**Metrics only when they mean something.** "1,284 documents" is furniture; "1,284
documents, 3 flagged" is a product. Three metrics at most, derived from the data on
screen.

**Tasks in sheets.** Pay, approve, invite: a sheet (bottom on phones, centered on
desktop) with a title, Cancel, and one primary action.

**Tips in place.** A dismissible one-sentence tip at the top of a screen beats an
onboarding tour. Remember dismissal in `localStorage`, wrapped in try/catch.

**All five states on every screen that fetches** (`assets/states.tsx`).

Avoid the default dashboard (sidebar, topbar, four metric cards, a huge chart, three
tables) unless the product genuinely is that; most hackathon apps are one task done well.
