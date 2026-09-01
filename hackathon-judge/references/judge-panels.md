# The four panels

Eight judges is mostly overlap. Four lenses genuinely disagree with each other, and the
disagreement is the useful output. Hostility is a mode applied to all four, not a fifth
judge sitting separately.

Each lens returns four things and nothing else:

```text
Score with confidence
Two sentences of evidence, citing a file, a URL or an observation
The single biggest concern
The one question the team cannot answer
```

Score independently before consolidating. A lens that has already seen the others'
scores converges on them, which destroys the only signal this panel produces.

## Product

> Would anyone care about this, and does the demo make me feel it?

Looks for:

- A **specific** user. "Teams and businesses" is nobody. "A procurement officer at a
  mid-size school district" is somebody.
- Whether the problem exists outside this hackathon, or was reverse engineered from the
  sponsor stack.
- Whether the demo makes the pain visible before showing the fix. Described pain does not
  land; shown pain does.
- What happens to this project on Monday. Not as a business question, as a reality check
  on whether anyone would open it twice.
- Whether an existing product already does this, and whether the team knows.

Hostile questions:

```text
Who specifically has this problem, and how do you know?
What do they do today instead? Why is that actually bad?
Why would they switch, given switching costs anything?
[Existing product] does this. What is different here?
If I removed the technology story, is there a product left?
```

The characteristic failure: a technically strong project with no identifiable user, which
scores 8 on Technical and 4 here, and loses to something simpler that mattered.

## Technical

> Was anything here actually hard, and does the architecture exist as described?

Security and reliability fold in here rather than living as a separate judge, because in
practice they are the same question asked about failure rather than success.

Looks for:

- **The hard part.** Name it. If the project is glue code between three APIs, that is a 5,
  scored honestly, however much work it took.
- Whether the README's architecture matches the repo. Every box should be a folder or a
  URL. A box that is neither is a finding.
- What is real versus mocked, and whether the mocking is disclosed.
- Error handling on the demo path. One malformed input should not produce a stack trace.
- Secrets: in the repo, in history, in the client bundle.
- For agents: is there a bounded loop, a tool allowlist, a cap on anything irreversible.
  An unbounded signer is a serious finding regardless of how well it works.
- What breaks under a second user, a refresh mid-flow, a rejected transaction.

Hostile questions:

```text
What was the hardest thing here, and why was it hard?
Which parts are mocked? Show me where the fixture is.
What happens if I refresh in the middle of a run?
What stops the agent doing something you did not intend?
Where do secrets live? Show me .env.example and the bundle.
This diagram box: which folder is it?
```

Scoring anchor: **glue code is a 5.** One genuinely hard component, working, is a 7. A
hard component plus correct failure handling is an 8.

## Sponsor

> Did they use our technology, or attach it to a project that could exist without us?

This lens decides track prizes, which are frequently the best expected value on the board.
The real judge is an engineer from the team that built the SDK.

The classification, which goes in the verdict verbatim:

| Rung | Test |
|---|---|
| **Decorative** | Remove it and nothing changes. Present to qualify |
| **Integrated** | A real feature depends on it |
| **Core** | Remove it and the project stops working |
| **Transformative** | Used in a way the sponsor did not anticipate, or past a real edge |

Verify rather than accept:

```bash
grep -rn "from ['\"]@sponsor" src/ --include=*.ts   # is it imported at all
grep -rn "sponsorClient\." src/ | wc -l              # is it called more than once
```

An SDK in `package.json` that nothing imports is Decorative, whatever the README says.
That check takes ten seconds and it is the highest-yield ten seconds in this review.

Hostile questions:

```text
Remove our SDK. What breaks?
Is this our quickstart with the values changed?
What surprised you about our API?
Which primitive are you using, and why that one over the alternative?
You entered three of our tracks. Show me the code for the third.
```

**"What surprised you"** is the tell. A specific answer (a rate limit, an undocumented
timeout, a response shape that changed) proves depth in a way nothing else does. No
answer means rung 2 at best, and the review should say so.

## Demo

> Alongside fifty others, would I remember this?

Scored on the artifact that exists: the deployed app, the recording, or the rehearsal.
If none exists yet, that is the finding, and the score is UNKNOWN rather than generous.

Looks for:

- **The first 30 seconds.** What is on screen at 0:10? A judge decides here.
- Whether the aha moment lands before 0:45. Late aha is the most common demo failure.
- Whether anything visibly *happens*, or the demo is a tour of screens.
- Dead air: cold starts, spinners, silent waits while a backend works.
- Recoverability: is there a recording, and has anyone rehearsed cutting to it?
- Whether it survives a judge typing something the team never tried.

Hostile questions:

```text
What is on screen at 0:10?
When does the interesting thing happen? Time it, do not estimate.
What is your plan when the network dies mid-demo?
What happens if I type an empty string? 500 characters? An emoji?
How long is the wait between the click and the result? Measure it.
```

Scoring anchor: **no recording is a ceiling of 5**, regardless of how good the live demo
is, because the risk is unmanaged and it is a twenty minute fix.

## Consolidating

Report the spread, not just the average. Variance carries the information:

```text
Product     6.5      Technical 8.0 vs Product 6.5
Technical   8.0      A strong build aimed at a problem nobody has articulated.
Sponsor     4.0      The fix is the framing and the demo, not the code.
Demo        5.5
           ----
            6.0
```

Three patterns worth naming explicitly when they appear:

| Pattern | Reading | Fix |
|---|---|---|
| Technical high, Product low | Built well, aimed badly | Reframe the pitch. Do not rebuild |
| Product high, Technical low | Good idea, thin build | Make one hard thing real and visible |
| Everything decent, Demo low | The most recoverable position there is | Demo work, and it is cheap |
| Sponsor low, rest high | The track prize is already lost | Deepen one integration or drop the track |

Never average disagreement away. A 6.0 consensus hiding a 4 and an 8 is a different
project from a 6.0 that is four 6s, and it needs a different response.
