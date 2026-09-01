---
name: hackathon-recon
description: The first skill in the workflow. Researches a hackathon and its sponsor technologies from official sources, runs their quickstarts to verify what actually works, and teaches the user what the stack does and where the openings are, before any idea exists. Use when a hackathon is announced, when the sponsor technologies are unfamiliar, when deciding which SDK to build on, or when someone asks what they could build with a technology they have not used. Hands its findings to hackathon-ideation. Read CONFIG.md first.
---

# Hackathon recon

This runs before ideation, and it exists because of a specific failure: teams read a
sponsor's feature list, invent a project that sounds like it uses the technology, and
build a cosmetic integration. The sponsor's own engineer judges it and can tell in one
question. The cause is not laziness. It is that nobody understood the technology well
enough to see what it was actually good for.

The goal is that the user finishes able to say: **I understand what this thing does, why
it exists, what it replaces, and where the openings are.** Ideas come after that, in
`hackathon-ideation`, and they are better ideas for having waited.

**Read `CONFIG.md` before anything else** for what the user already knows and how deep
to go.

## The rule that governs everything

> Nothing goes in the brief that you have not read in the official docs or run on your
> own machine.

This is the highest hallucination risk in the library. You are researching an unfamiliar
SDK and then teaching it authoritatively, and a confidently wrong explanation is worse
than no explanation: the team builds on it for six hours before discovering the API does
not work that way.

Three consequences, all non-negotiable:

- **Never teach from memory.** Sponsor stacks change every event and model memory of an
  SDK goes stale quickly. Fetch the current docs even when you are sure.
- **Never describe API behavior you have not seen documented or executed.** If the docs
  are ambiguous, say they are ambiguous.
- **Keep a "could not verify" list** and put it in the brief. It is more useful than a
  confident guess and it tells the team where to be careful.

Source ranking, the four kinds of claim, version and staleness checks, translating
marketing language into capability, and the stopping condition:
`references/research-method.md`.

## Time budget

Sixty minutes, and it ends with something running rather than with a document.

| # | Phase | Wall clock | Output |
|---|---|---|---|
| 1 | Hackathon facts | 10 min | Confirmed, inferred and unknown, kept separate |
| 2 | Map the stack, pick two or three | 10 min | Which technologies you will actually learn |
| 3 | Learn them, from official sources | 20 min | One card each, in plain language |
| 4 | **Run a quickstart** | 15 min | It authenticates and returns something, or it does not |
| 5 | Saturated versus open | 5 min | What everyone will build, and what nobody will |

Research is genuinely the deliverable here, which makes it the easiest skill in the
library to overrun. The stopping condition is not "I have read everything". It is: **can
I explain what this does, what it replaces, and what it cannot do, without hedging?**

## Step 1 - The hackathon facts

Extract what the user gave you, then fetch the official page rather than trusting the
announcement. Sort every fact into three buckets and never let them blur:

```text
CONFIRMED   stated on the official page or the sponsor's own docs
INFERRED    reasonable, but nobody said it. Marked as such, always
UNKNOWN     you looked and could not find it. This is a finding, not a gap to fill
```

An inferred requirement presented as confirmed is how teams enter tracks they do not
qualify for. When something matters and is unknown, say so plainly and suggest asking
the organizers, which is usually a Discord message and a ten minute wait.

What to extract: name, dates, deadline, tracks, judging criteria and weights, sponsors,
required versus optional technologies, prize table, submission requirements, eligibility
and restrictions, and previous winners if they are findable.

## Step 2 - Map the stack, then pick

List every sponsor technology on the table. Then **pick two or three to actually learn.**

Learning six shallowly is the same as learning none, and it produces exactly the
breadth-without-depth that loses sponsor prizes. Choose by:

```text
Prize per likely entrant     a smaller track is often better expected value
Fit with the team's stack    an SDK in a language nobody knows is a lane, not a feature
Whether it is load-bearing   can a project actually depend on this, or only call it
Whether the docs exist       an undocumented SDK is a 4x time multiplier
```

Say out loud which you are skipping and why. That decision is worth recording, because
it will be questioned at hour twenty when someone notices an unentered track.

## Step 3 - Learn each one

Official sources first, in this order: the developer docs, the API or SDK reference, the
official GitHub (especially the examples directory, which is more honest than the docs),
official changelogs, then official blog posts. Third party material only for context,
and never for a technical claim.

Produce one card per technology. Hard budget, because a wall of text does not get read:

```text
WHAT IT IS          two sentences, plain language, no marketing vocabulary
WHY IT EXISTS       the problem that made someone build this
WHAT IT REPLACES    what you would have had to do without it. THE key section
WHAT YOU CAN DO     three to five concrete developer capabilities
WHAT IT CANNOT DO   limits, quotas, unsupported chains or runtimes, known gaps
WHAT IT COSTS YOU   setup time, approval delays, whether a key is self-serve
```

**"What it replaces" is the section that makes a primitive click**, and it is the one
teams skip. A feature list teaches nothing; a before and after teaches the shape of the
opportunity:

```text
Before   To pay someone from an app you needed a payment processor account, a
         compliance review, a settlement window of days, and a human to approve it.

After    A wallet carries a spending policy, so the payment is a function call your
         code can make inside a loop, settling in seconds.

So       Software can now pay for things as part of doing them, rather than queueing
         a human. That is a different category of application, not a faster one.
```

The framing, mental models, vocabulary handling and plain-language rules:
`references/teaching.md`.

## Step 4 - Run the quickstart

**The step that separates this skill from a summarizer.** Documentation tells you what a
product is supposed to do. Running it tells you what it does.

Fifteen minutes per chosen technology, in a scratch directory:

```bash
mkdir -p /tmp/spike && cd /tmp/spike
# follow the official quickstart exactly, changing nothing
```

Answer four questions and write the answers down:

```text
Can you get a key, right now, without an approval email?
Does the quickstart run unmodified on this machine and this runtime?
What does a real response actually look like?
What broke, and what did the docs not tell you?
```

That last question is the valuable one. It produces the specific detail that later proves
depth to a sponsor judge, and it is the thing no amount of reading produces. Record it in
`assets/spike-log.md`.

Three outcomes, all useful:

| Result | What it means |
|---|---|
| It runs | You now know the response shape, the latency and the real ergonomics |
| It runs after a fight | **Write down the fix.** This is your rung-4 story |
| It does not run | You learned at hour one what most teams learn at hour twelve |

That third row is why this step is mandatory. An SDK that does not authenticate on your
machine is not available to you, whatever the sponsor page says, and finding out now
costs fifteen minutes instead of the project.

This spike is the same activity as `hackathon-architecture`'s hour-one risk spike. Do it
once, here, and carry the result forward.

## Step 5 - Saturated versus open

Before any ideas exist, establish what everyone else will build. Search the sponsor's own
showcase, previous hackathon submissions, their example gallery and their most-starred
community repos.

```text
SATURATED    three teams will build this. The example app in their docs is here
COMMON       done often, still viable with a strong angle
OPEN         the capability exists and nothing obvious uses it
```

The saturated list is the single most valuable artifact this skill hands to ideation,
because it sets the novelty floor before anyone falls in love with an idea. A team that
learns at hour thirty that their project is the sponsor's own tutorial has lost the
weekend.

Then look for the interesting edge: recently shipped primitives, underdocumented
capabilities, two technologies nobody has combined, and anything that reads as
infrastructure rather than as a feature. `references/opportunity-surface.md` covers how
to spot these without sliding into ideation.

## Do not generate ideas here

The user will push for ideas. The whole value of this skill is not doing that yet:
ideas formed before understanding are formed from feature lists, which is how cosmetic
integrations happen.

When a spark appears, and it will, **park it**:

```text
IDEA PARKING (unevaluated, for hackathon-ideation)
  - agent that settles its own invoices
  - proof of reserves without revealing balances
```

One line each, no development, no evaluation. Hand the list to ideation, where they get
scored properly. Telling the user "that is a good one, I am writing it down for the next
step" satisfies the impulse without abandoning the sequence.

## What you could not verify

Every brief ends with this section, and an empty one is a warning sign rather than a
success:

```text
COULD NOT VERIFY
  Rate limits on the free tier    not documented; support ticket open
  Whether X supports Solana       docs say "multi-chain", no list given
  Whether the track needs mainnet  rules ambiguous. ASK THE ORGANIZERS
```

Naming your uncertainty is more useful than covering it, and the third row is the kind
that decides eligibility. Anything marked ASK gets asked in the event Discord before
ideation starts, because the answer changes what is worth building.

## What not to research

- **The whole API reference.** You need the shape, not the surface. Read it when you build.
- **Technologies not on the table.** Interesting is not the same as relevant.
- **The sponsor's funding, history, or team.** It changes nothing you will build.
- **Third-party tutorials**, when official docs exist. They are often a version behind.
- **Anything after the stopping condition.** When you can explain it, stop and go build.

## The brief

Short. Fill `assets/brief.md`, which is roughly two pages, front-loaded so the parts that
change decisions come first. Nobody reads a fifteen section document at hour one.

Then check yourself before handing it over. These are questions for **you**, not an exam
for the user:

```text
Can I explain what this does in two sentences, without marketing words?
Can I say what it replaces, concretely?
Can I name three things it cannot do?
Did I run it, or am I repeating the docs?
Do I know which parts I could not verify?
```

Any "no" means more research on that specific point, not more research generally.

## Handoff

Fill in `hackathon-ideation`'s CONFIG directly. This is the point of the whole exercise,
and it saves ideation its own research phase:

| Recon output | Fills |
|---|---|
| Sponsor list, technologies, prize amounts | `sponsors[]` |
| Each technology's superpower, from the card | Step 2 opportunity areas |
| The saturated list | `strategy.avoid` and `novelty_floor` |
| Field size and format | `hackathon.*` |
| Spike results | `team.new_tech_ok`, and the feasibility multipliers |
| Idea parking list | Raw ideas, in step 3 |

Then run `hackathon-ideation`. The spike from step 4 also carries into
`hackathon-architecture` as its hour-one risk spike, already done.
