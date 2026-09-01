# Architecture brief: [PROJECT NAME]

<!--
One page. It replaces the fifteen-section architecture document nobody reads at 3am.
Written at minute 45, after the spike is already running.

Its second job is to be the source of the README's architecture section, so the
diagram here is the diagram judges see, which is why every box must be real.
-->

## Summary

```text
Style:        modular monolith / [deviation, if any]
Stack:        [runtime, framework, db, host]
Deploys:      [how many. one is the right answer]
Deployed at:  [URL, exists from hour one]
```

## The demo path

<!-- From the idea brief's demo script. This IS the specification. Anything not on
     this table does not exist until the table works end to end. -->

| # | User action | UI shows | Server does | Persists |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

**Aha step:** [which row number]
**That step gets:** the fallback, the retry, the good error state. The others get none.

## Diagram

<!-- At most 7 boxes. Every box is a folder in this repo or a URL you can open.
     Delete any box that is neither, a diagram that does not match the repo is a
     liability in Q&A, not an asset. -->

```text
      User
        │
        ▼
   [Frontend]         src/app, src/components
        │
        ▼
   [API routes]       src/app/api
        │
   ┌────┼────┐
   ▼         ▼
[Database] [Seam]     src/lib/*.ts  ← the only files importing an SDK
             │
             ▼
        [External]    [name them]
```

## Components

| Component | Tech | Responsibility | Depends on |
|---|---|---|---|
| | | | |

## Data model

```text
[Entity]     id, [fields], created_at
[Entity]     id, [fk], [fields]
```

**Rule applied:** if the demo does not read it, it is not here.

## API surface

| Method | Path | Purpose | Returns |
|---|---|---|---|
| POST | `/api/` | | |
| GET | `/api/` | | |

<!-- About five. If you are writing the ninth, the demo path grew without a decision. -->

## Shared types

```ts
// src/lib/types.ts: committed BEFORE any lane starts. frozen. changes announced.
```

## External dependencies and their seams

| Dependency | Used for | Fixture recorded? | If it dies on stage |
|---|---|---|---|
| | | ☐ | |
| | | ☐ | |

**`DEMO_MODE` on stage:** `fixture` / `auto`, [verified on the deployed URL? ☐]

## Timeout budget

```text
Host function limit:     [VERIFY against host docs, do not assume]
Longest operation:       [what, and how long]
Shape chosen:            request handler / SSE / job row + worker
```

## Security boundaries

```text
Secrets live:            [server only. grep .next/static before demoing]
Signing key held by:     [n/a | user wallet | backend env | smart account]
Agent authorization:     [n/a | allowlist + cap + human confirm, enforced in code]
Network:                 [testnet | mainnet + why]
```

## Lanes

| Lane | Owner | Owns these files | First task |
|---|---|---|---|
| UI | | `src/app`, `src/components` | |
| Hard part | | | **the spike** |
| Data + API | | `src/app/api`, schema | |
| Ops + demo | | deploy, env, README, recording | |

## Build order

```text
Hour 0-1    spike the riskiest call        owner: [ ]
Hour 0-1    deploy an empty app            owner: [ ]
Hour 1-3    walking skeleton, deployed     owner: [ ]
Hour 3+     the aha path, real             owner: [ ]
then        rest of demo path → states → hardening
```

**Checkpoints:** merge + deploy at hour 3, 8, 16, 24. **Feature freeze at T-2h.**

## Risks

| Risk | Detected by | Fallback |
|---|---|---|
| | | |

## Cut list

<!-- Decided now, in daylight, so it is not re-argued at 4am. In cut order. -->

```text
1.
2.
3.
```
