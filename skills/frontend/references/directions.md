# Directions

Six complete visual worlds. Each is a coherent set of decisions (ground, type voice,
surfaces, corners, color strategy, motion, nav, hero, footer) with a token block that
replaces the `TOKENS:START` to `TOKENS:END` region of `assets/globals.css`.

A direction is a starting point chosen in pass 3 of the imagination engine, never a
costume. Change any value with a reason written in DESIGN.md. Change none without one.

| Direction | Feels | For | Measured from |
|---|---|---|---|
| [quiet-monochrome](#quiet-monochrome) | calm, assured, Apple-adjacent | payments, fintech, team tools, consumer-grade B2B | tempo.xyz via Teampot |
| [luminous-dark](#luminous-dark) | discreet, technical, a little dramatic | crypto, privacy, security, AI infrastructure | gloam.trade |
| [editorial-paper](#editorial-paper) | considered, literate, trustworthy | research, writing, climate, civic, docs-heavy products | composite |
| [technical-grid](#technical-grid) | exact, fast, no-nonsense | developer tools, APIs, databases, CLIs | composite |
| [soft-product](#soft-product) | warm, friendly, human | consumer apps, health, education, social, marketplaces | composite |
| [bold-signal](#bold-signal) | loud, cultural, confident | communities, events, games, onchain culture | composite |

Every block sets the accent to a placeholder. Replace it with `brand.accent` from CONFIG,
then re-derive `accent-soft` and `on-accent-soft` (`references/color.md`).

---

## quiet-monochrome

**The idea.** The interface steps back so the product can step forward. Grey ground, black
type in one weight, white rounded tiles with no borders, black pill buttons. Color exists,
but only inside the product: the mocks, the charts, the status. The chrome is monochrome.

| Dial | Setting |
|---|---|
| Ground | light first (`#F5F5F5`), dark available |
| Type voice | one family, one weight (500) for everything; big numbers at 400 |
| Density | airy: 160px between sections, 48px heading to content |
| Corners | round: tiles 32 (24 on phones), stages 24, closing cards 56, pills for every control |
| Surfaces | flat tones. White tiles on grey. No borders, no card shadows. 1px rules for lists and stats |
| Color | monochrome chrome; color appears only inside product UI and state |
| Motion | quiet: line art that draws itself, light traveling along a path, a slow marquee |

**Fonts.** Inter Tight 500 (Google). Alternatives: Geist 500, Instrument Sans 500.
Licensed equivalents a team may own: Pilat, Söhne, Neue Montreal.

**Nav.** Floating centered pill: 52px tall, radius 26, `rgba(225,225,225,.6)` with
`blur(20px)`, max 862px wide, 16px from the top. Wordmark left, 4 to 6 links at 14px, one
black pill on the right. On phones: wordmark plus the pill, links in a sheet.

**Hero.** Statement + stage (`sections.md` H1). Centered two-line H1, one sentence, an
action pill and a quiet pill, then a large grey stage holding the live product.

**Signature fits.** Live stage, drawn mechanism, instrument.

**Footer.** Inverse column footer: black, mark left, three link columns, one note line.

**Pitfall.** It can go lifeless. The cure is one dark statement band, real product color
in the mocks, and a signature with motion. Never cure it by adding an accent to the chrome.

**Tokens.** The default block in `assets/globals.css`. Nothing to paste.

---

## luminous-dark

**The idea.** Near-black graphite, light display type, and one luminous field that glows
from inside an inset hero panel. Hierarchy comes from value, not hue. One tint (the brand
signal) marks one meaning, under 5% of any screen: sealed, verified, live.

| Dial | Setting |
|---|---|
| Ground | dark first (`#08090A`), light available |
| Type voice | light display (300) with tight tracking, regular body (400), medium UI (500) |
| Density | balanced: 128 to 144px between sections, generous hero |
| Corners | soft: tiles 18, panels 24, inputs 12, pill controls |
| Surfaces | tonal tiles (one step up from ground) plus hairline cards with an inset top highlight |
| Color | graphite monochrome plus one tint with one meaning |
| Motion | a slow drifting field (22s), a signature stream (38s, paused offscreen), 400ms reveals |

**Fonts.** General Sans or Satoshi (Fontshare, free, `next/font/local`) at 300/400/500.
Google-only fallback: Geist 300/400/500. Licensed: Aeonik (what Gloam uses).

**Nav.** Sticky full-width bar, 64px, ground at 85% with `blur(24px)`, optional 13px
announcement line above. Links centered at 14px, a quiet pill and a tint pill on the right.

**Hero.** Atmosphere panel (`sections.md` H2): an inset rounded panel aligned to the nav
container, `calc(100svh - 8rem)` tall, the field drifting behind, copy bottom-left in a
720px column, a small glass "scroll" chip bottom-right.

**Signature fits.** Transformation stream, reveal, split truth.

**Footer.** Inset panel footer: a rounded inverse panel inside the container, a brand
statement and contact on the left, three labeled columns on the right, a legal row with a
theme switch.

**Pitfall.** Glow inflation. One field per screen, two per page at most. No neon, no
purple-to-blue, no glowing borders. If it looks like a gaming peripheral, cut the glow in
half and raise the type contrast.

```css
/* ── TOKENS:START ──────────────────────────── direction: luminous-dark ── */
:root,
.theme-light {
  color-scheme: light;
  --ground: #ffffff;
  --surface: #f3f4f5;
  --surface-2: #eaebed;
  --panel: #ffffff;
  --tile: #f3f4f5;
  --fill: rgb(11 12 14 / 0.05);
  --fill-strong: rgb(11 12 14 / 0.09);
  --glass: rgb(255 255 255 / 0.55);
  --glass-line: rgb(255 255 255 / 0.85);
  --fg: #0b0c0e;
  --fg-soft: #34373c;
  --fg-mute: #5f636a;
  --fg-faint: #979ba2;
  --line: #e4e6e9;
  --line-strong: #cfd2d6;
  --action: #0b0c0e;
  --on-action: #ffffff;
  --action-hover: #26282c;
  --accent: #8a6420; /* placeholder: brand.accent, darkened for light ground */
  --accent-soft: #f6eedf;
  --on-accent-soft: #5c4214;
  --success: #2e7d53;
  --success-soft: #e6f2ea;
  --warning: #8a5a12;
  --warning-soft: #fbf3e4;
  --danger: #b4362a;
  --danger-soft: #fbecea;
  --focus: #4a4e55;
  --elev-card: 0 1px 2px rgb(11 12 14 / 0.04), 0 10px 28px -16px rgb(11 12 14 / 0.12);
  --elev-pop: 0 2px 6px rgb(11 12 14 / 0.05), 0 28px 70px -24px rgb(11 12 14 / 0.3);
  --elev-frame: 0 0 0 1px #e4e6e9, 0 30px 80px -24px rgb(11 12 14 / 0.3);
  --field-a: #ffffff;
  --field-b: #d2d6db;
  --field-c: #efe2c6;
}

[data-theme="dark"],
.theme-dark {
  color-scheme: dark;
  --ground: #08090a;
  --surface: #17181b;
  --surface-2: #1e2023;
  --panel: #111214;
  --tile: #17181b;
  --fill: rgb(255 255 255 / 0.05);
  --fill-strong: rgb(255 255 255 / 0.09);
  --glass: rgb(255 255 255 / 0.05);
  --glass-line: rgb(255 255 255 / 0.1);
  --fg: #f4f5f6;
  --fg-soft: #cdd0d4;
  --fg-mute: #9b9fa6;
  --fg-faint: #6c7077;
  --line: #232529;
  --line-strong: #33363b;
  --action: #f4f5f6;
  --on-action: #0b0c0e;
  --action-hover: #d7d9dc;
  --accent: #e8c07d; /* placeholder: brand.accent */
  --accent-soft: rgb(232 192 125 / 0.12);
  --on-accent-soft: #f3ddb4;
  --success: #8fd3ad;
  --success-soft: rgb(143 211 173 / 0.12);
  --warning: #e8b86a;
  --warning-soft: rgb(232 184 106 / 0.12);
  --danger: #f08a7e;
  --danger-soft: rgb(240 138 126 / 0.12);
  --focus: #b9bdc3;
  --elev-card: inset 0 1px 0 rgb(255 255 255 / 0.03), 0 12px 30px -18px rgb(0 0 0 / 0.7);
  --elev-pop: inset 0 1px 0 rgb(255 255 255 / 0.04), 0 30px 80px -24px rgb(0 0 0 / 0.85);
  --elev-frame: 0 0 0 1px #232529, 0 30px 80px -24px rgb(0 0 0 / 0.85);
  --field-a: #24272b;
  --field-b: #0c0d0f;
  --field-c: #3a3220;
}

:root {
  --display-weight: 300;
  --display-xl: clamp(42px, 5.2vw, 76px);
  --display-xl-lh: 1.02;
  --display-xl-tracking: -0.028em;
  --display-l: clamp(32px, 3.4vw, 48px);
  --display-l-lh: 1.06;
  --display-l-tracking: -0.022em;
  --display-m: clamp(26px, 2.6vw, 34px);
  --display-m-lh: 1.1;
  --display-m-tracking: -0.018em;
  --title: 19px;
  --title-lh: 1.375;
  --title-tracking: -0.01em;
  --title-weight: 400;
  --lead: clamp(17px, 1.3vw, 19px);
  --lead-lh: 1.6;
  --body: 16px;
  --body-lh: 1.6;
  --body-weight: 400;
  --small: 14px;
  --small-lh: 1.625;
  --label: 11px;
  --label-lh: 1.4;
  --label-tracking: 0.08em;
  --label-weight: 500;
  --label-transform: uppercase;
  --label-family: var(--font-sans);
  --ui-weight: 500;
  --num-weight: 300;
  --r-chip: 999px;
  --r-button: 999px;
  --r-input: 12px;
  --r-tile: 18px;
  --r-panel: 24px;
  --r-feature: 28px;
  --page-max: 1400px;
  --gutter: clamp(16px, 2.2vw, 28px);
  --section-y: clamp(80px, 9vw, 144px);
  --stack: 40px;
  --motion-out: cubic-bezier(0.22, 1, 0.36, 1);
  --motion-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-micro: 180ms;
  --dur-ui: 240ms;
  --dur-reveal: 400ms;
  --reveal-y: 12px;
}
/* ── TOKENS:END ───────────────────────────────────────────────────────── */
```

Set `<html data-theme="dark">` for dark first.

---

## editorial-paper

**The idea.** A well-set publication that happens to be software. Warm paper, ink type, a
serif display face over a quiet grotesk, hairline rules, numbered sections, wide margins.
Confidence comes from scale contrast and restraint, not effects.

| Dial | Setting |
|---|---|
| Ground | light first (warm paper `#F4F3EF`), dark available |
| Type voice | serif display (400) with near-neutral tracking; sans for titles, UI and body |
| Density | balanced, with a wide measure and generous margins |
| Corners | sharp: buttons 6, tiles 8, panels 12 |
| Surfaces | hairlines. Rules between everything, almost no fills, no shadows |
| Color | ink monochrome plus one deep accent (oxblood, forest, ink blue) |
| Motion | fades only, 200 to 500ms, underlines that draw in on hover |

**Fonts.** Display: Instrument Serif 400, Newsreader or Fraunces (Google). Body: Inter or
Instrument Sans. Licensed: GT Sectra, Tiempos, Söhne.

**Nav.** Minimal: wordmark left set in the serif, three links and one bordered button
right, a 1px rule under the bar. No blur, no pill.

**Hero.** Editorial headline (`sections.md` H4): an oversized left-aligned serif headline
across ten columns, a meta row of three facts between rules, then a figure.

**Signature fits.** Drawn mechanism with footnote-style labels, split truth set as a
two-column comparison, an annotated product figure with numbered callouts.

**Footer.** Minimal line or column footer on paper, separated by a strong rule. Optional
colophon line: typefaces, built where, by whom.

**Pitfall.** Reading as a blog template. It needs a real product figure, a number with a
source, and scale contrast of at least 4:1 between display and body.

```css
/* ── TOKENS:START ──────────────────────────── direction: editorial-paper ── */
:root,
.theme-light {
  color-scheme: light;
  --ground: #f4f3ef;
  --surface: #ecebe5;
  --surface-2: #e3e1d9;
  --panel: #fbfaf7;
  --tile: #ecebe5;
  --fill: rgb(18 19 22 / 0.05);
  --fill-strong: rgb(18 19 22 / 0.09);
  --glass: rgb(244 243 239 / 0.82);
  --glass-line: rgb(18 19 22 / 0.08);
  --fg: #121316;
  --fg-soft: #34363b;
  --fg-mute: #63636b;
  --fg-faint: #8e8e95;
  --line: #e1ded6;
  --line-strong: #c9c5bb;
  --action: #121316;
  --on-action: #f4f3ef;
  --action-hover: #2b2c30;
  --accent: #9a3b26; /* placeholder: brand.accent */
  --accent-soft: #f3e3dd;
  --on-accent-soft: #6e2817;
  --success: #2f6b46;
  --success-soft: #e4efe7;
  --warning: #8a5a12;
  --warning-soft: #f6eedf;
  --danger: #a83224;
  --danger-soft: #f6e4e0;
  --focus: #121316;
  --elev-card: none;
  --elev-pop: 0 1px 0 #c9c5bb, 0 18px 40px -24px rgb(18 19 22 / 0.25);
  --elev-frame: 0 0 0 1px #c9c5bb;
  --field-a: #fbfaf7;
  --field-b: #e3e1d9;
  --field-c: #efe0d6;
}

[data-theme="dark"],
.theme-dark {
  color-scheme: dark;
  --ground: #141412;
  --surface: #1c1c19;
  --surface-2: #252521;
  --panel: #191916;
  --tile: #1c1c19;
  --fill: rgb(237 235 229 / 0.06);
  --fill-strong: rgb(237 235 229 / 0.1);
  --glass: rgb(20 20 18 / 0.82);
  --glass-line: rgb(237 235 229 / 0.08);
  --fg: #edebe5;
  --fg-soft: #cfccc4;
  --fg-mute: #9c9a93;
  --fg-faint: #6e6c66;
  --line: #2a2925;
  --line-strong: #3a3833;
  --action: #edebe5;
  --on-action: #141412;
  --action-hover: #d3d0c8;
  --accent: #e08a6f; /* placeholder: brand.accent */
  --accent-soft: rgb(224 138 111 / 0.12);
  --on-accent-soft: #f2c3b3;
  --success: #8cc7a1;
  --success-soft: rgb(140 199 161 / 0.12);
  --warning: #e3b46a;
  --warning-soft: rgb(227 180 106 / 0.12);
  --danger: #ec8b7c;
  --danger-soft: rgb(236 139 124 / 0.12);
  --focus: #edebe5;
  --elev-card: none;
  --elev-pop: 0 1px 0 #3a3833, 0 18px 40px -24px rgb(0 0 0 / 0.6);
  --elev-frame: 0 0 0 1px #3a3833;
  --field-a: #252521;
  --field-b: #141412;
  --field-c: #2a1d18;
}

:root {
  --display-weight: 400;
  --display-xl: clamp(48px, 7vw, 104px);
  --display-xl-lh: 0.98;
  --display-xl-tracking: -0.015em;
  --display-l: clamp(34px, 4vw, 56px);
  --display-l-lh: 1.04;
  --display-l-tracking: -0.01em;
  --display-m: clamp(26px, 2.6vw, 36px);
  --display-m-lh: 1.1;
  --display-m-tracking: -0.005em;
  --title: 20px;
  --title-lh: 1.3;
  --title-tracking: -0.005em;
  --title-weight: 500;
  --lead: clamp(18px, 1.4vw, 21px);
  --lead-lh: 1.55;
  --body: 17px;
  --body-lh: 1.65;
  --body-weight: 400;
  --small: 14px;
  --small-lh: 1.55;
  --label: 11px;
  --label-lh: 1.4;
  --label-tracking: 0.1em;
  --label-weight: 500;
  --label-transform: uppercase;
  --label-family: var(--font-sans);
  --ui-weight: 500;
  --num-weight: 400;
  --r-chip: 999px;
  --r-button: 6px;
  --r-input: 6px;
  --r-tile: 8px;
  --r-panel: 12px;
  --r-feature: 12px;
  --page-max: 1280px;
  --gutter: clamp(20px, 4vw, 56px);
  --section-y: clamp(88px, 10vw, 144px);
  --stack: 40px;
  --motion-out: cubic-bezier(0.4, 0, 0.2, 1);
  --motion-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-micro: 150ms;
  --dur-ui: 200ms;
  --dur-reveal: 500ms;
  --reveal-y: 0px;
}
/* ── TOKENS:END ───────────────────────────────────────────────────────── */
```

Load the serif as `--font-brand-display` and the sans as `--font-brand-sans`.

---

## technical-grid

**The idea.** The page is a schematic. Visible 1px structure, a monospace voice for labels
and data, sharp corners, real code in the hero, and one signal color for status and the
cursor. Speed is shown, not claimed: a request trace, a latency number, a log.

| Dial | Setting |
|---|---|
| Ground | dark or light, both first-class |
| Type voice | sans display (600) with tight tracking; mono for labels, data and code |
| Density | dense: 96 to 120px between sections, tighter grids |
| Corners | sharp: 6 to 8 everywhere, 12 for frames |
| Surfaces | hairlines as structure: bordered sections, crosshair corners, dashed secondaries |
| Color | monochrome plus one signal (not Vercel blue: choose orange, green or yellow) |
| Motion | functional: cursor blink, typed output, number tickers, 120 to 180ms |

**Fonts.** Geist + Geist Mono (Google). Alternatives: Inter + JetBrains Mono, IBM Plex
Sans + IBM Plex Mono.

**Nav.** Full-width bar with a bottom hairline, 56px, wordmark in the sans, mono version
tag beside it (`v0.4`), links at 14px, a bordered button and an action button.

**Hero.** Terminal hero (`sections.md` H5): headline left, a copyable install command,
then a code or response panel that runs on load.

**Signature fits.** Typing proof, a live request trace with timings, a drawn mechanism
rendered as a schematic.

**Footer.** Minimal line with a status dot ("All systems normal" only if it is real), or a
dense column footer with mono headings.

**Pitfall.** Becoming a Vercel clone. Choose a non-blue signal, an unexpected grid motif
(crosshairs, a dot matrix, a ruler), and make the signature the product's own output.

```css
/* ── TOKENS:START ──────────────────────────── direction: technical-grid ── */
:root,
.theme-light {
  color-scheme: light;
  --ground: #ffffff;
  --surface: #fafafa;
  --surface-2: #f2f2f2;
  --panel: #ffffff;
  --tile: #fafafa;
  --fill: rgb(10 10 10 / 0.04);
  --fill-strong: rgb(10 10 10 / 0.08);
  --glass: rgb(255 255 255 / 0.8);
  --glass-line: #eaeaea;
  --fg: #0a0a0a;
  --fg-soft: #3f3f3f;
  --fg-mute: #666666;
  --fg-faint: #8f8f8f;
  --line: #eaeaea;
  --line-strong: #d4d4d4;
  --action: #0a0a0a;
  --on-action: #ffffff;
  --action-hover: #333333;
  --accent: #e24a00; /* placeholder: brand.accent */
  --accent-soft: #fff0e8;
  --on-accent-soft: #a33500;
  --success: #138a4b;
  --success-soft: #e7f6ee;
  --warning: #9a6700;
  --warning-soft: #fff6dd;
  --danger: #d1242f;
  --danger-soft: #ffebe9;
  --focus: #0a0a0a;
  --elev-card: none;
  --elev-pop: 0 8px 30px rgb(0 0 0 / 0.12);
  --elev-frame: 0 0 0 1px #d4d4d4;
  --field-a: #ffffff;
  --field-b: #ededed;
  --field-c: #fff0e8;
}

[data-theme="dark"],
.theme-dark {
  color-scheme: dark;
  --ground: #0a0a0a;
  --surface: #111111;
  --surface-2: #1a1a1a;
  --panel: #0f0f0f;
  --tile: #111111;
  --fill: rgb(255 255 255 / 0.05);
  --fill-strong: rgb(255 255 255 / 0.09);
  --glass: rgb(10 10 10 / 0.75);
  --glass-line: #1f1f1f;
  --fg: #ededed;
  --fg-soft: #c7c7c7;
  --fg-mute: #a1a1a1;
  --fg-faint: #707070;
  --line: #1f1f1f;
  --line-strong: #2e2e2e;
  --action: #ededed;
  --on-action: #0a0a0a;
  --action-hover: #cfcfcf;
  --accent: #ff6a1f; /* placeholder: brand.accent */
  --accent-soft: rgb(255 106 31 / 0.12);
  --on-accent-soft: #ffb48c;
  --success: #3fcf8e;
  --success-soft: rgb(63 207 142 / 0.12);
  --warning: #f5b83d;
  --warning-soft: rgb(245 184 61 / 0.12);
  --danger: #ff6369;
  --danger-soft: rgb(255 99 105 / 0.12);
  --focus: #ededed;
  --elev-card: none;
  --elev-pop: 0 0 0 1px #2e2e2e, 0 16px 40px rgb(0 0 0 / 0.5);
  --elev-frame: 0 0 0 1px #2e2e2e;
  --field-a: #1a1a1a;
  --field-b: #0a0a0a;
  --field-c: #2a160c;
}

:root {
  --display-weight: 600;
  --display-xl: clamp(40px, 5vw, 72px);
  --display-xl-lh: 1;
  --display-xl-tracking: -0.045em;
  --display-l: clamp(28px, 3vw, 44px);
  --display-l-lh: 1.08;
  --display-l-tracking: -0.035em;
  --display-m: clamp(22px, 2vw, 28px);
  --display-m-lh: 1.15;
  --display-m-tracking: -0.025em;
  --title: 18px;
  --title-lh: 1.35;
  --title-tracking: -0.015em;
  --title-weight: 600;
  --lead: 18px;
  --lead-lh: 1.55;
  --body: 15px;
  --body-lh: 1.6;
  --body-weight: 400;
  --small: 13px;
  --small-lh: 1.5;
  --label: 12px;
  --label-lh: 1.3;
  --label-tracking: 0.04em;
  --label-weight: 500;
  --label-transform: uppercase;
  --label-family: var(--font-mono);
  --ui-weight: 500;
  --num-weight: 500;
  --r-chip: 6px;
  --r-button: 6px;
  --r-input: 6px;
  --r-tile: 8px;
  --r-panel: 12px;
  --r-feature: 12px;
  --page-max: 1200px;
  --gutter: clamp(16px, 3vw, 32px);
  --section-y: clamp(72px, 8vw, 120px);
  --stack: 32px;
  --motion-out: cubic-bezier(0.16, 1, 0.3, 1);
  --motion-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --dur-micro: 120ms;
  --dur-ui: 180ms;
  --dur-reveal: 300ms;
  --reveal-y: 8px;
}
/* ── TOKENS:END ───────────────────────────────────────────────────────── */
```

The grid motif, as a section frame with crosshair corners:

```css
.grid-frame { position: relative; border: 1px solid var(--line); }
.grid-frame::before, .grid-frame::after {
  content: ""; position: absolute; width: 9px; height: 9px;
  border: solid var(--fg-faint); border-width: 0 1px 1px 0;
}
.grid-frame::before { top: -5px; left: -5px; }
.grid-frame::after { bottom: -5px; right: -5px; border-width: 1px 0 0 1px; }
```

---

## soft-product

**The idea.** A friendly consumer product with grown-up restraint. Warm off-white ground,
big soft tiles, a rounded sans at semibold, real phone screens, and one saturated brand
color that is allowed on the primary action. Springy, but never bouncy.

| Dial | Setting |
|---|---|
| Ground | light first (warm `#FAF8F5`), dark available |
| Type voice | rounded or humanist sans at 600 for display, 400 body, larger body size (17px) |
| Density | airy, with large tiles and generous phone imagery |
| Corners | round: tiles 28, panels 32, closing cards 40, pill controls |
| Surfaces | soft elevation: white tiles with a two-layer soft shadow on warm ground |
| Color | one saturated accent, allowed on the primary action and key product moments |
| Motion | gentle springs on press and toggle, 250ms UI, 450ms reveals with a 16px rise |

**Fonts.** Manrope 600/400, Plus Jakarta Sans or Hanken Grotesk (Google); General Sans or
Satoshi (Fontshare). Licensed: Circular, Graphik.

**Nav.** Light bar, no border, 64px; links at 15px; a filled accent pill.

**Hero.** Split proof (`sections.md` H3): copy left, two real phone screens right,
slightly overlapping, one tilted no more than 4 degrees (or not at all).

**Signature fits.** Live stage in a phone, instrument (a ring, a streak, a meter), typing
proof in a chat.

**Footer.** Column footer on the surface tone, with an app-store or "open the app" block.

**Pitfall.** Becoming childish. No emoji, no gradient text, no confetti on load, no
mascots unless the brand truly has one. One accent, used on purpose.

```css
/* ── TOKENS:START ──────────────────────────── direction: soft-product ── */
:root,
.theme-light {
  color-scheme: light;
  --ground: #faf8f5;
  --surface: #f2efea;
  --surface-2: #eae6df;
  --panel: #ffffff;
  --tile: #ffffff;
  --fill: rgb(26 23 20 / 0.05);
  --fill-strong: rgb(26 23 20 / 0.09);
  --glass: rgb(255 255 255 / 0.7);
  --glass-line: rgb(255 255 255 / 0.9);
  --fg: #1a1714;
  --fg-soft: #3d3833;
  --fg-mute: #6b645c;
  --fg-faint: #9c958c;
  --line: #ece7e0;
  --line-strong: #dad3c9;
  --action: #1a1714;
  --on-action: #ffffff;
  --action-hover: #36302a;
  --accent: #d6246e; /* placeholder: brand.accent. may also fill the action button */
  --accent-soft: #fde7f0;
  --on-accent-soft: #8f0f45;
  --success: #1e7a4f;
  --success-soft: #e3f3ea;
  --warning: #9a5b00;
  --warning-soft: #fdf0dc;
  --danger: #c4321f;
  --danger-soft: #fce8e4;
  --focus: #1a1714;
  --elev-card: 0 1px 2px rgb(26 23 20 / 0.04), 0 8px 24px -12px rgb(26 23 20 / 0.12);
  --elev-pop: 0 2px 8px rgb(26 23 20 / 0.06), 0 32px 64px -24px rgb(26 23 20 / 0.28);
  --elev-frame: 0 0 0 10px #ffffff, 0 40px 80px -20px rgb(26 23 20 / 0.25);
  --field-a: #ffffff;
  --field-b: #f2e8dc;
  --field-c: #fbdbe8;
}

[data-theme="dark"],
.theme-dark {
  color-scheme: dark;
  --ground: #12100e;
  --surface: #1c1916;
  --surface-2: #25211d;
  --panel: #1a1714;
  --tile: #1c1916;
  --fill: rgb(245 241 236 / 0.06);
  --fill-strong: rgb(245 241 236 / 0.1);
  --glass: rgb(28 25 22 / 0.7);
  --glass-line: rgb(255 255 255 / 0.08);
  --fg: #f5f1ec;
  --fg-soft: #d9d3cb;
  --fg-mute: #a39c93;
  --fg-faint: #6f6860;
  --line: #2a2622;
  --line-strong: #3a342e;
  --action: #f5f1ec;
  --on-action: #12100e;
  --action-hover: #dcd5cc;
  --accent: #ff5c9e; /* placeholder: brand.accent */
  --accent-soft: rgb(255 92 158 / 0.14);
  --on-accent-soft: #ffb3d1;
  --success: #6fcf97;
  --success-soft: rgb(111 207 151 / 0.12);
  --warning: #f2b35c;
  --warning-soft: rgb(242 179 92 / 0.12);
  --danger: #ff8a7a;
  --danger-soft: rgb(255 138 122 / 0.12);
  --focus: #f5f1ec;
  --elev-card: inset 0 1px 0 rgb(255 255 255 / 0.03), 0 12px 30px -18px rgb(0 0 0 / 0.7);
  --elev-pop: inset 0 1px 0 rgb(255 255 255 / 0.04), 0 32px 64px -24px rgb(0 0 0 / 0.8);
  --elev-frame: 0 0 0 10px #25211d, 0 40px 80px -20px rgb(0 0 0 / 0.7);
  --field-a: #25211d;
  --field-b: #12100e;
  --field-c: #3a1828;
}

:root {
  --display-weight: 600;
  --display-xl: clamp(40px, 5vw, 68px);
  --display-xl-lh: 1.02;
  --display-xl-tracking: -0.035em;
  --display-l: clamp(28px, 3.2vw, 44px);
  --display-l-lh: 1.08;
  --display-l-tracking: -0.028em;
  --display-m: clamp(22px, 2.2vw, 30px);
  --display-m-lh: 1.15;
  --display-m-tracking: -0.02em;
  --title: 20px;
  --title-lh: 1.3;
  --title-tracking: -0.015em;
  --title-weight: 600;
  --lead: 19px;
  --lead-lh: 1.55;
  --body: 17px;
  --body-lh: 1.6;
  --body-weight: 400;
  --small: 15px;
  --small-lh: 1.5;
  --label: 13px;
  --label-lh: 1.3;
  --label-tracking: 0;
  --label-weight: 600;
  --label-transform: none;
  --label-family: var(--font-sans);
  --ui-weight: 600;
  --num-weight: 600;
  --r-chip: 999px;
  --r-button: 999px;
  --r-input: 14px;
  --r-tile: 28px;
  --r-panel: 32px;
  --r-feature: 40px;
  --page-max: 1240px;
  --gutter: clamp(20px, 4vw, 48px);
  --section-y: clamp(88px, 10vw, 140px);
  --stack: 48px;
  --motion-out: cubic-bezier(0.22, 1, 0.36, 1);
  --motion-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-micro: 180ms;
  --dur-ui: 260ms;
  --dur-reveal: 450ms;
  --reveal-y: 16px;
}
/* ── TOKENS:END ───────────────────────────────────────────────────────── */
```

---

## bold-signal

**The idea.** Type as the image. Oversized heavy display, hard full-contrast lines, zero
radius, a mono voice for metadata and one acid signal color. It works when the product has
culture and an audience that wants attitude; it fails on anything that asks for trust
with money, so use it for communities, events, games and onchain culture, not for a vault.

| Dial | Setting |
|---|---|
| Ground | dark first (`#0B0B0B`), light available (bone `#F2F0E9`) |
| Type voice | heavy display (700 to 800) at huge sizes with very tight tracking; mono labels |
| Density | dense and rhythmic: bands, marquees, ruled tables |
| Corners | none. Zero radius on everything |
| Surfaces | hard 1 to 2px lines in full contrast; offset hard shadows for floating things |
| Color | monochrome plus one acid signal, used as a fill (on light it is never text) |
| Motion | snappy (100 to 160ms), marquee bands, clip-path reveals, no soft fades |

**Fonts.** Display: Bricolage Grotesque 800, Space Grotesk 700, Archivo (expanded) 800
(Google); Clash Display or Cabinet Grotesk (Fontshare). Mono: JetBrains Mono or Space Mono.

**Nav.** Full-width bar with a 1px full-contrast bottom line, wordmark heavy, links in mono
uppercase at 12px, a hard-edged acid button.

**Hero.** Editorial headline at 10 to 12vw, cropped by the viewport edge if it must be,
with a marquee band of facts beneath.

**Signature fits.** Instrument as a giant number, typing proof, a band that changes state.

**Footer.** Big wordmark footer: the name set at viewport width, cropped at the bottom.

**Pitfall.** Noise. Keep the grid strict, keep one accent, keep the copy plain. Loud
styling with vague copy is the worst of both worlds.

```css
/* ── TOKENS:START ──────────────────────────── direction: bold-signal ── */
:root,
.theme-light {
  color-scheme: light;
  --ground: #f2f0e9;
  --surface: #e8e5dc;
  --surface-2: #ddd9ce;
  --panel: #f7f5ef;
  --tile: #e8e5dc;
  --fill: rgb(11 11 11 / 0.06);
  --fill-strong: rgb(11 11 11 / 0.12);
  --glass: rgb(242 240 233 / 0.92);
  --glass-line: #0b0b0b;
  --fg: #0b0b0b;
  --fg-soft: #2a2a2a;
  --fg-mute: #57554f;
  --fg-faint: #85827a;
  --line: #d2cec3;
  --line-strong: #0b0b0b;
  --action: #0b0b0b;
  --on-action: #f2f0e9;
  --action-hover: #2a2a2a;
  --accent: #c6f000; /* placeholder: brand.accent. a fill on light, never text */
  --accent-soft: #c6f000;
  --on-accent-soft: #0b0b0b;
  --success: #1d7a3e;
  --success-soft: #dcefe2;
  --warning: #8f5a00;
  --warning-soft: #f6e7c8;
  --danger: #c22a1e;
  --danger-soft: #f6dcd8;
  --focus: #0b0b0b;
  --elev-card: none;
  --elev-pop: 6px 6px 0 #0b0b0b;
  --elev-frame: 0 0 0 2px #0b0b0b;
  --field-a: #f7f5ef;
  --field-b: #ddd9ce;
  --field-c: #e9f7a8;
}

[data-theme="dark"],
.theme-dark {
  color-scheme: dark;
  --ground: #0b0b0b;
  --surface: #151515;
  --surface-2: #1e1e1e;
  --panel: #111111;
  --tile: #151515;
  --fill: rgb(242 240 233 / 0.06);
  --fill-strong: rgb(242 240 233 / 0.12);
  --glass: rgb(11 11 11 / 0.92);
  --glass-line: #f2f0e9;
  --fg: #f2f0e9;
  --fg-soft: #d6d3ca;
  --fg-mute: #9a978f;
  --fg-faint: #6b6963;
  --line: #2a2a2a;
  --line-strong: #f2f0e9;
  --action: #d4ff00;
  --on-action: #0b0b0b;
  --action-hover: #e2ff4d;
  --accent: #d4ff00; /* placeholder: brand.accent */
  --accent-soft: rgb(212 255 0 / 0.12);
  --on-accent-soft: #e9ff8a;
  --success: #5ee08a;
  --success-soft: rgb(94 224 138 / 0.12);
  --warning: #ffc04d;
  --warning-soft: rgb(255 192 77 / 0.12);
  --danger: #ff6a5c;
  --danger-soft: rgb(255 106 92 / 0.12);
  --focus: #d4ff00;
  --elev-card: none;
  --elev-pop: 6px 6px 0 #d4ff00;
  --elev-frame: 0 0 0 2px #f2f0e9;
  --field-a: #1e1e1e;
  --field-b: #0b0b0b;
  --field-c: #2a3300;
}

:root {
  --display-weight: 800;
  --display-xl: clamp(56px, 9vw, 152px);
  --display-xl-lh: 0.88;
  --display-xl-tracking: -0.05em;
  --display-l: clamp(36px, 5vw, 72px);
  --display-l-lh: 0.95;
  --display-l-tracking: -0.04em;
  --display-m: clamp(24px, 2.6vw, 36px);
  --display-m-lh: 1.05;
  --display-m-tracking: -0.03em;
  --title: 20px;
  --title-lh: 1.2;
  --title-tracking: -0.02em;
  --title-weight: 700;
  --lead: 19px;
  --lead-lh: 1.5;
  --body: 16px;
  --body-lh: 1.55;
  --body-weight: 400;
  --small: 14px;
  --small-lh: 1.5;
  --label: 12px;
  --label-lh: 1.2;
  --label-tracking: 0.06em;
  --label-weight: 500;
  --label-transform: uppercase;
  --label-family: var(--font-mono);
  --ui-weight: 600;
  --num-weight: 800;
  --r-chip: 0px;
  --r-button: 0px;
  --r-input: 0px;
  --r-tile: 0px;
  --r-panel: 0px;
  --r-feature: 0px;
  --page-max: 1440px;
  --gutter: clamp(16px, 2.5vw, 40px);
  --section-y: clamp(72px, 9vw, 128px);
  --stack: 40px;
  --motion-out: cubic-bezier(0.7, 0, 0.3, 1);
  --motion-in-out: cubic-bezier(0.7, 0, 0.3, 1);
  --dur-micro: 100ms;
  --dur-ui: 160ms;
  --dur-reveal: 280ms;
  --reveal-y: 0px;
}
/* ── TOKENS:END ───────────────────────────────────────────────────────── */
```

---

## Mixing directions

Allowed, deliberately, one dial at a time: quiet-monochrome with an editorial serif for a
single statement band (Teampot does this with Instrument Serif); technical-grid's mono
labels inside luminous-dark (a developer panel). Write the borrowed dial in DESIGN.md.

Not allowed: two type voices for display, two accents, or two corner languages. Those are
the seams people notice without knowing what they noticed.
