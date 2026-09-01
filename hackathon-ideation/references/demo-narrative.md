# Demo narrative

Design the demo before the product. Not after, not alongside — before. The demo is the
only part of the project every judge experiences, so it is the specification, and
every feature that does not appear in it is optional by definition.

This file is about the *narrative*. Making it survive the venue wifi and the projector
is `hackathon-frontend/references/demo-proofing.md`.

## The four questions

Before an idea is committed, answer these. If you cannot, the idea is not ready.

```text
1. What does the user do?            (one action, nameable in five words)
2. What happens?                     (visible, immediate, on screen)
3. What is the system doing?         (the part that earns the technical score)
4. What surprising thing do they see? (the aha)
```

Most half-formed ideas fail on 2 or 4. An idea that can only answer 1 and 3 is an
architecture, not a project.

## The three-minute arc

| Time | Beat | Rule |
|---|---|---|
| 0:00-0:15 | The problem, in one sentence, with a face | No market stats. One person, one pain |
| 0:15-0:45 | **The aha.** The thing works, live | The wow lands before minute one or it does not land |
| 0:45-2:00 | How it works | The one hard part, shown, not described |
| 2:00-2:30 | Second capability, or depth on the first | Only if it strengthens. Otherwise skip |
| 2:30-3:00 | What it means, what is next | Ten seconds. Then stop talking |

The most common failure is spending 0:00-1:30 on context. By the time the product
appears, the judge has already formed an opinion from your slides, and the opinion is
"another slide deck".

**Open with the thing running.** You can explain the problem afterwards; a judge who
has already seen it work listens to the explanation differently.

## Designing the aha

The aha moment has four properties. Drop one and it stops working:

- **Visible.** It happens on screen, not in a log, not in your description of it.
- **Fast.** Under five seconds from action to reaction. Anything slower needs a
  progress affordance that is itself interesting to watch — a stream of steps, a
  trace filling in, a counter moving.
- **Unexpected.** The judge could not have predicted the exact output. Determinism is
  invisible; watching a machine decide is not.
- **Legible.** They understand *why* it is impressive without being told. If you have
  to say "note that this is doing X", X is not visible enough.

The most reliable aha in a hackathon is **a machine doing something a human obviously
had to do a minute ago**, with both versions on screen.

## Making invisible work visible

Backend-heavy projects lose points they earned, because judges score what they see.
The fix is almost always a panel:

| Invisible work | Make it visible as |
|---|---|
| An agent planning | A live step list, each row appearing as it is decided |
| A retrieval pipeline | The sources lighting up, with the chosen one highlighted |
| Consensus / verification | A proof or signature resolving from pending to verified |
| A settlement | Two balances, side by side, both changing |
| A model choosing a tool | The tool name appearing before the call runs |
| Any long job | A trace that streams, not a spinner that spins |

A spinner is the single most expensive UI element in a hackathon demo: it converts
your hardest work into dead air. Anything that streams — steps, tokens, logs, rows —
converts the same wait into the most-watched part of the pitch.

## Rehearsal

- **Say it out loud, timed, at least twice.** Silently reading the script does not find
  the sentence you cannot say.
- **Cut every sentence that is not about what is on screen.** Judges cannot listen and
  watch at the same time; when they conflict, the screen wins and your sentence is
  lost anyway.
- **Never say "as you can see".** If they can see it, it needs no words. If they
  cannot, more words will not help.
- **Rehearse the failure line.** "The network is slow — here it is from ten minutes
  ago", then cut to the recording without pausing. A dead API costs five seconds if
  rehearsed and the whole pitch if not.
- **Have the recording.** Record the working flow while it works, not while you hope
  it will.

## The question you cannot answer

Every project has one. Find it during ideation, not at the judging table.

Usual suspects:

```text
"What does this do that [the obvious existing tool] does not?"
"Is this actually using [the sponsor tech], or could it be a database?"
"What happens with a hundred users? A hundred thousand?"
"Is this the model doing the work, or your code?"
"What is hardcoded right now?"
```

That last one gets asked at almost every hackathon, and the correct answer is the
honest one. "The counterparty is scripted; the negotiation logic and settlement are
real" is a fine answer that costs nothing. "Nothing is hardcoded" — when something
plainly is — costs the judge's trust in everything else you said, which is far more
expensive than the point you were protecting.

## The two-sentence version

A judge will ask what you built while walking past your table, with ten seconds of
attention. You need this before you need the three-minute version:

> **What:** We built X for Y, letting them Z.
> **Why it is hard:** Doing that used to require W, which is why nobody did it.

Everyone on the team says the same two sentences. Judges compare notes, and four
different descriptions of one project reads as four people who did not agree on what
they were building.
