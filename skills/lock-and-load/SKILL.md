---
name: lock-and-load
description: Initialize a hackathon repo for disciplined work before the building starts. Sets up git hygiene, the CLAUDE.md that governs every session, the continuity files, and a commit roadmap aimed at a history that reads as sustained engineering rather than a code dump. Use at the start of a build once the idea is chosen, when a repo needs its working rules established, when adapting an existing project for a hackathon, or when the commit history is becoming a liability. Read CONFIG.md first.
---

# Lock and load

Twenty minutes, once, in hour one. It creates the scaffolding that makes every later
session disciplined: the rules file, the continuity files, the git hygiene, and a commit
plan.

Run it after the idea is chosen and before the first feature. It does **not** replace
`/skillz:architecture`, which designs the system. This sets up the repo the system will
live in, and the two run back to back in hour one.

**Read `CONFIG.md` before anything else.**

**Per-event config lives in the project, not here.** If the hackathon repo has a
`hackathon.yml` at its root, read that first; the values below are defaults. At the
start of an event, copy this skill's `CONFIG.md` into a `hackathon.yml` at the project
root and edit that copy, so a plugin update never overwrites your settings.

## The rule that governs everything

> Set up the repo for the history judges will read, not just for the code you are about
> to write.

Organizers check commit history to confirm the work happened during the event. That
makes your history a judged artifact, not a byproduct. A log showing steady progress
across the weekend reads as engineering; four giant commits read as a dump, or worse, as
code that existed before the event.

## Time budget

| # | Phase | Wall clock | Output |
|---|---|---|---|
| 1 | Inspect what is already here | 3 min | New, existing or partial, and what to preserve |
| 2 | Git hygiene | 5 min | `.gitignore`, no secrets, first commit |
| 3 | The three files | 7 min | `CLAUDE.md`, `handoff.md`, `memory.md` |
| 4 | Commit roadmap | 5 min | Natural commit boundaries from the build order |

**This must not delay the deploy.** `/skillz:architecture` wants a URL to exist in hour
one, and that outranks this. Run them in parallel: one person deploys an empty app while
another runs this, or run this immediately after the deploy lands.

```bash
bash assets/init.sh          # does phases 2 and 3 in about thirty seconds
```

## Step 1 - Inspect first

Never overwrite instructions you have not read.

```bash
ls -a; cat README.md CLAUDE.md AGENTS.md 2>/dev/null | head -40
cat package.json 2>/dev/null | head -30
git log --oneline | head -10; git status --short
cat .gitignore 2>/dev/null
```

Classify what you have, because the answer changes everything after it:

| State | Approach |
|---|---|
| **Empty directory** | Full setup. Nothing to preserve |
| **Fresh scaffold** (create-next-app and nothing else) | Full setup. Keep the generated `.gitignore` and add to it |
| **Existing project** | Read every instruction file before touching it. Add, do not replace |
| **Pre-existing code being adapted** | **Check the rules.** Many events restrict pre-existing code, and commits predating the window are a disqualification risk. Resolve this before writing anything |

That last row is the one that ends hackathons, and it is a five minute check.

## Step 2 - Git hygiene

### What never gets committed

```text
.env, .env.local, .env*.local      secrets
node_modules/, .next/, dist/        regenerable
*.log, .DS_Store                    noise
any private key, on any network     see the house rules
```

Verify rather than assume, because a key in history stays in history:

```bash
git ls-files | grep -E "^\.env$|^\.env\.local$" && echo "REMOVE AND ROTATE"
git log --all -p 2>/dev/null | grep -icE "sk-[a-zA-Z0-9]{20}|PRIVATE_KEY=[^[:space:]]"
```

Commit `.env.example` with every key present and every value empty.

### What does get committed, despite the temptation

**Do not blanket-ignore markdown.** The rule `*.md` with `!README.md` looks tidy and
quietly breaks two other skills:

- `/skillz:readme` and `/skillz:polish` create `docs/architecture.md`,
  `docs/integrations.md`, `docs/evaluation-map.md` and `docs/technical-decisions.md`.
  Those are judge-facing evidence. A sponsor judge clicks them. Ignored, they do not
  exist.
- `handoff.md` ignored means a teammate who was asleep cannot read it. The whole point
  of a handoff is that someone else resumes from it, so a local-only handoff works for
  one person on one machine and fails everywhere else.

The real goal behind the instinct is a repo root that looks intentional. Get that by
putting the operational files somewhere deliberate, not by hiding them:

| Layout | Root contains | Choose when |
|---|---|---|
| **Flat** (default) | `README.md`, `CLAUDE.md`, `handoff.md`, `memory.md` | Solo or pair. Simplest |
| **`.hack/`** | `README.md`, `CLAUDE.md` only | Three or more people, or you want the tidiest tree |

Both commit everything. Set `repo.layout` in CONFIG. Full reasoning and the drop-in
file: `references/repo-hygiene.md` and `assets/gitignore`.

## Step 3 - The three files

| File | Job | Source |
|---|---|---|
| `CLAUDE.md` | The working stance, read every session | `../workflow/assets/CLAUDE.md` |
| `handoff.md` | Where work stopped, and the next step | `../workflow/assets/handoff.md` |
| `memory.md` | Durable project knowledge | `../workflow/assets/memory.md` |

Copy them, then fill in the project specifics: the commands, the demo path files, the
deployed URL. An unfilled `CLAUDE.md` is worse than none, because it costs context every
session and says nothing.

`/skillz:workflow` owns how these are maintained during the build. This skill only
creates them. Do not duplicate its guidance here.

The one rule worth repeating at init, because it is the one that decays: **`handoff.md`
gets updated at every checkpoint, not at session end.** You will not know which
checkpoint was the last one.

## Step 4 - The commit roadmap

Do not invent a second plan. Take the build order from
`../architecture/references/build-order.md` and mark the commit boundaries on it.

```text
Phase            Commits   Boundary
Foundation       1-6       scaffold, deploy, tokens, shell, types, seed
Walking skeleton 7-12      one request end to end, API, schema, render
The aha path     13-24     the hard part, in working increments
Rest of demo     25-34     remaining screens and routes
States + errors  35-42     empty, loading, error, partial, success, fallbacks
Hardening        43-50     demo-proofing, README, fixtures, recording
```

That is a planning tool, not a quota. Numbers are illustrative; the real boundaries come
from your build order.

### The target, and the actual reason for it

**Aim for 50 or more meaningful commits.** Over a 36 hour event that is roughly one
every 45 minutes, which is a natural working rhythm rather than a stretch.

The reason is not neatness. Organizers check history to confirm the work happened in the
window, and a judge who opens your commits sees one of two stories:

```text
52 commits, steady across two days, readable messages   a team that built something
4 commits, three of them in the last hour               a dump, or pre-existing code
```

**Never manufacture commits to hit the number.** `fix`, `update`, `changes`, `final`,
`final2` are worse than a smaller honest count, because they are visibly padding and
padding reads as insecurity. A real 30 beats a fake 50.

Message format, the anti-spam rules, and what a strong history looks like:
`references/commit-history.md`.

## Commit discipline

Every commit is one coherent unit that leaves the project working.

```text
feat: add wallet connection flow
fix: handle expired session tokens
test: cover settlement retry behavior
refactor: simplify transaction service
docs: document sponsor integration
chore: configure deployment environment
```

Three hard rules, all from the house rules and all checkable:

- **No em dashes** in commit messages.
- **No AI attribution.** No `Co-Authored-By` naming a tool, no generated-by footer, no
  robot emoji. History is a surface judges read.
- **No secrets.** Ever, on any network.

Before each commit:

```text
[ ] One purpose, and the project still runs
[ ] Only related changes
[ ] I actually verified the behavior I am claiming
[ ] Message is specific, no em dash, no AI trailer
[ ] handoff.md reflects reality
```

## Honest test records

Record what you ran, in `handoff.md`, with real numbers:

```text
Ran:    npm test -- settlement
Result: 12 passed, 0 failed
Covers: payout path and the cap rejection
```

**Never claim a test you did not run, and never invent a count.** An unticked box is
useful information; a ticked box nobody exercised removes the next person's reason to
look. `../workflow/references/verification.md` has the escalation ladder.

## What not to do at init

- **Do not build features.** This is twenty minutes of setup, then you build.
- **Do not pre-create empty commits** to seed the count.
- **Do not add CI, Docker, husky or a monorepo tool.** None of them score, all of them
  cost an hour, and a pre-commit hook that fails at 3am is a real risk.
- **Do not write a test suite.** One smoke test of the demo path, later.
- **Do not rewrite an existing project's conventions** to match your preferences.
- **Do not delay the deploy.** A URL in hour one outranks everything here.

## Time traps

- **Perfecting `CLAUDE.md`.** Fill the commands and the demo path. Refine it later or never.
- **Designing a branch strategy** before anyone has pushed. Default to `main`, add
  branches when two people actually collide.
- **A commit roadmap with forty line items.** Six phases is enough to work from.
- **Running this twice.** It is an init skill. After the first run, `/skillz:workflow`
  owns the ongoing discipline.

## Report

```text
LOCKED AND LOADED

Created      CLAUDE.md, handoff.md, memory.md, .gitignore, .env.example
Preserved    [anything that already existed and was kept]
Layout       flat | .hack/
Commits      1 (initial). Roadmap: 6 phases, ~50 boundaries
Verified     no secrets tracked, no secrets in history, build green

State        [one line on where the project actually is]
Next         [the exact next task, with the file]
```

## Handoff

`/skillz:architecture` next, if it has not already run in parallel. Then
`/skillz:workflow` governs every session from here, and `version-control` for the git
problems that arrive later: a four-way merge at 3am, and recovery from the one that ate
the demo.
