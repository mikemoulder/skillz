# Research method

You are learning an unfamiliar technology quickly and then explaining it to someone who
will build on your explanation for the next two days. A confident error here does not
get caught in review; it gets caught at hour twelve when the API does not behave the way
you said.

Everything below exists to keep that from happening.

## Never from memory

Model memory of an SDK is stale in ways that are invisible from the inside. Package
names change, auth flows change, endpoints get deprecated, free tiers get quotas, and
the version you remember may predate the one the hackathon requires.

**Fetch the current documentation even when you are confident.** Especially then: high
confidence about a specific API signature is exactly the state that produces a
plausible, wrong, unhedged sentence.

The same applies to version numbers, pricing, rate limits and chain support. All of them
change and all of them get asserted from memory.

## Source order

| Rank | Source | Trust |
|---|---|---|
| 1 | Official developer docs | High, but check the version selector |
| 2 | Official SDK reference | High for signatures |
| 3 | **Official GitHub examples** | Highest for what actually works |
| 4 | Official changelog or releases | High, and it tells you what is new |
| 5 | Official blog | Medium. Announcements outrun implementation |
| 6 | Community posts, tutorials | Context only. Never a technical claim |
| 7 | Your own memory | Not a source |

Row 3 deserves the emphasis. **The examples directory is more honest than the docs**,
because it has to compile. Docs describe the intended API; examples show the one that
shipped, including the awkward parts nobody wrote prose about.

Row 5 matters at hackathons specifically. Sponsors announce capabilities at the event
that are in preview, partially shipped, or gated behind a form. An announcement is not
an available feature until you have called it.

## Four kinds of claim

Label internally, and label in the brief whenever it is not obvious:

```text
DOCUMENTED   the official docs say this
OBSERVED     you ran it and saw this happen
COMMUNITY    people report this. useful, unverified
INFERRED     you are reasoning. say so
```

OBSERVED beats DOCUMENTED when they disagree, and they do disagree. When you find a
conflict, that is a finding worth writing down: it is often the thing that costs another
team six hours.

Never present INFERRED as DOCUMENTED. The phrase "it should support" is the tell, and
when you catch yourself writing it, either go verify or mark it unverified.

## Version and staleness checks

```bash
npm view <package> version time.modified    # what is current, and when it moved
```

Then, in the docs: find the version selector and confirm you are reading the version you
will install. Reading v2 docs while installing v3 is a common and expensive mistake, and
the docs rarely announce it.

Check the changelog for the last few releases. Two minutes there tells you whether the
API is stable, whether something you plan to use just changed, and whether the thing the
sponsor announced last week actually shipped.

## When the docs are ambiguous

Say they are ambiguous. Do not resolve it by guessing, and do not resolve it by picking
the reading that makes the project easier.

Three moves, in order:

1. **Check the examples.** Ambiguity in prose is usually settled by code.
2. **Run it.** Fifteen minutes of spike beats an hour of reading.
3. **Ask.** Sponsor engineers are in the event Discord and answer fast. They also
   remember the team that asked a good question at hour two, and they are frequently the
   people scoring you at hour thirty-six.

If it stays unresolved, it goes in the "could not verify" list with a note on what would
settle it.

## Marketing versus capability

Sponsor pages are written to make a product sound inevitable. Translate before you teach:

| Page says | Ask |
|---|---|
| "Seamless integration" | How many lines, and what auth? |
| "Enterprise ready" | Is there a free tier, and what does it cap? |
| "Supports any chain" | Which chains, listed? By name? |
| "Instant settlement" | Instant meaning what, measured how? |
| "AI powered" | Which part is a model and which is code? |
| "Coming soon" | Not available. Do not plan on it |

**Supported is not the same as recommended, and possible is not the same as easy.** A
capability that exists behind three days of approval is not available for a weekend
hackathon, and saying so is more useful than listing it as a feature.

## What the spike is for

Reading gives you the shape. Running gives you the truth. The spike answers four things
no document reliably will:

```text
Can I get a key right now, self-serve, without an approval email?
Does the quickstart run unmodified on my runtime and OS?
What does a real response actually look like, field by field?
What broke, and what did the docs not mention?
```

The fourth is the one that becomes a sponsor-track story later. It is also the one that
cannot be faked, which is precisely why it is worth having.

Record it in `assets/spike-log.md` while it is fresh. A spike you did not write down is
a spike somebody repeats tomorrow.

## Stopping

Research expands to fill the time available, and this skill runs at the hour when time
is most valuable. Stop when you can answer all of these without hedging:

```text
What is it, in two sentences, with no marketing vocabulary?
What did people do before it existed?
What can a developer actually call?
What are three things it cannot do?
What does the response look like? (from the spike, not the docs)
What could I not verify?
```

If you can, stop, whatever remains unread. If you cannot, research **that specific
question**, not the topic generally. The difference between those two is most of the
overrun in this skill.
