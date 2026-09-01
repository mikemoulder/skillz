# Build order

Architecture is only useful if it converts into a sequence someone can start on. The
ordering principle is **risk first, then vertical, then breadth** — the opposite of how
production software is usually built, and the reason so many hackathon projects have
nothing to show at hour 30.

## Why layer-first fails

The natural order — database, then backend, then frontend, then integrate — has one
fatal property at a hackathon: **nothing is demoable until the last step**, and the
last step is where the time ran out. Teams building this way discover their integration
does not work at hour 20, with no slack to change the design.

Risk-first inverts it. The unknowns are resolved while they are still cheap to be
wrong about, and something runnable exists from hour two onward.

## The sequence

### Hour 0-1 — Spike and deploy, in parallel

Two people, two tasks, before the architecture is even final.

```text
Person A: make the riskiest external call succeed once, in a throwaway script
Person B: create-next-app, push, deploy. a URL exists with nothing on it
```

The spike does not need to be integrated, typed, or pretty. It needs to answer one
question: **does this thing work from our machines with our credentials?** Auth flows
that need an approval email, SDKs that do not run on Node 22, testnet faucets that are
dry, APIs that need a business account — all of these are survivable at hour one and
fatal at hour twenty.

If the spike fails and cannot be fixed within an hour: **change the architecture now.**
That is what the hour is for.

### Hour 1-3 — The walking skeleton

One request, end to end, through every layer, returning hardcoded data.

```text
button click → POST /api/tasks → insert a row → return it → render it
```

No real logic. No real integration. The point is that the wiring is proven and every
lane is unblocked: the UI has a real endpoint shape, the API has a real database
connection, and the deploy pipeline has carried all of it to production.

**Deploy the skeleton.** The gap between "works locally" and "works deployed" is where
env vars, build errors and Node version mismatches live, and you want to meet them now.

### Hour 3-N — Thicken the aha path only

Take the one step marked as the aha moment and make it real, end to end, before
anything else on the demo script. Everything else stays hardcoded.

This is the same discipline as the frontend skill's "build against fake data that
already looks like a successful demo" — and for the same reason. If you run out of
time at any point after this, you still have a demo. The order guarantees that the
thing you cut is always the least important thing remaining.

### Then — the rest of the demo path, states, hardening

In that order, and stopping the moment the clock says to.

## Parallel lanes

| Lane | Owns | Depends on | Never blocked by |
|---|---|---|---|
| **UI** | `app/`, `components/` | `types.ts`, seed data | The integration |
| **Hard part** | `lib/<the-thing>/`, contracts | The spike | The UI |
| **Data + API** | `app/api/`, schema | `types.ts` | The UI |
| **Ops + demo** | Deploy, env, README, recording | A deployed URL | Everything |

Two rules keep lanes from colliding:

1. **Types are written and committed before any lane starts**, and treated as frozen.
   Changing a shared type is announced out loud, not merged quietly.
2. **Nobody edits another lane's files.** If the UI needs an endpoint changed, ask; do
   not reach into `app/api/`. The two minutes of asking beats the twenty of untangling
   a merge at 3am.

With two people, collapse to two lanes: hard part, and everything else. With one
person, there are no lanes — build one vertical slice at a time, in the sequence above.

The fourth lane looks like the least technical and is frequently the difference between
placing and not. Deploy, env vars, README, the fallback recording and the demo
rehearsal are all real work, all on the critical path, and all traditionally left until
there is no time for them.

## Integration checkpoints

Merge everything and deploy at fixed times, not when a feature is "ready". Ready is not
a time; 6pm is.

| Checkpoint | Everything merged, deployed, and | If it fails |
|---|---|---|
| **Hour 3** | The skeleton renders on the deployed URL | Stop. The pipeline is the problem |
| **Hour 8** | The aha path works end to end | Cut a lane's scope now, not later |
| **Hour 16** | The full demo path runs on the deployed URL | Start `SALVAGE MODE` |
| **Hour 24** | Fixtures in place, demo rehearsed once | Freeze features. Polish only |
| **T-2 hours** | **Feature freeze.** Nothing merges but bug fixes | — |

The T-2 freeze is the one teams break and the one that costs them. A feature merged at
T-30 minutes that breaks the build converts a working demo into no demo, and it has
happened at every hackathon anyone has attended.

## When a lane falls behind

Diagnose which case it is, because the responses are opposite:

| Situation | Response |
|---|---|
| The hard part is slow but progressing | Everyone else cuts scope. It is the technical score |
| The hard part is genuinely stuck | Flip it to fixtures permanently. Demo the recorded version |
| The UI is behind | Cut screens, not polish. One perfect screen beats three drafts |
| The API is behind | UI keeps using seed. Ship the demo on seed if you must |
| Deploy is broken | **Everything stops.** Undeployed is unjudged |

The instinct when someone is behind is to add a second person to their lane. It rarely
works — most hackathon lanes are one person's mental model, and a second person spends
an hour loading it. Cut scope instead.

## The last two hours

No new features. The order is fixed:

```text
1. Deploy whatever currently works. Right now, before anything else
2. Screen-record the full working demo. This is your parachute
3. Rehearse against the deployed URL, out loud, timed
4. Fix only what broke during the rehearsal
5. README and submission form — with 30 minutes to spare, not 5
6. Set DEMO_MODE=fixture and verify the deployed URL still works
```

Submission forms close hard, and they ask for things you have not prepared — a video
link, a slide URL, a track selection, team member emails. Teams have finished a working
project and failed to submit it. Start the form at T-45.
