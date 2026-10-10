# The voice-over script

The script is the spec for the whole film. It decides what footage gets shot, how long each
chapter runs and what the judge remembers. Write it first, dry-run it, lock it, then build.

## The arc, scaled to the length

From `../../ideation/references/demo-narrative.md`, compressed to what a video can hold:

| Beat | 90 s film | 120 s film | 180 s film | The line does |
|---|---|---|---|---|
| Hook | 0:00-0:08 | 0:00-0:10 | 0:00-0:12 | One person, one pain, over footage of the pain |
| One-liner | 0:08-0:14 | 0:10-0:16 | 0:12-0:20 | The product's name and what it does, over the product |
| **Aha** | 0:14-0:30 | 0:16-0:35 | 0:20-0:45 | The thing working, live, the surprising part visible |
| How | 0:30-1:05 | 0:35-1:25 | 0:45-2:15 | The one hard part, shown: the trace, the agent's steps, the settlement |
| Sponsor | inside How | 1:25-1:40 | 2:15-2:35 | Where the sponsor tech runs, on screen, by name |
| Close | 1:05-1:30 | 1:40-2:00 | 2:35-3:00 | Name, one-liner again in different words, the URL on screen |

The aha by 0:30 is not negotiable. Judges with forty videos to watch decide in the first
minute, and many stop at 90 seconds (`../../readme/references/evidence.md`).

## The word budget

Charon with the default style reads 140-160 words a minute. Speech should fill at most 85%
of the film, so the picture has room to land between lines:

```text
words  ≈  target_seconds × 0.85 × 155 / 60

 90 s  →  ~195 words
120 s  →  ~260 words
180 s  →  ~395 words
```

Write under it. A script at the budget sounds rushed, because the aha and the close need
air after them that the formula does not count. `npm run vo:dry` checks it.

## Rules for each line

- **One line per chapter.** A line is one to three sentences, read as one breath group. The
  chapter's length comes from the line's take, so a line that covers two chapters breaks the
  timing.
- **Say what is on screen at that moment, and say it once.** The viewer cannot listen and
  watch at the same time when the two disagree, and the screen wins.
- **Never say "as you can see".** If they can see it, it needs no words.
- **Give the viewer where to look** on dense screens: "Watch the balance on the left."
- **Specific beats general.** "The refund lands in four seconds" beats "refunds are fast".
  Every number spoken must be the number on screen.
- **Name the sponsor where it runs.** "The transfer is a USDC payment on Base", over the
  explorer page that shows it. Sponsor judges listen for their name and look for proof.
- **The first line is not the product name.** Open inside the problem. The name lands in
  the second line, once the viewer cares.
- **The close restates the one-liner in new words.** Not "thank you for watching".
- **No stock phrasing.** Seamless, unlock, leverage, revolutionize, AI-powered, game-changer.
  `../../readme/references/voice.md` has the list; it applies to spoken words too.
- **No em dashes** in the script (house rule). They also read as an unpredictable pause.

## Writing for a voice

The model reads `text` exactly as written. Write for the ear:

| Problem | Fix |
|---|---|
| Acronyms and tickers (x402, USDC, zkSync, EIP-712) | `"say"`: "x four oh two", "U S D C", "zee kay sync", "E I P seven twelve" |
| Numbers with units (2.5s, $0.003, 10k) | Write them as spoken in `say`: "two and a half seconds", "a third of a cent", "ten thousand" |
| URLs | Do not read them. Put the URL on screen at the close |
| Code identifiers (`settleRefund()`) | Describe it: "the settle function". The identifier can be on screen |
| A sentence that runs on | Split it. Full stops give the voice somewhere to breathe |
| Emphasis on one word | Capitalize it, sparingly: "the refund lands BEFORE they leave the counter" |
| A deliberate beat inside a line | `<short pause>`. A full pause between chapters comes from the timeline, not the take |

`text` is what the captions and SRT show; `say` is what the voice reads. Keep them saying the
same thing, so the captions never disagree with the audio.

## Honesty

Every sentence is a claim a judge can check against the repo and the live app.

- **Only what the product does today.** Roadmap goes in one closing clause at most, marked as
  next: "Next, we are adding..." Never narrate a planned feature over footage.
- **Say what is scripted.** If the counterparty, the data or the trigger is seeded, a short
  clause covers it: "with a seeded store". `/skillz:judge` will ask what is hardcoded, and the
  video should not have answered differently.
- **Match the README.** The one-liner, the numbers and the sponsor claims say the same thing
  in the video, the README and the submission form. Judges compare them.

## The template

`assets/script.json` is a worked example for an invented product. Replace every line. Keep
the shape: `voice`, `model`, `style`, `target_seconds`, and `lines` with `id`, `text`, and
optional `say` and `style`. Ids become TypeScript keys and act names, so use words:
`hook`, `aha`, `trace`, `close`.
