# The evaluation map

`docs/evaluation-map.md` is a claim-to-file index. It answers the question every reviewer
has and almost no repository answers:

> You said you built that. Where is it?

It is additive, it takes fifteen minutes, it carries no risk, and it is the single
highest value artifact this skill produces.

## What it is, and what it is not

**It is** a navigation aid. "Here is where each thing lives", written so that a judge
with four minutes, a sponsor engineer looking for their own SDK, or an automated
summarizer can all get to the evidence directly.

**It is not** an argument. It contains no scores, no adjectives, no case for why the
project should win, and nothing addressed to an evaluator. The moment it starts arguing,
it stops being useful and starts being the thing described in `ai-legibility.md`.

The distinction is visible in one line:

```text
good:  Bounded agent loop with tool allowlist   → src/agents/execution.ts:22
bad:   Our sophisticated agent architecture (a key innovation) → src/agents/
```

The first is checkable and useful. The second is a claim with a folder attached, and a
reviewer who follows it and finds ordinary code has learned something you did not want
them to learn.

## The shape

```markdown
# Evaluation map

Where each part of this project lives.

## Sponsor integrations

Circle programmable wallets, settlement layer
  → src/payments/settlement.ts:40      the call site
  → tests/settlement.test.ts           proves it settles without approval
  → docs/integrations.md               why this primitive over the alternative

OKX DEX quotes, used at plan time
  → src/agents/quote.ts:18

## Core implementation

Agent loop: bounded steps, wall clock, tool allowlist
  → src/agents/execution.ts:22

Authorization boundary: caps enforced in code, not in the prompt
  → src/payments/authorize.ts:14

On-chain settlement
  → contracts/Settlement.sol
  → 0xabc...def on Base Sepolia (verified)

## Demo path

The flow shown in the video, in order
  → src/app/page.tsx            task submission
  → src/app/api/tasks/route.ts  creates the run
  → src/app/run/[id]/page.tsx   the live step timeline
```

## Choosing entries

Between eight and fifteen. Fewer and it is not a map; more and it is a file listing,
which a reviewer already has.

Include:

- **Every sponsor integration**, with the call site and not just the directory. This is
  the section that gets read most.
- **The hardest technical work**, whatever the inventory in step 1 identified.
- **Any security or authorization boundary.** It is the first thing a technical judge
  asks about and the last thing they can find.
- **The demo path**, in order. It lets a reviewer follow what they saw in the video
  through the code, which is the most convincing sequence available.
- **Deployed artifacts**: contract addresses with explorer links.

Leave out: anything ordinary, anything you would have to oversell, and anything that is
not there yet.

## Line numbers

Use them for call sites (`settlement.ts:40`), and accept that they drift. A line number
that is off by five still lands the reader in the right function, which is the entire
job. A wrong file path does not, so check the paths even if you do not re-check the
lines.

Regenerate the paths after any rename:

```bash
grep -rn "\.ts:[0-9]" docs/evaluation-map.md | awk -F'→' '{print $2}' | awk -F: '{print $1}' \
  | tr -d ' ' | sort -u | while read -r f; do [ -e "$f" ] || echo "MISSING: $f"; done
```

## Where it is linked from

One line in the README, near the repository structure section:

```markdown
[Evaluation map](docs/evaluation-map.md): where each part of this project lives.
```

Not above the fold. The fold belongs to the one liner, the demo link and the screenshot,
and a judge who is still deciding whether to care does not want an index. The reader of
this document has already decided to look, which is exactly the reader it serves.

## Keeping it honest

Every line is a claim, so every line is checkable, which means an inaccurate map is worse
than none. Two failure modes:

- **A path that does not exist.** Reads as documentation written from intention rather
  than from the repo. Run the check above before submitting.
- **A claim the file does not support.** "Authorization boundary → auth.ts" pointing at a
  file with a single `if (user)` is the claim gap, in index form, with a direct link to
  the disproof.

The map's value comes entirely from being trustworthy. One wrong entry costs more than
ten right ones earn, because a reviewer who checks two entries and finds one wrong stops
checking and starts doubting.
