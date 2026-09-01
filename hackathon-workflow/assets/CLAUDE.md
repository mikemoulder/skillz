<!--
  Drop this at the root of the HACKATHON PROJECT (not the skill library).
  It is read at the start of every session, which is why the working stance lives
  here rather than in a skill: a skill loads when something invokes it, and stance
  has to apply continuously.

  Fill in the project specifics below, delete the rest of this comment, and keep the
  whole file short. It costs context every session, so it earns its length or it goes.
-->

# [PROJECT NAME]

[One sentence: what this is and who it is for.]

Hackathon: [name], deadline [date and time]. Feature freeze at [deadline minus 2h].

## Before starting work

Read `handoff.md` first, then verify it against the repo (`git log --oneline -5`,
`git status --porcelain`). The repository is right when they disagree. `memory.md` has
the durable project knowledge; do not rediscover what is written there.

## Commands

```bash
npm run dev        # local
npm run build      # must pass before any commit
npx tsc --noEmit   # cheapest useful check
[test command]
```

Deployed at: [URL]. Deploys on push to `main`.

## The demo path

These files are what gets judged. Changes here are verified in a browser, not just by a
green build:

```text
[src/app/page.tsx]          [what the user does]
[src/app/api/x/route.ts]    [what the server does]
[src/lib/x.ts]              [the hard part]
```

## Working stance

Slow, steady, sharp. Take the time to understand; do not spend time on work that does
not change the outcome.

- **Inspect before modifying.** Find the file, understand what it does, check who calls
  it, then make the smallest change that works.
- **Preserve what works.** Do not rewrite unfamiliar code, and do not restructure because
  another shape looks cleaner. Ugly and running beats clean and broken.
- **Verify before reporting.** Cheapest check first: typecheck, then a targeted test,
  then the build, then the demo path in a browser. Never say a change works without
  having checked.
- **One change at a time when debugging.** Observe, locate, hypothesize, change one
  thing, verify. Changing three things at once means learning nothing from the result.
- **Stop after two failed attempts** on the same problem. Re-read the error, try the
  simpler version, or record it in `handoff.md` under Do Not Repeat and move on.
- **Protect the scope.** New ideas get classified MUST / SHOULD / COULD / NOT NOW before
  any code. A smaller finished project beats a larger unfinished one.

## Communication

Plain language. The reader should not need to know the implementation to understand what
happened.

```text
Found:    the payment flow worked, but failed when the wallet had no balance
Changed:  added a balance check before settlement
Verified: tested funded and unfunded wallets in the browser
Next:     transaction confirmation flow
```

Do not narrate every file read or search. Group the work and report the outcome. Keep
the message proportional to the change: a one line fix does not need four sections.

## Before ending a session

Verify, commit, then update `handoff.md` with the exact stopping point and the single
next step. The bar: **someone who was not here can start in under two minutes.** Update
`memory.md` only when something durable changed.

## Never

- Commit a secret, or a `.env` file. `NEXT_PUBLIC_*` ships to the browser.
- Add AI attribution to a commit: no `Co-Authored-By` naming a tool, no generated-by
  footer, no robot emoji. Judges browse commit history.
- Use em dashes in the README, docs, commit messages or comments. It reads as machine
  written and discounts the surrounding claims.
- Push to `main` with a red build. The deploy is the submission.
- Refactor after hour 20.
