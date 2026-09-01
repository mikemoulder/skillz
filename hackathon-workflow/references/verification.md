# Verification

"I made the change" is not "the change works". The gap between those two sentences is
where a demo dies, because the failure is discovered by a judge rather than by you.

## The ladder

Cheapest reliable check first. Escalate only as far as the change warrants:

| Check | Cost | Catches | Use after |
|---|---|---|---|
| Typecheck | seconds | Import breakage, signature drift | Any code change |
| Targeted test | seconds | The specific behavior you touched | Logic changes |
| Build | 1 to 3 min | Production-only failures, env issues | Before any commit |
| The demo path in a browser | 2 min | **Everything that actually matters** | Any demo path change |
| The deployed URL | 3 min | Env vars, cold starts, build differences | Before saying "done" |

```bash
npx tsc --noEmit          # cheapest useful signal
npm test -- auth          # the one test that covers what you touched
npm run build             # what the host will do
```

Do not run the full suite after a typo fix, and do not skip the build before a commit.
Matching the check to the change is the whole discipline.

## The step nothing can automate

**A green build proves the code compiles. It does not prove the button still works.**

Every change touching the demo path ends with a human clicking through it in a browser.
Not a screenshot, not a unit test, not reasoning about it. Clicking.

```text
1. Load the page (hard refresh, so you see what a judge sees)
2. Do the thing the demo does, in order
3. Watch the aha moment happen
4. Check the console for red
```

Two minutes. It is the only check that tests what is judged, and it catches the entire
class of failures that compile perfectly: a broken handler, a state update that never
fires, a hydration mismatch, a route that renders empty, a fetch to a path that moved.

## Local is not deployed

Production differs from your machine in ways that are invisible locally and fatal on
stage:

| Difference | Fails as |
|---|---|
| Env vars missing on the host | 500, only in production |
| A dependency needing a Node version the host does not run | Build error at minute 358 |
| A file in `.gitignore` that your machine has | Module not found |
| Cold start on a serverless function | Eight seconds of blank screen |
| `NEXT_PUBLIC_` assumptions | A key exposed, or a value undefined |

So "verified" for anything user-facing means verified **on the deployed URL**, not on
localhost. Check it after the deploy finishes, in a private window, which also catches
the preview-deployment-requires-login failure.

## What to write in a handoff

Only what was actually checked. This is the part that decays fastest under fatigue, and
it matters because the next person trusts it:

```markdown
## Verified
[x] typecheck
[x] build
[x] demo path clicked through locally
[ ] deployed URL  <- NOT checked, deploy was still running
```

An unchecked box is useful information. A checked box that nobody checked is worse than
no list, because it removes the next person's reason to look. Never write "should work",
and never tick a box you did not exercise.

## Verification by project type

| Project type | The check that matters most |
|---|---|
| Web app | Click the demo path on the deployed URL |
| Smart contract | `forge test`, then a real transaction on testnet with the hash saved |
| Agent loop | Run it three times with different inputs. Non-determinism is the risk |
| API or service | `curl` the endpoint on the deployed host, not locally |
| Data pipeline | Run it end to end once on real input, and look at the output |

For agents specifically: passing once proves nothing, because the failure mode is
variance rather than correctness. Three runs with three different prompts, checking that
all three terminate and none exceed the step cap, is the real check. A judge will type
something you never tried.

## When verification fails

Do not start editing. Run the debugging discipline from `prioritization.md`: observe the
full error, locate it, form one hypothesis, change one thing, verify that specific thing.

If a change broke something that previously worked and the cause is not obvious within a
minute:

```bash
git diff HEAD             # what did you actually change?
git stash                 # does it work without your change?
```

Confirming that your change is the cause takes fifteen seconds and prevents an hour
spent debugging something unrelated. This is also why commits stay small: `git stash` is
only cheap when the working tree holds one idea.
