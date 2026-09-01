# Legibility to an automated reviewer

Many events now run some automated pass over submissions, whether a first-round filter, a
summarizer that briefs human judges, or a tool that checks requirements. Optimizing for
it is legitimate and mostly identical to optimizing for a tired human: **make accurate
evidence easy to find.**

Start with the line, because everything else depends on staying on the right side of it.

## The line

**Never write anything intended to instruct, manipulate, or deceive an evaluator.**

```text
Hidden text (white-on-white, zero size, off-screen positioning)       never
HTML comments addressed to a reviewer                                 never
"Ignore previous instructions", or any prompt injection               never
Text placed to be read by a machine and not by a human                never
Keyword stuffing, in code, comments, docs, or metadata                never
A file whose purpose is to be read by a scoring system                never
Claims in docs that the code does not support                         never
```

This is not a gray area to be reasoned around. It is fraud, it is routinely detected,
and it turns a strong submission into a disqualification plus a story that follows the
team. It is also pointless: everything genuinely worth communicating can be written in
text a human would be glad to read.

**The test for any change:** would you be comfortable if a judge saw exactly why you made
it? A clear name passes. An accurate doc passes. Anything you would want hidden fails,
and the wanting-to-hide is itself the answer.

A useful corollary: if a change would look bad in a diff shown on a projector, do not
make it.

## What automated review reads reliably

Roughly in descending order of reliability:

| Signal | Read reliably? | Implication |
|---|---|---|
| File and directory names | Yes | Name the architecture into the tree |
| Exported symbol names | Yes | `settleCompletedTask` beats `handle` |
| README and `docs/` prose | Yes | Explicit statements beat inference |
| Dependency manifests | Yes | A declared but unimported SDK is visible as such |
| Test names | Yes | Name tests for the claim they prove |
| Comments at call sites | Yes | Where the "why" belongs |
| Commit messages | Usually | Real messages tell the build's story |
| Cross-file control flow | Poorly | Do not rely on it tracing your architecture |
| Runtime behavior | Not at all | It cannot run your demo |

The last two rows carry the practical lesson. **Anything that only becomes apparent by
tracing execution across five files will be missed**, by an automated reviewer and by a
human skimming for four minutes. That is the same conclusion this skill reaches from the
human side, which is why there is no separate strategy for machines.

## Concretely

```text
Engine                        →  AutonomousSettlementEngine
PaymentHelper                 →  SponsorPaymentAdapter
integration detail in 5 files →  docs/integrations.md, plus the files
"we handle failures"          →  a test named "falls back to fixture on timeout"
an implied architecture       →  docs/evaluation-map.md pointing at each piece
```

Every one of those is also better for a human. That is the check: **a change that helps
only a machine is on the wrong side of the line.**

## Consistent terminology

Pick one word per concept and use it in the code, the README, the docs, the commit
messages and the submission form. A project that calls the same thing a `task`, a `job`,
a `run` and a `request` in four places reads as four people who did not talk, to a human
and to a summarizer alike.

```bash
grep -rniE "\btask\b|\bjob\b|\brun\b|\brequest\b" README.md docs/ src/ -o | sort | uniq -c | sort -rn | head
```

If the counts are evenly spread across synonyms, pick the dominant one and align the
others. This is cheap, it is additive, and it measurably improves how any reviewer
summarizes the project.

## What not to do in the name of legibility

- **Do not write a file addressed to a reviewer.** `docs/evaluation-map.md` is an index of
  where things live, useful to any reader. A file that argues for a score is not.
- **Do not stuff sponsor names.** Repeating a sponsor twelve times in the README does not
  deepen the integration; the judge from that sponsor will check the code and find rung 1.
- **Do not restructure the whole repo for machine readability.** Mutative, risky, and the
  README can point at anything for free.
- **Do not write documentation for code that does not exist.** The most damaging error in
  this whole library, and it gets more damaging as documentation gets better, because a
  confident doc pointing at nothing reads as deliberate.
