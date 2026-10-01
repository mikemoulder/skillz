# Commit history

Your commit log is read by judges. Organizers open it to confirm the work happened during
the event, and a technical judge skims it to see how the project was built. That makes it
a submitted artifact, and it is one of the few you can shape continuously rather than at
the end.

## What judges actually see

```text
Strong                                      Weak
52 commits across two days                  4 commits, three in the final hour
feat: add settlement retry with backoff     update
fix: handle rejected wallet signatures      fix
test: cover the payout cap                  final final
first commit inside the event window        first commit three weeks before the event
```

The left column tells a story: a team that built something in increments, fixed real
problems, and tested the parts that mattered. The right column tells one too, and judges
read it just as fast.

## The 50 target

**About 50 meaningful commits** over a 36 hour event is one roughly every 45 minutes. That
is how disciplined work naturally commits, not a stretch goal.

It is a direction, not a quota:

- **A real 30 beats a fake 50.** Padding is visible and reads as insecurity.
- **Never pre-create empty commits** to seed the count.
- **Never split one change into five** to inflate it.
- **Never batch a whole feature into one** either. That is the opposite failure and it
  hides the work.

If you are well short at hour 30, the fix is not more commits. It is noticing that you
have been committing too rarely, which means each commit is too large to revert cleanly.
That is a real engineering problem, and the count was only the symptom.

## One commit, one purpose

A good commit:

- does one thing, nameable in a short message
- leaves the project building and running
- contains only the related changes
- can be reverted without breaking unrelated work

The last property is the practical payoff at 3am. A history of focused commits means a
bad change is `git revert <sha>`. A history of giant ones means it is an archaeology dig
during the most expensive hour of the event.

## Message format

Conventional prefixes, a specific subject, no trailing period:

| Prefix | For |
|---|---|
| `feat:` | New capability a user or judge can see |
| `fix:` | A bug, named by its symptom |
| `test:` | Tests, named by the behavior they prove |
| `refactor:` | Structure change, no behavior change |
| `docs:` | README, docs, comments |
| `chore:` | Config, deps, tooling |
| `perf:` | Measurable speed improvement |

```text
Bad                      Good
fix                      fix: handle expired session tokens
update stuff             feat: add transaction settlement workflow
changes to api           refactor: extract quote fetching into its own module
tests                    test: cover settlement retry on RPC timeout
```

Name the symptom in a fix, not the code change. `fix: handle rejected wallet signatures`
tells a reader what was broken; `fix: add try catch` tells them nothing.

## Never

- **An em dash** in a message. It reads as machine written.
- **An AI co-author trailer**, a generated-by footer, or a robot emoji. History is judged,
  and a machine authorship marker on every commit is the clearest signal there is that a
  project was generated rather than engineered.
- **A changed git identity** to make a tool look like a contributor.
- **A secret.** Rotate any key that was ever committed. Rewriting history does not help,
  because it has already been fetched.

## A strong history, in shape

```text
chore: scaffold next app and deploy empty shell
chore: add design tokens and app shell
feat: add seeded review queue screen
feat: add task submission form
feat: create task API with in-memory store
feat: persist tasks to postgres
feat: add agent planning step with tool allowlist
feat: stream agent steps to the run timeline
fix: bound agent loop by step count and wall clock
test: cover the step cap and the timeout path
feat: settle completed tasks through sponsor wallet
fix: show rejected signatures as a normal outcome, not an error
feat: add fixture fallback behind every external call
docs: add evaluation map and technical decisions
docs: write judge-facing README with sponsor table
```

Read top to bottom, that is the build order from `/skillz:architecture`, visible in the
log. That correspondence is the point: the history should look like a plan executed,
because it was.
