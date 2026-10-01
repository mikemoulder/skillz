# Repo hygiene

What to commit, what to ignore, and why the obvious markdown rule is a trap.

## The markdown trap

The tempting rule:

```gitignore
*.md
!README.md
```

It aims at something real: a repo root that does not look like a pile of notes. But it
hides exactly the files other people need.

| File | Who needs it | Ignored means |
|---|---|---|
| `docs/architecture.md` | A technical judge | The diagram they asked about does not exist |
| `docs/integrations.md` | The sponsor judge | Your track prize evidence is gone |
| `docs/evaluation-map.md` | Every reviewer | "Where is the thing you built" has no answer |
| `docs/technical-decisions.md` | A technical judge | Your reasoning is invisible |
| `handoff.md` | Whoever works next | A teammate who slept cannot resume |
| `memory.md` | Every session | Each person rediscovers the project |

The first four are produced by `/skillz:readme` and `/skillz:polish`, which both tell you
to commit them. The last two are `/skillz:workflow`'s continuity system, which only works
if more than one person can read it.

## Getting the tidy root anyway

Put operational files somewhere deliberate rather than hiding them.

**Flat** (default, best for one or two people):

```text
README.md
CLAUDE.md
handoff.md
memory.md
docs/
src/
```

**`.hack/`** (three or more people, or the tidiest possible tree):

```text
README.md
CLAUDE.md          stays at root: Claude Code reads it from here
.hack/
  handoff.md
  memory.md
docs/
src/
```

Both commit everything. If you choose `.hack/`, update `/skillz:workflow`'s CONFIG:

```yaml
continuity:
  memory:   .hack/memory.md
  handoff:  .hack/handoff.md
```

## If you genuinely want handoff local

There is one legitimate case: a solo developer, one machine, who wants scratch notes that
nobody else sees. Then ignore that one file, by name, and nothing else:

```gitignore
handoff.md
```

Never the pattern. A pattern catches files you have not created yet, including the ones a
later skill tells you to commit.

## What never gets committed

```gitignore
.env
.env.local
.env*.local
node_modules/
.next/
out/
dist/
*.log
.DS_Store
```

`assets/gitignore` is the full drop-in. If a scaffold already generated a `.gitignore`,
**append** to it rather than replacing it; generated ignore files often carry
framework-specific entries you will not remember to add back.

## Secrets

```bash
git ls-files | grep -E "^\.env(\.local)?$" && echo "TRACKED: remove and rotate"
git log --all -p | grep -icE "sk-[a-zA-Z0-9]{20}|PRIVATE_KEY=[^[:space:]]"
```

If a key was ever committed, **rotate it**. Deleting it in a later commit leaves it in
history, and scanners find committed keys within minutes of a push. Rewriting history
does not fix it either, because it has already been fetched.

Commit `.env.example` with every key present and every value empty, and a comment on each
saying where to get one.

## Pre-existing code

If the project existed before the event, check the rules before the first commit. Many
hackathons allow boilerplate and prohibit prior product code, and commits dated before
the window are the first thing an organizer checks.

```bash
git log --reverse --format='%ad %s' --date=short | head -5
```

If prior work is allowed, say so in the README. If it is not, the right answer is a fresh
repo with only what was built during the event, decided in hour one rather than
discovered at judging.
