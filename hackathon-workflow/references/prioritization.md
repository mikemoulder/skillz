# Prioritization and scope

At hour 20 everything looks urgent, every option is defensible, and the team has run out
of the energy that makes good judgment cheap. This file exists so the decision is already
made.

## The order

| # | Work | The reason it outranks everything below it |
|---|---|---|
| 1 | The deploy is broken | Undeployed is unjudged. Nothing else counts |
| 2 | The demo path does not run | The demo is the deliverable |
| 3 | A mandatory requirement is unmet | Zero in that track, whatever the quality |
| 4 | The aha moment is not real | It is what the entire score is built on |
| 5 | The rest of the demo path | Everything the script touches |
| 6 | States, errors, fallbacks | Where the polish score actually lives |
| 7 | README and the recording | On the critical path, always left too late |
| 8 | Differentiation and depth | Real points, but only after the above |
| 9 | Everything else | Usually never, and that is the correct outcome |

Two overrides:

**A blocker on someone else's lane jumps to the top.** One person stuck costs more than
one person working, and unblocking usually takes minutes. Check for this before starting
anything else.

**After the freeze at T minus 2 hours, only demo path bug fixes.** A feature merged at
T minus 30 that breaks the build converts a working demo into no demo. This has happened
at every hackathon anyone has attended.

## Necessary depth versus perfectionism

The distinction that decides whether careful work is valuable or wasteful:

| Necessary depth | Perfectionism |
|---|---|
| The demo path must not break | A code path no judge will reach |
| The thing a judge will definitely see | The thing they might see if they went looking |
| A failure with no recovery | A failure with an obvious fallback |
| A decision that is expensive to reverse later | A decision that is one commit to change |
| The hard part that earns the technical score | Making the hard part elegant |

The test: **if this is wrong, when do we find out, and what does it cost then?** Expensive
and late means go deep now. Cheap and immediate means take the fast path and move.

The 80/20 heuristic holds almost everywhere here, with one exception: anything on the
demo path gets the full 100, because the demo is the artifact and a partial demo is not
80 percent of a score.

## Scope control

Every new idea gets classified out loud, before any code:

```text
MUST     the demo does not work without it
SHOULD   build after every MUST is done AND deployed
COULD    build only if genuinely ahead, which you will not be
NOT NOW  written down, decided, and not re-argued
```

The fourth category does the work. An idea that is merely not being built comes back
every few hours, costs ten minutes of discussion each time, and eventually someone starts
it at hour 26. An idea written down as NOT NOW, with one line of why, stays down.

```markdown
NOT NOW
  Mobile layout          the demo runs on a laptop
  Multi-user accounts    single-player demo, not on the script
  Second sponsor SDK     two integrations done well beat five listed
```

**A smaller finished project beats a larger unfinished one, in every rubric.** When the
clock and the scope disagree, the scope loses. That is not a compromise, it is the
correct trade: judges score what runs.

## The stuck protocol

Persistence stops paying at a predictable point. After two failed attempts on the same
problem, change something about the approach rather than trying harder:

```text
1. Re-read the actual error. The full text, not your memory of it
2. Re-read the code you are changing, top to bottom, including the parts you wrote
3. Search the repo. Something similar may already be solved somewhere
4. Try the version that definitely works, even if it is uglier
5. Ask whether this is architectural. If so the fix is not here
6. Record it under Do Not Repeat, switch to other work, come back later or never
```

Step 4 deserves emphasis at a hackathon. The elegant fix that takes another hour and the
crude fix that takes five minutes score identically, because judges see behavior and not
implementation. Take the crude one, note it, and move.

Step 6 is what stops the same dead end consuming three people's nights.

## Debugging discipline

```text
Observe          what actually happened, in full
Locate           where it happened, precisely
Hypothesize      one specific explanation
Change           one thing
Verify           did that specific thing change?
```

Changing three things at once and finding it works teaches nothing: you now have three
changes, at least two of which are unnecessary, and no understanding. Under time pressure
that feels faster and is reliably slower.

## Measuring progress

Progress is completed verified capability, not activity:

```text
weak:    changed 24 files, refactored the agent module
strong:  the payment flow works end to end and is verified in the browser
```

The first sentence describes effort, which nobody scores. The second describes a
capability, which is the only thing that shows up in a demo. When reporting or deciding
what to do next, count capabilities.

## When the project is behind

Diagnose which case it is; the responses are opposite:

| Situation | Response |
|---|---|
| The hard part is slow but moving | Everyone else cuts scope. It is the technical score |
| The hard part is genuinely stuck | Flip it to fixtures, demo the recorded version |
| The UI is behind | Cut screens, not polish. One good screen beats three drafts |
| Too many half-finished things | Finish one, delete the rest. Nothing partial scores |
| Nobody knows what state it is in | Stop. Read the handoff, verify, write it down, restart |

That last row is this skill's own failure mode, and it is more common at hour 24 than any
technical problem. The fix is thirty minutes of reconstruction, not more building, and
teams resist it because it feels like not working. It is the highest value half hour
available at that point.
