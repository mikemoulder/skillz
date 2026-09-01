# Scoring

Scoring exists to make a group of tired people argue about the right things. It does
not exist to produce a number. Treat the number as a way to surface disagreement — if
two people score the same idea 4 and 9 on feasibility, that gap is the most useful
thing you will learn in the whole session.

## Scope

Score the **3-5 ideas that survived the three gates**. Never score the raw twelve.
Scoring twelve ideas on six axes is 72 judgments to eliminate ideas that a single
question already killed, and it is the most common way ideation runs past an hour.

## The axes

| Axis | Weight | 1-3 | 5-6 | 8-10 |
|---|---|---|---|---|
| **Demo / aha** | 20% | Must be explained to be understood | A judge gets it with narration | Lands in 45s, silently |
| **Technical depth** | 20% | Glue code and a template | One genuinely hard component | A judge asks *how* you did it |
| **Novelty** | 15% | Three teams here have it | A familiar idea, sharp angle | Nobody in the room has seen it |
| **Tech integration** | 15% | Cosmetic | Valuable | Essential, and in the aha moment |
| **Problem importance** | 15% | Invented for the hackathon | Real but niche | Someone in the room has it today |
| **Feasibility** | 15% | Needs a week | Tight but plausible | Core loop by the halfway mark |

Weighted total, one decimal. Anything ranking above 7.5 with no hard-gate failure is
worth building.

## Mirror the real rubric

If `rubric` in CONFIG is filled with the event's actual criteria, **use those weights
instead of these**, mapping each of your axes onto the official ones. A hack that
weights "social impact" at 40% is telling you exactly what to build, and scoring it
against a generic rubric throws that away.

Two adjustments to make when you do:

- **Keep feasibility at 10-15% even though no rubric contains it.** Judges do not score
  it; reality does, and an unfinished project scores zero on every official axis at
  once.
- **Do not let an unweighted axis vanish.** If "presentation" is 20% of the official
  rubric, that is a signal about where your last four hours go, even though it is not
  a property of the idea.

## Hard gates

Applied *after* the arithmetic. These override the total.

```text
Feasibility ≤ 4                          → dead. You cannot demo what does not exist
Demo/aha ≤ 4                             → dead. A judge who does not feel it does not score it
Integration = Cosmetic, sponsor-driven   → dead. The sponsor's engineer is judging
Novelty < strategy.novelty_floor         → dead. See CONFIG
Nobody on the team wants to build it     → dead. It is 3am in fourteen hours
```

That last gate is not sentimental. Motivation is a real input to how much gets
finished overnight, and the idea the team is excited about routinely outperforms the
idea that scored 0.4 higher.

## Worked example

Ideation for an AI-agents hackathon, three survivors, `strategy.risk: balanced`:

| Idea | Demo | Tech | Novelty | Integ | Problem | Feas | Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| A — Agent that files your expenses | 6 | 5 | 3 | 6 | 8 | 9 | **6.1** |
| B — Agents negotiating cloud spend live | 9 | 8 | 8 | 9 | 7 | 5 | **7.8** |
| C — Verifiable audit trail for agent actions | 5 | 9 | 7 | 8 | 6 | 6 | **6.9** |

**A** is the safe idea and it is not close — novelty 3 means several teams have it, and
high feasibility cannot rescue it. This is the classic trap: the idea everyone agrees
on quickly, because it is obvious, because it is not novel.

**C** is the strongest engineering and the weakest demo — the work is invisible. Rescue
it with the visible internal (render the audit trail as it is written, live) and the
demo score moves to 7, taking the total past B. Note what that means: the *idea* did
not change, the *demo* did. This is the highest-return kind of fix available during
ideation and the reason demo/aha is weighted highest.

**B** wins as scored, but feasibility 5 is one point off a hard gate. Before committing,
simplify: two agents instead of a market of ten, one negotiation round, real API data
but a scripted counterparty. If that lifts feasibility to 7 without dropping the demo
below 8, build it. If the simplification kills the aha moment, build C-with-a-panel
instead.

That paragraph is the actual work. The table only made it possible to have it.

## Anti-precision

Do not compute to two decimals, do not average five people's scores, and do not
re-score after arguing. The resolution of this instrument is roughly ±1 point per
axis, which means gaps under about 0.5 total are noise.

When two ideas land within noise of each other, do not break the tie with more
scoring. Break it with:

1. Which demo can you picture, frame by frame, right now?
2. Which one does the team want to be building at 3am?
3. Which one survives losing its riskiest component?

Then commit and stop. The cost of picking the second-best idea is small. The cost of
spending another forty minutes deciding is not.
