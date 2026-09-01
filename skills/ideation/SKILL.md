---
name: ideation
description: Find the hackathon idea worth building — pressure-test a vague concept, or generate from a theme, a sponsor stack or a blank slate, then commit to one with a clear aha moment and a demo that fits in three minutes. Use when a hack is starting and there is no idea, when an idea needs a reality check before anyone writes code, when choosing between candidate ideas, when a sponsor track or theme has to be worked into a project, or when the current idea is not landing and it is time to pivot. Read CONFIG.md first.
---

# Hackathon ideation

The idea is chosen in the first hour and sets the ceiling on everything after it. No
amount of execution rescues a project a judge cannot retell. Most teams that lose did
not lose at 3am — they lost at minute 40, cheerfully, while agreeing on something
reasonable.

**Read `CONFIG.md` before anything else.** The hackathon, the sponsors, the rubric and
the clock all live there. If it is unfilled, research what you can, infer the rest,
state your assumptions in one line, and keep moving — never block ideation on a
missing config.

**Per-event config lives in the project, not here.** If the hackathon repo has a `hackathon.yml` at its root, read that first; the values below are defaults. At the start of an event, copy this skill's `CONFIG.md` into a `hackathon.yml` at the project root and edit that copy, so a plugin update never overwrites your settings.

## The rule that governs everything

> Pick the idea whose demo a judge can retell to another judge.

Judging is not a careful read. It is a tired person seeing their thirtieth project,
then arguing for a few of them in a room you are not in. Your idea has to survive
being described in one sentence by someone who is not you. Everything below serves
that.

## Time budget

Ideation is capped at **60 minutes**. Longer is not more rigorous, it is just later.

| # | Phase | Wall clock | Done when |
|---|---|---|---|
| 1 | Read the hackathon | 15 min | Sponsors, rubric, tracks and prizes are written down |
| 2 | Opportunity areas | 5 min | 5-8 areas, drawn from *this* hack, not a stock list |
| 3 | Raw ideas | 15 min | ~12 one-liners. Breadth, not polish |
| 4 | The three gates | 10 min | Everything failing two gates is dead |
| 5 | Score the survivors | 5 min | 3-5 ideas ranked, hard gates applied |
| 6 | Stress test the top 3 | 5 min | Risks, judge question, simplification each |
| 7 | Commit + write the brief | 5 min | `assets/idea-brief.md` filled, team agreed |

At minute 61 you commit to the leader, even if it is not perfect. An idea decided at
minute 60 and built for twenty hours beats a better idea decided at minute 240.

## Two entry paths

**Path A — the user already has an idea.** The common case. Do *not* open with twelve
alternatives; that reads as ignoring them, and it burns the clock. Run their idea
through the three gates (step 4) and the one-sentence test — 15 minutes, total.
Report honestly which gates it passes. Only if it fails two or more do you go wide,
and say why before you do.

**Path B — blank slate, a theme, or a sponsor stack.** Run the full workflow.

Either way, do not blindly ratify the first idea. Challenge the weak assumption; the
point of this skill is the pressure, not the enthusiasm.

## Step 1 — Read the hackathon

Extract and write down, before generating anything:

```text
Name / theme / tracks
Judging criteria and their weights
Sponsors, their technologies, their prize amounts
APIs and SDKs actually available to you
Submission requirements (repo? video? deployed URL? length?)
Time on the clock, and restrictions (pre-built code? team size? in person?)
Last year's winners, if findable
```

**If `/skillz:recon` has run, this step is already done.** Take its brief: the
confirmed facts, the technology cards, the saturated list and the spike results. Recon
fills this skill's CONFIG directly, and its parking list becomes raw ideas in step 3.
Skip to step 2 and save fifteen minutes.

If it has not run and the sponsor stack is unfamiliar, run it first. Ideas formed from a
feature list rather than from understanding are how cosmetic integrations happen, and
gate 2 kills them anyway.

Otherwise, research this rather than assuming it — sponsor stacks and rubrics change
every event, and last year's guidance is often wrong. Prefer the official hackathon page
and the sponsors' own docs.

Two things move the odds more than anything else you learn here: **the rubric weights**
(build toward what is actually scored) and **the sponsor prize table** (sponsor prizes
routinely draw a fraction of the entrants the grand prize does).
`references/sponsor-strategy.md` has the prize math and the integration ladder.

## Step 2 — Opportunity areas

Five to eight areas, derived from this hackathon's theme and its sponsors' actual
capabilities — not a canned list. One line each on what the technology newly makes
possible there. Cheap step; it stops all twelve ideas landing in the same corner.

## Step 3 — Raw ideas

About twelve, mostly one-liners. Breadth beats polish — nothing gets written up
properly until it survives step 4.

```text
Name — for [user], [does what], using [tech] to [enable what was hard]
```

Deliberately include two or three that feel too ambitious and two that feel too small.
The winner is usually adjacent to one of those, not in the safe middle.

The highest-yield move here is **the unusual pair**: two available technologies nobody
has combined, where the combination is obviously right once stated. Judges reward the
combination far more than either half.

## Step 4 — The three gates

Every idea faces three questions. **Fail two and it is dead**, no discussion.

### Gate 1 — Why now?

Why is this worth building *this year*? A strong answer names a newly available
technology, a newly cheap capability, a new primitive, a new behaviour, or a new
regulatory reality. If the idea would have made equal sense five years ago, it
probably is not using anything the hackathon gave you.

### Gate 2 — Why this technology?

> Remove the hackathon's primary technology. Does the project still work?

| Verdict | Meaning | Keep? |
|---|---|---|
| **Essential** | Remove the tech and the project cannot exist | Yes |
| **Valuable** | It works without it, but is meaningfully worse | Yes |
| **Cosmetic** | The tech is there to satisfy the track | No |

Cosmetic integrations lose sponsor prizes *specifically*, because the sponsor's own
engineer is usually the judge and can tell from one question. Ideas built **for** the
technology beat ideas that had it added.

### Gate 3 — The aha moment

Name the single moment a judge understands why this matters. It must be something that
**happens on screen**, and it must land inside the first 45 seconds of the demo.

```text
"Give the agent the task, and watch it find and use the tools it needs."
"The money arrives, globally, before I finish this sentence."
"It proves the claim without ever seeing the data."
"The contract reacts to the real-world event, live, right now."
```

"Users can manage their X" is not an aha moment. If you cannot name one, the idea is
not weak — it is *unfinished*. Redesign it around a moment, or drop it.

Design the demo now, not later — it is the specification, and every feature outside it
is optional by definition. The four questions, the three-minute arc, and how to make
invisible backend work scoreable: `references/demo-narrative.md`.

## Step 5 — Score the survivors

Only the 3-5 gate survivors get scored. Mirror `rubric` from CONFIG when it is filled
— scoring against the real rubric is the entire point. Default weights:

| Axis | Weight | Reading |
|---|---|---|
| Demo / aha | 20% | Does the wow land on screen, fast, without narration? |
| Technical depth | 20% | Is there something here that was hard to build? |
| Novelty | 15% | Has a judge already seen this today? |
| Tech integration | 15% | Essential / Valuable / Cosmetic, from gate 2 |
| Problem importance | 15% | Does anyone actually have this problem? |
| Feasibility | 15% | Can *this* team ship it on *this* clock? |

Feasibility is never in a judging rubric and always belongs in yours — an unfinished
project scores zero on every axis at once.

**Hard gates, applied after the arithmetic:**

- Feasibility ≤ 4 → dead, whatever the total says. You cannot demo what does not exist.
- Demo/aha ≤ 4 → dead. A judge who does not feel it does not score it.
- Integration is Cosmetic and the hack is sponsor-driven → dead.

**The number ranks; it does not decide.** A 7.4 whose demo you can picture beats an
8.1 you cannot. Use the score to argue, then use judgment. Full method, adapting to
odd rubrics, and a worked example: `references/scoring.md`.

## Step 6 — Stress test the top 3

Five lines each, no more:

```text
Technical risk    — the one thing that, if it does not work, kills the project
Product risk      — the reason it might just not be useful
Demo risk         — what breaks on stage, on someone else's wifi
Judge question    — the hardest question they will ask, and your answer
Simplification    — what you can cut and still keep the aha moment
```

The judge question is the one teams skip and the one that decides tie-breaks. Write
the actual answer, not a note to write one later.

## Step 7 — Commit

Fill `assets/idea-brief.md`. It is the north star for every later skill, and writing it
is what surfaces the ambiguity the team was silently disagreeing about.

Then the **one-sentence test**:

> We built **X** for **Y**, letting them **Z**, using **T** to make **something
> previously hard or impossible** possible.

If that sentence needs a subordinate clause to make sense, the idea is too
complicated. Simplify it or take the runner-up. This sentence becomes your README's
first line, your demo's first line, and the sentence a judge repeats in the room you
are not in.

## Shapes that win

| Shape | The aha |
|---|---|
| **The autonomous loop** | Give it a goal, watch it work, unscripted |
| **The impossible-before** | Something that could not have been built last year |
| **The compression** | Two hours of work becomes one click, shown side by side |
| **The live wire** | A real-world event moves something on screen, right now |
| **The inversion** | The machine does the part a human always had to do |
| **The visible internal** | Make the invisible legible — the reasoning, the graph, the trace |
| **The unusual pair** | Two technologies nobody combined, obviously right in hindsight |

## Shapes that lose

| Shape | Why it dies |
|---|---|
| **The dashboard** | Nothing happens. Judges have seen forty |
| **The chatbot wrapper** | A prompt is not technical depth, and everyone shipped one |
| **X, but on-chain / with AI** | Cosmetic by construction |
| **The marketplace** | Needs two sides; your demo has one |
| **The platform** | Too broad to demo. "Platform" means "we did not choose" |
| **The social app** | Needs users to be interesting. You will have one |
| **The aggregator** | Needs data you will not have by Sunday |
| **The invisible win** | The clever part never appears on screen |
| **The form** | The demo climaxes in a successful submit |

Worked examples of each, and how to rescue an idea that has landed in a losing shape:
`references/idea-patterns.md`.

## Feasibility, honestly

Teams do not misjudge whether something is possible. They misjudge how long the
second-to-last 10% takes. Anchor the estimate:

| Has this team built this exact thing before? | Multiply the estimate by |
|---|---|
| Yes, recently | 1.5x |
| Something close | 2x |
| Read the docs, never shipped it | 3x |
| New SDK, docs unread | 4x — and prototype the riskiest call in hour one |
| Nobody knows the language | Do not |

**If the estimate exceeds half of `time.build_hours`, cut scope now.** The other half
goes to integration, deploy, the demo, the README and some sleep. Every team believes
it is the exception. None are.

## Judge psychology

- A judge at a mid-size hack sees dozens of projects in an afternoon, a few minutes
  each. Assume three minutes, half of them looking at the screen and not at you.
- The sponsor's judge is usually an engineer from the team that built the SDK. They
  will know instantly whether you used it or wrapped it.
- Judges reward what they can *retell*. Complexity they cannot summarise reads as
  confusion, not as depth.
- An idea legible in one screenshot outperforms an idea that needs a paragraph.
- Nobody scores your market size. Several people silently score whether the demo ran.

## SALVAGE MODE

When `time.build_hours < 8`, or you are re-ideating mid-hack because the idea is not
landing:

1. Skip steps 2 and 3 entirely. No new ideas.
2. Take what already runs. Ask the only question that matters: **what is the smallest
   change that gives this a demoable aha moment?**
3. Prefer re-framing over rebuilding. The same code, aimed at a sharper problem, with a
   better first 45 seconds, is a different project to a judge.
4. Cut every feature not on the path to that moment. All of them.
5. If nothing is salvageable, take the most boring idea on the list that you can
   certainly finish, and make its demo excellent. Finished and modest beats ambitious
   and dark.

Pivots after the halfway mark almost never finish. Re-framing does.

## Time traps

- **A fourth round of ideas.** More ideas past minute 40 is procrastination in a lab coat.
- **Market sizing.** Nobody is scoring TAM. Cut the slide.
- **Consensus.** Four people cannot agree on an idea. One decides, three commit. Vote
  once, then build.
- **Falling for the ambitious idea because it is fun to discuss.** The discussion is not
  the project.
- **Designing the architecture during ideation.** Wrong skill, wrong hour.
- **Forcing in every sponsor.** Two integrations done properly beat five name-drops, and
  judges read the fifth as desperation. See `references/sponsor-strategy.md`.
- **Naming the project.** Fifteen minutes, gone. Take the third name anyone says and move.

## Handoff

With the brief filled: `/skillz:frontend` for the judge-facing UI — hand it
`demo.hero_screen` and the aha moment, since those decide the one screen it builds.
Then `/skillz:readme` for the judge-facing writeup, and `/skillz:version-control`
for a history that survives a four-person merge at 3am.
