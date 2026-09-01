# Frontend skill customization

Edit this file, not the skill body. `SKILL.md` reads these values and adapts every
command, token and component it emits. Anything left at `auto` is decided at build
time from the repo and the hackathon brief.

```yaml
# ── Identity ────────────────────────────────────────────────────────────────
project_name:      auto        # used in <title>, nav, README, og:title
tagline:           auto        # one line, under 60 chars, shown in the hero
audience:          judges      # judges | users | investors, changes copy density

# ── Stack ───────────────────────────────────────────────────────────────────
framework:         next-app    # next-app | next-pages | vite-react
styling:           tailwind-v4
components:        shadcn      # shadcn | none
icons:             lucide
fonts:             geist       # geist | inter | custom (see brand.font_stack)
animation:         motion      # motion | css-only | none
charts:            none        # none | recharts  (only if the demo shows data)
state:             url+server  # url+server | zustand | react-query
forms:             rhf-zod     # rhf-zod | uncontrolled | none

# ── Brand ───────────────────────────────────────────────────────────────────
brand:
  primary:         oklch(0.62 0.19 264)   # the ONE accent. everything else is neutral
  neutral:         slate                  # slate | zinc | stone | neutral
  radius:          0.625rem
  mode:            dark-first             # dark-first | light-first | both
  font_stack:      auto
  vibe:            technical              # technical | playful | editorial | brutalist

# ── Copy ────────────────────────────────────────────────────────────────────
copy:
  em_dashes:       forbidden    # in UI text, seed data, alt text, titles, toasts
  case:            sentence     # sentence | title. sentence reads as a real product
  exclamations:    none
  tone:            plain        # plain | warm | technical
  product_noun:    auto         # ONE word for the core object. task | run | job | item
  reading_level:   plain        # "read it out loud" is the test. see references/ui-copy.md

# ── Images ──────────────────────────────────────────────────────────────────
images:
  ask_user:        required     # ALWAYS ask, in hour two. never invent or hotlink
  og_image:        auto         # 1200x630. highest return image in the project
  favicon:         auto         # 512x512. a default Next icon is a visible cost
  logo:            none
  product_images:  none         # images the demo CONTENT needs. name them when asking
  fallback:        type-led     # type-led | initials | gradient | icons
  stock_photos:    forbidden    # the clearest template signal there is

# ── Demo constraints ────────────────────────────────────────────────────────
demo:
  surface:         projector    # projector | laptop | screen-recording
  duration_min:    3
  offline_safe:    true         # true => no live API on the critical path
  hero_screen:     auto         # the ONE screen that must be perfect
  screens_max:     4            # hard cap. more screens = worse demo

# ── Time budget ─────────────────────────────────────────────────────────────
time:
  total_hours:     auto
  frontend_hours:  auto         # if < 6, skill switches to SALVAGE MODE
  deploy_target:   vercel       # vercel | netlify | cloudflare | none (local demo)

# ── Judging rubric weights (0 if not scored) ────────────────────────────────
rubric:
  design_ux:       25
  technical:       25
  innovation:      25
  impact:          15
  presentation:    10
```

## How the knobs bite

| Knob | Effect on what gets built |
|---|---|
| `demo.surface: projector` | Contrast floor rises to 7:1, base font to 17px, `dark-first` forced off unless the room is dark. |
| `demo.offline_safe: true` | Every fetch gets a seeded fallback; no screen can render only from a live network call. |
| `time.frontend_hours < 6` | **SALVAGE MODE**, one screen, no routing, no auth UI, static seed data. |
| `rubric.design_ux >= 30` | Motion pass and empty-state pass become mandatory, not optional. |
| `brand.vibe` | Picks the type scale, border weight, shadow depth and motion easing set. |
| `demo.screens_max` | Skill refuses to scaffold more routes than this and says which to cut. |
| `copy.em_dashes: forbidden` | UI strings, seed data and metadata are generated without them, and the pre-demo pass greps for any that crept in. |
| `copy.product_noun` | Fixes one word for the core object across UI, README, API routes and the pitch. Prevents the task/job/run drift that reads as four people who never spoke. |
| `images.ask_user: required` | The skill asks for images in hour two with sizes and fallbacks, rather than inventing, hotlinking, or leaving grey boxes. |
| `images.fallback` | Decides what an image-free build looks like. `type-led` is right for most hacks and does not read as missing. |
