# Sponsor sections

The reader of this section is an engineer from the team that built the SDK, scanning
your README for their own product name, deciding whether to shortlist you for a prize
that has far fewer entrants than the grand prize. They have one question, and it is
not whether you used their technology.

> Did these people understand what we built, or did they call one endpoint to qualify?

Everything here answers that question.

## Placement

A sponsor judge does not read top to bottom. They search the page for their name. So:

1. The sponsor line goes **above the fold** ("Built at X with A and B").
2. The **integration table** goes immediately after "What we built", not at position
   nine.
3. Deep paragraphs follow the table, or move to `docs/integrations.md` when there are
   three or more sponsors.

If `style.audience: sponsors` is set in CONFIG, the table moves above the problem
section. That is correct when the submission is aimed primarily at track prizes.

## The table

```markdown
| Technology | Role in the system | Where |
|---|---|---|
| Circle Wallets | Settlement layer. Every completed task pays out through it | `src/lib/pay.ts` |
| OKX DEX API | Price discovery at plan time, before the agent commits | `src/lib/quote.ts` |
```

Three columns, and the third is what makes it evidence rather than assertion. A file
path is checkable in one click, and offering it says you expect it to be checked. A
table without paths is a list of logos.

Populate `Where` from the code, never from memory:

```bash
grep -rn "from ['\"]@circle\|from ['\"]@okx" src/ --include=*.ts | head
```

If that command returns nothing for a sponsor in your table, that row is a
fabrication. Remove it. This is the single most damaging error available in a
hackathon README, because the person best positioned to catch it is the person
scoring it.

## The paragraph

One per sponsor, four sentences, in this order:

```text
1. What the technology provides, in their terms, showing you read past the quickstart
2. What your system uses it for, structurally
3. What would be harder or impossible without it
4. Where it lives in the code
```

Worked example:

```markdown
### Circle Programmable Wallets

Circle's programmable wallets let a wallet carry a spending policy rather than a
raw key, so authorization lives in the wallet instead of in the caller. We use them
as the settlement layer: the agent holds a policy-bound wallet with a per-task cap,
so completing a task and paying for it are one action inside the agent loop.
Without this the agent would have to queue an approval and wait for a human, which
removes the autonomy the project is about, or hold a bare private key, which we
were not willing to demo. The integration is in `src/lib/pay.ts`, and the policy is
set at `src/lib/pay.ts:34`.
```

Sentence three is the one teams omit and the one that carries the section. "What
breaks without it" is exactly the Essential / Valuable / Cosmetic test from
`hackathon-ideation`, written as prose, and a sponsor engineer reads it as the answer
to their real question.

## The depth ladder

Match your writing to the rung you are actually on. Claiming a higher rung than the
code supports is the failure this whole file exists to prevent.

| Rung | What you did | How to write it |
|---|---|---|
| 1. Call | One API call, off the critical path | Do not write a paragraph. One table row, honestly |
| 2. Feature | A real feature depends on it | Plain description. No architectural vocabulary |
| 3. Load bearing | Remove it and the demo stops | The full four sentence paragraph. Use the structural phrasing |
| 4. Beyond spec | You used it in a way the docs did not cover, or hit a real edge | The paragraph, plus the story below |

Rung 4 is worth disproportionately more than the others and is more achievable than it
sounds. It means you read past the quickstart, found something the documentation did
not answer, and solved it. Sponsors remember that team, because that team wrote them a
case study for free.

```markdown
**A note on rate limits.** Their streaming endpoint closes idle connections at 30
seconds, which is shorter than our agent's planning step. We keep the connection
warm with a heartbeat frame and buffer steps until the first tool call. This is not
in the docs; we found it at 3am and it is in `src/lib/stream.ts:52`.
```

That paragraph does more for a track prize than three additional shallow
integrations. It proves depth in a way no adjective can, it is impossible to fake,
and it gives the sponsor engineer something concrete to bring back to their team.

**The test for rung 4:** can you name a specific thing about the SDK that surprised
you? If not, you are on rung 2 or 3, and writing as though you are higher is the risk.

## Deep integration, when it applies

When several sponsor products form one lifecycle, show the lifecycle and map each
stage. This is the strongest available answer to "did you just bolt one API onto an
unrelated app":

```markdown
User intent      →  parsed by the agent            (src/lib/agent.ts)
Tool discovery   →  Sponsor A's registry           (src/lib/tools.ts)
Execution        →  our orchestrator                (src/lib/run.ts)
Authorization    →  Sponsor B's policy wallet       (src/lib/pay.ts)
Settlement       →  USDC on testnet                 (0xabc..., verified)
Verification     →  explorer receipt in the UI      (src/app/run/[id])
```

Every row has a file or an address. Rows that do not are aspiration, and aspiration in
a lifecycle diagram is the kind of error a judge asks about in Q&A.

## Do not

- **List a sponsor you did not integrate.** Not even in "Built With". A logo with no
  code behind it is a claim, and it is the claim most likely to be checked.
- **Force a fifth integration.** Two described precisely beat five listed. Past three,
  each additional logo reads as compliance rather than depth, and it dilutes the two
  that are real.
- **Use structural vocabulary on a rung 1 integration.** "Core execution layer" over a
  single API call is the specific thing that makes a sponsor engineer go looking.
- **Copy the sponsor's marketing language.** They wrote it, they recognize it, and it
  demonstrates nothing about your understanding.
- **Bury the integration in prose.** They are scanning. Table first, paragraphs after.

## Before submitting

```text
[ ] Every sponsor in the table has a real import at the path listed
[ ] Every claimed rung matches what the code does
[ ] The one sponsor you integrated most deeply has a beyond-spec detail written
[ ] No sponsor named in the submission form is missing from the README, and none is
    in the README but absent from the code
[ ] Track selections on the submission form match the sponsors documented here
```

That last pair is worth checking twice. Judges cross reference the submission page
against the repo, and a mismatch between the tracks you entered and the integrations
you documented is read as either carelessness or an attempt to enter tracks you did
not build for.
