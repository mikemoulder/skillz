# The opportunity surface

Mapping where the openings are, without choosing one. The distinction matters: this
skill produces a landscape, and `hackathon-ideation` picks a point on it. Sliding into
ideation here means picking before you have finished looking.

## Saturated, common, open

Before anyone has an idea, establish what everyone else will build. Search the sponsor's
own showcase, previous submissions to this event, their example gallery, and their
most-starred community repos.

```text
SATURATED    three teams will build this. It is the example app in their docs
COMMON       done often, still viable with a genuinely different angle
OPEN         the capability exists and nothing obvious uses it
```

**The saturated list is the most valuable thing this skill hands forward.** It sets the
novelty floor in `hackathon-ideation` before anyone falls in love with something, and it
prevents the specific disaster of a team discovering at hour thirty that their project is
the sponsor's own tutorial with a different color scheme.

Write it as a list of one-liners:

```text
SATURATED
  Portfolio dashboard reading balances across chains
  Chatbot that answers questions about the docs
  A "swap aggregator" that wraps their aggregator
  Anything that is their quickstart with a UI on top
```

Be blunt. This list is only useful if it names things people are actually going to build.

## Where the openings are

Six places worth checking, roughly in order of how often they produce something:

**Recently shipped primitives.** Check the changelog for the last two or three releases.
Anything shipped in the last few months has no ecosystem around it yet, which means no
saturation and a sponsor who is actively looking for someone to use it. This is the
single highest yield check in this file, and it takes two minutes.

**The undocumented-but-present capability.** Something in the SDK reference or the
examples directory that the docs barely mention. Its existence means someone built it for
a reason.

**The unusual pair.** Two available technologies nobody has combined. Look for one
infrastructure primitive (settlement, verification, storage, sync) and one intelligence
primitive (a model, an agent, a decision). The pair usually reads as obvious in hindsight,
which is exactly the reaction that wins.

**The capability that removes a former limit.** Find what used to be impossible. If a
constraint disappeared recently, the applications that constraint blocked are now
buildable and mostly unbuilt.

**Composability nobody exercised.** Products from the same sponsor that are documented
separately and never together. Their own team often has not tried the combination, which
makes it a story they will want.

**What is boring to them and interesting to you.** Infrastructure companies undersell
their own most useful primitives, because internally the primitive is plumbing. Read
past the headline feature to what it is built on.

## The question

> What can this technology do that most participants will not think about?

Then, immediately after, the discipline question:

> Is that because it is a good idea, or because it does not work?

The second saves you from the trap this file otherwise creates. Underexplored areas are
sometimes underexplored because someone tried and hit a wall. When an opening looks too
good, spend ten minutes finding out whether anyone attempted it, and check whether the
capability actually works in the spike.

## Record it as capability, not as project

This is the line between recon and ideation. Write what becomes possible, not what to
build:

```text
Good (a capability):
  Payments can happen inside an agent loop without a human approval step, because
  the spending policy is enforced by the wallet rather than by the caller.

Too far (a project):
  An AI procurement agent for mid-size school districts that negotiates with
  vendors and settles invoices automatically.
```

The first is a fact about the technology and it enables ten projects. The second is one
project, chosen before the landscape was finished, and writing it down here makes every
subsequent option feel like a worse version of it.

Park the second in the idea list, one line, unevaluated. `hackathon-ideation` will
generate a dozen of those against the gates and score them properly.

## What to hand forward

```text
SATURATED           → ideation's strategy.avoid, and the novelty floor
CAPABILITIES        → ideation's step 2 opportunity areas
THE UNUSUAL PAIRS   → ideation's step 3, the highest-yield move there
SPIKE RESULTS       → feasibility multipliers, and team.new_tech_ok
IDEA PARKING        → raw ideas, unevaluated
```

Every row is a CONFIG value or a workflow step in the next skill. If a finding here does
not map to one of those rows, ask whether it needed researching.
