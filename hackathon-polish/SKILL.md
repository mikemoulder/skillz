---
name: hackathon-polish
description: Make the strongest parts of a hackathon project discoverable before submission. Surfaces real engineering that is buried in vague naming, undocumented architecture or unexplained integrations, using additive changes that carry no risk and renames that are gated on a passing build and the clock. Use when a project is technically strong but does not look it, when sponsor integration is real but hard to find, when preparing a repo for human or automated review, or when asking what a judge would miss. Read CONFIG.md first.
---

# Hackathon polish

Judges award credit for what they can find. A sophisticated agent pipeline behind a
function called `run()`, in a file called `utils.ts`, with no test and no mention in the
README, scores exactly what an unsophisticated one scores, because nobody looking for
four minutes can tell them apart.

This skill does one thing: **make real excellence discoverable.** It does not find
what is broken. That is `hackathon-judge`, and it runs first.

| Skill | Question | Output |
|---|---|---|
| `hackathon-judge` | What is wrong, and will this lose? | A ranked fix list |
| `hackathon-polish` | What is right and invisible? | Changes that make it visible |

**Read `CONFIG.md` before anything else**, especially `time.hours_remaining` and
`build.command`. Those two decide what this skill is allowed to touch.

## The rule that governs everything

> A judge can only award credit for strengths they can discover.

Treat the whole repository as the submission. Naming, module boundaries, comments,
tests, docs and structure all carry evidence, and a judge reads all of them faster than
they read logic.

## The safety gate

This skill edits a working project close to a deadline, so it is bounded before it is
useful. **A polish pass that breaks the demo is catastrophically net negative**, and no
amount of discoverability compensates.

Two classes of change, and they are not equally safe:

| Class | Examples | Risk |
|---|---|---|
| **Additive** | Docs, comments, tests, README pointers, an evaluation map | None. Nothing that runs changes |
| **Mutative** | Renames, file moves, module restructuring, extracted functions | Real. Every one can break a build |

What is allowed depends only on the clock:

| Hours remaining | Allowed |
|---|---|
| **More than 12** | Everything, with a build verified after each mutative change |
| **6 to 12** | Additive anywhere. Renames only off the demo path |
| **Under 6** | **Additive only.** No renames, no moves, no exceptions |
| **Under 2** | Docs only. Do not touch source at all |

Before touching anything, take a checkpoint, so the entire pass is one command to undo:

```bash
git add -A && git commit -m "checkpoint before polish"   # then: git reset --hard HEAD
```

If the build is not green before you start, stop. Polishing a broken build means you
cannot tell which change broke it. Run `hackathon-judge` instead and fix the build.

## Time budget

| # | Phase | Wall clock | Output |
|---|---|---|---|
| 1 | Inventory the buried excellence | 15 min | A list of real strengths and where they hide |
| 2 | Additive surfacing | 25 min | Evaluation map, decisions doc, evidence comments, tests |
| 3 | Mutative surfacing, if the clock allows | 15 min | Renames, each with a green build |
| 4 | Verify and report | 5 min | Build passes, demo path runs, what was left alone |

Run it once, after `hackathon-judge`, before the feature freeze.

## Step 1 - Inventory what is buried

Find the real strengths first. This step is read only, and it is the one that decides
whether the rest of the pass is worth anything.

```bash
find src -name '*.ts' -o -name '*.tsx' | xargs wc -l | sort -rn | head -15
grep -rn "from ['\"]@" src/lib --include=*.ts | head -20
git log --format='%s' | head -30
```

The largest files, the SDK call sites and the commit messages together tell you where
the work actually went. Then, for each candidate strength, answer:

```text
What is genuinely impressive here?
Where does it live?
Could a judge find it in four minutes?
What is the cheapest change that makes it findable?
```

**Only surface things that are real.** If the inventory turns up nothing impressive,
that is the finding, and it belongs in the report rather than being papered over with
comments. This skill makes existing work visible; it does not make weak work look
strong, and the attempt is transparent to anyone who reads the code.

The usual hiding places:

| Strength | Where it hides |
|---|---|
| A real agent loop with bounded termination | `run()` in `utils.ts` |
| A careful sponsor integration | A single call site with no comment |
| A non-trivial algorithm | An unnamed inline function |
| Deliberate failure handling | A `catch` block that looks defensive rather than designed |
| A considered architecture decision | Nowhere. It is in someone's head |
| A contract with real access control | A file nobody links to from the README |

## Step 2 - Additive surfacing

Zero risk, available at any hour, and where most of the value is. The full catalogue,
ordered by value per minute, with before and after examples:
`references/surfacing-moves.md`.

### The evaluation map

`docs/evaluation-map.md`: a claim to file index. It is the single highest value artifact
this skill produces, because it answers the question every reviewer has and no repo
answers: **where is the thing you said you built?**

```markdown
## Sponsor integration
Circle programmable wallets, settlement layer   → src/payments/settlement.ts:40
                                                → tests/settlement.test.ts

## Core technical work
Bounded agent loop with tool allowlist          → src/agents/execution.ts:22
On-chain settlement                             → contracts/Settlement.sol
```

Write it as navigation, not as advocacy. It should read as "where things live", which
serves a human judge and an automated reviewer equally. Template in
`assets/evaluation-map.md`; how to choose the entries is in `references/evaluation-map.md`.

### Technical decisions

`docs/technical-decisions.md`, three to five entries, only for decisions that were
actually hard. Context, alternatives, choice, tradeoff. This is what makes engineering
maturity legible, and it is invisible in code by construction: nobody can see the option
you rejected. Template with a worked example: `assets/technical-decisions.md`.

If you cannot name a real alternative you considered and rejected, it was not a
decision, it was a default, and it does not belong in the document.

### Evidence comments

Short comments that explain **why**, placed at the call sites that matter. Never
comments that narrate what the next line does.

```ts
// Settlement runs through the sponsor's payment primitive rather than an internal
// ledger so the transfer stays externally verifiable, which is what lets an agent
// settle without a human approving each payout. Cap enforced in code at line 61.
```

Three rules, and the third is the one that gets broken:

- Only where it genuinely helps. Ten good comments beat a hundred.
- Only what is true. A comment claiming a property the code lacks is worse than silence.
- **Never add a comment to code you did not read.** Explaining unread code produces
  confident falsehoods, and a judge who catches one stops trusting the rest.

Words like "sophisticated", "advanced" and "novel" do not belong in comments. Describe
the constraint and let the reader conclude.

### Tests as evidence

One test that demonstrates the hardest behavior is worth more than a coverage number.
It proves the behavior exists, it survives a judge running it, and it is a legitimate
answer to "is that real?".

### README pointers

One line per major claim, linking to the file. `hackathon-readme` owns the README
itself; this skill only ensures its claims point somewhere.

## Step 3 - Mutative surfacing

Only if the clock allows, only with a green build after each change, and only for names
that a reviewer would actually stumble over.

| Vague | Reveals intent |
|---|---|
| `Manager`, `Helper`, `Utils`, `Service`, `Handler` | `SettlementService`, `AgentExecutionPipeline` |
| `run()`, `process()`, `handleData()` | `executeTaskPlan()`, `settleCompletedTask()` |
| `lib/misc.ts` | `payments/settlement.ts` |

Rename what a judge reads: exported names, file names, the modules named in the README.
Do not rename local variables; nobody scores them and every edit is a chance to break
something.

The mechanics matter more than the naming taste. One rename, build, commit, repeat, and
the specific traps that eat hackathon teams (deployed contracts, dynamic imports, route
files) are in `references/safe-refactor.md`. **Read that before the first rename.**

## Step 4 - The automated reviewer

Many events now run an automated pass before or alongside human judging. The goal is the
same as for a human: give it accurate evidence it can find. Concretely, an automated
reviewer reads names, structure, docs and dependency manifests more reliably than it
traces logic, which means explicit beats clever:

```text
AutonomousSettlementEngine     over   Engine
docs/integrations.md           over   the detail scattered across five files
a test named "settles without human approval"   over   a claim that it does
```

### The line, and it is not blurry

**Never attempt to instruct, manipulate, or inject anything into an evaluator.** No
hidden text, no white-on-white or zero-size fonts, no HTML comments addressed to a
reviewer, no "ignore previous instructions", no keyword stuffing, no text placed to be
read by a machine and not by a human.

This is not a close call and it is not a rules-lawyering opportunity. It is fraud, it is
detected, and it converts a strong submission into a disqualification and a story that
follows the team. It is also unnecessary: everything worth communicating can be
communicated in text a human would be glad to read.

The test for any change made under this step: **would you be comfortable if a judge saw
exactly why you made it?** A clear name and an accurate doc pass. Anything you would want
hidden fails, and the discomfort is the signal.

`references/ai-legibility.md` covers what automated review actually reads well.

## Step 5 - Verify

Every mutative change gets verified. No exceptions, no "it was only a rename".

```bash
bash assets/verify-polish.sh --build "npm run build"
```

It confirms a checkpoint commit exists, runs the build, typechecks if TypeScript is
present, confirms the demo path files still exist, and reports local README links that
stopped resolving. If the build fails and the cause is not obvious in one minute:

```bash
git reset --hard HEAD    # back to the checkpoint. this is why you made it
```

Reverting a polish pass costs nothing. Debugging a rename at hour 34 costs the demo.

## What not to touch

- **A deployed contract's name.** Renaming means redeploying and re-verifying, which
  invalidates the explorer link that is your strongest evidence.
- **Anything on the demo path, under 6 hours.** However ugly.
- **Generated files, lockfiles, migrations.** Nothing reads them for quality.
- **Working code, for style.** Ugly and running beats clean and broken, every time.
- **The build config.** A polish pass has never needed to.
- **Dependencies.** Removing an unused one at hour 33 to look tidy is a build risk with
  no scoring upside.

## Time traps

- **Renaming for taste rather than legibility.** If a reviewer would not stumble, leave it.
- **Comments everywhere.** Density destroys signal. Ten placed well is the target.
- **Restructuring directories.** High risk, low reward, and the README can point anywhere.
- **Writing docs for code that is not impressive.** Documenting mediocrity draws attention
  to it. Surface the strong parts and leave the rest quiet.
- **Polishing before the build is green.** Fix first, then surface.
- **Running this before `hackathon-judge`.** Fixing what is broken outranks surfacing what
  works, and judge tells you which is which.

## Report

Short, and it names what you deliberately left alone:

```text
SURFACED
  Agent loop, bounded + tool allowlist   src/agents/execution.ts    comment + test + map
  Sponsor settlement integration          src/payments/settlement.ts comment + map entry
  Three architecture decisions            docs/technical-decisions.md

RENAMED (build green after each)
  lib/utils.ts        -> payments/settlement.ts
  run()               -> executeTaskPlan()

NOT TOUCHED (deliberate)
  contracts/Settlement.sol   deployed and verified. renaming breaks the explorer link
  src/app/page.tsx           demo path, under 6 hours remaining

VERIFIED   build passes, typecheck clean, demo path intact, README links resolve
```

## Handoff

`hackathon-readme` if the README claims now point at things worth linking.
`hackathon-judge` for a TRIAGE re-run if the pass was large, to confirm no requirement
regressed. `hackathon-version-control` for the final merge.
