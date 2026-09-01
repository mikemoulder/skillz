# Scaffold

## Step 0: establish ground truth

Never trust a remembered version number. Read what you actually got:

```bash
npm ls next react tailwindcss 2>/dev/null | head -5
ls src/app/globals.css tailwind.config.* postcss.config.* components.json 2>/dev/null
head -3 src/app/globals.css
```

| Signal | Tailwind version | What that means |
|---|---|---|
| `@import "tailwindcss";` at top of globals.css | **v4** | Theme in CSS, `@theme inline`, no config file. Use `assets/globals.css` as-is. |
| `@tailwind base;` + a `tailwind.config.ts` | **v3** | Theme in JS, HSL triplets. See the v3 fallback below. |
| Neither | not installed | `npx shadcn@latest init` and let it install. |

## Fresh project

```bash
npx create-next-app@latest APP --ts --tailwind --app --eslint --src-dir --use-npm
cd APP
npx shadcn@latest init          # pick the neutral base; accent comes from CONFIG
npx shadcn@latest add button card input badge skeleton sonner dialog dropdown-menu tabs
npm i lucide-react motion
```

Then, in order:

```bash
cp <skill>/assets/globals.css   src/app/globals.css
cp <skill>/assets/app-shell.tsx src/components/app-shell.tsx
cp <skill>/assets/states.tsx    src/components/states.tsx
cp <skill>/assets/seed.ts       src/lib/data.ts
npm run dev
```

Edit exactly one line before you write a feature: `--brand` in `globals.css`.

## Root layout

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const sans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PROJECT: TAGLINE",     // CONFIG project_name / tagline
  description: "TAGLINE",
  openGraph: { title: "PROJECT", description: "TAGLINE", images: ["/og.png"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // "dark" here = CONFIG brand.mode: dark-first. Add "projector" for stage.
    <html lang="en" className="dark">
      <body className={`${sans.variable} ${mono.variable}`}>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
```

`og.png` at 1200x630 in `/public` takes five minutes and makes every link you
paste into Slack, Devpost and the judging sheet look like a real product. Do it.

## Directory shape

Flat. A hackathon does not survive a clever architecture.

```
src/
  app/
    layout.tsx
    page.tsx              <- the hero screen. build this one properly.
    [feature]/page.tsx    <- at most CONFIG demo.screens_max - 1 of these
    api/items/route.ts    <- only if you actually have a backend
  components/
    app-shell.tsx
    states.tsx
    ui/                   <- shadcn, do not hand-edit
    [feature]-card.tsx
  lib/
    data.ts               <- SEED + the swap seam. the important file.
    utils.ts
```

Rules that pay off:

- **No `components/common/`, no `hooks/` until you have three of something.**
  Premature structure costs more than duplication at this timescale.
- **One file per screen until it exceeds ~200 lines.** Then extract the card,
  not the "logic".
- **Server components by default.** Add `"use client"` only when a file uses
  state, effects or event handlers. If a page is slow to iterate on, it is
  usually because a client boundary sits too high in the tree.

## Tailwind v3 fallback

If you inherited a v3 project and cannot upgrade in the time available, do not
fight it. Keep the shadcn HSL-triplet convention:

```css
/* globals.css */
@tailwind base; @tailwind components; @tailwind utilities;
@layer base {
  :root   { --primary: 243 75% 59%; --background: 0 0% 100%; --foreground: 222 47% 11%; }
  .dark   { --primary: 245 80% 68%; --background: 222 47% 8%;  --foreground: 210 40% 98%; }
}
```

```ts
// tailwind.config.ts
theme: { extend: { colors: {
  primary: "hsl(var(--primary))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
}}}
```

Note the triplets are bare `H S% L%` with no `hsl()` wrapper. That is what
lets `bg-primary/50` opacity modifiers work. Everything else in this skill
(the five states, the shell, the seed seam, the checklists) is version-agnostic.

## Alternate stacks

| Situation | Use instead | Why |
|---|---|---|
| Pure client demo, no API, no auth | `npm create vite@latest app -- --template react-ts` | ~2s HMR vs Next's cold compile. Meaningful over 12 hours. |
| Judges will read code, backend is Python | Next frontend + separate FastAPI | Do not force API routes to proxy a service you already have. |
| Team has one frontend dev and it is not you | Whatever they already know | Familiarity beats every advantage on this list. |

Do not switch stacks after hour 2. The switch always costs more than the
problem it solves.
