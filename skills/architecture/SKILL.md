---
name: architecture
description: Design the smallest architecture that survives a hackathon, pick the stack in five minutes, draw seams so the whole team can build in parallel, put a fixture behind every external dependency, and get a risk-first build order that produces something deployed in hour one. Use after an idea is chosen, when a project needs structure, when connecting a frontend, backend, database, LLM, agent, chain or third-party API, when choosing between architectural approaches, or when the build has stalled and the design is the reason. Read CONFIG.md first.
---

# Hackathon architecture

Architecture at a hackathon is a scheduling decision wearing technical clothes. The
diagram has two jobs and neither is elegance: let four people work at once without
blocking each other, and let any single dependency fail at 2pm on Sunday without
taking the demo with it. A design that is correct but serializes the team is a bad
design here.

**Read `CONFIG.md` before anything else.** Stack, team size, what components exist,
and the clock all live there. If it is unfilled, infer from the idea brief and the
repo, state your assumptions in one line, and keep moving.

**Per-event config lives in the project, not here.** If the hackathon repo has a `hackathon.yml` at its root, read that first; the values below are defaults. At the start of an event, copy this skill's `CONFIG.md` into a `hackathon.yml` at the project root and edit that copy, so a plugin update never overwrites your settings.

## The rule that governs everything

> Draw the boundaries where the work splits and where reality can be faked.

Every seam should either let another person start working, or let a dependency
disappear without stopping the demo. A boundary that does neither is a boundary you
are maintaining for free.

## Time budget

Architecture is capped at **45 minutes**. It ends with a spike running, not a document.

| # | Phase | Wall clock | Done when |
|---|---|---|---|
| 1 | Write the demo path | 10 min | The one flow, end to end, as steps |
| 2 | Take the default stack | 5 min | Deviations named and justified, or none taken |
| 3 | Draw the seams | 10 min | Every dependency has a fixture; every person has a lane |
| 4 | State + API surface | 10 min | The entities and about five endpoints, typed |
| 5 | Risk spike + build order | 10 min | Someone is already running the riskiest call |

If this is taking ninety minutes, the architecture is too big. That is the signal, not
the schedule slipping.

## Step 1: The demo path is the specification

Take the demo script from `skills/ideation/assets/idea-brief.md` and write what the
system does at each beat:

```text
User action        →  what the UI does  →  what the server does  →  what persists
```

**Everything not on this path is out of scope until the path works end to end.** Not
deprioritized, out. This single rule removes most architecture decisions before you
have to make them, because the components that were only serving hypothetical
features stop existing.

Mark one step as **the aha moment**. That step gets the redundancy, the fallback, and
the good error handling. The others get none of it.

## Step 2: Take the default stack

Where the choice does not change the outcome, do not spend the hour. The default:

```text
Next.js App Router        UI and API in one deploy, one repo, one language
  route handlers          this IS your backend. no separate service
Postgres (Supabase/Neon)  managed, has a free tier, works in 5 minutes
Drizzle or Prisma         whichever the team has used. do not learn one today
Vercel                    git push → deployed
```

One process. One deploy. One language. The overwhelming majority of hackathon projects
should be exactly this and nothing else.

**Deviate only on these triggers:**

| Trigger | Add | Not |
|---|---|---|
| A job runs longer than the function timeout | A worker process + a job row | A longer function |
| The demo needs live updates | SSE from a route handler | WebSockets, Redis pub/sub |
| The core work is Python (ML, notebooks, a research lib) | One FastAPI service, called by Next | Rewriting it in TS |
| Smart contracts | Foundry or Hardhat in the same repo | A separate contracts repo |
| Files/images | The host's blob storage | S3 + a signed-URL service |
| Nothing persists between page loads | Nothing. Skip the database | A database "for later" |

Anything not on this table is not a trigger. `references/stack-defaults.md` has the
picked versions, the hosting comparison, and the timeout and payload limits that
actually bite.

**Two subsystems need design past this point, and only if CONFIG says they exist:**
`components.agent: true` → `references/agent-architecture.md` for the loop bounds,
the tool allowlist and the authorization boundary. `components.onchain: true` →
`references/onchain-architecture.md` for the on-chain/off-chain split, the transaction
lifecycle and the wallet model. Both are where the technical score and the sponsor
judge's first question live. If neither is true, skip both and keep moving.

## Step 3: Draw the seams

Two jobs, done at once.

### Seam job A: parallel lanes

Architecture decides how many people can work at 3am. Draw the boundaries so each
person owns files nobody else touches:

| Lane | Owns | Builds against |
|---|---|---|
| **UI** | `app/`, `components/` | Seed data. Never waits for the API |
| **The hard part** | The agent loop / contracts / whatever earns the technical score | A fixture harness, run from a script |
| **Data + API** | `app/api/`, schema, queries | Its own types |
| **Ops + demo** | Deploy, env vars, the demo path, README, the fallback recording | Whatever exists |

With a team of two, merge Data+API into UI and keep the hard part isolated. The hard
part is *always* its own lane. It is the thing most likely to run long, and it must
never block anyone.

**The lanes meet at typed contracts, written before anyone opens an editor.** Define
the shared types in one file, commit it first, and treat it as frozen for the next six
hours. Ten minutes on this buys back the two hours of merge conflicts that normally
arrive at hour 20.

```ts
// src/lib/types.ts: committed before any lane starts. changes here are announced.
export type Task = { id: string; prompt: string; status: TaskStatus; steps: Step[] };
```

### Seam job B: a fixture behind every dependency

Every call that leaves your process goes through one module that can serve a recorded
response instead: LLMs, chains, third-party APIs, payment rails, anything.

```text
your code → lib/<dep>.ts → live call
                        ↘ fixture (recorded once, when it worked)
```

This is not a nicety. It is what makes the demo survivable, and it is worth building
in hour two rather than hour thirty:

- The UI lane starts immediately, without waiting for the integration.
- A rate limit, an expired key or dead venue wifi costs zero.
- You can rehearse the demo a hundred times without burning quota.
- The slow dependency stops slowing every test cycle.

`assets/seam.ts` is the drop-in wrapper: timeout, retry, fallback, and a flag to
force fixtures for the live demo. `references/seams-and-fixtures.md` covers recording
real responses and which dependencies deserve which treatment. Note the layering: this
is the *server* seam; `skills/frontend/assets/seed.ts` is the browser→API seam. A
demo-proof project has both.

## Step 4: State and API surface

Minimum viable, and no more.

**State rule:** if the demo does not read it, do not store it. Every entity must appear
somewhere on the demo path or it is deleted from the schema.

A typical agent-shaped project is three tables, not twelve:

```text
Task     id, prompt, status, created_at
Run      id, task_id, status, started_at, finished_at
Step     id, run_id, type, input, output, status, created_at
```

**API rule:** about five endpoints. If you are writing the ninth, the demo path grew
without anyone deciding it should.

Skip, deliberately: users and auth (hardcode one user id), soft deletes, pagination,
migrations beyond `push`, audit columns, and any table whose purpose is "we might need
it".

## Step 5: The risk spike, then the build order

**Before the architecture is final**, one person makes the riskiest external call
succeed exactly once, from a throwaway script. Not integrated, not wrapped, not
typed, just proven.

```bash
# hour one, in a scratch file, in parallel with everything else
node spike.ts   # does the SDK authenticate and return something from this laptop?
```

The question "does this SDK actually work for us" has ended more hackathons than any
other, and it is free to answer in hour one and catastrophic to answer at hour twelve.
If the spike fails and cannot be fixed within an hour, **the architecture changes now**,
while changing it is cheap.

Then build in risk order, not layer order:

| # | Milestone | Why here |
|---|---|---|
| 0 | Riskiest call proven in a script | Kills the project-ending unknown while it is cheap |
| 1 | Empty app deployed | A URL exists. Deploy before you build |
| 2 | Walking skeleton, one request, end to end, hardcoded | Proves the wiring, unblocks all lanes |
| 3 | The aha path, real | The one thing that must work |
| 4 | The rest of the demo path | Everything else on the script |
| 5 | States, errors, fallbacks | Where the polish score lives |
| 6 | Demo hardening | Rehearse against production, record the fallback |

Layer-first ordering (all the backend, then all the frontend) is the classic
hackathon mistake: nothing is demoable until the end, and the end never arrives.
Milestone 2 before 3 is the whole trick. `references/build-order.md` has the
checkpoints and what to do when a lane falls behind.

## The timeout budget

The most common architectural failure in an agent hackathon, and it appears at hour
twenty with no warning:

> It works locally. In production it 504s.

Serverless functions have a wall-clock limit, often around 10 seconds on a free tier,
and typically not more than a minute or two on paid ones. **Check your host's current
limit before designing.** An agent loop that runs 90 seconds cannot live in a request
handler at any limit worth relying on.

| Operation duration | Shape |
|---|---|
| Under ~5s | Plain request handler. Done |
| ~5-30s | Stream it (SSE). The user watches steps arrive, and the connection stays alive |
| Over ~30s | Write a job row, return immediately, poll or stream status. A worker does the work |

Streaming is worth choosing for the demo even when a plain response would fit: a
progress log that fills in is the most-watched part of a pitch, and a spinner is the
least. Decide this at minute 30, because retrofitting it at hour 20 means rewriting
the route, the client and the state model at once.

## Security boundaries

Short, and none of it optional:

- **Secrets are server-side only.** In Next, anything named `NEXT_PUBLIC_*` ships to the
  browser. Before demoing: `grep -rl "sk-\|API_KEY\|SECRET" .next/static`.
- **No private key in the repo, ever, on any network.** Not in `.env.example`, not in a
  comment, not "just the testnet one", testnet keys get reused on mainnet later.
- **The agent proposes; your code decides.** Any agent touching money, keys or anything
  irreversible runs behind a boundary you enforce in ordinary code: an allowlist of
  callable tools, a hard cap on amounts, and a human confirmation on the irreversible
  step. Never hand a model an unbounded signer. This is also the question a sponsor
  judge asks first, and "the model decides" is the wrong answer.
- **Testnet unless the demo genuinely requires otherwise.** Real funds on stage are a
  risk with no scoring upside.

## Theater

Complexity added to look serious. Judges, particularly the sponsor engineers, read
all of it correctly.

| Theater | Looks like | Actually |
|---|---|---|
| **Microservice** | Five services, four of them one file | Four deploys to break, one demo |
| **Blockchain** | A hash written on-chain, read by nobody | A database with a worse latency profile |
| **AI** | An LLM call where an `if` would do | A slower, less reliable, non-deterministic `if` |
| **Infrastructure** | Custom queue, custom auth, custom cache | The weekend, spent on solved problems |
| **Abstraction** | Repositories, factories, adapters, one impl each | Indirection with no second implementation to justify it |
| **Diagram** | Boxes for things nobody will build | A judge asking about the box, and finding out |

The diagram test: **at most seven boxes, and every box is a folder in the repo or a URL
you can open.** Delete any box that is neither. A diagram that matches the repo is
worth real points in the README; one that does not is a liability in Q&A.

## What not to build

Auth and login flows (hardcode a user). An admin panel. Rate limiting. Multi-tenancy.
A migration history. Caching (nothing has load). Docker (the host builds from git).
i18n. A component library. A test suite: one smoke test of the demo path is worth it,
a suite is not. Retry logic anywhere except the seam. Anything whose justification
starts with "when we scale".

## SALVAGE MODE

When `time.build_hours < 8`, or the build has stalled and the design is why:

1. **Collapse to one process.** Delete the worker, the second service, the queue. Move
   that code into a route handler, however ugly.
2. **Flip every seam to fixtures.** All of them, right now. Recorded responses are a
   working demo; a half-finished integration is not.
3. **Delete the database if nothing must survive a reload.** In-memory state and seed
   data demo identically for three minutes.
4. **Keep exactly the aha path.** Delete every route not on it. A judge will click one
   and find the half-built page.
5. **Deploy, then record the working flow.** In that order.

A project running entirely on recorded responses, deployed and rehearsed, outscores a
real integration that 504s on stage. Say it runs on demo data; volunteering that costs
one point of completeness and buys back several of credibility.

## Time traps

- **Choosing the stack.** It is chosen. Step 2. Move.
- **Setting up Docker, CI, or a monorepo tool.** Nothing here needs a build system with
  opinions.
- **Designing the schema for the product you would build with a year.** Three tables.
- **Auth.** Costs 3 hours, scores 0 points, and judges never see the login page.
- **Refactoring at hour 20.** Ugly code that renders beats clean code that does not.
- **Building the second feature before the first is deployed.** Nothing is real until
  it has a URL.
- **Writing the architecture document instead of the spike.** The document is one page
  and comes after something ran.

## Handoff

Fill `assets/architecture-brief.md`: one page, and the source of the README diagram.
Then: `/skillz:frontend` for the UI lane (hand it the types file and the seed shape),
`/skillz:readme` for the judge-facing writeup, and `/skillz:version-control` for
lane branches that survive a four-person merge at 3am.
