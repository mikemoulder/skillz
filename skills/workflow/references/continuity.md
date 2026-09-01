# Continuity

Two files, one job each. The value of both comes from being trusted, and trust comes
from precision, so most of this file is about how to write them precisely.

| File | Question | Update frequency | Audience |
|---|---|---|---|
| `memory.md` | What should anyone know before working here? | Rarely | Anyone, any time |
| `handoff.md` | Where did work stop, and what is next? | Every checkpoint | Whoever is next |

Merging them produces a diary, which is the failure both are designed to prevent. The
test: **if a line will be false in two hours, it belongs in `handoff.md`. If it will
still be true tomorrow, it belongs in `memory.md`.**

## Why checkpoint, not session end

Teams write handoffs when they plan to stop. The interruptions that hurt are the ones
nobody plans: a laptop dies, someone falls asleep at the table, a session ends mid-tool
call, a teammate takes over a file at 3am without asking.

None of those produce a handoff, and those are precisely the moments the file exists for.

Update at every natural checkpoint instead: after a feature works, before a risky change,
before a break, before a merge. It costs about ninety seconds and it means the file is
never more than one unit of work out of date.

## The SHA anchor

Every handoff names the commit it describes:

```markdown
**As of:** a3f9c21 · 03:15 · Sam (session 4)
```

This is what makes a handoff verifiable rather than merely believable. A reader can see
exactly what has changed since it was written:

```bash
git log --oneline a3f9c21..HEAD      # what landed after the handoff
git diff --stat a3f9c21..HEAD        # how much moved
git status --porcelain               # uncommitted work nobody has described
```

Without the anchor, a stale handoff and a current one look identical, and following a
stale one is worse than having none: it sends the reader confidently to the wrong place.

## Trust the repo, not the handoff

Handoffs go stale in three ways, all common:

- Someone pushed after it was written.
- The session ended mid-edit and the file describes the intent, not the state.
- The writer was tired and described what they meant to do.

So the session start ritual verifies before acting. **When the repository and the handoff
disagree, the repository is right.** Update the handoff to match reality first, then
continue. That correction takes a minute and saves the next person from inheriting the
same false picture.

## Writing the next step

The single most important line in either file, and the one most often useless.

```text
Useless:  Continue working on the backend.
Useless:  Fix the auth bug.
Useless:  Pick up where I left off.

Useful:   In src/hooks/useSession.ts, the session state is not updated after a
          successful token refresh. The refresh request itself now succeeds (verified
          in the network tab). Add the state update in the onSuccess branch around
          line 40, then run `npm test auth`.
```

The bar is testable: **could someone who was not here start in under two minutes?** If
the reader has to open three files to work out what you meant, the line failed.

Include the file, the function or line, what is already true, and the command that
verifies the fix. Four facts, one sentence each, ninety seconds to write.

## Do Not Repeat

The highest value section in `handoff.md` and the one nobody writes.

At 3am, the same dead end gets attempted by three people over one night, because nothing
records that it was already tried. Each attempt costs twenty minutes and produces the
same failure.

```markdown
## Do not repeat

Upgrading the SDK to 3.x        peer dep conflict with viem, 40 min lost
Polling every 500ms             hits their rate limit at ~30 requests
Running the loop in the route   504s in production, works locally. Use the job row
```

Two lines each. What was tried, and what happened. A failed attempt that is recorded is
worth more than the attempt itself, because it converts twenty minutes of loss into
twenty minutes of information for everyone else.

## What does not belong in memory.md

- **Anything derivable by reading the code.** The file list, the function signatures,
  what a component renders. A reader can see all of that faster than you can write it.
- **Anything that will be stale in two hours.** That is the handoff's job.
- **A narrative.** "On Saturday we spent a long time on the payment code and eventually
  discovered" belongs nowhere. The discovery belongs under Lessons, in one line.
- **A decision still being argued.** Record decisions that are settled. An unsettled one
  written as settled causes an argument at 4am with the file as evidence.
- **Empty headings.** A section with nothing real in it teaches the reader nothing,
  twice. Delete it.

## Multiple sessions and multiple agents

At a hackathon the repo is usually touched by several people and often several agent
sessions, sometimes at once. Three rules keep that from producing conflicting work:

**Handoffs are written for a stranger.** Never "you know the thing we discussed". The
reader may be a teammate who was asleep, or a fresh agent session with no history. Both
need the same explicitness, which is why `team.handoff_audience: both` is the default.

**Name the lane in the handoff.** With the lanes from `/skillz:architecture`, say which
one this session was in. Two sessions in the same lane will collide; two in different
lanes almost never do.

**Announce a frozen file.** If you are mid-edit in something someone else might touch,
say so in Context, with the time. It is the cheapest possible merge-conflict prevention
and it costs one line.

```markdown
## Context the next person needs

Mid-edit in src/lib/settlement.ts as of 03:15, uncommitted. Do not open it; either
wait or ask. Everything else in payments/ is committed and safe.
```

## The ninety second version

When there is genuinely no time, this is still worth writing:

```markdown
**As of:** a3f9c21 · 03:15
**Next:** [one specific action, with the file]
**Broken:** [what is red right now, or "nothing"]
**Do not repeat:** [the last thing that failed]
```

Four lines. It is not a good handoff, and it is enormously better than none, which is
the actual alternative at 3am.
