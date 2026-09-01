# Sponsor strategy

Sponsors are not decoration on a hackathon. They pay for it, they staff the judging
table, and they hand out most of the prizes by count. Reading the sponsor stack
correctly is the single most underrated ideation move.

## The prize math

The grand prize attracts every team. A sponsor track attracts the teams that used that
sponsor — often a small fraction of the field.

```text
Grand prize    $10,000   /  180 projects   ≈  $56 per project entered
Sponsor track   $2,500   /   14 projects   ≈  $179 per project entered
```

Those numbers are illustrative, but the ratio is not unusual, and it points the same
way at almost every event: **expected value is usually higher on sponsor tracks.**

Better still, tracks stack. One project can win a sponsor track, a category track and
place overall — from a single submission, with a single demo. Aim for the idea that is
credibly the *best* entry in two tracks, not the twentieth-best in five.

## How many sponsors to integrate

**Two.** Occasionally three, when the third is genuinely load-bearing.

Each integration past the second costs build hours and buys a diminishing chance at a
smaller prize. Worse, a judge reading five sponsor logos on your slide correctly infers
that at least three are shallow, and that inference contaminates the two that are real.

The exception: an event that explicitly rewards breadth ("use 3+ sponsor
technologies"). Read the rules; when breadth is scored, integrate for breadth and say
so plainly.

## The integration depth ladder

Sponsor judges — usually engineers from the team that built the thing — are ranking
depth, and they can tell which rung you are on in about one question.

| Rung | What it looks like | Sponsor prize odds |
|---|---|---|
| 0 — Logo | Named in the README | None |
| 1 — Call | One API call on a path the demo barely touches | Near zero |
| 2 — Feature | A real feature depends on it, and works | Occasionally |
| 3 — Load-bearing | Remove it and the demo stops. It is in the aha moment | Strong |
| 4 — Beyond spec | You used it for something the sponsor did not anticipate, or hit a real edge of it | Usually wins |

Rung 4 is more achievable than it sounds and is where the disproportionate returns
are. It means: you read past the quickstart, you hit something the docs did not cover,
and you can tell that story. Sponsors remember the team that found the edge of their
product — that team wrote them a case study for free.

**The tell for rung 4:** you can name a specific thing about the SDK that surprised
you. If you cannot, you are on rung 2 and you should assume the judge will find out.

## Reading a sponsor stack

For each sponsor, answer two questions before generating any ideas:

```text
What is this technology uniquely good at?      (its superpower)
What does this sponsor want to see built?      (their agenda)
```

The superpower governs which problems it should be pointed at. Rough map:

| Category | Superpower | Points at |
|---|---|---|
| Payment / stablecoin rails | Instant global settlement, programmable money | Anything where waiting for money is the problem |
| Agent frameworks | Autonomous multi-step execution | Workflows a human currently babysits |
| Blockchains / L2s | Verifiability, ownership, shared state without a trusted party | Coordination between parties who cannot trust each other |
| ZK / proving | Proving a fact while hiding the data | Compliance, identity, private eligibility |
| Vector / search infra | Semantic retrieval at scale | Any pile of unstructured text |
| Realtime infra | Sub-second sync between many clients | Collaboration, live multiplayer, live control |
| DePIN / device networks | Physical world data with no central operator | Sensing, coverage, real-world verification |
| Auth / identity | Portable identity, delegated permission | Agents acting on a human's behalf |
| Observability / eval | Making model behaviour measurable | Anything where "is it actually good?" is the hard part |

The **agenda** is different from the superpower, and easier to find than teams
expect. Sponsors publish what they want: last year's winners, their DevRel team's
recent posts, the examples they chose for the quickstart, the phrase they repeat in
the kickoff talk. If they say "agentic payments" four times in the opening, the track
is going to a project about agentic payments.

## Combining sponsors

The pair that wins is usually **one infrastructure primitive plus one intelligence
primitive** — something that can decide, joined to something that can settle,
verify, sync or persist. The intelligence half makes the demo watchable; the
infrastructure half makes it a real system rather than a prompt.

Test any pair against one question:

> Does technology A make technology B *do something new*, or are they just both here?

If they operate on separate screens, you have two integrations and no combination. If
one calls the other in the aha moment, you have the combination — and that is what
gets retold.

## Before you build against a sponsor SDK

Fifteen minutes of due diligence, in hour one, before the idea is locked:

```text
[ ] Does it work on your platform and language? Check, do not assume
[ ] Is there a testnet / sandbox / free tier, and how do you get a key
[ ] How long does approval take? (some keys take days — that kills ideas)
[ ] Rate limits on the free tier, vs. how often your demo calls it
[ ] Is the quickstart current? Run it. Right now. Before committing
[ ] Is there a sponsor engineer at the event or in the Discord? Find them early
```

That last one is worth more than it looks. Sponsor engineers unblock you in minutes on
things that would cost you three hours, and they remember the team that asked a good
question at hour two. They are frequently the person scoring you at hour thirty-six.

**Run the quickstart before the idea is locked.** An SDK that does not authenticate on
your laptop is not available to you, whatever the sponsor page says, and finding that
out at hour twelve has ended more hackathons than any other single cause.
