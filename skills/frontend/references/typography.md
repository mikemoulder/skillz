# Typography

Type is most of what a page looks like. Strip the color and imagery from any site this
skill was calibrated against and it still looks designed, because the type was. The
fastest way to make a page look generated is to leave type at its defaults: bold
headlines at normal tracking, body line height on display sizes, five weights, gray-500
everywhere.

## Choosing the family

One family does almost everything. Add a mono for technical data, and a serif only when
the direction calls for it (editorial-paper, or one statement band). Never two sans
families.

| Direction | Display | Body | Mono | Source |
|---|---|---|---|---|
| quiet-monochrome | Inter Tight 500 | same | Geist Mono | Google |
| luminous-dark | General Sans / Satoshi 300 (or Geist 300) | same at 400 | Geist Mono | Fontshare (local) or Google |
| editorial-paper | Instrument Serif 400, Newsreader, Fraunces | Inter, Instrument Sans | IBM Plex Mono | Google |
| technical-grid | Geist 600 | Geist 400 | Geist Mono | Google |
| soft-product | Manrope 600, Plus Jakarta Sans, Hanken Grotesk | same at 400 | none | Google |
| bold-signal | Bricolage Grotesque 800, Space Grotesk 700; Clash Display, Cabinet Grotesk | Inter, Space Grotesk 400 | JetBrains Mono | Google, Fontshare |

**Licensing.** Google Fonts and Fontshare fonts are free for commercial use. Aeonik,
Söhne, Neue Montreal (commercial use needs a license), GT America, Pilat and Circular are
paid. Use a licensed face only if the team owns the license; otherwise use the free
stand-in from the table. Closest free stand-ins, by feel rather than by claim:

| Licensed | Free stand-in |
|---|---|
| Aeonik | General Sans, Satoshi |
| Söhne, Pilat, GT America | Inter Tight, Geist |
| Neue Montreal, Neue Haas | Switzer, Inter Tight |
| Circular | Manrope, Plus Jakarta Sans |
| GT Sectra, Tiempos | Newsreader, Fraunces |

**What to avoid as the brand face:** Inter at default settings (fine as body, anonymous as
display), Poppins and Montserrat (the template defaults of the last decade), Roboto, Arial
or system UI as display, any script or novelty face, and more than one display family.

## Loading

Self-host through `next/font`, which removes the layout shift and the font CDN from the
critical path (and so keeps `demo.offline_safe` true):

```tsx
// src/app/layout.tsx
import { Inter_Tight, Geist_Mono } from "next/font/google";
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-brand-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-brand-mono", display: "swap" });
// <html className={`${sans.variable} ${mono.variable}`}>
```

A separate display face goes in `--font-brand-display`; `globals.css` falls back to the
sans when it is not set. Instrument Serif is not variable, so pass `weight: "400"`.

Fontshare faces: download the family from fontshare.com, put the `.woff2` files in
`src/fonts/`, and load them with `next/font/local`:

```tsx
import localFont from "next/font/local";
const sans = localFont({
  src: [
    { path: "../fonts/GeneralSans-Light.woff2", weight: "300" },
    { path: "../fonts/GeneralSans-Regular.woff2", weight: "400" },
    { path: "../fonts/GeneralSans-Medium.woff2", weight: "500" },
  ],
  variable: "--font-brand-sans",
  display: "swap",
});
```

Load only the weights the scale uses. Every extra weight is a request and a temptation.

## The scale

Roles, not sizes. Each role has a size, a line height, a tracking and a weight, and they
are set together in the tokens. The values below are the quiet-monochrome and
luminous-dark measurements; other directions are in `directions.md`.

| Role | quiet-monochrome | luminous-dark | Use |
|---|---|---|---|
| display-xl | 40 to 60 / 0.95 / -0.04em / 500 | 42 to 76 / 1.02 / -0.028em / 300 | the hero H1, once per page |
| display-l | 28 to 36 / 1.1 / -0.02em / 500 | 32 to 48 / 1.06 / -0.022em / 300 | section claims |
| display-m | 22 to 30 / 1.1 / -0.02em | 26 to 34 / 1.1 / -0.018em | sub-claims, tab titles |
| title | 20 / 1.2 / -0.02em / 500 | 19 / 1.375 / -0.01em / 400 | card and column titles |
| lead | 17 / 1.45, muted | 17 to 19 / 1.6, muted | the sentence under a heading |
| body | 16 / 1.4 / 500 | 16 / 1.6 / 400 | paragraphs |
| small | 14 / 1.43 | 14 / 1.625 | metadata, captions, secondary |
| label | 10 / 1.6 / +0.06em / 500, upper | 11 / 1.4 / +0.08em / 500, upper | eyebrows |
| num | 54 / 1.1 / -0.04em / 400 | 26 / 1 / -0.02em / 300 | money and stats |

### The rules behind the numbers

- **Tracking tightens as size grows.** About -0.02em at 32px, -0.03em at 48px, -0.04em at
  64px and up, for weights 500 to 600. Light weights (300) need about 0.01em less; heavy
  weights (800) about 0.01em more. Body is 0. Uppercase labels at 10 to 12px get +0.04em
  to +0.1em. Default tracking on a 64px headline is the single most common unstyled tell.
- **Line height falls as size grows.** Display 0.92 to 1.06, section headings 1.06 to 1.15,
  titles 1.2 to 1.4, body 1.4 to 1.65. Large type with body leading falls apart into
  separate lines.
- **Scale contrast is the hierarchy.** The hero should be 3.5 to 5 times the body size
  (Tempo: 53/16; Gloam: 75/18). Section claims about 2 to 3 times. Below 3 the hero does
  not lead.
- **Two weights, three at most.** Quiet-monochrome uses one (500) plus 400 for numbers.
  Luminous-dark uses 300 display, 400 body, 500 UI. Weight is hierarchy; "everything
  bold" is no hierarchy.
- **Color strength, not more sizes.** Secondary text is the same size in a weaker
  strength (`fg-mute`), not a smaller size. Four strengths of one color cover everything.
- **Measure.** Body 45 to 75 characters (`max-w-[56ch]` for leads, `65ch` for prose). Hero
  copy about 46ch. Headings get `text-wrap: balance`; paragraphs get `text-wrap: pretty`.
- **Numbers.** `tabular-nums` in every column, table and changing value. Money can show
  small cents (`$2,981` large, `.40` at 60%). Large numbers often look best a weight
  lighter than headings.
- **Keep compound words whole in display type.** A headline that breaks "walk-" at the
  end of a line looks like an accident. Use a non-breaking hyphen (U+2011) or wrap the
  compound in a `whitespace-nowrap` span, and check the hero at 390.
- **Fluid sizes.** `clamp(min-at-375, vw, max-at-1440)`. Write the min for a 375px
  phone, not for 320, and check the hero at 390 and 1440.

### Never

- A headline in all caps (labels only).
- Text under 12px that a person must read. Labels at 10 to 11px are the only exception.
- Justified text. Centered paragraphs longer than three lines.
- Italic or bold for emphasis inside display type (change the color strength instead).
- Gradient text. Outline text. Text shadows.
- Line lengths over 80 characters.
- A different heading size per section. The tokens are the only sizes.

## Hierarchy in one screen

A heading block has at most three levels, separated by size, then strength, then space:

```text
EYEBROW LABEL              label, fg-faint             (optional, 1 to 3 words)
                           16px
The claim, in display      display-l, fg
                           20px
The one sentence that      lead, fg-mute, 56ch
explains it.
                           var(--stack), 40 to 48px
[content]
```

## Semantic level is not visual size

`<h2 className="t-display-xl">` is fine. Choose the HTML level for the document outline
(one h1, then h2 for sections, h3 inside them, never skipping) and the type role for the
eye. The `Heading` primitive takes both: `<Heading as="h2" size="xl">`.
