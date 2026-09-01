# Stack defaults

Every choice here is made so you do not spend the hour making it. They are not the
best technologies in the world; they are the ones that get a deployed URL fastest with
the fewest ways to fail, which is the only property that matters before Sunday.

Deviate when a trigger in `SKILL.md` step 2 fires. Do not deviate on taste.

## The default

```text
Next.js App Router     UI + API in one repo, one deploy, one language
Postgres (Supabase)    managed, free tier, connection string in 5 minutes
Drizzle                typed queries, `push` instead of migrations
Vercel                 git push → deployed, preview URL per branch
```

```bash
npx create-next-app@latest APP --ts --tailwind --app --eslint --src-dir --use-npm
cd APP && npm i drizzle-orm postgres && npm i -D drizzle-kit
npx vercel link && npx vercel        # a URL exists before you write a feature
```

Verify what you actually got rather than trusting a remembered version:

```bash
npm ls next react drizzle-orm 2>/dev/null | head -5
```

## Why route handlers instead of a backend service

The instinct to split frontend from backend is correct in production and wrong here.
One deploy means: one set of env vars, no CORS, no service-to-service auth, shared
types with no codegen step, and one thing that can be down during judging instead of
two.

```text
src/app/api/tasks/route.ts       POST /api/tasks
src/app/api/tasks/[id]/route.ts  GET  /api/tasks/:id
src/lib/                         the actual logic. framework-free, testable, spikeable
```

Keep real logic in `src/lib/` and let route handlers be thin. That is the entire
"modular monolith" discipline you need: it keeps the hard part runnable from a script
during the spike, and it means extracting a service later is a file move, not a
rewrite. You will not extract a service later.

## Database

| Situation | Choice |
|---|---|
| Anything must survive a page reload | Postgres on Supabase or Neon |
| Team knows Prisma, not Drizzle | Prisma. Do not learn an ORM today |
| Single-player demo, nothing persists | **No database.** In-memory + seed |
| You need vector search | Postgres + `pgvector`, same database |
| You need a queue | A `jobs` table with a status column, same database |

That last row is worth internalizing: a table with `status` and a worker polling it
every two seconds is a queue. It is observable in the SQL editor, it survives a
restart, and it costs zero new infrastructure. Redis, SQS and BullMQ are all correct
answers to a problem you do not have this weekend.

Skip migrations. `drizzle-kit push` against a dev database is right for 36 hours; a
migration history is for teams that need to roll back, and you do not.

## Hosting

| Host | Best for | Watch out for |
|---|---|---|
| **Vercel** | Next.js, the default | Function wall-clock limit; no long-running process |
| **Railway** | A worker, a Python service, anything long-lived | Sleeps on free tiers — warm it before demoing |
| **Fly.io** | Persistent processes, websockets | More setup than you want at hour two |
| **Render** | Simple always-on services | Cold starts on free tier are brutal |
| **Cloudflare** | Edge, cheap and fast | Workers runtime is not Node; some SDKs break |

Deploy in hour one, before there is anything to deploy. A team that deploys last loses
the hack to a build error at minute 358 — a `Module not found` that only appears in a
production build, an env var that only exists on a laptop, a package that needed a
Node version the host does not run.

## The limits that actually bite

**Verify these against your host's current docs during step 2** — they change, and the
free-tier numbers change most. What matters is the shape of the constraint, which does
not change:

| Limit | Typical order of magnitude | Kills |
|---|---|---|
| Function wall clock | ~10s free, up to a minute or two paid | Agent loops, long LLM chains, batch jobs |
| Request/response body | A few MB | File upload, base64 images, huge JSON |
| Response streaming | Usually supported, sometimes not on edge | SSE demos, token streaming |
| Concurrent connections | Low on free DB tiers | A serverless function per request, each opening a pool |
| Build time | ~10-45 min | Nothing you will hit, unless you commit `node_modules` |

The connection-pool one surprises people: serverless plus a naive Postgres client
exhausts a free-tier connection limit under almost no load. Use the pooled connection
string your provider gives you (Supabase's pooler, Neon's pooled endpoint), not the
direct one, and cache the client in module scope.

## Environment variables

```text
.env.local          real values. gitignored. never committed
.env.example        the same keys, all values empty. committed
```

Set them in the host's dashboard the moment you create the project, not the night of.
Then verify the deployed app has them — a missing env var in production is invisible
locally and presents as a 500 in front of a judge.

`NEXT_PUBLIC_*` is shipped to the browser. Nothing secret gets that prefix, and before
demoing:

```bash
grep -rl "sk-\|API_KEY\|SECRET" .next/static 2>/dev/null && echo "LEAK"
```

## Realtime, in order of preference

| Approach | Use when | Cost |
|---|---|---|
| **Polling** (2s `setInterval`) | Almost always. Status updates, job progress | 10 minutes |
| **SSE** from a route handler | You want tokens or steps to *stream* on screen | 1 hour |
| **WebSockets** | Genuinely bidirectional, many clients | Half a day, plus a host that supports them |
| **Managed realtime** (Supabase, Pusher) | Multi-client sync is the product | Varies, plus a dependency |

Polling looks identical to a judge and takes a tenth of the time. Choose SSE when the
*streaming itself* is the demo — watching an agent's steps appear is genuinely better
theater than a progress bar — and choose WebSockets only when two clients must see
each other.

## Python, when you cannot avoid it

If the core work is a model, a notebook or a research library, do not rewrite it in
TypeScript at a hackathon. One FastAPI service, one endpoint, deployed to Railway,
called from a Next route handler:

```text
Next route handler  →  POST https://svc.railway.app/run  →  the Python thing
```

Budget a full lane for this. Two runtimes means two deploys, two dependency systems
and a CORS conversation, and it is the most expensive deviation on the table. It is
still cheaper than porting a working model.
