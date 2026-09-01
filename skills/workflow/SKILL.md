---
name: workflow
description: Run a multi-day hackathon build without losing the thread. Covers the session start and end protocol, the two continuity files that let anyone resume mid-task, what to work on next when everything looks urgent, and scope control that protects a finishable project. Use at the start of a work session, when resuming after a break or an interruption, when writing a handoff, when deciding what to do next, or when the project has drifted and nobody is sure what is done. Read CONFIG.md first.
---

# Hackathon workflow

A hackathon is thirty-six hours long, involves several people and often several agent
sessions, and every one of them will be interrupted. Someone sleeps, a laptop dies, a
session ends mid-task, a teammate picks up a file they did not write. The work that
survives all of that is the work that left a trail.

This skill is about the trail. It does two things: it defines the ritual at the start
and end of a work session, and it decides what to do next when everything looks urgent.

**Read `CONFIG.md` before anything else** for the continuity file locations and the
verification commands.

**Per-event config lives in the project, not here.** If the hackathon repo has a `hackathon.yml` at its root, read that first; the values below are defaults. At the start of an event, copy this skill's `CONFIG.md` into a `hackathon.yml` at the project root and edit that copy, so a plugin update never overwrites your settings.

## Install the ambient half first

Half of what governs good work cannot live in a skill, because a skill is loaded when
something invokes it and working stance has to apply continuously. That half goes in the
project's `CLAUDE.md`, which is read at the start of every session:

```bash
cp <skill>/assets/CLAUDE.md ./CLAUDE.md      # then fill in the project specifics
```

Do this in hour one. It carries the working stance, the communication format and the
verification rule into every session automatically, including sessions that never invoke
this skill. Without it, the discipline holds only when someone remembers to ask for it,
which is not a discipline.

## The rule that governs everything

> Write the handoff before you need it, because you will not know which checkpoint was
> the last one.

Teams write handoffs when they plan to stop. The interruptions that actually hurt are
the unplanned ones, and by definition nobody writes a handoff for those. Update the file
at every natural checkpoint instead, which costs about ninety seconds and is the
difference between resuming in two minutes and reconstructing for forty.

## The two files

Both live at the repository root. They serve different questions and must not be merged.

| File | Answers | Changes |
|---|---|---|
| `memory.md` | What should anyone know before working on this project? | Rarely. It is durable |
| `handoff.md` | Where exactly did work stop, and what happens next? | Constantly. It is a snapshot |

`memory.md` is the project. `handoff.md` is the cursor. A file that mixes them becomes a
diary, which is the failure mode both are designed to avoid.

Templates: `assets/memory.md` and `assets/handoff.md`. Depth, precision rules and
multi-session coordination: `references/continuity.md`.

## Session start

Three minutes, every time, including when you think you remember where you were.

```text
1. Read memory.md and handoff.md
2. Verify the handoff against the repository, do not trust it
3. Confirm the build is green before adding to it
4. State in one line what you are about to do, and why it is next
```

Step 2 is the one that matters. A handoff describes the repo as it was, and someone may
have pushed since, or the session may have ended mid-edit leaving files the handoff does
not mention:

```bash
git log --oneline -5                    # has anything landed since the handoff?
git status --porcelain                  # uncommitted work the handoff may not know about
git diff --stat HEAD                    # what is half-finished right now
```

If the repository disagrees with the handoff, **the repository is right.** Update the
handoff to match reality before doing anything else, then continue.

## What to work on next

When several things look urgent, this order is close to always correct at a hackathon:

| # | Work | Why it outranks the next one |
|---|---|---|
| 1 | **The deploy is broken** | Undeployed is unjudged. Nothing else matters until this is fixed |
| 2 | **The demo path does not run** | The demo is the deliverable |
| 3 | **A mandatory requirement is unmet** | Zero in that track regardless of quality |
| 4 | **The aha moment is not real yet** | It is what the score is built on |
| 5 | **The rest of the demo path** | Everything the script touches |
| 6 | **States, errors, fallbacks** | Where the polish score actually lives |
| 7 | **The README and the recording** | On the critical path, always left too late |
| 8 | **Differentiation and depth** | Only after the above are done |
| 9 | **Everything else** | Usually never, and that is fine |

Two rules that override the list: a **blocker on someone else's lane** jumps to the top,
because one person stuck costs more than one person's work. And after the feature freeze
at T minus 2 hours, the only permitted work is bug fixes on the demo path.

`references/prioritization.md` covers scope control, the stuck protocol, and how to tell
necessary depth from perfectionism.

## Scope control

The most common way a strong hackathon project fails is not a bug. It is a team that
kept starting things.

Every new idea gets classified out loud before any code:

```text
MUST     the demo does not work without it
SHOULD   build after every MUST is done and deployed
COULD    build only if ahead, which you will not be
NOT NOW  written down, decided, and not re-argued at 4am
```

The fourth category is the one doing the work. An idea that is merely undiscussed comes
back every few hours; an idea that is written down as NOT NOW stays down.

**A smaller finished project beats a larger unfinished one, in every rubric, every
time.** When the clock and the scope disagree, the scope loses.

## Verification

Cheapest reliable check first, and only escalate when the change warrants it:

```text
typecheck  →  targeted test  →  build  →  the demo path in a browser
```

The last step is the one that counts, and it is the one that cannot be automated. A
green build proves the code compiles; it does not prove the button still works, and the
button is what is judged. After any change touching the demo path, click through it.

Never report a change as done without having verified it. `references/verification.md`
has the ladder per project type and what "verified" has to mean before you write it in a
handoff.

## Session end

Five minutes. Do this before you are tired rather than because you are.

```text
1. Verify what you just built actually works
2. Commit, so the handoff can reference a real SHA
3. Update handoff.md: stopping point, next step, what failed, what not to retry
4. Update memory.md only if something durable changed
5. Tell the user what happened in four lines
```

Step 3 has one quality bar, and it is testable: **could someone who was not here start
work in under two minutes?** If the next step is "continue the backend", the answer is
no. If it is "in `src/hooks/useSession.ts`, the session state is not updated after a
successful refresh; add that, then run `npm test auth`", the answer is yes.

## Stopping when stuck

Persistence becomes waste at a predictable point. After two failed attempts on the same
problem, stop attacking it and change something about the approach:

```text
1. Re-read the actual error. Not the summary of it, the error
2. Re-read the code you are changing, top to bottom
3. Check whether the repo already solves this somewhere else
4. Try the simpler version that definitely works
5. Ask whether this is architectural, in which case the fix is elsewhere
6. Record it in handoff.md under Do Not Repeat, and move to other work
```

Step 6 is the one teams skip, and it is why the same dead end gets attempted three times
by three people over one night. Writing down what did not work is worth more than the
attempt that produced it.

## Time traps

- **Reconstructing project state that is already written down.** Read the two files first.
- **Narrating every file read.** Group the work, report the outcome.
- **Rewriting working code because it is unfamiliar.** Understand it or leave it.
- **Refactoring after hour 20.** Ugly and running beats clean and broken.
- **Building the interesting idea instead of the next one.** Classify it and continue.
- **Skipping the handoff because the session is ending soon anyway.** That is exactly
  when it is needed.
- **Writing a handoff nobody can act on.** "Continue the frontend" costs the ninety
  seconds it took to write and saves nothing.

## Handoff to other skills

This skill runs alongside the others rather than before or after them. When the current
work is a specific phase, the phase skill owns it:

`/skillz:ideation` for the idea, `/skillz:architecture` for the design and build
order, `/skillz:frontend` for the UI, `/skillz:readme` for the writeup,
`/skillz:judge` at the midpoint and again at T minus 6, `/skillz:polish` before the
freeze.
