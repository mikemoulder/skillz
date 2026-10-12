# Components

One component language for the whole product: the same heights, corners, strengths and
states everywhere. A button on the landing page and a button inside the app are the same
button. Specs below use the tokens; values in brackets are quiet-monochrome and
luminous-dark measurements.

## Surfaces: box or no box

The most important component decision is whether something needs a container at all. AI
pages put everything in a card. Studios put almost nothing in one.

```text
Is it an object the user can act on (open, select, pay, approve)?
  yes -> CARD: panel bg, hairline, card shadow, radius tile
  no  -> Is it a stage for product UI, a demo, or an atmosphere field?
           yes -> PANEL: surface bg, radius panel, no border
           no  -> Is it one of several parallel items that need grouping
                  (use cases, plans, a comparison)?
                    yes -> TILE: tile bg, radius tile, no border, no shadow
                    no  -> Is it a list of things to scan?
                             yes -> ROWS: hairline dividers, no boxes
                             no  -> OPEN CONTENT: text on the ground,
                                    with a top rule if it is one of a set
```

| Surface | Look | Example |
|---|---|---|
| Open content | text on the ground, optional 1px top rule in `fg` | Gloam "The app / The protocol / The SDK" |
| Rows | 1px `line` dividers, hover fills the row with `fill` | Gloam payroll steps; any index |
| Tile | `tile` bg, radius `tile`, no border, no shadow | Teampot use-case cards [white, 32]; Gloam use tiles [surface, 18] |
| Card | `panel` bg, 1px `line`, `shadow-card`, radius `tile` | a payment card, a product mock |
| Panel | `surface` bg, radius `panel`, holds a field or a demo | Teampot stage [#E9E9E9, 24]; Gloam hero [24] |
| Feature | `tile` bg, radius `feature`, 64px padding | Teampot closing CTA pair [white, 64] |

Never stack decorations: a card gets a border **or** a tinted background **or** a shadow
as its main signal, and at most a hairline plus a soft shadow together. Border, tint,
shadow and glow on one card is the template signature.

## Buttons

| Spec | Value |
|---|---|
| Heights | 36 (sm), 44 (md), 48 (lg). One height per row |
| Padding | 16 / 22 / 28 horizontal |
| Radius | `--r-button` (pill in most directions, 6 in technical, 0 in bold) |
| Type | 13 / 14 / 15px, `--ui-weight`, tracking -0.005em, no uppercase |
| Hover | background shifts one step (`action-hover`, `fill-strong`); no lift, no glow |
| Active | `scale(0.98)` for 150ms |
| Focus | 2px `focus` outline, 3px offset |
| Disabled | 45% opacity, `not-allowed`, no hover |
| Busy | label hidden, spinner in place, width kept, `aria-busy` |

Variants and when to use them:

| Variant | Look | Use |
|---|---|---|
| `action` | ink pill | the one primary action of a section. Never two in one section |
| `quiet` | translucent fill | the secondary action beside it ("Take the tour") |
| `ghost` | hairline border | secondary on busy backgrounds, toolbars |
| `text` | no chrome, fill on hover | tertiary actions, cancel |
| `accent` | accent-soft fill | an action that carries the accent's meaning ("Verify a proof") |
| `danger` | danger fill | destructive confirmation only, inside a dialog |
| Arrow link | words plus an arrow that moves 3px on hover | inline and column CTAs: "Read the docs ->" |

Labels are verb plus object: "Open the app", "Run a test payroll", "Read the docs". Not
"Get started", "Learn more", "Submit".

## Navigation

Pick one pattern from the direction and build it once:

| Pattern | Spec | Direction |
|---|---|---|
| Floating pill | fixed, 16px from top, centered, `min(862px, 100% - 32px)` wide, 52px tall, radius 26, `bg-glass backdrop-blur-[20px]`, padding 4 4 4 24, links 14px in 44px hit areas | quiet-monochrome |
| Sticky bar | sticky, full width, 64px, `bg-ground/85 backdrop-blur-[24px]`, inner content in the container, links centered | luminous-dark |
| Ruled bar | static or sticky, 56 to 64px, 1px bottom rule, no blur | editorial, technical |
| App shell | 240px sidebar at 1024 and up; bottom tab bar (max 4 single-word tabs) on phones | product screens |

Rules: four to six links at most; one action button on the right; the current page is
marked; on phones the nav shows the wordmark plus the action, with the rest in a sheet.
Never a mega menu on a hackathon project. The announcement line above the nav (13px, one
sentence, a link, dismissible) is the one place for news.

## Inputs

48px tall, radius `input`, 1px `line-strong`, `panel` background, 15px text. Focus: border
to `fg` plus a 3px `fill-strong` ring. Invalid: `danger` border, `danger-soft` ring, and a
message under the field in `danger` at 14px that says how to fix it. Every input has a
visible `<label>`; placeholders are examples, not labels.

Segmented controls and tabs: a `fill` track with radius `chip`, 3px padding, the active
segment on `panel` (light) or `fg` with `on-action` text (dark). 32 to 40px tall.

## Labels, chips and badges

- **Eyebrow:** `t-label`, above a heading, one to three words: "Built on Tempo", "The SDK".
- **Status chip:** 24px tall, radius chip, 12px medium text, semantic soft background with
  a 6px dot. Only where state is real (Settled, Waiting, Refused). Never "New", "Beta",
  "AI-powered" or "Hot" as decoration.
- **Count badge:** a small number on a nav item or tab ("3 waiting"), in `fill`, not red,
  unless it is genuinely urgent.

Budget: no more than one chip per card and no more than a handful per screen. A grid of
pills is the second most common template tell.

## Stats

A top rule (1px `line-strong`), 24px of space, the number large in `t-num`
([54px / 400 / -0.04em]), the label under it at 14px in `fg-mute`, three across. Only
numbers that were measured, each with a label that says what was measured ("~1 second:
payday for the whole company, one payment on Tempo"). Never "10x", "99.9%" or "10,000+"
without a source.

## Code blocks

`panel` or `surface` background, radius 16, 1px `line`, a 44px header strip with the file
or command name and a copy button that flips to "Copied" for two seconds. 14px mono at
1.75 line height. Syntax colors from the tokens: comments `fg-faint`, strings `accent` or
`success`, keywords `fg`. A one-line install command gets its own copyable pill.

## Product frames

| Frame | Spec |
|---|---|
| Phone | 312 x 620, radius 44, 8px white bezel (`shadow-frame`), real UI inside, scaled |
| Browser | radius `panel`, 1px `line`, a 40px quiet top bar with one dot and the URL in `fg-faint` |
| Stage | a `panel` of 520 to 640px holding one to three frames, the side ones lowered 64px |

Real UI only: render the product's own components with seed data, or embed the live app
in an iframe scaled down (Teampot's middle phone is the running app). Never a fake
screenshot of features that do not exist.

## Footer

Pick by tone:

| Pattern | Contents | Direction |
|---|---|---|
| Inverse columns | black band, mark left (1fr), 3 link columns (2fr), note line under | quiet-monochrome |
| Inset panel | rounded inverse panel inside the container: statement, email, socials, a pill on the left; 3 labeled columns right; legal row with a theme switch | luminous-dark |
| Minimal line | one row: wordmark, three links, status, copyright | apps, small sites |
| Big wordmark | the name at viewport width, cropped at the bottom | bold-signal only |

Every link goes somewhere real. Column headings say what is in them (Product, Proof,
Developers), not "Resources". Include the one honest line the product needs: "Testnet.
Test money only." The footer concludes the page; it does not need eighteen links.

## Icons

One set, one stroke width, one size per context. Either `lucide-react` with
`strokeWidth={1.5}` at 20 to 24px, or a small custom set drawn on a 24 grid at 1.3 to
1.5 stroke (Gloam draws its own). Icons mark navigation, actions and list items. They do
not decorate headings, and they never sit in a tinted rounded square above a feature
title (the template feature grid).

## Interaction states, all of them

Every interactive component has: rest, hover, focus-visible, active, disabled, and where
relevant busy, selected, invalid and empty. The system sheet (`/system`) renders them all;
if a state is missing there, it is missing everywhere.
