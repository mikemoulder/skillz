# Design tokens

The goal is not beauty. The goal is **coherence**. A judge cannot articulate
why one hack looks professional and another looks like a template, but the
difference is almost always consistency, not talent.

## Picking the accent

One accent. Set `--brand` and stop. In oklch the three numbers are
`L C H`: lightness (0-1), chroma (saturation), hue (0-360).

| Hue | Reads as | Good for |
|---|---|---|
| 264 indigo | technical, trustworthy | dev tools, infra, fintech |
| 195 cyan | clean, modern | data, analytics, health |
| 150 green | growth, safe | climate, wellness, money-in |
| 85 amber | energetic, warm | consumer, social, marketplaces |
| 25 red-orange | urgent, bold | security, alerts, sports |
| 300 violet | creative, AI-coded | generative, design tools |

Keep chroma in `0.14-0.20` and lightness in `0.55-0.68` for light mode. Above
0.22 chroma you get the neon-startup look; below 0.10 it reads grey and the
accent stops working as a signal.

**Lift the accent for dark mode.** The same color on a dark ground looks
darker and muddier. `assets/globals.css` already does this: L +0.08,
chroma -0.02. Skip this and your primary button disappears.

## Why one accent

Color in a UI is a signal, not decoration. If two things are colored, the user
must work out which one matters. In a ten-second judging glance they will not.
The rule that follows:

> Exactly one primary button per screen. Everything else is `variant="outline"`
> or `variant="ghost"`.

Semantic colors (`--destructive`, `--success`, `--warning`) are exempt: they
carry meaning, not emphasis. They appear on state, never on chrome.

## The 60/30/10 split

- **60%**: `--background`. Most of the screen is nothing.
- **30%**: `--card`, `--muted`, `--foreground`. Structure and text.
- **10%**: `--primary`. The one action, the active tab, the key metric.

If your screen has more than ~10% accent, it looks like a landing page for a
product that does not exist. Judges have seen a thousand of those.

## Type scale

Four sizes. Weight and color carry the rest of the hierarchy.

| Role | Class | Weight |
|---|---|---|
| Hero / page title | `text-3xl` or `text-4xl` | `font-semibold tracking-tight` |
| Section | `text-xl` | `font-semibold tracking-tight` |
| Body | `text-base` (`text-sm` in dense UI) | `font-normal` |
| Label / meta | `text-sm` | `text-muted-foreground` |

`tracking-tight` on headings is doing real work: default letter-spacing at
large sizes is the single most common tell of an unstyled app.

Per `brand.vibe`:

| vibe | Scale | Borders | Radius | Motion |
|---|---|---|---|---|
| technical | tight, `text-sm` body, mono for numbers | 1px, visible | 0.5rem | 150ms, minimal |
| playful | larger body, generous line-height | soft, low contrast | 1rem | 250ms, spring |
| editorial | serif headings, wide measure | hairline | 0.25rem | 200ms fade only |
| brutalist | oversized headings, all-caps labels | 2px, full contrast | 0 | none, or instant snap |

## Spacing

`gap-2` (8px) inside a component, `gap-4` (16px) between components,
`gap-8` (32px) between sections, `py-8` page padding. Four values. Every
number outside this set needs a reason.

Vertical rhythm matters more than horizontal: inconsistent gaps between
sections is what makes a page feel "unfinished" even when each block is fine.

## Contrast

| Context | Floor |
|---|---|
| Body text | 4.5:1 |
| Large text (18px+ bold, 24px+) | 3:1 |
| Anything on a projector | **7:1** |
| Focus rings, borders on interactive elements | 3:1 |

Check the pairs you actually shipped, not the ones you intended:

```bash
# quick sanity: does muted text survive? open devtools, or eyeball it at
# 50% screen brightness with the room lights on. that is the demo condition.
```

`--muted-foreground` is the danger token. It is used for every label, every
timestamp, every helper line, and it is the first thing a projector eats.
`assets/globals.css` ships a `.projector` class that raises it to ~7:1;
add `projector` to `<html>` before you walk on stage.

## Dark mode

Rules that differ from light mode and catch people out:

- **Never pure black.** `oklch(0.16 ...)` not `#000`. Pure black kills the
  sense of depth and makes borders look like tears in the screen.
- **Elevate with lightness, not shadow.** Cards are *lighter* than the page.
  Shadows are near-invisible on dark grounds.
- **Borders become `oklch(1 0 0 / 12%)`**, white at low alpha, not a grey.
  A solid grey border on dark reads as a seam.
- **Desaturate long text.** Pure white body copy on dark vibrates. `0.97 L`
  with a trace of the neutral hue reads better than `#fff`.

Pick one mode and commit (`brand.mode`). A toggle is 30 minutes you do not
have, and a half-tested second theme is worse than one good one.
