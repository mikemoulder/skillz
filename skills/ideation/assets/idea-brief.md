# Idea brief — [PROJECT NAME]

<!--
The output of /skillz:ideation and the input to every skill after it. Fill it in
once, at minute 55, and keep it open. Anything the team disagrees about later is
resolved here, not in a debate at 3am.

Delete a section rather than leaving it blank — an empty section reads as "not decided
yet", which is the state this document exists to end.
-->

## The sentence

> We built **[X]** for **[Y]**, letting them **[Z]**, using **[T]** to make
> **[previously hard or impossible thing]** possible.

<!-- If this needs a subordinate clause, the idea is too complicated. Simplify it
     before writing anything below. This line becomes the README's first line and the
     demo's first line. -->

## Problem

**Who:** [one specific person, named by role, not a segment]
**Pain:** [what they do today, and why it is bad — one or two sentences]
**Evidence:** [why you believe this is real. "I have this problem" is valid evidence]

## Solution

[Three sentences, maximum. No interface words — no screens, no clicks, no lists.
Describe what happens, not what the user taps.]

## Why now

[The newly available technology, capability, primitive, behaviour or regulation that
makes this buildable this year and not five years ago.]

## Why this technology

| Technology | Used for | Depth | Remove it and… |
|---|---|---|---|
| [sponsor / core tech] | [what it does here] | Essential / Valuable | [what breaks] |
| [second tech] | | | |

<!-- Every row must be Essential or Valuable. A Cosmetic row is a row to delete from
     the project, not from the table. -->

## The aha moment

**At 0:30 the judge sees:** [one sentence — a thing that happens on screen]

**Why it lands:** [visible / fast / unexpected / legible — which of these carry it]

## Demo script

| Time | What you do | What appears | What the system is doing |
|---|---|---|---|
| 0:00 | | | |
| 0:15 | | | |
| 0:45 | | | |
| 1:30 | | | |
| 2:30 | | | |

**Fallback:** [recorded video at [path], and the line you say while switching to it]

## MVP

```text
MUST HAVE     — the aha moment cannot happen without these
  -
  -

SHOULD HAVE   — build only after every MUST is done and deployed
  -

NICE TO HAVE  — build only if you are ahead, which you will not be
  -

CUT           — decided, written down, not revisited at hour 20
  -
```

<!-- The CUT list is the most valuable list here. Its purpose is to end the same
     argument three times at 4am. -->

## Scope check

```text
Build hours available:       [from CONFIG time.build_hours]
Honest estimate for MUST:    [estimate x the multiplier from SKILL.md]
Ratio:                       [must be under 0.5 — if not, cut, now]
Riskiest component:          [what gets prototyped in hour one]
```

## Risks

| Risk | If it happens | Mitigation |
|---|---|---|
| **Technical** | | |
| **Product** | | |
| **Demo** | | |

## The hard question

**They will ask:** [the question you least want]
**You answer:** [the honest answer, written out, agreed by the team]

**What is hardcoded:** [list it. you will be asked, and the honest answer is cheap]

## Tracks targeted

| Track / sponsor | Prize | Why we qualify | Integration depth |
|---|---|---|---|
| | | | rung [0-4] |
| | | | rung [0-4] |

## Handoff

```text
demo.hero_screen    — [the ONE screen that must be perfect, for /skillz:frontend]
Owner per MUST item — [name against each, before anyone opens an editor]
Next skill          — /skillz:frontend
```
