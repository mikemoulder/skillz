# Layout, grid and spacing

A page looks built when its parts share edges and its gaps repeat. A page looks assembled
when every section picks its own width, its own padding and its own alignment. Most of
"this feels professional" is alignment nobody consciously notices.

## The container

| Token | quiet-monochrome | luminous-dark | Use |
|---|---|---|---|
| `--page-max` | 1320px | 1400px | the content box of every section |
| `--gutter` | 20 to 60px | 16 to 28px | side padding, fluid |
| `max-w-text` | 720px | 720px | heading blocks, hero copy column |
| `max-w-prose` | 65ch | 65ch | long reading |
| lead measure | 52 to 56ch | 46 to 58ch | the sentence under a heading |

`<Container>` applies the page width and gutter. Every section's content sits inside one,
so every heading, every grid and the nav share the same left edge. Full-bleed is for
backgrounds (an inverted band, a marquee), never for text.

**The nav aligns to the container.** If the nav's wordmark is at x=28 and the hero copy at
x=60, the page is already misaligned before anyone reads a word. Gloam's hero panel is
inset to exactly the nav's container; Teampot's floating pill centers on the page axis
the hero is centered on.

## The grid

Twelve columns, gap 24px at desktop and 16px at phone. Most layouts use a few splits:

| Split | Use |
|---|---|
| 12 | statements, stages, full-width panels |
| 6 / 6 | comparison pairs, spotlight splits, CTA pairs |
| 5 / 7 or 4 / 8 | copy plus product (split hero, tabbed showcase: list 405px, panel the rest) |
| 4 / 4 / 4 | ruled columns, use tiles |
| 3 x 4 | dense specs, stats (rarely) |
| 4 / 8 (1fr 2fr) | heading left, content grid right: Gloam's "Private payments you can prove" |

Asymmetry is allowed and often better: a heading block in the left third with a
three-column grid in the right two thirds reads as editorial and confident. A centered
heading over a centered three-up grid reads as a template.

## The spacing scale

```text
4  8  12  16  20  24  32  40  48  64  80  96  128  160
```

Tailwind's 4px scale already covers it (`gap-3` is 12, `py-24` is 96). The rules for
using it:

| Between | Space |
|---|---|
| sections | `--section-y`: 96 to 160 desktop, 64 to 100 phone |
| a section heading and its content | `--stack`: 40 to 48 |
| eyebrow and heading | 16 |
| heading and lead | 20 to 24 |
| lead and buttons | 32 |
| buttons in a row | 8 |
| tiles in a grid | 12 to 24 |
| columns of open content | 24 horizontal, 40 vertical |
| inside a large tile | 40 to 64 desktop, 24 to 32 phone |
| inside a card | 20 to 24 |
| rows in a list | 16 vertical padding |

Section padding to heading-gap is about 3 to 1. That ratio is what reads as rhythm:
large breaks between ideas, small breaks inside them. Equal spacing everywhere reads as
nobody decided.

**No magic numbers.** `mt-[37px]` means the system is missing something. Either a token
covers it, or it is a one-off that the critique loop will catch as drift.

## Vertical rhythm of a section

```text
                       --section-y (top)
EYEBROW                label
                       16
Section claim          display-l
                       20
One sentence lead.     lead
                       --stack
[ content grid ]
                       --section-y (bottom)
```

Two adjacent sections both with padding create a 2x gap. That is intended between
sections on the same ground. When a section has its own background (a panel, a band),
the band's internal padding replaces one of the gaps; do not stack three.

## Alignment anchors

Name them in DESIGN.md and check them in the critique loop (`measure.js` reports
`contentLeftEdges`; a healthy page has two or three distinct left edges, not ten):

1. **The container edge.** Section headings, grids, rules, footer columns.
2. **The text column.** Heading blocks and leads stop at 720px.
3. **The axis.** Centered beats (hero, thesis, close) share the page center.
4. **The split line.** In split layouts, the boundary between copy and product.

## Responsive behavior

Design the transformations, do not shrink. At minimum check 375, 768, 1024, 1280 and 1440.

| Component | Desktop | Tablet (768 to 1023) | Phone (under 768) |
|---|---|---|---|
| Nav | wordmark, links, actions | wordmark, two links, action | wordmark + action pill, links in a sheet |
| Hero (statement) | centered, 2 lines | centered | left-aligned or centered, 3 to 4 lines at 40px, buttons side by side if they fit |
| Hero (split) | copy 5 / product 7 | stacked, product below | stacked, product cropped to its key region |
| Stage with three phones | three phones | two | one, the live one |
| Ruled columns | 3 across | 3 across | stacked, rules stay |
| Use tiles | 3 x 2 grid | 2 x 3 | horizontal snap scroller, 78% width tiles, scrollbar hidden |
| Tabbed showcase | list left, panel right | stacked | list as an accordion, panel opens under the active item |
| Comparison pair | side by side | side by side | stacked, ours second |
| Stats | 3 across | 3 across | stacked with rules |
| Tables | full | horizontal scroll inside the card | rows become two-line items |
| Signature stream | full width | full width | slower, narrower cards, the slab narrows |
| Footer | brand + 3 columns | brand + 3 columns | brand, then 2 columns |
| Section padding | 128 to 160 | 96 to 120 | 64 to 100 |

Rules:

- **No horizontal scroll at 375.** `measure.js` reports `horizontalOverflow`.
- **Touch targets 44px.** Buttons are 44px tall at md for this reason.
- **Real CSS media queries for row and column swaps** if a framework's responsive display
  classes conflict in dev (Gloam hit this with webpack dev and Tailwind `sm:`/`lg:`
  display variants). The production build is the truth; check it, not dev.
- **Use `svh`** for full-height heroes (`min-h-[calc(100svh-8rem)]`), so mobile browser
  chrome does not crop them.
- **Respect the safe area** on fixed bottom bars: `padding-bottom: env(safe-area-inset-bottom)`.
- **Phones are not small desktops.** Hide the second and third phone, not the copy. Keep
  the signature but simplify it. Keep one action visible without scrolling.
