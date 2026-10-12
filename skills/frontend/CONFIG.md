# Frontend customization

Defaults. Copy into `hackathon.yml` at your project root and edit there. Anything left at
`auto` is decided by the imagination engine from the brief and the repo, and written into
`DESIGN.md`.

```yaml
# ── Identity ────────────────────────────────────────────────────────────────
project_name:      auto        # used in <title>, nav, og:image, footer
one_liner:         auto        # what it is in 12 words or fewer. the hero is built from it
audience:          judges      # judges | users | investors. changes copy density and proof
product_noun:      auto        # ONE word for the core object, used in UI, README, pitch

# ── Surface ─────────────────────────────────────────────────────────────────
surface:           both        # landing | app | both. what gets built
landing_sections:  auto        # 6 to 9 beats, from the storyboard
system_page:       keep        # keep | delete. the /system sheet, noindexed either way

# ── Design ──────────────────────────────────────────────────────────────────
design:
  direction:       auto        # quiet-monochrome | luminous-dark | editorial-paper |
                               # technical-grid | soft-product | bold-signal | auto
  mode:            auto        # light | dark | both. auto: the direction's first mode
  feels:           auto        # three adjectives that could fail. "modern, clean" is not allowed
  never_feels:     auto        # three refusals
  references:      []          # URLs to measure in calibration, e.g. [https://tempo.xyz]
  signature:       auto        # the one screenshot-worthy element. the engine chooses
  density:         auto        # airy | balanced | dense

# ── Brand ───────────────────────────────────────────────────────────────────
brand:
  accent:          auto        # the ONE accent, as hex. auto: the direction's placeholder,
                               # replaced by the engine with a hue chosen for its meaning
  accent_means:    auto        # what the accent marks, e.g. "a hazard" or "sealed". required
  display_font:    auto        # auto: the direction's free default
  body_font:       auto
  mono_font:       auto
  licensed_fonts:  []          # fonts the team owns a license for, e.g. [Aeonik]
  logo:            ask         # ask | none | path to an SVG in /public

# ── Stack ───────────────────────────────────────────────────────────────────
stack:
  framework:       next-app    # next-app | vite-react
  styling:         tailwind-v4
  behavior:        radix       # radix | shadcn | none. for dialogs, menus, tooltips only
  icons:           custom      # custom (inline SVG, 1.3 to 1.5 stroke) | lucide
  motion:          css         # css (assets/motion.tsx) | css+motion (adds the motion package)

# ── Copy ────────────────────────────────────────────────────────────────────
copy:
  em_dashes:       forbidden   # UI text, seed data, alt text, titles, toasts, comments
  case:            sentence
  exclamations:    none
  claims:          proven      # every claim links to something checkable, or it is cut

# ── Images ──────────────────────────────────────────────────────────────────
images:
  ask_user:        required    # once, in hour two, with sizes and fallbacks
  og_image:        generate    # generate (next/og from the hero) | screenshot | path
  stock_photos:    forbidden
  ai_images:       forbidden

# ── Critique ────────────────────────────────────────────────────────────────
critique:
  widths:          [1440, 390] # add 768 and 1024 for app-heavy builds
  rounds_max:      3
  pass_score:      24          # out of 30, with no dimension below 2
  slop_strict:     false       # true: every slop-check WARN fails the gate

# ── Demo constraints ────────────────────────────────────────────────────────
demo:
  surface:         projector   # projector | laptop | screen-recording
  offline_safe:    true        # true: no live API or font CDN on the critical path
  hero_screen:     auto        # the ONE screen that must be perfect
  screens_max:     4           # hard cap on product routes

# ── Time budget ─────────────────────────────────────────────────────────────
time:
  total_hours:     auto
  frontend_hours:  auto        # under 6: SALVAGE MODE and the engine's fast path
  deploy_target:   vercel      # vercel | netlify | cloudflare | none

# ── Judging rubric weights (0 if not scored) ────────────────────────────────
rubric:
  design_ux:       25
  technical:       25
  innovation:      25
  impact:          15
  presentation:    10
```

## How the knobs bite

| Knob | Effect |
|---|---|
| `design.direction` | Picks the token block pasted into `globals.css` and the nav, hero and footer patterns. `auto` lets pass 3 choose by feeling and audience |
| `design.references` | Each URL is measured in pass 3 and gets a row set in the calibration table. Proportions are borrowed, brand never |
| `design.feels` | Drives the direction choice. Rejected if every design ever made would satisfy it |
| `brand.accent_means` | Written into DESIGN.md as the accent rule. An accent without a meaning is decoration and the critique loop scores it down |
| `brand.licensed_fonts` | Only these licensed faces may be used; everything else comes from Google Fonts or Fontshare |
| `surface: landing` | Skips product-screen rules and the five-state wiring beyond the demo widgets |
| `surface: app` | The storyboard becomes a screen list; the hero is the hero screen with the page-header pattern |
| `stack.behavior: shadcn` | Allowed, with the class conversion table in `references/scaffold.md` applied to every generated component |
| `critique.pass_score` | The gate for Step 8. Raising it adds rounds; lowering it is how templates ship |
| `critique.slop_strict` | Every slop-check warning becomes a failure. Use it when design is the main judging axis |
| `demo.surface: projector` | Add `projector` to `<html>` on stage: muted text to about 7:1, hairlines thicker, body to 17px |
| `demo.offline_safe: true` | Fonts self-hosted through `next/font`, every fetch seed-backed, no remote image on the critical path |
| `time.frontend_hours < 6` | SALVAGE MODE: the ten-minute engine, one screen, one critique round |
| `rubric.design_ux >= 30` | The full engine with calibration is mandatory, and the critique loop runs all three rounds |

## The one that is usually wrong

`design.feels`. It gets filled with "modern, clean, professional", which rules nothing out,
so the direction gets chosen by habit and the page comes out average. Write three words
that could fail: "sturdy, exact, outdoors" makes a dark neon page impossible, which is
the point.
