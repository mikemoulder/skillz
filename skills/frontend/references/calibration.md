# Calibration: measure, do not guess

Good sites carry years of iteration in their numbers: how big the H1 is relative to the
body, how far apart sections sit, how tall a button is, how much a hairline is darkened.
Guessing those numbers produces averages. Measuring them borrows the iteration.

Teampot's landing page was built this way. The team measured tempo.xyz's computed styles
at 1440 and 390, wrote a component-by-component table, and rebuilt their own page to the
same proportions with their own content and font. The result reads as professional
because the proportions are professional.

**The rule: take proportions, never brand.** Their H1 ratio, not their font. Their
section rhythm, not their colors. Their button height, not their words. Their structure
for a comparison, not their claim. Never reproduce another company's logo, illustrations,
copy, or color identity.

## The method

### 1. Pick references

One or two sites in the product's category that are clearly better than average, plus
any the user named. Good references are product companies with in-house design teams.
Verify each by looking at it first; sites change.

| Category | Candidates to look at |
|---|---|
| Payments, fintech | tempo.xyz, mercury.com, ramp.com, stripe.com |
| Crypto, privacy | gloam.trade, zama.ai, arcium.com, phantom.com |
| Developer tools | linear.app, vercel.com, resend.com, railway.com, planetscale.com |
| AI products | anthropic.com, perplexity.ai, granola.ai |
| Consumer | arc.net, things (culturedcode.com), family.co |
| Editorial, research | stripe.press, every.to, our world in data |
| Hackathon-grade, measured below | teampot.vercel.app, gloam.trade |

### 2. Measure

```bash
npm i -D playwright && npx playwright install chromium     # once
node <skill>/assets/measure-reference.mjs https://tempo.xyz --out .design/ref-tempo
node <skill>/assets/measure-reference.mjs https://gloam.trade --out .design/ref-gloam --scheme dark
```

Each run writes viewport slices at 1440 and 390 (`1440-01.png` ...), a full-page shot, the
raw measurements as JSON and a `summary.md`: the type ramp with counts, headings with size,
line height, tracking and wrap, text colors, backgrounds, borders, radii, shadows, gaps,
max widths, content left edges, the nav, deduplicated buttons, transitions and
animations. Overlays in the way: `--hide ".cookie-banner"`. Without Playwright, paste
`assets/measure.js` into the browser console, or run it through a browser tool.

`.design/` is scratch: gitignore it, or keep it outside the repo.

### 3. Look, then read

Open the slices one at a time and describe each section in one line: pattern, alignment,
density, what is on it. Then read `summary.md` for the numbers. The pictures say what to
build; the numbers say how big.

### 4. Write the calibration table

In DESIGN.md section 3: component, reference measured, ours, why different. Every "why"
is a reason ("our product is darker", "our font runs wider, so tracking is looser"), not a
preference.

### 5. Measure yourself with the same tool

In the critique loop, run the same script on your own build. Comparing your `summary.md`
to DESIGN.md catches drift that eyes miss: a stray 13px size, a sixth radius, a tenth
left edge.

## Reading the numbers

| Measurement | Healthy | Smell |
|---|---|---|
| Type ramp | 6 to 10 distinct styles, most with 3+ uses | 20+ styles, many used once |
| Hero size / body size | 3.5 to 5 | under 3 |
| Display tracking | negative, -0.02 to -0.045em | 0em at 48px+ |
| Text colors | one ink at 3 to 5 strengths, plus one accent | 8+ unrelated grays |
| Radii | 4 to 6 values, each tied to a component | 10+ values |
| Content left edges | 2 to 4 values carry most text | many values with similar counts |
| Shadows | 0 to 3 recipes | many one-off shadows |
| Transitions | 1 or 2 curves, 150 to 250ms | many curves, `all` |
| Horizontal overflow at 390 | no | yes |
| Console errors | 0 | any |

## Case studies (measured 2026-10-12)

### tempo.xyz, via Teampot's case study

Measured by the Teampot team from computed styles at 1440 and 390. Font: Pilat (licensed);
Teampot substituted Inter Tight at the same weight and tracking.

| Component | Measured |
|---|---|
| Ground and text | `#F5F5F5`, text `#000` |
| Type voice | one weight, 500, upright. Never italic, never bold |
| H1 | 53px, line-height 0.95, tracking -0.04em, centered, two lines |
| H2 | 36px, 1.1, -0.02em, max 600px wide |
| H3 (tab titles) | 30px, 1.1, -0.02em, inactive at 40% black |
| Body | 16 / 22, weight 500, `rgba(0,0,0,.56)` |
| Eyebrow | 10px, 500, uppercase, +0.06em, `rgba(0,0,0,.4)` |
| Big numbers | 54px, weight 400, -0.04em |
| Nav | floating centered pill, `rgba(225,225,225,.6)` + `blur(20px)`, radius 26, height 52, padding 4 4 4 24, links 14px 500, black pill CTA |
| Primary button | black pill, 14px 500, height 44 to 48, padding 0 24 to 32 |
| Secondary button | `rgba(0,0,0,.04)` or `rgba(194,194,194,.24)` pill, black text |
| Accent | none in the chrome; color only inside product illustrations |
| Card | white, radius 32, no border, no shadow, copy padding 64 64 12, illustration fills the bottom |
| Showcase | product list left with 1px `rgba(0,0,0,.16)` dividers; gray panel radius 32 right holding a white mock of the real UI |
| Stats | 1px top rule, padding-top 23, number 54/400, label 14/500 at 56% |
| Statement band | full-bleed dark, serif quote |
| Diagram | monochrome line art, thin gray strokes, one black path |
| CTA | two white cards, radius 64, padding 64 |
| Footer | black, 4 to 5 link columns, 14px 500 |
| Rhythm | 160px section top padding (100 for the first), 60px sides, max 1320, heading to grid 48, grid gap 24 |
| Mobile | same components stacked; nav collapses to logo plus menu; buttons stay side by side |

### teampot.vercel.app (quiet-monochrome)

| Component | Measured at 1440 |
|---|---|
| Fonts | Inter Tight 400, 500; Instrument Serif 400 for one statement |
| Ramp | serif quote 64/1.02/-0.01em; H1 56/0.95/-0.04em/500; stat 54/1.1/-0.04em/400; H2 36/1.1/-0.02em; tab H3 30/1.1/-0.02em; card H3 20/1.2/-0.02em; marquee 18; body 16/1.375/500; links 14/500 |
| Text strengths | `#000`, `rgba(0,0,0,.56)`, `.4`, `.32`; footer `rgba(255,255,255,.6)` |
| Lines | one rule: 1px `rgba(0,0,0,.16)` |
| Radii | pill buttons; 32 cards and phone screens; 24 stage; 64 CTA cards; 26 nav; 12 mock fields |
| Elevation | phone frames only: `0 0 0 8px #fff, 0 30px 80px rgba(0,0,0,.18)` |
| Buttons | 48h pad 32 black (hero); 48h pad 32 `rgba(194,194,194,.24)` (secondary); 44h pad 24 black (nav) |
| Alignment | 24 of 40 text blocks start at x=60, the container edge |
| Signature | live app in the middle phone with a role switcher; key-tree line art with light running along paths |
| Phone | nav becomes wordmark + action pill; one phone in the stage; cards stack at radius 24 |

### gloam.trade (luminous-dark)

| Component | Measured at 1440 (dark) |
|---|---|
| Fonts | Aeonik 300, 400, 500 (licensed, self-hosted) |
| Ramp | H1 75/1.02/-0.028em/300 (`clamp(42px,5.2vw,76px)`); H2 48/1.06/-0.022em/300; statement 24/1.375/-0.01em/400; column titles 19/1.375/-0.01em; lead 19/1.6; body 15 to 16/1.5 to 1.625; label 11/500/+0.08em upper |
| Text strengths | `#F4F5F6`, `#CDD0D4`, `#9B9FA6`, `#6C7077`; signal `#8FD3AD` (23 uses, all meaning "sealed" or "private") |
| Ground and surfaces | `#08090A`, panel `#111214`, surface `#17181B`, surface-2 `#1E2023`, line `#232529` |
| Radii | pill controls; 18 cards; 24 panels; 16 and 12 glass chips |
| Elevation | card: `inset 0 1px 0 rgba(255,255,255,.03), 0 12px 30px -18px rgba(0,0,0,.7)`; pop: `inset 0 1px 0 rgba(255,255,255,.04), 0 30px 80px -24px rgba(0,0,0,.85)` |
| Buttons | 48h pad 24 15px (hero); 44h pad 20 14px; 36h pad 16 13px (nav); white pill primary, tint pill for "Open app" |
| Nav | sticky 64px, ground at 85% + `blur(24px)`, announcement line above |
| Layout | max 1400, gutter 28; hero panel inset to the container, `calc(100svh - 10rem)`, copy bottom-left in 720px |
| Motion | `cubic-bezier(.22,1,.36,1)`; reveals 0.4s, 12px; stream 38s linear; field drift 22s; buttons 0.18s, press 0.98 |
| Signature | the seal stream; engraved banknotes revealed under the cursor in the hero |
| Phone | hero panel nearly full height, copy bottom-left; nav becomes wordmark, tint pill and a menu |
