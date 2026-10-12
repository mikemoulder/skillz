# Scaffold

Next.js App Router, Tailwind v4, the skill's tokens and primitives. No component library's
default look: behavior primitives are fine, their styling is replaced by the tokens.

## Ground truth first

Never trust a remembered version number. Read what is installed:

```bash
npm ls next react tailwindcss 2>/dev/null | head -5
ls src/app/globals.css tailwind.config.* postcss.config.* components.json 2>/dev/null
head -3 src/app/globals.css
```

| Signal | Tailwind | Meaning |
|---|---|---|
| `@import "tailwindcss";` at the top of globals.css, no config file | v4 | theme in CSS. `assets/globals.css` works as is |
| `@tailwind base;` and a `tailwind.config.ts` | v3 | see the v3 section below |
| neither | none | install v4 with create-next-app |

Recent create-next-app versions may wire Tailwind through a bundler loader
(`@tailwindcss/turbopack` in `next.config.ts`) instead of `postcss.config.mjs`, and may
ship an `AGENTS.md` saying the bundled docs in `node_modules/next/dist/docs/` are the
truth for that version. Read them when an API looks unfamiliar. The `@import
"tailwindcss"` test above holds either way.

## A fresh project

```bash
npx create-next-app@latest APP --ts --tailwind --app --eslint --src-dir --use-npm
cd APP
npm i sonner                     # toasts, used by states.tsx
npm i lucide-react               # only if the direction uses lucide icons
npm i motion                     # only for layout animations (tab indicators, sheets)
```

Then copy the skill's files in:

```bash
SKILL=<path to skills/frontend>
cp $SKILL/assets/globals.css        src/app/globals.css
mkdir -p src/components src/lib src/app/system
cp $SKILL/assets/primitives.tsx     src/components/primitives.tsx
cp $SKILL/assets/motion.tsx         src/components/motion.tsx
cp $SKILL/assets/states.tsx         src/components/states.tsx
cp $SKILL/assets/seed.ts            src/lib/data.ts
cp $SKILL/assets/system-page.tsx    src/app/system/page.tsx
cp $SKILL/assets/DESIGN.template.md DESIGN.md        # if the engine has not run yet
```

Paste the chosen direction's token block over the `TOKENS:START` to `TOKENS:END` region
of `globals.css`, set the accent, and load the fonts.

## The root layout

```tsx
// src/app/layout.tsx
/*
THESIS      Fieldnote is a spoken inspection that becomes a signed report; it refuses the clipboard dashboard.
WORLD       grey ground, Inter Tight 500, white tiles, black pills; safety orange means a hazard, nothing else.
STORY       hook with the live report, three steps, three real inspections, the hazard path, the close.
FIRST VIEW  two-line statement, one sentence, record + demo, the live stage cropped by the fold.
SIGNATURE   the transcript turning into report rows, the hazard row lighting orange.
REFUSES     dashboards, stock photos of hard hats, a gradient anywhere.
*/
import type { Metadata, Viewport } from "next";
import { Inter_Tight, Geist_Mono } from "next/font/google";
import { MOTION_BOOT, MotionRoot } from "@/components/motion";
import { Toaster } from "@/components/states";
import "./globals.css";

const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-brand-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-brand-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://fieldnote.example"),
  title: { default: "Fieldnote: speak the walk-through", template: "%s | Fieldnote" },
  description: "Say your site inspection out loud. Fieldnote writes the signed report and flags every hazard.",
  openGraph: { type: "website", siteName: "Fieldnote" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#F5F5F5" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-theme="dark" for dark-first directions; add "projector" to className on stage
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT }} />
      </head>
      <body>
        <MotionRoot />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

The thesis comment is DESIGN.md section 0. It costs nothing and it is the first thing the
next session, or a judge reading the code, sees.

Pages: `src/app/opengraph-image.tsx` (imagery.md), `src/app/icon.svg` for the favicon,
and `export const metadata` per route.

## Directory shape

```text
DESIGN.md                    the imagination engine's output. read before every UI change
src/
  app/
    layout.tsx
    page.tsx                 the landing page, or the hero screen
    system/page.tsx          the system sheet (noindex)
    opengraph-image.tsx
    icon.svg
    [route]/page.tsx         product screens, at most CONFIG demo.screens_max
  components/
    primitives.tsx           Container, Section, Heading, Button, Surface, RuledColumns...
    motion.tsx               Reveal, LineArt, Marquee, CountUp, PauseOffscreen
    states.tsx               the five states, Toaster
    landing/                 one file per section: hero.tsx, signature.tsx, proof.tsx...
    product/                 the real product components the landing page also renders
  lib/
    data.ts                  seed data and the swap seam
  fonts/                     local font files, if any
```

One file per landing section keeps the storyboard visible in the file tree. The landing
page imports the same product components as the app, which is what makes the mocks real.

## Component libraries

`assets/primitives.tsx` covers layout, type, buttons, surfaces and open content. For
behavior that is genuinely hard (dialogs, menus, popovers, tooltips, comboboxes), use
Radix primitives directly and style them with the tokens:

```bash
npm i @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tooltip
```

shadcn/ui works too, with two cautions. `npx shadcn init` rewrites `globals.css` with its
own tokens, so run it before copying the skill's `globals.css`, or not at all (`npx shadcn
add` works without it if `components.json` exists). And its components use token names
this system does not define. Replace them in each generated file:

| shadcn class | Token class |
|---|---|
| `bg-background` | `bg-ground` |
| `text-foreground` | `text-fg` |
| `text-muted-foreground` | `text-fg-mute` |
| `bg-muted` | `bg-fill` |
| `bg-accent` (hover background) | `bg-fill` (not `bg-accent`, which is the brand accent here) |
| `bg-primary` / `text-primary-foreground` | `bg-action` / `text-on-action` |
| `bg-card`, `bg-popover` | `bg-panel` |
| `border-input`, `border` | `border-line-strong`, `border-line` |
| `ring-ring` | `ring-focus` |
| `bg-destructive` | `bg-danger` |
| `rounded-md`, `rounded-lg` | `rounded-input`, `rounded-tile` |
| `shadow-md`, `shadow-lg` | `shadow-pop` |

The default palette and shadow scale are removed in `globals.css`, so an unconverted class
renders nothing, and `slop-check.sh` lists every one.

## Tailwind v3

Upgrade if there is any time: `npx @tailwindcss/upgrade` handles most projects in minutes.
If not, keep the token blocks as plain CSS (`:root` and `[data-theme="dark"]` work in
any CSS), map the colors in `tailwind.config.ts` under `theme.extend.colors` as
`ground: "var(--ground)"` and so on, map radii under `theme.extend.borderRadius`, and turn
each `@utility t-...` block into a class inside `@layer components`. Opacity modifiers
(`bg-fg/50`) will not work on hex variables in v3; use the four text strengths instead.

## Other stacks

| Situation | Use | Change |
|---|---|---|
| Pure client demo, no server | Vite + React + Tailwind v4 | in `primitives.tsx`, replace `next/link` with `<a>`; load fonts with `@fontsource/*` |
| An existing app in another framework | keep it | port `globals.css` as is; the primitives are plain JSX and port in minutes |
| A static landing page only | Next with `output: "export"` or Astro | the CSS and the patterns carry over unchanged |

Do not switch stacks after hour two. The switch always costs more than the problem.
