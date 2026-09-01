# Deploy

## Deploy before you build

Phase 1 of the build order, non-negotiable. A blank page on a public URL in
the first twenty minutes buys you:

- Every later push is a 60-second deploy instead of an unknown risk.
- Build errors surface one commit at a time, not all at once at minute 358.
- The team gets a link to share the moment there is anything to see.
- Environment-variable problems appear now, when they are cheap.

The teams that deploy last are the teams that do not deploy.

## Vercel (default for Next.js)

```bash
npm i -g vercel
vercel                 # first run: links the project, deploys a preview
vercel --prod          # promote to the real URL
```

Or connect the GitHub repo in the dashboard. Every push to `main` deploys,
every PR gets a preview URL. For a team hack, the GitHub integration is
better: nobody has to have the CLI logged in.

Environment variables:

```bash
vercel env add OPENAI_API_KEY production
vercel env pull .env.local        # sync down so local matches prod
```

Two rules that cost teams the deadline:

- **`NEXT_PUBLIC_*` is public.** It is inlined into the browser bundle. Never
  a secret. Never an API key you pay for.
- **Env vars are read at build time.** Adding one in the dashboard does
  nothing until you redeploy. `vercel --prod --force`.

## Netlify / Cloudflare

```bash
# Netlify
npm i -g netlify-cli && netlify deploy --build --prod

# Cloudflare Pages (Next on Workers)
npx @cloudflare/next-on-pages && npx wrangler pages deploy .vercel/output/static
```

Both work. Neither is worth switching to mid-hack if Vercel is already set up.
Cloudflare's Next support has real edge-runtime constraints. Do not discover
them at hour 10.

## Static export

If there is genuinely no backend, the deploy target stops mattering:

```js
// next.config.js
module.exports = { output: "export", images: { unoptimized: true } };
```

`npm run build` emits `out/`, which any host will serve, including GitHub
Pages. Note: no API routes, no server components with data fetching, no
`next/image` optimization. Fine for a seed-data demo, fatal if you planned
server actions.

## The build that fails at the deadline

The three that account for most of them:

| Error | Cause | Fix now, not later |
|---|---|---|
| `Type error: ... in /app/page.tsx` | Vercel builds with type-checking; `next dev` does not | Run `npx tsc --noEmit` early and often |
| `Module not found: Can't resolve '@/components/...'` | Case-sensitive Linux vs case-insensitive macOS/Windows | Match filename case exactly. `Button.tsx` != `button.tsx` |
| `ReferenceError: window is not defined` | Browser API in a server component | `"use client"`, or move it into `useEffect` |

The escape hatch, only in the final hour, only if the failing check is not a
real bug:

```js
// next.config.js: the "we ship in 40 minutes" config
module.exports = {
  eslint:     { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};
```

This is a legitimate hackathon move and a terrible habit. Use it to ship, and
mention nothing about it in the README.

## Domain

A custom domain takes about five minutes and is worth roughly one slide of
credibility. `vercel domains add yourhack.dev`, or just rename the project so
the URL reads `riverside-audit.vercel.app` instead of `my-app-git-main-x7f2`.
Rename it. It is free and it appears on every judging sheet.

## Deploy checklist

```
[ ] public URL exists and was opened from a phone (not just your laptop)
[ ] the URL is in the README, the Devpost entry, and the team chat
[ ] production build passes locally: npm run build
[ ] no secret in any NEXT_PUBLIC_ var
[ ] the deployed build is the one you rehearsed against
[ ] someone other than the author has loaded it successfully
```

That last one catches the class of bug where it only works on the machine that
has the `.env.local`.
