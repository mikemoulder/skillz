# Evaluation map

<!--
  Where each part of this project lives. A navigation aid, not an argument.

  Rules, from references/evaluation-map.md:
    - 8 to 15 entries. Fewer is not a map; more is a file listing
    - Every line is a checkable claim. One wrong entry costs more than ten right ones
    - No adjectives, no scores, nothing addressed to a reviewer
    - Point at call sites, not directories, for anything a judge is hunting for
    - Verify every path resolves before submitting

  Link it from the README's structure section, not from above the fold.
-->

Where each part of this project lives.

## Sponsor integrations

<!-- The most-read section. A track judge opens this looking for their own name. -->

[Sponsor A], [its role in one clause]
  → `src/[path].ts:[line]`          the call site
  → `tests/[path].test.ts`          proves [the behavior it proves]
  → `docs/integrations.md`          why this primitive over the alternative

[Sponsor B], [its role]
  → `src/[path].ts:[line]`

## Core implementation

<!-- Whatever the inventory named as the technical high point. Not everything. -->

[The hardest thing you built]
  → `src/[path].ts:[line]`

[The authorization or security boundary]
  → `src/[path].ts:[line]`

<!-- First thing a technical judge asks about, last thing they can find on their own. -->

## Deployed artifacts

<!-- Only what actually exists and can be opened. Delete this section otherwise. -->

[Contract name]
  → `contracts/[Name].sol`
  → `0x...` on [network] ([verified explorer link])

## Demo path

<!-- The flow shown in the video, in order. Lets a reviewer follow what they watched
     through the code, which is the most convincing sequence available. -->

1. [what the user does]        → `src/app/[path]`
2. [what the server does]      → `src/app/api/[path]/route.ts`
3. [what they see]             → `src/app/[path]`

## What is real, what is recorded

<!-- Keep this consistent with the README's disclosure section. Contradicting it is
     worse than having neither. -->

Real: [the parts that genuinely run]
Recorded: [what replays from a fixture, and where the fixture lives]

---

<!--
  Before submitting, verify every path resolves:

  grep -oE '`[^`]+\.(ts|tsx|sol|md)[^`]*`' docs/evaluation-map.md \
    | tr -d '`' | cut -d: -f1 | sort -u \
    | while read -r f; do [ -e "$f" ] || echo "MISSING: $f"; done
-->
