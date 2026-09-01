---
name: hackathon-frontend
description: Build the judge-facing frontend of a hackathon project fast: Next.js App Router + Tailwind v4 + shadcn/ui, with a demo-proof design system, the five screen states, and a deploy that lands before the deadline. Use when scaffolding or polishing a hackathon UI, when asked to "make it look good for judges", when a demo screen needs empty/loading/error states, when picking colors/typography/motion under time pressure, or when a hack has hours left and the frontend must be triaged. Read CONFIG.md first.
---

# Hackathon frontend

The frontend is the only part of your hack the judges actually experience. They will
not read your code. They will look at one screen for about ten seconds and decide
whether you are serious. Build for that.

**Read `CONFIG.md` before anything else.** Every command below adapts to it. If the
user has not filled it in, fill in what you can infer from the brief and repo, state
your assumptions in one line, and keep moving. Do not block on it.

## The rule that governs everything

> One screen, perfect. Not four screens, decent.

A hackathon demo is a *guided tour of a single artifact*. Every hour spent on the
second screen is an hour not spent making the first one indefensible. When
`demo.screens_max` is hit, the answer is to cut, not to compress.

## Build order (do not reorder)

| # | Phase | Wall clock | Done when |
|---|---|---|---|
| 1 | Scaffold + deploy a blank page | 20 min | A public URL exists. **Deploy before you build.** |
| 2 | Design tokens + layout shell | 30 min | Nav, container, spacing scale, one accent locked. **Ask the user for images here**, not at hour 30 |
| 3 | Hero screen with **hardcoded** data | 90 min | It looks finished and is a lie |
| 4 | Wire real data behind the same components | 60 min | The lie became true, nothing moved visually |
| 5 | The five states | 45 min | Empty, loading, error, partial, success all exist |
| 6 | Motion + polish pass | 30 min | Transitions, focus rings, hover, one delight moment |
| 7 | Demo-proofing | 30 min | Works offline, on a projector, on a cold load |

Phase 1 first is not optional. Teams that deploy last lose the hack to a build error
at minute 358. See `references/deploy.md`.

Phase 3 before phase 4 is the whole trick: **build the UI against fake data that
already looks like a successful demo.** If the backend never lands, you still have a
demo. If it lands, you swap one module.

## Scaffold

```bash
npx create-next-app@latest APP --ts --tailwind --app --eslint --src-dir --use-npm
cd APP && npx shadcn@latest init
npx shadcn@latest add button card input badge skeleton sonner dialog dropdown-menu tabs
npm i lucide-react motion
```

Verify the versions you actually got before trusting any syntax below. Tailwind v3
and v4 have incompatible config, and shadcn emits different tokens for each:

```bash
npm ls tailwindcss next react | head; ls src/app/globals.css tailwind.config.* 2>/dev/null
```

`@import "tailwindcss"` in `globals.css` and **no** `tailwind.config.ts` means v4:
theme lives in CSS via `@theme inline`. A `tailwind.config.ts` with a `content` array
means v3. Full decision table and the v3 fallback: `references/scaffold.md`.

## Design system

Copy `assets/globals.css` over the generated one and change exactly one value:
`--primary`, to `brand.primary` from CONFIG. That is the entire branding step.

The constraints that make an unbranded hack look designed:

- **One accent, everything else neutral.** 60% background, 30% surface/text, 10%
  accent. The accent appears on the primary action and nowhere else. Two accents
  reads as a template; one accent reads as a product.
- **One type scale, four sizes.** `text-sm` labels, `text-base` body, `text-xl`
  section, `text-4xl` hero. No sizes in between. Weight carries hierarchy, not size.
- **Space in multiples of 4, gaps of 8.** `gap-2 / gap-4 / gap-8` only.
- **Border > shadow.** `border border-border` on every surface beats a shadow stack
  and survives a projector. Reserve shadow for things that genuinely float.
- **One radius token.** From `brand.radius`. Never mix `rounded-md` and `rounded-2xl`
  in the same view.
- **Contrast floor 4.5:1, or 7:1 when `demo.surface: projector`.** Projectors eat
  about two stops of contrast. `text-muted-foreground` on a projector is invisible.
  Bump it or drop the text.

Tokens, the oklch palette, dark-mode pairing and the vibe-to-scale table:
`references/design-tokens.md`.

## Copy

Judges read the words. In ten seconds they read three strings: the heading, the button,
and whatever the empty state says. Those do more work than any visual polish, and most
teams write them last, at 4am, in thirty seconds.

- **No em dashes.** Not in UI text, seed data, alt text, page titles or toasts. Use a
  comma, colon, period or parentheses. This matters more here than in the README: the
  interface is not a document describing the product, it **is** the product, and copy
  that reads as machine written makes the whole thing read as machine written.
- **Read it out loud.** If you would not say the sentence to someone standing next to
  you, do not ship it. "Seamlessly manage your workflows" fails; "Everything flagged in
  the last day, worst first" passes.
- **Sentence case, no exclamation marks.** "New review", not "New Review!". Title case
  reads like a slide deck.
- **Buttons are verb plus object.** "Connect a source", not "Get started" or "Submit".
- **One sentence under every page title**, saying what the screen is for. The highest
  value string in the interface, and the one most often missing, which is why judges
  spend their ten seconds working out what they are looking at.
- **One word per concept**, matching the README and the pitch. A thing that is a task
  here, a job there and a run in the API reads as three people who never spoke.
- **Seed data is copy.** Judges read your fake data to see whether you understood the
  domain. "Riverside Elementary HVAC retrofit" says you did; "Test User 1" says you did
  not.

Per-element wording, the generated-copy tells, budgets and the pre-demo greps:
`references/ui-copy.md`.

```bash
grep -rn $'\xe2\x80\x94' src/ --include='*.tsx' && echo "EM DASH IN UI"
```

## Images

**Always ask the user for images. Never invent, hotlink, or substitute them.** An agent
cannot produce images, and the two things it does instead are both worse than asking:
it links something that dies on venue wifi, or it leaves grey rectangles that read as
unfinished.

Ask in hour two, when you scaffold, not at hour thirty. Ask for all of them at once and
give each one a purpose, a size, a format and a fallback, so the request is answerable
in five minutes.

| Image | Size | If they have none |
|---|---|---|
| **og:image** | 1200x630 | Screenshot your own app. Highest return image in the project |
| **Favicon** | 512x512 | A letter mark in the brand color |
| Product content images | any | A colored block with initials, which looks deliberate |
| Logo or wordmark | SVG | The project name set in the accent color. Common and fine |

Most teams have nothing, and image-free is a good outcome rather than a compromise:
type-led hero, a wordmark, a CSS gradient, initials blocks, `lucide-react` icons. The
og:image is the exception worth insisting on, because it renders every time the URL is
pasted into Slack or the submission form, and it is one screenshot.

Never stock photography (it is the clearest possible template signal), never a
fabricated company or sponsor logo, never an image on the critical path when
`demo.offline_safe` is true. Every asset lives in `/public` and is committed.

The request template to send the user, the fallback techniques, `next/image` mechanics,
alt text and file size limits: `references/imagery.md`.

## Structure

Semantic markup is the cheapest accessibility pass there is, and it is judge-visible the
moment anyone tabs through your screen or opens it on a projector.

- **One `<h1>` per page**, then `h2`, `h3` in order. Never skip a level to get a size;
  size comes from the type scale.
- **Landmarks**: `<header>`, `<nav>`, `<main>`, `<footer>`. `assets/app-shell.tsx`
  already does this.
- **Buttons are `<button>`, links are `<a>`.** A `<div onClick>` is invisible to the
  keyboard and to a screen reader, and tabbing is on the demo-proofing checklist.
- **Every input has a `<label>`.** A placeholder is not a label; it disappears on focus.
- **Every image has `alt`.** A real description, or `alt=""` if genuinely decorative.
- **Lists are `<ul>`/`<ol>`.** A stack of divs reads as one blob to assistive tech.

None of this costs time when done as you build, and all of it costs time when retrofitted
at hour thirty.

## The five states

The single largest quality gap between a hackathon UI and a product UI. Judges find
them by accident (an empty search, a slow network, a bad input) and that accident
is where the polish score is decided.

| State | What most teams ship | What to ship |
|---|---|---|
| **Empty** | blank div | Icon, one sentence of what goes here, the primary action |
| **Loading** | spinner | Skeleton in the *shape of the real content* |
| **Error** | crash / raw JSON | Plain sentence + Retry button; never expose a stack trace |
| **Partial** | nothing | Render what arrived, skeleton the rest |
| **Success** | silent | Toast or an inline state change: confirm the action landed |

`assets/states.tsx` has all five as drop-in components. Wire them the moment a screen
can fetch anything. `references/component-kit.md` covers the shell, the card grid and
the form pattern.

## Motion

Motion is the cheapest possible perceived-quality win and the easiest to overdo.

- Entrance only, 150–250ms, `ease-out`. Nothing animates on exit during a demo.
- Stagger lists by 30ms per item, cap at 8 items.
- `hover:` on every interactive element. A dead hover state reads as a mockup.
- **One** delight moment, a number counting up, a card flip, confetti on submit.
  Exactly one, on the money shot. Two is a toy.
- `prefers-reduced-motion` guard, always. It is three lines and judges check.

## Demo-proofing

Run this checklist before you stop building. Details in `references/demo-proofing.md`:

- [ ] Hard reload the deployed URL on a cold cache. Nothing flashes unstyled.
- [ ] Kill the network mid-demo. The hero screen still renders (`demo.offline_safe`).
- [ ] Zoom the browser to 150%. Nothing overlaps or clips.
- [ ] Open at 1280x720, the projector resolution, not your laptop resolution.
- [ ] Every screen looks right with the longest realistic string and with zero rows.
- [ ] Seed data is plausible. No "asdf", no "Test User 1", no lorem ipsum. Judges
      read your fake data and it tells them whether you thought about the problem.
- [ ] Console is clean. A red error visible on a shared screen costs real points.
- [ ] Tab through the hero screen. Focus rings visible, order sane.
- [ ] Zero em dashes in the UI: `grep -rn $'\xe2\x80\x94' src/ --include='*.tsx'`
- [ ] Read every visible string out loud. Rewrite the one you stumble on.
- [ ] Tab title and favicon are yours. "Create Next App" is a real cost.
- [ ] Paste the deployed URL into Slack. The og:image renders.
- [ ] No hotlinked images: `grep -rn 'src="http' src/ --include='*.tsx'` returns nothing.

## SALVAGE MODE

When `time.frontend_hours < 6`, or when it is the final two hours and the UI is not
demoable, stop building and triage:

1. Pick the one screen in the demo script. Delete every route that is not it.
2. Hardcode its data. All of it. Right now.
3. Apply only: tokens, spacing, one accent, empty + loading states, and the copy pass.
   The copy pass is fifteen minutes and it is the cheapest quality left on the table:
   a real page title, one sentence under it, verb-plus-object buttons, plausible seed
   data, no em dashes. Skip the images entirely and go type-led.
4. Deploy. Screen-record the working flow as a fallback video.
5. Only then, if time remains, reconnect real data.

A single polished screen with fake data beats four broken screens with real data,
every time, in every rubric.

## Time traps

Things that have eaten a hackathon frontend and given back nothing:

- Auth UI. Hardcode a logged-in user. Judges do not score your login page.
- A custom component library. Use shadcn, restyle the token, move on.
- Responsive mobile layouts, unless the pitch *is* mobile. Demos run on a laptop.
- Dark mode toggle. Pick one mode per `brand.mode` and commit.
- Animation libraries beyond `motion`. Tailwind transitions cover 90% of it.
- A landing page. The app *is* the landing page. Ship the product screen.
- Refactoring at hour 5. Ugly code that renders beats clean code that does not.

## Handoff

When the UI is demoable, the remaining points live elsewhere: route to
`hackathon-readme` for the judge-facing README, and `hackathon-version-control` for a
history that survives a four-person merge at 3am.
