# Voice

Two failure modes, opposite directions, equally costly. Undersell real engineering and
a judge never learns what was hard. Oversell it and a judge finds the seam, then
discounts everything else on the page.

The target is narrow and reachable: **ambitious framing, strictly factual claims.**

## No em dashes

Never use the em dash character in generated project text. Not in the README, `docs/`,
commit messages, code comments, submission copy, or the project description on the
submission form.

Use instead: a comma, a colon, a period, a semicolon, or parentheses. Almost every em
dash is a comma or a period that wanted to be more dramatic.

The three `Before:` lines below are the only intentional em dashes in this skill. They
are specimens, not prose, and they are why `check-docs.sh` is pointed at your project's
docs rather than at this library. Do not "fix" them.

```text
Before:  The agent plans, executes and settles — all without a human in the loop.
After:   The agent plans, executes and settles, with no human in the loop.

Before:  Three sponsors — Circle, OKX and Vercel — power the settlement path.
After:   Three sponsors (Circle, OKX and Vercel) power the settlement path.

Before:  It is fast — under a second.
After:   It is fast: under a second.
```

**The reason is credibility, not taste.** The em dash has become one of the most
recognizable markers of machine generated text. A judge who reads your README as
AI-written discounts every claim in it, which is precisely the opposite of what the
document exists to do. The same logic governs the phrase list below.

Verify with a scan, never a manual read. The character is easy to miss and easy to
reintroduce when editing:

```bash
grep -rn $'\xe2\x80\x94' README.md docs/ 2>/dev/null && echo "EM DASH FOUND"
```

Watch for reintroduction from three places: pasted text from a chat, a Markdown editor
with smart punctuation enabled, and your own later edits. Run the scan last, after
every edit is finished.

## No AI attribution, ever

Never add an AI co-author trailer or a generated-by footer to anything in the
repository. This is absolute and has no exceptions.

```text
Co-Authored-By: Claude <...>              never
Co-Authored-By: [any AI tool] <...>       never
Generated with [any AI tool]              never
Assisted by / Written by [any AI tool]    never
🤖 anything                                never
```

Applies to commit messages, pull request bodies, the README, `docs/`, code comments,
the submission form, and the demo video description. If a tool adds one of these by
default, turn it off before the first commit rather than cleaning up later.

The reason is the same as the em dash rule, only stronger. Commit history is a surface
judges browse, particularly at hackathons where organizers check whether a project was
built during the event. A machine co-author on every commit is the single most legible
marker available that the work was generated rather than engineered, and it invites
exactly the scrutiny the rest of this skill exists to avoid. It also creates an
authorship record for your submission that does not match the humans on your team.

To be clear about what this is not: it is not a claim that no tools were used. Use
whatever you want. The commit trailer is a machine-readable authorship assertion in a
document judges read, and it does not belong there.

Fix it before there is history to rewrite:

```bash
git log --format='%an <%ae>%n%b' | grep -iE "co-authored-by|generated with|🤖"
```

If trailers already exist, they can be stripped, though this rewrites every commit
after the first affected one. Do it before pushing anywhere shared, and never during
the final two hours:

```bash
git filter-branch -f --msg-filter \
  'grep -viE "co-authored-by:.*(claude|copilot|gpt|cursor|codeium)|generated with|🤖"' \
  -- --all
```

If history is already pushed and the deadline is close, leave it. A rewrite that
breaks the repo an hour before judging costs more than the trailers do.

## Phrases that read as machine written

Not banned because they are wrong; banned because they are the tells, and they cluster
in text nobody wrote with intent.

| Avoid | Why | Instead |
|---|---|---|
| "In today's fast paced world" | Opens nothing | Open with the problem |
| "Seamlessly integrates" | Says nothing measurable | Name what it connects, and how |
| "Leverages cutting edge" | Two filler words | Name the technology |
| "Revolutionizing / transforming the way" | Unverifiable | Name the specific change |
| "Robust, scalable, enterprise grade" | False at a hackathon | "A working prototype of X" |
| "Delve into", "It's worth noting that" | Filler | Delete the sentence opener |
| "Unlocking the power of" | Marketing with no content | What became possible, concretely |
| "Whether you're a X or a Y" | Fake audience breadth | Name the one real user |
| "The possibilities are endless" | The opposite of a roadmap | List the three next things |
| "Game changing", "next generation" | Superlatives without referents | A measurement |

The general rule: **any sentence that would be true of a hundred other projects is
costing you a line.** A judge reading a generic sentence learns nothing about you and
concludes there was nothing specific to say.

## Ambition without fabrication

Amplify significance. Never invent artifacts. The distinction is mechanical, and it is
about the object of the sentence rather than its energy:

| Fabrication (never) | Ambition (correct) |
|---|---|
| Users, transactions, or benchmarks that did not happen | Framing the workflow you did build as a primitive |
| Integrations not present in the code | Describing a real integration's architectural role |
| "Production ready", "audited", "battle tested" | "A prototype of the settlement path, on testnet" |
| Partnerships, funding, adoption | The problem class the prototype points at |
| Performance numbers you did not measure | The number you did measure, with its method |

Worked rewrites:

```text
Weak (undersells real work):
  "We made a tool that sends USDC when a task is done."

Fabricated (invents scale):
  "Our platform processes millions in autonomous payments for enterprise teams."

Correct (ambitious, defensible):
  "Payment becomes a step the agent can take, not a human approval it waits for.
   Completing a task and settling it are the same action, on testnet today."
```

```text
Weak:
  "Uses the Circle SDK for payments."

Fabricated:
  "Deep native integration across Circle's entire product suite."

Correct:
  "Circle's programmable wallets are the execution layer for payouts. The agent
   holds a spending policy rather than a key, so a completed task settles inside
   the agent loop instead of queueing for a human. See src/lib/pay.ts."
```

Notice that the correct version is more impressive than the fabricated one. It is
specific, it names a real constraint, and it points at a file. Specificity is what
reads as competence; superlatives read as the absence of anything specific to say.

## The claim to evidence test

Apply to every sentence making a factual claim. Three outcomes, one of which is not
"leave it":

```text
Can I point at a file, a URL, or a measurement?
  yes  → keep it, and add the pointer
  no, but I could produce one in 5 minutes → produce it (screenshot, tx link, timing)
  no   → soften to what is true, or delete
```

Softening is usually a two word edit and almost never weakens the page:

```text
"handles thousands of concurrent users"  →  "handles concurrent runs; we tested 20"
"fully autonomous"                       →  "autonomous within a spending cap we set"
"instant settlement"                     →  "settles in about two seconds on testnet"
```

Each rewrite is more credible and more interesting than the original, because a real
number invites the follow up question you can answer.

## Vocabulary for architectural depth

These phrases communicate that a technology is structural rather than bolted on. They
are legitimate when true and damaging when not, because a sponsor engineer reading
"core execution layer" will look for the code that makes it one.

```text
core execution layer        settlement primitive       trust boundary
agent coordination layer    source of truth            authorization boundary
real time orchestration     programmable infrastructure   protocol primitive
```

The test before using one: **remove that technology, and describe what breaks.** If
something structural breaks, the phrase is earned. If the answer is "we would call a
different API", write the plain version instead. That test is the same one from
`hackathon-ideation`, applied to prose.

## Tone by section

| Section | Register |
|---|---|
| One liner | Plain and concrete. No adjectives |
| Problem | Human. One person, one situation. No statistics |
| What we built | Flat and specific. Let the screenshot carry the impression |
| Sponsor sections | Technical and precise. This reader checks claims |
| How it works | Numbered, mechanical, unadorned |
| Limitations | Direct. Confidence comes from naming them plainly |
| Vision | The one place to be expansive, clearly marked as not yet built |

The most common structural error is using vision register in the product section. It
makes the built thing sound speculative, which is the exact reverse of what you need: a
judge should be more certain the product exists after reading about it, not less.

## Before submitting

```bash
grep -rn $'\xe2\x80\x94' README.md docs/          # em dashes
grep -rniE "seamlessly|cutting edge|revolutioniz|game chang|endless possibilities" README.md
grep -rniE "production ready|enterprise grade|battle tested|audited" README.md
```

The second and third scans should return nothing. If they return something, the fix is
almost always to replace the phrase with the specific fact it was standing in for.
