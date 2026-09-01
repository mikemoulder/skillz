# Surfacing moves

A catalogue of ways to make real work findable, ordered by value per minute. Everything
in the first three sections is additive and safe at any hour.

The precondition for all of it: **the work has to actually be there.** These moves make
existing quality legible. Applied to weak work they produce documentation of weak work,
which draws attention to it. If step 1's inventory found nothing impressive, say so
rather than decorating.

## Evidence comments

The highest value per minute, and the easiest to do badly.

A comment earns its place when it explains something the code cannot: a constraint, a
rejected alternative, a protocol behavior, a reason. It fails when it narrates.

```ts
// bad: narrates what the reader can already see
// call the payment API
await pay(amount);

// good: explains why this exists at all
// Settlement goes through the sponsor's payment primitive rather than an internal
// ledger so the transfer stays externally verifiable. That is what lets the agent
// settle inside its own loop instead of queueing a human approval. The cap that
// bounds it is enforced in code at line 61, not in the prompt.
await settlement.pay(amount);
```

Where to put them, in priority order:

1. **The sponsor call site.** This is what a track judge is looking for.
2. **The hardest function.** Whatever the inventory named as the technical high point.
3. **A surprising decision.** Anywhere a reader would ask "why did they do it that way".
4. **A security or authorization boundary.** Especially anything bounding an agent.
5. **A deliberate constraint.** The timeout, the cap, the retry limit and why those values.

Rules:

- **Ten well placed beat a hundred.** Density destroys the signal; a reader skimming a
  wall of comments stops reading them, including the good ones.
- **Only what is true.** A comment asserting a property the code lacks is worse than
  silence, because it is a claim a judge can falsify in one read.
- **Never comment code you have not read.** Explaining unread code produces confident
  falsehoods at a rate that will embarrass the team in Q&A.
- **No adjectives.** "Sophisticated", "advanced", "novel", "robust" all read as insecurity.
  State the constraint and let the reader draw the conclusion.

## Tests as evidence

One test that demonstrates the hardest behavior does three jobs at once: it proves the
behavior is real, it survives a judge running it, and it answers "is that actually
working?" without anyone having to trust you.

```ts
// worth writing at hour 30
test("settles a completed task without human approval", async () => { ... });
test("refuses a payout above the configured cap", async () => { ... });

// not worth writing at hour 30
test("renders the button", () => { ... });
```

Name the test for the **claim it proves**, not the function it calls. `settles without
human approval` is evidence; `settlement.test.ts > pay > works` is not. A reviewer
reading test names alone should learn what the system does.

Two or three tests is the right number here. This is evidence, not a coverage exercise,
and nobody scores coverage at a hackathon.

## Documentation that carries evidence

| Artifact | What it proves | Cost |
|---|---|---|
| `docs/evaluation-map.md` | Where every claim lives | 15 min |
| `docs/technical-decisions.md` | That the architecture was reasoned, not stumbled into | 20 min |
| A README line linking a claim to a file | That the claim is checkable | 1 min each |
| An architecture diagram matching the repo | That the design is real | 15 min |

`technical-decisions.md` is the one teams skip and the one that most changes how a
technical judge reads the project, because the reasoning behind a decision is invisible
in code by construction. Nobody can see the option you rejected.

```markdown
## Job rows instead of long-running functions

**Context.** The agent loop runs 30 to 90 seconds. Our host caps functions well below
that, so a request handler cannot hold the work.

**Alternatives.** A longer function on a paid tier (still capped, and the cap is not
under our control). A separate always-on worker service (a second deploy, and a second
thing that can be down during judging).

**Chosen.** A `jobs` table with a status column, polled by a worker in the same process.
The API returns immediately and the client streams step rows as they are written.

**Tradeoff.** Slightly more state to manage, and a 2 second polling floor on updates. In
exchange the work is observable in SQL, it survives a restart, and there is still only
one deploy.
```

Three to five of these, for decisions that were genuinely hard. Documenting an easy
decision at this length reads as padding.

## Naming, when the clock allows

Mutative. Gated on the clock and a green build. See `safe-refactor.md` for the mechanics
before doing any of it.

| Vague | Reveals intent |
|---|---|
| `Manager`, `Helper`, `Utils`, `Service` | `SettlementService`, `AgentExecutionPipeline` |
| `run()`, `process()`, `handle()` | `executeTaskPlan()`, `settleCompletedTask()` |
| `data`, `result`, `obj` (exported) | `taskPlan`, `settlementReceipt` |
| `lib/misc.ts` | `payments/settlement.ts` |

The test for whether a rename is worth its risk: **would a reviewer skimming this file
list know where the interesting code is?** If yes already, leave it. Rename to remove
confusion, never to sound impressive. `AutonomousSettlementOrchestrationEngine` on a
120 line file is worse than `settlement.ts`, because now the name is making a claim the
file cannot support.

## Module boundaries

The most useful structural signal a repo gives, and the cheapest to read:

```text
src/lib/           everything, 14 files          reveals nothing
src/agents/        the loop
src/payments/      the sponsor integration        reveals the architecture
src/settlement/    the on-chain path
```

Directory names are the first thing anyone reads and they carry the architecture for
free. But moving files is mutative and touches every import, so **the README can point
at the interesting files instead**, at zero risk, and captures most of the benefit. Under
12 hours, do that rather than restructuring.

## What not to surface

- **Work that is not impressive.** Documenting it draws attention to it. Leave it quiet.
- **Abandoned experiments.** Delete them or leave them; never explain them.
- **Anything you would have to overstate.** If the honest description is unimpressive, the
  problem is upstream of this skill.
- **Complexity that was accidental.** A comment explaining why something is convoluted
  tells the reader it is convoluted. Either simplify it, if the clock allows, or say
  nothing.
