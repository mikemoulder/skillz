<!--
  memory.md is the PROJECT. What anyone should know before working here.
  handoff.md is the CURSOR. Where work stopped.

  This file changes rarely. If you are updating it every hour, the content belongs in
  handoff.md instead.

  Do not include: anything derivable by reading the code, anything that will be stale
  in two hours, a narrative of what happened, or a decision still being argued.

  Delete any section that has nothing real in it. An empty heading is worse than no
  heading, because the next person reads it and learns nothing twice.
-->

# Project memory

## What this is

[One paragraph. The project, the user, the problem. Same words as the README's one
liner, so the whole submission uses one vocabulary.]

## Stack

```text
[framework, language]
[database]
[host, and where the deploy config lives]
[sponsor SDKs, and which file each is used in]
```

## Architecture

[Three or four sentences. The shape, not the detail. Where the hard part lives.]

```text
[the diagram, if it fits in ten lines. otherwise link docs/architecture.md]
```

## Files that matter

<!-- Where a newcomer should look first, not a listing of the tree. -->

```text
[src/lib/x.ts]        [the hard part]
[src/app/api/y]       [the API surface]
[src/lib/seam.ts]     [every external call goes through here]
```

## Decisions

<!-- Decision, why, and what was rejected. This is what stops the same argument
     recurring at 4am, so include the rejected option or it will come back. -->

```text
[what was decided]
  why:      [reason]
  instead of: [alternative, and why not]
```

## Conventions

[Naming, file layout, anything a newcomer would otherwise get wrong. Only what is
non-obvious. "We use TypeScript" is not a convention.]

## Constraints

<!-- Real limits that shape decisions: rate limits, function timeouts, a key that
     cannot be self-served, a chain's block time, a team member who is asleep. -->

```text
[constraint]     [what it forces]
```

## Known issues

<!-- Things that are broken or fragile and are staying that way. Say so explicitly,
     so nobody spends an hour rediscovering it and another hour "fixing" it. -->

```text
[issue]     [why it is not being fixed]
```

## What is real, what is recorded

<!-- Keep this consistent with the README's disclosure section. Contradicting it is
     worse than having neither. -->

**Real:** [what genuinely runs]
**Recorded:** [what replays from a fixture, and where the fixture lives]

## Verification

```bash
[typecheck command]
[test command]
[build command]
```

The demo path is verified in a browser, not by a green build. Files: [list].

## Lessons

<!-- Only discoveries that change future decisions. Not a diary.
     "The streaming endpoint closes idle connections at 30s, so we heartbeat" is a
     lesson. "We spent a long time on the payment code" is not. -->
