# How hackathon projects actually lose

A catalogue for step 4, ranked roughly by how often each one decides a placement. Work
it top down. The first section costs more placements than the rest combined, and almost
none of it is about code quality.

## Tier 1: Losing without being judged

These do not reduce your score. They remove you from consideration, and every one of
them is preventable in under an hour.

| Failure | Why it happens | Check |
|---|---|---|
| **Missed the submission deadline** | The form asks for things nobody prepared | Start the form at T minus 45 |
| **No video, or the video is private** | Recorded late, permissions never checked | Open the link logged out |
| **Demo URL dead, or requires login** | A preview deployment tied to your account | Open it in a private window |
| **Repo private, or the link is wrong** | Never checked from outside | Open it logged out |
| **Track entered with no matching integration** | Ticked hopefully on the form | Every track maps to a real import |
| **Commits outside the event window** | Pre-existing code, against the rules | `git log` against the event dates |
| **Missing a mandatory requirement nobody read** | Rules skimmed once, at the start | The requirements matrix, step 1 |

Every one of these is an UNKNOWN in the matrix that somebody assumed was a PASS. When
reviewing, treat this tier as the first ten minutes of work, always, at any depth.

## Tier 2: The demo

More placements are decided here than by code quality, because it is the only part every
judge experiences.

| Failure | What the judge sees |
|---|---|
| **The demo breaks live** | Twenty seconds of silence, then apology. Nothing recovers this |
| **Cold start** | A blank screen for 8 seconds while you explain. The first impression is a spinner |
| **The aha moment arrives at 2:10** | Judges decided at 0:40 and are now thinking about lunch |
| **Nothing visibly happens** | A dashboard, a form submit, a chart. No moment to remember |
| **Dead air during a wait** | The backend is working and the screen is not saying so |
| **Explaining instead of showing** | Two minutes of context before the product appears |
| **A red console error on the shared screen** | Small, visible, and read as carelessness |
| **No fallback when it fails** | The recording existed and nobody made it |

The test: **can a judge who has watched fifty demos retell yours to another judge?** If
the answer needs a paragraph, the demo has no moment.

## Tier 3: The claim gap

The most damaging finding class, because it converts interest into distrust and the
distrust spreads to true claims.

```text
README says            Code does                       Judge finds out
autonomous             requires a human click          in Q&A, immediately
real time              polls every 5 seconds           by watching the network tab
fully on-chain         critical state in Postgres      by asking one question
AI-powered             one regex and a template        by reading src/
production ready       a prototype with three mocks    by trying it
multi-agent            one loop called twice           by reading the code
"we built X"           X is the SDK's own example      by recognizing their own code
```

The last row is specific and lethal at sponsor-judged tracks. A sponsor engineer knows
their own quickstart, and presenting it as your work is the fastest way to lose their
prize.

Detection: run every strong claim in the README and submission against the code. The
sweep script flags claim keywords with no corresponding signal, but only a read confirms
it.

## Tier 4: Sponsor integration depth

The judge is an engineer from the team that built the SDK, and they can tell in one
question.

| Failure | The tell |
|---|---|
| **Decorative integration** | One call, off the demo path, present to qualify |
| **The SDK is imported but never runs** | It is in `package.json` and nothing calls it |
| **Their quickstart, unchanged** | They wrote it, they recognize it |
| **Five sponsors, all shallow** | Reads as compliance, and dilutes the two that are real |
| **Cannot answer "what surprised you"** | Proof you never went past the quickstart |
| **Wrong network, or unverified contract** | "Deployed" that nobody can check |

The question this tier answers: **remove the sponsor technology. Does the project still
work?** If yes, the integration is Decorative or Integrated, and the track prize is
already lost. Say so plainly in the review rather than scoring it 6 out of 10.

## Tier 5: The product

Where technically strong teams lose, and the hardest tier to fix late.

- **No identifiable user.** "For teams and businesses" means nobody.
- **A problem invented to fit the technology.** Judges recognize this instantly, because
  they have seen the same technology attached to four other invented problems today.
- **The demo does not make anyone feel the problem.** The pain is described, never shown.
- **An existing product does this, better, and nobody addressed why.** The judge is
  thinking about that product now.
- **Impressive engineering aimed at nothing.** Scores 8 on technical, 4 on impact, and
  places below a simpler project that mattered.

If a review surfaces this tier at hour 30, the fix is the pitch and the demo framing, not
the code. Rebuilding loses; reframing sometimes wins.

## Tier 6: Technical credibility

- **The architecture in the README does not exist.** A box in the diagram with no folder.
- **Everything is hardcoded** and the demo path is a fixed script that no input changes.
- **Mocks presented as implementation.** Fixtures are fine and disclosed fixtures are
  professional. Undisclosed ones are the claim gap again.
- **No error handling anywhere.** One malformed input and the judge sees a stack trace.
- **Secrets in the repo.** Instant credibility loss, and at some events a rules violation.
- **An agent with an unbounded signer.** The first thing a sponsor security judge asks.
- **Nothing hard anywhere.** Glue code between three APIs, scored honestly, is a 5.

## Tier 7: Polish and perception

Individually trivial. Collectively they decide close calls, because they are what a judge
uses to infer how much of the rest they can trust.

```text
"Create Next App" in the tab title       a dead link in the README
default favicon                          a screenshot of an older UI
console errors on load                   lorem ipsum or "Test User 1" in seed data
no og image when the URL is pasted       a 404 on a route the judge clicked
placeholder text still in the README     the repo has no description or topics
```

None of these cost a point on any rubric. All of them shift the prior a judge brings to
everything else, and all of them cost minutes to fix. See `fix-triage.md`.

## The interrogation

Questions judges actually ask, in rough order of how often they are asked and how badly
they are answered. Have the answer written before Q&A:

```text
Is that live, or is it mocked?
What is hardcoded right now?
What did you build, versus what did the SDK do?
Why does this need [blockchain / AI / the sponsor tech] at all?
What happens if [the external dependency] goes down?
What is genuinely new here, compared to [obvious existing product]?
Who holds the keys, and what stops the agent overspending?
What happens with a hundred users?
What would you cut if you had one more day?
What surprised you about our SDK?
```

Two notes. **"Is that live"** is asked constantly and the honest answer costs almost
nothing, while a caught evasion costs everything. **"What surprised you about our SDK"**
is the sponsor's real test: a specific answer proves depth in a way no adjective can, and
having no answer proves you never went past the quickstart.

Generate more questions from the specific project. The one the team cannot answer is the
most valuable finding in the review, and it is always findable, because every project has
one.
