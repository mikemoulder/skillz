# Evidence sweep

The premise of this skill is that claims are worthless and artifacts are not. This file
is how you tell the difference, mechanically, in ten minutes.

Run the script first, then read what it found. It gathers evidence; it does not judge.

```bash
bash assets/judge-sweep.sh --url https://your-app.vercel.app --sponsors @circle-fin,@okx
```

## The hierarchy

When two sources disagree, the higher one wins and the lower one becomes a finding:

```text
1. The deployed thing, working, right now
2. Source code that actually runs on the demo path
3. On-chain or deployment evidence (verified contract, tx hash)
4. A recording of it working
5. Documentation
6. README claims
7. Anything a team member remembers
```

**Level 6 with nothing at 1 to 3 is a finding.** Write it that way in the review: not
"the agent may not be fully autonomous", but "the README claims autonomous execution;
`src/app/run/page.tsx:88` requires a click between plan and execute. A judge will find
this in Q&A."

## Is the deployed thing real

```bash
curl -s -o /dev/null -w "status %{http_code}  total %{time_total}s\n" -L "$URL"
curl -s -o /dev/null -w "warm  %{time_total}s\n" -L "$URL"
```

Run twice. The first number is what a judge sees on a cold function; the second is what
you see in rehearsal. **A gap of more than about three seconds is a finding**, because
the judge's first impression is the blank screen, not your rehearsed load.

Then open it in a private window. Two failures look fine from your machine and are dead
for everyone else:

- A preview deployment tied to your hosting account, which asks a judge to log in.
- A video or repo set to private rather than unlisted.

Both are Tier 1 failures in `failure-modes.md`. Both are checked in fifteen seconds.

## Is the sponsor integration real

```bash
grep -rn "from ['\"]@sponsor" src/ --include=*.ts --include=*.tsx    # imported at all
grep -rn "sponsorClient\.\|sponsorSdk\." src/ | wc -l                # called how often
grep -n "@sponsor" package.json                                       # or only declared
```

Three outcomes, and only one of them is an integration:

| Result | Classification |
|---|---|
| In `package.json`, imported nowhere | **Decorative.** The README claim is false |
| Imported in one file, called once, off the demo path | **Decorative to Integrated** |
| Called on the demo path, removing it breaks the flow | **Core.** Verify by reading the call site |

Do this for every sponsor named in the README and every track entered on the submission
form. A track entered with no matching import is a Tier 1 failure and one of the most
common ones.

## What is mocked

```bash
grep -rn "TODO\|FIXME\|XXX\|HACK" src/ --include=*.ts --include=*.tsx | head -20
grep -rn "mock\|dummy\|fake\|placeholder\|hardcod\|stub" src/ -i --include=*.ts | head -20
grep -rn "return \[\]\|return null  *//\|not implemented" src/ | head
```

Mocks are not automatically a finding. A disclosed fixture is good engineering, and the
architecture skill actively recommends them. The finding is the **gap between what is
mocked and what is claimed**. Compare the results against the README's "what is real,
what is not" section. If that section does not exist, that absence is itself the finding.

Distinguish carefully, and do not penalize the first two:

```text
A fixture behind a seam, disclosed          good engineering
A dev-only artifact never rendered           irrelevant
A hardcoded value on the demo path           finding, if presented as computed
A "mock" that IS the feature being claimed   serious finding
```

## Does the architecture exist

Take every box in the README diagram and resolve it to a folder or a URL:

```bash
git ls-files | awk -F/ 'NF>1 {print $1"/"$2}' | sort -u | head -20
```

A box that is neither a folder nor an openable URL is documented architecture that does
not exist, which is the error class judges ask about most directly. Report the specific
box, not a general concern.

## Did the work happen during the event

Some events check this, and a rules violation is worse than any score.

```bash
git log --format='%ad %s' --date=short | tail -5     # oldest commits
git log --format='%ad' --date=short | sort | uniq -c # activity per day
```

Commits predating the event window need an explanation that matches the rules. Many
hackathons allow pre-existing boilerplate and prohibit pre-existing product code; the
distinction is usually in the rules and rarely read.

## Secrets

```bash
git log --all -p | grep -icE "sk-[a-zA-Z0-9]{20}|PRIVATE_KEY=.|SECRET=."
grep -rl "sk-\|API_KEY\|SECRET" .next/static 2>/dev/null && echo "LEAK IN BUNDLE"
```

A key in history is a finding even if it was removed later, because history is what gets
cloned and scanners find committed keys within minutes of a push. The fix is rotation,
not a rewrite.

## Submission versus repo

The highest-yield ten minutes in the whole review, and the one teams never do. Put the
submission form text beside the README and look for contradictions:

```text
Form says              Repo shows                   Severity
autonomous             a manual approval step       serious
real time              a 5 second poll              moderate
fully on-chain         state in Postgres            serious
3 sponsor tracks       2 integrations exist         critical, track ineligibility
"built during X"       commits from last month      critical, rules violation
```

Judges cross reference these routinely, because the submission page and the repo are the
two artifacts in front of them. A contradiction reads as either carelessness or an
attempt to claim something untrue, and both cost more than the underlying gap.

## What a sweep cannot tell you

Be explicit about this in the verdict. A grep proves an import exists; it does not prove
the integration is good. A 200 response proves the URL loads; it does not prove the demo
works. Nothing here can assess latency on venue wifi, whether the video is compelling, or
how the team handles Q&A.

Those need a human, and each has cost teams a placement. List them as unchecked rather
than letting a clean sweep imply they passed.
