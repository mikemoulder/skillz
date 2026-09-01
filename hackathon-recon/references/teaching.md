# Teaching the stack

The output is understanding, not coverage. A user who can explain one primitive well
will build something better than a user who has skimmed six.

Behave like someone who has used the technology explaining it to a competent colleague
who has not. Not a documentation scraper, and not a salesperson.

## Before and after

The frame that makes a primitive click, and the one most explanations skip. A feature
list teaches nothing because it has no reference point; a before and after teaches the
shape of the opportunity.

```text
BEFORE   What you had to do without this. Be concrete: the accounts, the waiting,
         the human in the loop, the infrastructure you had to run.

AFTER    What you do now. Concrete again: the call you make, what comes back.

SO       What class of thing becomes buildable. Not "it is faster", but "this is a
         different kind of application".
```

Worked:

```text
BEFORE   To pay someone from an application you needed a processor account, a
         compliance review, a settlement window measured in days, and a human to
         approve each payout.

AFTER    A wallet carries a spending policy, so a payment is a function call your
         code makes, settling in seconds within limits you set in advance.

SO       Software can pay for things as part of doing them, instead of queueing a
         human. An agent can complete a task and settle it in the same loop. That
         is a category that did not exist, not an existing thing made faster.
```

The SO line is where hackathon ideas come from later. Do not write the ideas here; write
the line that makes them obvious in the next skill.

## Mental models

When a product is genuinely complicated, draw the flow. The model must reflect the real
architecture, not a simplified story that will mislead later.

```text
Traditional                    With the primitive

your app                       your app
  ↓                              ↓
your ledger                    the primitive
  ↓                              ↓
processor account              settlement network
  ↓                              ↓
compliance queue               done
  ↓
days
```

Two rules: **at most seven boxes**, and every box is a real thing with a name. A model
with a box labeled "magic" is a model you do not understand well enough to teach yet.

## Vocabulary

Explain only the terms needed to build. Not the glossary.

For each one, three lines:

```text
Term          the word they will hit in the docs
Means         plain language, one sentence
Matters       why it shows up in a decision they will make
```

```text
Term    Attestation
Means   A signed statement from the network that something happened, which anyone
        can check without trusting you.
Matters It is what lets the receiving side accept a transfer without waiting for
        your server to confirm it. It is why the flow has no callback.
```

Six to ten terms is usually right. Past that you are transcribing a glossary, and the
user stops reading exactly when the useful ones would have appeared.

## Plain language

Technical accuracy stays intact. The vocabulary gets simpler.

```text
Weak:  It provides an intent-driven programmable settlement abstraction over a
       generalized transaction execution layer.

Good:  You describe the payment you want. The infrastructure works out how to make
       it happen and settles it. Your code never touches a chain directly.
```

The second is not less precise. It is precise about different things: what you do, and
what happens. The first is precise about vocabulary, which is only useful to someone who
already knows the answer.

The test is the same one the frontend skill applies to UI copy: **read it out loud.** If
you would not say the sentence to a colleague, rewrite it.

Also: **no em dashes** in the brief or in any generated documentation. Use a comma, a
colon, a period or parentheses. It reads as machine written, which is the wrong
impression for a document whose whole job is demonstrating understanding.

## Budgets

| Section | Budget |
|---|---|
| What it is | 2 sentences |
| Why it exists | 2 sentences |
| What it replaces | The before/after/so block |
| What you can do | 3 to 5 bullets, one line each |
| What it cannot do | 3 to 5 bullets. Do not skip this one |
| What it costs you | Setup time, key availability, quotas |

The "cannot do" section is the one that gets cut and the one that saves the most time.
Limits, unsupported runtimes, quota ceilings and approval delays are what kill a plan at
hour twelve, and every one of them is findable at hour one.

## Calibrate to the user

Read `user.knows` from CONFIG before writing a word.

- **A technology they already use** gets one line confirming the version and anything
  that changed. Explaining Postgres to someone who ships Postgres wastes the hour.
- **An adjacent technology** gets the delta: how this differs from the thing they know.
  "It is like Stripe, except the authorization lives in the wallet" is worth three
  paragraphs of first-principles explanation.
- **A genuinely new category** gets the full card, plus a mental model.

When you do not know their background, ask once, briefly, rather than guessing. It is one
question and it changes the whole brief.

## What not to do

- **Do not copy documentation.** They can read it. Your value is compression and judgment.
- **Do not explain everything.** Relevance is decided by what they will build.
- **Do not teach the marketing frame.** Translate it first. See `research-method.md`.
- **Do not hedge everything.** "May possibly support" is not caution, it is unusable.
  Verify it, or mark it unverified and move on.
- **Do not slide into ideation.** When an idea appears, park it in one line and continue.
  Ideas formed from a feature list are exactly what this skill exists to prevent.
