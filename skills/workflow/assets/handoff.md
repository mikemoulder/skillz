<!--
  handoff.md is the CURSOR. Where work stopped, and what happens next.
  memory.md is the PROJECT. Keep them separate; a file that mixes them is a diary.

  Update at every natural checkpoint, not at session end. You will not know which
  checkpoint was the last one, and the interruptions that hurt are the unplanned ones.

  Quality bar: someone who was not here can start work in under two minutes.
-->

# Handoff

**As of:** [commit SHA] · [time] · [who or which session]

<!-- The SHA is what makes this verifiable. A reader can diff what changed since. -->

## Next step

<!-- ONE action, specific enough to start immediately. This is the most important
     line in the file, which is why it is first rather than last.

     Not: "continue the frontend"
     But: "in src/hooks/useSession.ts, session state is not updated after a successful
           token refresh. Add that, then run `npm test auth`."                       -->

## Current status

**Working:** [what runs end to end right now]

**Deployed:** [URL, and whether it matches local]

**Build:** green / red [if red, that is the next step, not this]

## Stopping point

**Task:** [what was being worked on]

**Exactly where:** [file, function, line. the more precise the better]

**State:** [mid-edit? committed? does it compile?]

## Changed since the last handoff

```text
[file]    [what changed in it, one line]
[file]    [what changed]
```

**Uncommitted:** [anything in the working tree, or "none"]

## Verified

<!-- Only what was actually checked. "Should work" is not verification, and writing it
     here means the next person trusts something nobody tested. -->

```text
[ ] typecheck
[ ] build
[ ] the demo path, clicked through in a browser
[ ] deployed and checked on the real URL
```

## Failed / blocked

**What failed:** [the actual error, not a summary of it]

**Where:** [file, command]

**Current state:** [reverted? left broken? worked around?]

## Do not repeat

<!-- The highest value section here. At 3am the same dead end gets attempted by three
     people in one night. Writing down what did not work is worth more than the
     attempt that produced it. -->

```text
[approach tried]     [why it did not work]
[approach tried]     [why it did not work]
```

## Remaining work

<!-- Ordered. The order is the decision; the list is just the record of it. -->

```text
1. [MUST]    
2. [MUST]    
3. [SHOULD]  
4. [NOT NOW] [decided, do not re-argue]
```

## Context the next person needs

<!-- Only what is not obvious from the code and not already in memory.md.
     Live constraints: a rate limit you are near, a key that expires, a teammate
     mid-edit in a file, a service that is down. -->
