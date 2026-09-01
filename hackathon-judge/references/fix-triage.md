# Fix triage

A review that returns findings has done half the job. The half that changes the outcome
is deciding which ones fit the hours remaining, and saying out loud which ones do not.

## The budget

```text
fix_budget = hours_remaining x 0.5
```

The other half is not slack. It is demo rehearsal, the recording, the README, the
submission form and some sleep, all of which are on the critical path and all of which
teams leave until there is no time for them. A fix list that consumes every remaining
hour produces an unrehearsed demo and an unsubmitted project.

Worked: 10 hours left means a 5 hour fix budget. Take fixes in ranked order until 5 hours
are allocated, then draw the line and stop.

## The ranking

```text
judge impact x requirement severity / hours to fix
```

Roughly, in practice:

| Priority | What qualifies |
|---|---|
| **P0** | A requirement is FAIL or UNKNOWN, or the demo cannot run |
| **P1** | A judge will notice this and it costs real score |
| **P2** | Meaningful improvement at reasonable cost |
| **P3** | Polish. Only if the budget survives P0 to P2 |

Two rules that override the arithmetic:

- **A P0 costing more than the whole budget is not a task, it is a decision.** Present it
  as a cut: "the video requirement needs 1.5 hours we do not have unless we drop the
  second integration. Which?" Do not put an impossible task at the top of a list and let
  the team discover it is impossible at hour 34.
- **Estimate honestly, then multiply.** Use the ladder from `hackathon-architecture`: 2x
  if you have done something close, 3x if you have only read the docs. A fix list built
  on optimistic estimates is a fiction that expires at 4am.

## The cheap points list

Where most of the recoverable score sits at hour 33. Everything here is under fifteen
minutes and visible to every judge who looks:

```text
5 min   Page title and favicon. "Create Next App" in the tab is a real cost
5 min   Fix every dead link in the README. Judges click them
5 min   Delete every console.log and fix every console error on load
5 min   Add the og image so a pasted URL renders in Slack and on the form
5 min   Repo description and topics on GitHub. An empty About box reads as abandoned
10 min  Replace "Test User 1" and lorem ipsum with plausible seed data
10 min  Screenshot the current UI and put it at the top of the README
10 min  The one line description, at the top, matching the submission form
15 min  Empty and loading states on the one screen in the demo
15 min  Delete every route not in the demo. A judge will click the half-built one
20 min  Record the demo, even roughly. This is the highest value item on the list
```

That last line is not polish and it is on this list because it is cheap, not because it is
minor. **A recording converts a demo failure from fatal to a five second detour.** If the
budget allows exactly one item, it is this one.

None of these appear on any rubric. All of them move the prior a judge brings to
everything else, and at hour 33 they are frequently the only fixes that will actually
land.

## The line

State what is below it, explicitly, as a decision rather than an omission:

```text
FIXING (4.5h of a 5h budget)
  P0  Record the demo video                  1.5h   requirement is UNKNOWN
  P0  Cold start: 9s blank screen on load    0.5h   first impression is a spinner
  P1  Sponsor B is Decorative                2.0h   this track is unwinnable as is
  P3  Favicon, title, og image               0.5h   cheap credibility

NOT FIXING (decided, do not revisit)
  Mobile layout               demo runs on a laptop
  /settings empty states      not on the demo path
  Test coverage               nobody scores it
  Refactor the agent loop     works, ugly, invisible to judges
```

The second list does as much work as the first. Without it, every item recurs as an
argument at 4am, and each argument costs more than the fix would have. Writing it down
converts an open question into a closed one.

## When the finding is not fixable

Some findings arrive too late to fix. Say so directly rather than listing them as tasks:

| Finding at hour 30 | Not the answer | The answer |
|---|---|---|
| Product lens scored 4 | Rebuild for a different user | Reframe the pitch and the demo opening |
| Sponsor integration is Decorative | Add a second integration | Deepen the one you have, or drop that track |
| The idea is unoriginal | Change the idea | Sharpen the one differentiator and lead with it |
| Architecture is wrong | Re-architect | Ship it. Ugly and working outscores clean and unfinished |
| No hard technical component | Build one | Make the hard part you did build visible on screen |

That last row is the highest leverage move available late in a hackathon. Backend work is
invisible, and invisible work is unscored. A panel that renders the agent's steps, the
trace, or the settlement as it happens converts existing work into demo material without
building anything new. It is usually two hours and it moves both the Technical and Demo
lenses at once.

## Re-review

Once. After the P0 and P1 fixes land, run TRIAGE again to confirm the requirement matrix
has no FAIL or UNKNOWN rows left. That is the only thing worth re-checking.

Do not run a second full review. The findings will be similar, the team has already
decided what it is not fixing, and the hours spent re-reviewing are hours not spent
rehearsing. **Review once properly, fix, verify requirements, stop.**
