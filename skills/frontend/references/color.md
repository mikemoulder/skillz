# Color

Premium interfaces get their hierarchy from value (light and dark), spacing, type and
lines. Hue is the last tool, used for meaning. The fastest test of a palette: convert the
screenshot to grayscale. If the hierarchy survives, the palette is doing its job. If
everything that mattered was "the purple one", it was not.

## The token set

Every color on the page is one of these. `globals.css` removes Tailwind's default palette,
so anything else does not render.

| Token | Job | Rule |
|---|---|---|
| `ground` | the page | 60% of every screen |
| `surface`, `surface-2` | stages, panels, a step inside them | one and two steps from the ground |
| `panel` | cards, inputs, popovers | the lightest (light mode) or one step up (dark) |
| `tile` | flat content blocks | on quiet-monochrome it is white on grey; on luminous-dark it is a step up |
| `fill`, `fill-strong` | quiet buttons, chips, field backgrounds, hover | translucent fg, so it works on any surface |
| `glass`, `glass-line` | the floating nav and overlays | the only translucent surfaces; pair with a backdrop blur |
| `fg`, `fg-soft`, `fg-mute`, `fg-faint` | text at four strengths | one color, four strengths, never five grays |
| `line`, `line-strong` | hairlines, then rules and input borders | |
| `action`, `on-action`, `action-hover` | the primary button | usually ink: black on light, white on dark |
| `accent`, `accent-soft`, `on-accent-soft` | one meaning | under 5% of a screen |
| `success`, `warning`, `danger` (+ `-soft`) | state only | never decoration, never a theme |
| `focus` | focus rings | visible on every surface |
| `field-a`, `field-b`, `field-c` | the atmosphere | the only colors a gradient may mix |

## Building a neutral ramp

Pure grays look like defaults. Chosen grays lean two or three degrees toward a hue:

- **Cool graphite** (luminous-dark, technical-grid): hue 250 to 260 at very low chroma.
  `#08090A`, `#111214`, `#17181B`, `#232529`: each a hair blue.
- **Warm paper** (editorial-paper, soft-product): hue 70 to 90. `#F4F3EF`, `#ECEAE4`.
- **True neutral** (quiet-monochrome): pure gray, made deliberate by using translucent
  black for text strengths (`rgb(0 0 0 / .56)`) so text always sits correctly on any tile.

In OKLCH, step lightness evenly and keep chroma under 0.01 for neutrals:

```text
dark ground   oklch(0.13 0.004 255)     light ground  oklch(0.97 0.002 90)
surface       oklch(0.19 0.005 255)     surface       oklch(0.94 0.004 90)
line          oklch(0.27 0.006 255)     line          oklch(0.90 0.006 90)
fg-faint      oklch(0.55 0.008 255)     fg-faint      oklch(0.62 0.006 90)
fg-mute       oklch(0.70 0.008 255)     fg-mute       oklch(0.47 0.006 90)
fg            oklch(0.97 0.002 255)     fg            oklch(0.18 0.006 90)
```

## The accent

### Choosing it

The accent is a meaning, not a mood. Decide what it means first ("sealed", "hazard",
"live", "yours"), then choose a hue that fits the meaning and the brand.

| Hue (OKLCH h) | Reads as | Watch out for |
|---|---|---|
| 25 to 40 red-orange, vermilion | urgent, warm, physical | confused with danger: give danger a different red |
| 60 to 90 amber, gold | valuable, cautious, twilight | low contrast on white: darken for text |
| 130 to 160 green, mint | safe, verified, money in | confused with success: keep success as the same hue on purpose, or move it |
| 180 to 210 teal, cyan | clean, data, health | |
| 250 to 270 blue, ink blue | trust, technical | the most common choice in the category; needs another distinction |
| 280 to 310 violet, purple | AI, generative | the AI template default. Only when it is genuinely the brand |
| 330 to 350 raspberry, magenta | energetic, consumer, social | |

Chroma 0.12 to 0.20 for an accent used as text or fill on light. Above 0.22 it reads as
neon. Lift lightness about 0.08 and drop chroma about 0.02 for dark mode, or the accent
sinks into the ground.

### Deriving the soft pair

```text
accent-soft     light: the accent at L 0.95, C 0.03       dark: the accent at 12% alpha
on-accent-soft  light: the accent at L 0.40               dark: the accent at L 0.85
```

### The budget

- **Under 5% of any screen.** With the accent on the action button, up to 10%.
- **One accent.** Two accents read as a template; one reads as a product.
- **Where it lives, written down.** DESIGN.md states the accent rule in one sentence,
  e.g. "Safety orange marks a hazard. It never appears in the chrome."
- **Quiet-monochrome puts it inside the product only:** in the mocks, the charts, the
  status. The navigation, buttons and headings stay monochrome.

## Gradients

**Allowed:**

- The atmosphere field: soft blurred radial light inside one panel, mixed only from the
  `--field` tokens, drifting slowly or not at all. One per screen.
- Data: a chart's area fill fading to transparent. A progress fill.
- Masks: fading the edges of a marquee or a stream to transparent.
- A dark statement band with a single soft glow toward the brand hue at 15 to 20%.

**Never:**

- Gradient text.
- Purple to blue, or any two-hue gradient as decoration.
- Gradient buttons, gradient borders, animated gradient borders.
- Multiple glowing orbs. A mesh gradient as the whole hero with nothing to say.
- A gradient on a card to make it "pop".

## Dark mode

- **Never pure black.** `#08090A` to `#0B0C0E` grounds. Pure black kills depth and makes
  borders look like cuts.
- **Elevate with lightness.** Each surface step is about 3 to 5% lighter. Shadows barely
  show on dark; use them as an inset top highlight plus a long soft drop.
- **Text is not pure white.** `#F4F5F6` reads better; pure white vibrates on dark.
- **Borders are solid tones or white at 8 to 12% alpha,** never mid-gray.
- **Lift the accent** (above) and soften state colors (`#F08A7E` danger, not `#FF0000`).
- **Images and marks:** SVG with `currentColor`, or transparent PNGs. A white rectangle on
  a dark ground is a glowing hole.

Both modes are defined in every direction block. Ship one mode first per `brand.mode`, and
add the second only when it is tested at every breakpoint. `.theme-dark` and
`.theme-light` scope a mode to one band (a dark developer panel on a light page), which is
the cheapest way to get contrast without a second site.

## Contrast

| Pair | Minimum | On a projector |
|---|---|---|
| Body text | 4.5 : 1 | 7 : 1 |
| Large text (24px+, or 19px+ bold) | 3 : 1 | 4.5 : 1 |
| UI boundaries (inputs, focus rings) | 3 : 1 | |

`fg-mute` is the risky token: it carries every secondary line. Check it on the ground and
on every tile. `.projector` on `<html>` raises it to about 7:1 for the stage.

## The grayscale test

Before calling the palette done: screenshot the hero and one dense section, convert to
grayscale (any image tool, or `filter: grayscale(1)` on `<html>` in devtools), and check
that the headline, the action and the signature still lead. If they do not, the
hierarchy was resting on hue. Fix it with value, size and space.
