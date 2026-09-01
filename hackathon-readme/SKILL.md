---
name: hackathon-readme
description: Write the judge-facing README and repo surface for a hackathon submission. Covers the first fifteen lines that decide whether the rest gets read, the sponsor integration sections that win track prizes, evidence that makes claims credible, setup that works on a stranger's machine, and a documentation voice that is ambitious without fabricating. Use when writing or fixing a project README, when a repo needs to look intentional rather than dumped, when a sponsor needs to see how deeply their technology was used, when preparing a submission, or when documentation must be checked for accuracy against the actual code. Read CONFIG.md first.
---

# Hackathon README

The README is the second thing judged and the first thing read. A judge arrives from a
submission list with dozens of tabs open, gives the top of your page a few seconds, and
decides whether to click the demo or close the tab. Everything below the first screen
exists to serve the people who did not close it.

**Read `CONFIG.md` before anything else.** Project identity, sponsors, which proof
artifacts exist, and the voice rules live there. If it is unfilled, inspect the repo
first (see Accuracy below), infer the rest, state assumptions in one line, and keep
moving.

## The rule that governs everything

> The first fifteen lines decide whether the rest is read.

Most hackathon READMEs are written as reference documentation, front-loaded with
badges and a table of contents, with the interesting part at position nine. Judges do
not reach position nine. Put the payload at the top and let depth accumulate below it.

## Time budget

Capped at **45 minutes**, and not in the last hour.

| # | Phase | Wall clock | Done when |
|---|---|---|---|
| 1 | Inspect the repo for ground truth | 10 min | You know what actually exists, from files, not memory |
| 2 | Above the fold | 10 min | One line, one image, three links, all working |
| 3 | Body sections | 15 min | Problem, product, sponsors, how it works, quick start |
| 4 | Evidence and honesty pass | 5 min | Every claim maps to a file or a URL. Limitations written |
| 5 | Gates | 5 min | `assets/check-docs.sh` passes. Fresh clone tested |

**Write the skeleton at hour two, not at the end.** The one line, the problem and the
sponsor list all come straight from the idea brief and cost ten minutes while you are
fresh. Filling them in as you build is nearly free; writing the whole thing at T-15
produces exactly the code dump this skill exists to prevent.

## Accuracy comes first

Never document from assumption. Before writing a word, read the repo and let the
implementation be the source of truth:

```bash
cat package.json | head -40                    # real deps, real scripts
ls src/app/api src/lib contracts 2>/dev/null   # what actually exists
cat .env.example 2>/dev/null                   # what it really needs
grep -rn "from ['\"]@" src/lib --include=*.ts | head -20   # real SDK imports
git log --oneline | head -20                   # what actually got built
```

That fourth command is the important one. It tells you which sponsor SDKs are genuinely
imported and where, which is the difference between a sponsor section that survives one
question and one that does not.

**Documenting something that does not exist is the worst outcome available here.** It
converts a judge's interest into a discovered lie, and it costs more than the feature
would have earned.

## Above the fold

The first fifteen lines. No table of contents, no badge wall, no "Contributing".

```markdown
# Project Name

**One sentence: what it does, for whom, and the thing that was previously hard.**

[Live demo](url) · [90 second video](url) · [Verified contract](url)

![The product doing the interesting thing](assets/screenshots/hero.png)

Built at [Hackathon] with [Sponsor A] and [Sponsor B].
```

Five elements, in that order:

| Element | Why it is here |
|---|---|
| The one sentence | Straight from the idea brief. It is the sentence a judge repeats to another judge |
| The three links | Demo, video, proof. A judge who clicks one of these has already scored you higher |
| **A screenshot or GIF of the product working** | The single highest-value object on the page |
| The hackathon and sponsor line | A sponsor judge scanning for their own name finds it in two seconds |

The image is not decoration. A judge who sees a working interface before reading a
word arrives at the text already believing the project exists, and that belief colors
everything after it. A GIF of the aha moment is better than a static shot. Put it in
`assets/screenshots/` and commit it, never hotlink it.

## The body

In this order, with these budgets. **Total README under 800 words.** Anything longer
goes to `docs/`.

| Section | Words | Contains |
|---|---:|---|
| **The problem** | 60 | One person, one pain, in human terms. No market statistics |
| **What we built** | 100 | Concrete. The actual workflow, plus a second screenshot |
| **Sponsor integrations** | table | One scannable row each, deep version linked. See below |
| **How it works** | 150 | The numbered walkthrough plus one diagram |
| **Technical highlights** | 90 | Three bullets: the hard parts, and why they were hard |
| **Quick start** | code | Commands that work on a stranger's machine |
| **What is real, what is not** | 80 | The honesty section. See Evidence below |
| **Limitations and next** | 80 | Built / Next / Vision, clearly separated |

Sections to skip unless they earn their place: Contributing, Code of Conduct, License
discussion, team bios, acknowledgments, a table of contents, an inline API reference,
and any section that exists because other READMEs have one.

`assets/README.template.md` is this structure as a fill-in file, with the budgets and
the reasoning inline as comments. Start from it rather than from a blank page.

## Sponsor integrations

Sponsor prizes are often the best expected value on the board, and they are decided by
an engineer from the team that built the SDK, reading your README while looking
specifically for their own product. Design the section for that reader.

**A scannable table first, at a position they will reach:**

```markdown
| Technology | How we use it | Where |
|---|---|---|
| [Sponsor SDK] | The settlement layer. Every completed task pays out through it | `src/lib/pay.ts` |
| [Sponsor API] | Tool discovery. The agent queries it at plan time | `src/lib/tools.ts` |
```

The `Where` column is what makes this credible. A file path is a claim the reader can
check in one click, and offering it signals that you expect them to.

**Then one paragraph per sponsor**, answering the only question they have: did these
people understand what we built, or did they call one endpoint to qualify? The
template, and the phrasing that communicates architectural depth without overstating,
are in `references/sponsor-sections.md`.

Two rules that override everything else in that file:

- **Never claim an integration that is not in the code.** The judge is the person who
  can most easily verify it, and they will.
- **Depth beats breadth.** Two integrations described precisely outscore five listed.
  A fifth logo reads as desperation, not as coverage.

## Evidence

Evidence is the credibility currency of a hackathon repo. Every strong claim should
have an artifact attached:

| Claim | Evidence that settles it |
|---|---|
| "It works" | A live URL that loads, right now |
| "It is deployed on chain" | A verified contract on a block explorer, linked |
| "It really transacts" | A transaction hash, linked |
| "The agent is autonomous" | A recorded run with its steps visible |
| "It looks like this" | A committed screenshot, not a description |
| "You can run it" | A fresh clone that works. See below |

Then the section teams skip, which is worth more than any of the above:

```markdown
## What is real, what is not

Real: the agent loop, tool selection, and on-chain settlement on [testnet].
Recorded: the market data feed runs from a captured fixture during the demo.
Not built: multi-user accounts, and the mainnet path.
```

Judges ask "is that live?" because they have seen many demos. Volunteering the answer
costs one point of apparent completeness and buys back several of credibility. Getting
caught after claiming otherwise costs the reader's trust in every other claim on the
page, including the true ones.

**Capture evidence while things are working, not at the end.** Every artifact above
takes two minutes during the build and is unavailable at 4am once a key has expired or
the deploy has broken. `references/evidence.md` has the capture checklist, how to make
a hero GIF, contract verification, and the two failures that look fine from your
machine and are dead for everyone else.

## Ambitious, never fabricated

The README should be bold. It should make real work sound significant, because real
work usually is and hackathon teams routinely undersell it. The line is precise:

> Amplify the significance of what exists. Never invent what does not.

| Do not write | Write instead |
|---|---|
| "Revolutionizing payments for millions of users" | "Demonstrates programmable dollars acting as an execution primitive inside an autonomous workflow, rather than as a passive balance" |
| "Enterprise grade, production ready" | "A working prototype of the settlement path, on testnet" |
| "10x faster" | "Completes in about 8 seconds what took us 4 minutes by hand" |
| "Fully decentralized and trustless" | "Settlement and ownership are on chain. Planning and indexing run on our server" |

The test, applied to every sentence in the README: **can I point at the file, the URL,
or the measurement?** If not, either produce the artifact or soften the sentence. The
second column above is more impressive than the first anyway, because it is specific,
and specificity is what reads as competence. Full voice guidance, the banned phrase
list, and worked rewrites: `references/voice.md`.

## No em dashes

Do not use the em dash character in the README, in `docs/`, in commit messages, in code
comments, in submission copy, or in any generated project text. Use commas, colons,
periods, semicolons or parentheses.

The reason is practical rather than stylistic: the em dash has become one of the
clearest signals that text was machine generated. A judge who reads your README as
AI-written discounts everything it claims, which is the exact opposite of what the
document is for. The same applies to the phrasing patterns listed in
`references/voice.md`.

Scan before finalizing, never trust a manual read:

```bash
bash assets/check-docs.sh          # includes the em dash gate, plus the others
grep -rn $'\xe2\x80\x94' README.md docs/ 2>/dev/null && echo "EM DASH FOUND"
```

## No AI attribution in commits

**Never add an AI co-author trailer or a generated-by footer to a commit, a pull
request, the README, or anything else in the repository.** No exceptions. If a tool
emits one by default, turn it off before the first commit.

```text
Co-Authored-By: [any AI tool] <...>       never
Generated with [any AI tool]              never
🤖 anything                                never
```

Commit history is a surface judges browse, and hackathon organizers check it to
confirm the work happened during the event. A machine co-author on every commit is the
most legible marker available that a project was generated rather than engineered, and
it puts an authorship record in your submission that does not match your team. This is
not about hiding tool use; it is about not making a machine-readable authorship claim
in a document judges read.

`check-docs.sh` fails on this, in both history and documentation. Catch it at the first
commit, because stripping it later rewrites history, and a history rewrite in the final
two hours is a risk with no upside. `references/voice.md` has the scan and the strip
command.

## Setup that works on a stranger's machine

The quick start is a claim like any other, and it is the one most often false. A judge
who tries your instructions and hits an error on line three stops being a judge and
becomes a skeptic.

```bash
git clone <repo> && cd <repo>
cp .env.example .env.local        # then fill in the keys listed below
npm install
npm run db:push                   # only if there is a database
npm run dev                       # http://localhost:3000
```

**The test that matters:** clone into a fresh directory and run your own instructions
verbatim, with no environment you already have.

```bash
cd /tmp && rm -rf verify && git clone <repo> verify && cd verify
# now follow the README exactly. every failure is a bug in the README
```

Commit a `.env.example` with every key present and every value empty, and document what
each key is and where to get one. A key nobody outside the team can obtain should be
flagged as such, honestly, rather than left to fail silently.
`references/setup-that-works.md` covers the failures that only appear on someone else's
machine.

## The repo surface

The repository itself is read as evidence of seriousness. A judge who opens the file
tree sees whether this was built or dumped.

```text
README.md            the pitch
.env.example         every key, no values
.gitignore           .env.local, node_modules, .next
assets/screenshots/  committed images the README points at
docs/                only files that exist because a README section outgrew the fold
src/                 the code
```

Add `docs/` files only when they have content. Two is usually right:
`docs/architecture.md` for the diagram and component detail, and
`docs/integrations.md` for the deep sponsor writeups. **Never create an empty
documentation file to make the tree look larger.** A stub called `docs/api.md`
containing a heading is worse than no file, because a judge will open it.

The architecture diagram must match the code. Every box is a folder in the repo or a
URL you can open; delete any box that is neither. A diagram describing components that
do not exist is the most expensive kind of documentation error, because it is the kind
a judge asks about.

Commit history is its own surface and its own skill. Route to
`hackathon-version-control` for it.

## SALVAGE MODE

Fifteen minutes to submission and the README is a scaffold:

1. **The one sentence.** From the idea brief. Nothing else matters as much.
2. **The demo link and the screenshot.** Both above the fold.
3. **The sponsor table.** Three rows, with file paths.
4. **A four line quick start.** Even if untested, mark it untested.
5. **The honesty section.** Three lines: real, recorded, not built.
6. Run the em dash scan and the secret scan. Submit.

That is a defensible README in fifteen minutes. Skip the vision, the roadmap, the
technical highlights, and every badge. A short honest README with a working demo link
outscores a long one whose links are dead.

## Time traps

- **Badge walls.** Eight shields at the top push the payload below the fold, and no
  judge has ever scored a badge.
- **A table of contents** on a document you can scroll in two seconds.
- **Writing the README last.** The skeleton costs ten minutes at hour two and is
  unaffordable at T-15.
- **Documenting the architecture you intended.** Read the repo. Document what shipped.
- **A logo.** Thirty minutes, zero points. Use a screenshot of the product instead.
- **Prose where a table works.** The sponsor section, the env vars and the endpoints
  are all tables. Judges skim tables and skip paragraphs.
- **Contributing guidelines** for a repository that will receive no contributions.

## Final gate

Run `assets/check-docs.sh`, then verify by hand what a script cannot:

```text
[ ] Every link in the README opens. Especially the demo link, from a phone
[ ] The screenshot shows the current UI, not an early one
[ ] Every sponsor claim points at a real file
[ ] The architecture diagram matches the repo
[ ] Quick start tested from a fresh clone
[ ] .env.example committed, .env.local ignored, no secrets in history
[ ] Limitations section exists and is honest
[ ] Roadmap does not describe unbuilt features as if built
[ ] Zero em dashes
[ ] The submission form and the README use the same project name and one liner
```

That last line matters more than it looks. Judges cross reference the submission page
against the repo, and a project described two different ways reads as two half
projects rather than one finished one.

## Handoff

`hackathon-version-control` for commit history and the final merge.
`hackathon-frontend` if the screenshots reveal the UI is the weak surface. If the
architecture diagram is hard to draw because the design is unclear, that is a signal to
return to `hackathon-architecture` rather than to write around it.
