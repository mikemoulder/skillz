# Technical decisions

<!--
  Three to five decisions that were genuinely hard. Not a design document.

  This exists because the reasoning behind a decision is invisible in code by
  construction: nobody can see the option you rejected. It is what makes engineering
  maturity legible to a technical judge, and it is the artifact most teams skip.

  Documenting an easy decision at this length reads as padding. If you cannot name a
  real alternative you considered and rejected, it was not a decision, it was a default.
-->

## [Decision, stated as what you did]

**Context.** [The constraint that forced a choice. One or two sentences. A real number
belongs here if you have one: a timeout, a rate limit, a deadline.]

**Alternatives.** [What else you considered, and the specific reason each was rejected.
This section is the point of the document. "We considered X but it needed Y" is worth
more than the paragraph above it.]

**Chosen.** [What you did, concretely enough that a reader can find it in the code.]

**Tradeoff.** [What this costs. Every real decision costs something, and naming it is
what separates a decision from a rationalization.]

<!-- Worked example, delete before submitting:

## Job rows instead of long-running functions

**Context.** The agent loop runs 30 to 90 seconds. Our host caps serverless functions
well below that, so a request handler cannot hold the work.

**Alternatives.** A longer function on a paid tier: still capped, and the cap is not
under our control. A separate always-on worker service: a second deploy and a second
thing that can be down during judging.

**Chosen.** A `jobs` table with a status column, polled by a worker in the same process.
The API returns immediately; the client streams step rows as they are written.
See `src/lib/jobs.ts:18`.

**Tradeoff.** More state to manage and a 2 second floor on update latency. In exchange
the work is observable in SQL, it survives a restart, and there is still only one deploy.

-->

## [Decision 2]

**Context.**

**Alternatives.**

**Chosen.**

**Tradeoff.**

## [Decision 3]

**Context.**

**Alternatives.**

**Chosen.**

**Tradeoff.**
