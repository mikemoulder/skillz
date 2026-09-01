---
name: hackathon-judge
description: Adversarial review of a hackathon project before the real judges see it. Audits the submission against official requirements, verifies every claim against the code, runs four judging lenses in hostile mode, and returns a ranked fix list that fits the hours actually remaining. Use when a project needs a reality check, when checking requirement or track eligibility, when asking why a project might lose, when deciding what to fix with limited time left, or when preparing for judge questions. Read CONFIG.md first.
---

# Hackathon judge

The purpose is not validation. It is to find every credible reason this project loses,
while there is still time to do something about it.

Two failure modes bound this skill. A review that flatters is useless. A review that
returns forty findings at hour 34 is worse than useless, because it converts the last
hours into panic and the team fixes nothing. **The deliverable is a short ranked fix
list that fits the hours remaining**, not a report.

**Read `CONFIG.md` before anything else.** The official rubric, the tracks entered,
the hours left and the review depth live there. If the rubric is unfilled, research the
official criteria before scoring; judging against a generic rubric when a real one
exists is the most common way this review misleads.

## The rule that governs everything

> Score only what a stranger can verify without you in the room.

This does three things at once. It puts evidence above claims, it models the actual
judging condition (nobody is there to explain), and it defends against the bias that
makes self review worthless: **you have context the judge does not have.**

## The bias reset

This skill is usually run by the team on its own project, often by an agent that helped
build it. That agent remembers intentions, near misses and things that worked an hour
ago. A judge remembers none of that.

Before scoring, discard the conversation. **Judge from the artifacts only:** the repo as
pushed, the deployed URL as it loads right now, the README as written, the submission
form as filled. If a fact is not in one of those, it does not exist. When you catch
yourself scoring something because you know it works, that is precisely the finding: a
judge will not know.

## When to run this

Timing matters more than depth. A perfect review delivered too late is a liability.

| Point in the build | Depth | Purpose |
|---|---|---|
| **50 to 60 percent through** | FULL | The run that matters. Findings you can still act on |
| T minus 6 hours | TRIAGE | Requirement failures and demo risks only |
| T minus 3 hours | TRIAGE | Cheap points, dead links, console errors |
| T minus 1 hour | **Do not run** | Nothing is actionable. It only creates panic |

If you are being asked to review at T minus 1, say so and run the cheap points list
from `references/fix-triage.md` instead. That is the honest and more useful answer.

## Two depths

**TRIAGE, 15 minutes.** Requirements matrix, evidence sweep, top five fixes. Nothing
else. Correct any time under 8 hours remain.

**FULL, 45 minutes.** Everything below. Correct once, at the midpoint.

| # | Phase | Wall clock | Output |
|---|---|---|---|
| 1 | Requirements audit | 10 min | Every requirement PASS / PARTIAL / FAIL / UNKNOWN |
| 2 | Evidence sweep | 10 min | Claims verified against code, deploy and chain |
| 3 | Four panels, hostile | 15 min | Scores with evidence, per lens |
| 4 | The losing case | 5 min | Ranked reasons this loses |
| 5 | The winning case | 2 min | The defensible advantage |
| 6 | Fix budget | 3 min | Ranked fixes that fit the hours left |

## Step 1 - Requirements audit

Requirements before quality. An impressive project that misses a mandatory requirement
scores zero in that track, and no amount of technical depth compensates.

Research the official rules rather than assuming them, then build the matrix:

| Requirement | Source | Mandatory | Status | Evidence | Severity |
|---|---|---|---|---|---|
| Use sponsor SDK | Track rules | Yes | PASS | `src/lib/pay.ts:12` | - |
| Deployed and reachable | Rules | Yes | PARTIAL | URL loads, cold start 9s | HIGH |
| Public repo | Rules | Yes | PASS | github.com/... | - |
| Video under 3 min | Rules | Yes | UNKNOWN | not recorded yet | CRITICAL |

Four statuses, and the fourth is the one that matters:

- **PASS** - satisfied, with evidence a stranger can check.
- **PARTIAL** - real but incomplete or ambiguous.
- **FAIL** - not satisfied.
- **UNKNOWN** - insufficient evidence.

**Never promote UNKNOWN to PASS on assumption.** UNKNOWN is a finding: it means a judge
looking for this will not find it either. Most disqualifications are UNKNOWNs that
everyone assumed were PASSes.

Severity for anything not passing: **CRITICAL** (disqualification or track
ineligibility), **HIGH** (material score loss), **MEDIUM** (perception), **LOW**
(polish).

## Step 2 - Evidence sweep

Verify claims against artifacts. Run the sweep, then read what it found:

```bash
bash assets/judge-sweep.sh --url https://your-app.vercel.app --sponsors @circle-fin,@okx
```

It checks what a script can check: the deployed URL responds and how slowly, which
sponsor SDKs are genuinely imported and where, mocks and placeholders left in the
source, secrets in history, whether commits fall inside the event window, and README
claims with no corresponding code signal. It gathers evidence and does not judge; read
what it found. `references/evidence-sweep.md` has the manual checks it cannot do, the
submission-form versus repo diff, and an explicit statement of what a grep can and
cannot prove.

The evidence hierarchy, when two sources disagree:

```text
1. The deployed thing, working, right now
2. Source code that runs
3. On-chain or deployment evidence
4. A recorded demo
5. Documentation
6. README claims
7. Anything a team member says
```

**A claim at level 6 with nothing at levels 1 to 3 is a finding, not a feature.** The
README saying "autonomous agent" while the code awaits a manual click is the single
most common serious finding in hackathon review, and it is exactly what a judge catches
in Q&A.

## Step 3 - Four panels, hostile

The draft-standard eight-judge panel mostly overlaps. Four lenses genuinely differ, and
**hostility is a mode applied to all of them**, not a ninth judge. Each returns a score,
two sentences of evidence, and the one question the team cannot answer.

| Lens | The question it asks | Scores |
|---|---|---|
| **Product** | Would anyone care, and does the demo make me feel it? | Problem, clarity, differentiation |
| **Technical** | Was anything here actually hard? Does the architecture exist as described? | Depth, correctness, security, reliability |
| **Sponsor** | Did they use our technology, or attach it? | Integration depth, correctness, creativity |
| **Demo** | Alongside fifty others, would I remember this? | First 30 seconds, wow, recoverability |

Sponsor integration gets the four-rung classification, because it decides track prizes:

```text
Decorative     present, irrelevant. Remove it or deepen it
Integrated     a real feature depends on it
Core           remove it and the project stops working
Transformative used in a way the sponsor did not anticipate
```

Score Core or above or expect to lose the track. Full lens detail, what each looks for,
and their interrogation questions: `references/judge-panels.md`.

**Disagreement between lenses is the most valuable output here.** Technical 8 with
Product 4 is not a 6; it means a strong build aimed at a problem nobody has, and the fix
is the pitch rather than the code. Never average disagreement away. Name it.

## Step 4 - The losing case

One question, answered as many times as is credible:

> If this project loses, why will it lose?

Work `references/failure-modes.md`, which catalogues how hackathon projects actually
lose, ranked by frequency. Do not stop at the obvious. Classify each finding:

```text
FATAL     disqualification, track ineligibility, or the demo cannot run
SERIOUS   materially reduces placement
MODERATE  noticeable, fixable
MINOR     polish
```

Then the pass teams skip: **read the submission form against the repo.** Contradictions
between what you claimed and what you built are found by judges constantly, and they
cost more than the underlying gap.

```text
Submission says "autonomous"    -> code requires a human click
README says "real time"         -> implementation polls every 5 seconds
Submission says "fully on-chain"-> critical state lives in Postgres
Form claims 3 tracks            -> two have no corresponding integration
```

## Step 5 - The winning case

Immediately after, argue the other side. An artificially negative review gets discounted
by the team and stops changing behaviour, which defeats the point.

> What are the strongest true reasons this wins?

Name the **defensible advantage**: the one thing a competing team could not easily copy
by Sunday. If there is not one, that is the most important finding in the entire review,
and it belongs at the top.

## Step 6 - The fix budget

Findings are not the deliverable. **Ranked fixes that fit the clock** are.

```text
fix_budget_hours = hours_remaining x 0.5
```

The other half belongs to demo rehearsal, the recording, the README and the submission
form, all of which are on the critical path and all of which teams routinely leave until
there is no time for them.

Rank by:

```text
judge impact x requirement severity / hours to fix
```

Then draw a line when the budget is spent, and **state explicitly what is below it.**

```text
FIXING (4.5h of 5h budget)
  P0  Record the demo video                    1.5h  CRITICAL, not started
  P0  Fix cold start on the demo URL           0.5h  judge sees a 9s blank screen
  P1  Sponsor B integration is Decorative      2.0h  track prize is unwinnable as is
  P2  Favicon, page title, og image            0.5h  cheap credibility

NOT FIXING (below the line, decided, do not revisit)
  - Mobile layout            demo runs on a laptop
  - The empty states on /settings   not on the demo path
  - Test coverage            nobody scores it
```

The "not fixing" list is as valuable as the fixing list. It ends the argument that would
otherwise recur at 4am, and it stops findings from occupying attention they cannot earn.

A P0 that costs more than the whole budget is not a P0. It is a decision to cut
something else, and it should be presented that way rather than as a task.
`references/fix-triage.md` has the cheap points list, which is where most of the
available score actually sits at hour 33.

## Scoring

Use the official rubric from CONFIG when it exists. A generic rubric applied to an event
with published criteria is a wrong answer that looks like a right one. Fallback weights:

| Category | Weight |
|---|---:|
| Technical execution | 20% |
| Sponsor technology usage | 20% |
| Innovation | 20% |
| Product and impact | 15% |
| Demo | 10% |
| UX and design | 10% |
| Completeness | 5% |

Calibrate against a real field, not against ambition:

| Score | Means |
|---|---|
| 5 to 6 | **Where most hackathon projects land.** Works, unremarkable |
| 7 | Strong. Places at a small event |
| 8 | Very strong. Wins tracks |
| 9 | Exceptional. Wins events. Rare |
| 10 | Essentially unused. Do not award it |

If your scores average above 8, the review is not working. Recalibrate against the
honest median rather than against how much effort the team spent, which is invisible to
judges and irrelevant to scoring.

Every score carries **evidence and a confidence level**. "Technical 8, high confidence,
the agent loop and settlement path are real and I traced both" is a judgment. "Technical
9, impressive" is a compliment.

## What this review cannot see

State the boundary explicitly rather than implying coverage you do not have. A static
review cannot assess:

- **Whether the demo actually runs on the day**, on venue wifi, on a projector.
- **Latency and feel.** A 4 second interaction reads fine in code and badly on stage.
- **The video**, unless it exists and you watched it.
- **Live Q&A**, which is where technical depth is really tested.
- **The field.** Whether three other teams built this is unknowable from here.

Each of those needs a human to check, and each has cost teams a placement. Say which
ones remain unchecked in the verdict rather than letting a high score imply they passed.

## Output

Compact. Fill `assets/scorecard.md`. The whole thing should fit on one screen:

```text
PANEL              score  confidence
Product              6.5  high
Technical            8.0  high
Sponsor              4.0  high      <- Decorative on Sponsor B
Demo                 5.5  medium    <- no video recorded
                    ----
Consensus            6.2            Competitive, not winning

REQUIREMENTS   2 PASS   1 PARTIAL   0 FAIL   1 UNKNOWN(video)
READINESS      FUNCTIONALLY READY
DISAGREEMENT   Technical 8 vs Product 6.5: strong build, unclear who needs it

TOP 5 FIXES    listed with hours, against a 5h budget
```

Readiness is a separate judgment from score: **NOT READY** (a requirement fails or the
core does not work), **FUNCTIONALLY READY** (works, real weaknesses), **JUDGE READY**
(requirements met, competitive), **WINNING READY** (survived the hostile pass with no
serious finding). Never label a project WINNING READY on score alone.

## Time traps

- **Reviewing instead of building.** This is a 45 minute skill, once, plus short triage
  passes. A second full review before the first fix list is done is procrastination.
- **Producing findings nobody can action.** Forty findings at hour 34 is noise. Five
  ranked fixes with hour estimates is a plan.
- **Scoring the intention.** The team's effort is invisible to judges. Score the artifact.
- **Fixing what is cheap rather than what is heavy.** The cheap points list exists, but
  it comes after the CRITICAL requirement gaps, always.
- **Rebuilding at hour 30 because a lens scored low.** If Product scores 4 that late,
  the fix is the framing and the demo, not the architecture. See ideation SALVAGE MODE.
- **Treating an average as a verdict.** The disagreement between lenses carries the
  actual information.

## Handoff

Route each finding to the skill that owns it, rather than fixing everything here:

| Finding | Goes to |
|---|---|
| Demo fragile, no fallback, dead air | `hackathon-frontend` demo-proofing |
| README overclaims, sponsor section thin, dead links | `hackathon-readme` |
| Architecture does not match the diagram, no seams | `hackathon-architecture` |
| The idea itself is the problem, late in the build | `hackathon-ideation` SALVAGE MODE |
| Commit history, final merge, attribution | `hackathon-version-control` |
