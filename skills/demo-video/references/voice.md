# The voice: Gemini TTS, Charon

Facts checked against the Gemini API speech-generation docs and live requests in October 2026.
APIs move; if a request fails in a way this page does not describe, read the current docs at
https://ai.google.dev/gemini-api/docs/speech-generation before changing the script.

## The request

```text
POST https://generativelanguage.googleapis.com/v1beta/interactions
x-goog-api-key: $GEMINI_API_KEY

{
  "model": "gemini-3.8-flash-tts",
  "input": [{ "type": "user_input", "content": [
    { "type": "text", "text": "<the line>",
      "annotations": [{ "type": "speech_metadata", "style": "<delivery direction>" }] }
  ]}],
  "response_format": { "type": "audio" },
  "generation_config": { "speech_config": [{ "voice": "Charon" }] }
}
```

The response's `steps[].content[]` holds an item of `type: "audio"` whose `data` is a
base64 WAV: 24 kHz, mono, 16-bit. `voiceover.py` does all of this with the Python standard
library, so it runs anywhere Python 3 does, Windows included, without cinetic's packages.

| Model | Use |
|---|---|
| `gemini-3.8-flash-tts` | Default. Best reading of the current models |
| `gemini-3.8-flash-lite-tts` | Fallback when Flash's daily quota is spent. Same voices, reads a little faster |
| `gemini-3.1-flash-tts-preview`, `gemini-2.5-pro-preview-tts` | Older. Only if a newer one is unavailable |

The older `generateContent` request shape with `prebuiltVoiceConfig` is no longer what the
docs show. Use the interactions endpoint.

## The voice

Charon is one of 30 prebuilt voices, and Google's one-word description of it is
"Informative". That suits a walkthrough: it explains rather than sells. To audition others,
change `voice` in `script.json` (Kore is "Firm", Iapetus "Clear", Sadaltager
"Knowledgeable", Sulafat "Warm") and re-run; a voice change re-voices every line, so on the
free tier audition with one short line under `--only` first.

## Delivery: style, pace, tags

- **`style`** is delivery direction, sent as `speech_metadata`. The model reads `text`
  verbatim, so direction never goes in the text.
- **Pace needs saying.** Measured on the same 13-word line with Charon:

  | Style | Pace |
  |---|---|
  | "a calm, confident narrator: clear diction, measured pace..." | 180-230 wpm, varying per take |
  | "...speaking at a relaxed, unhurried pace..." | about 190 wpm |
  | **"speaking slowly and clearly, a calm, confident narrator..."** | **137-160 wpm** (the default) |
  | "speaking slowly" plus `<short pause>` tags in the text | 95 wpm, too slow |

  A per-line `style` replaces the script's style, so it must restate "speaking slowly and
  clearly" or that line comes back fast.
- **Tags** go inline in `text` or `say`, in English even for other languages: `<short pause>`,
  `<long pause>`, `<sigh>`, `<laugh>`. A short pause renders at nearly a second; use one only
  where the line needs a beat.
- **Emphasis**: capitalize a word. Once per line at most.

## Quotas: the constraint that shapes the workflow

The free tier allows **10 TTS requests a day per model**, and a few a minute. A 429 says
which; `voiceover.py` waits out per-minute limits (up to 75 s, four times) and stops at once
on the daily one, keeping every take already written.

That is why the defaults are what they are:

- **Batch takes.** All pending lines go out as one request, one content item per line with a
  `<long pause>` between them. A long pause renders at about 1 s, but a sentence break inside
  a line can run 0.8 s, so the take is cut where each line's share of the words says the
  boundary should be, taking the pause that is long and near that point, and every cut is
  checked: each line's pace must sit within 0.6-1.6x the take's median. If the cut fails
  that check, the lines are voiced one by one, which costs one request each.
- **A batch is also the better reading.** Separate requests for the same text came back
  anywhere from 160 to 230 wpm; one take keeps one pace and one energy across the film.
- **Dry-run before every voiced run.** `npm run vo:dry` costs nothing.
- **Batch retakes too.** `--retake hook,aha,close` is one request; three runs are three.
- **A paid tier removes the problem.** Enabling billing on the AI Studio project lifts the
  daily cap. Worth it for a team that will iterate on the script.

## Takes, caching and retakes

- Each line's take is kept until its spoken text, style, voice or model changes (a hash of
  the four is in `vo/manifest.json`). Re-running `npm run vo` after an unrelated edit costs
  nothing and keeps the timing still.
- `--retake <ids>` voices named lines again with unchanged inputs: a misread name, a flat
  payoff. Listen first; most problems are fixed by `say` or `style`, which re-voice the line
  on their own.
- `--only <ids>` limits which lines may be voiced in a run. Lines outside it keep their takes
  even when stale, and the manifest marks them `STALE` so the next full run catches them.
- Takes are trimmed of edge silence (below -50 dBFS, keeping 30 ms), so a line's `frames` in
  `src/vo.ts` is its speech, and the gap between lines is the timeline's decision.
- Commit `vo/takes/` in the film project. A teammate who re-voices from scratch gets
  different lengths and a broken timeline.

## The key

- `voiceover.py` reads `GEMINI_API_KEY` from the environment, else from a `GEMINI_API_KEY=`
  line in `.env.local` or `.env` in the working directory or up to three parents. So a film
  project inside or beside the hackathon repo can share the repo's `.env.local`.
- In WSL, Windows environment variables do not cross over by default. Export it in the WSL
  shell (`~/.bashrc`, or the film's `.env.local`).
- The key never goes in `script.json`, a skill file, a commit, a screenshot or the video
  description. A key pasted into a chat or a public place should be rotated in AI Studio.

## When it goes wrong

| Symptom | Cause | Fix |
|---|---|---|
| `the key was rejected (401/403)` | Wrong or revoked key, or not an AI Studio key | New key at aistudio.google.com/apikey |
| `daily request quota used up` | 10 requests a day on the free tier | Wait for the reset, switch to `gemini-3.8-flash-lite-tts`, or enable billing |
| `model ... not found` | Model renamed or retired | Check the docs page above for the current id |
| `no audio in the response` | The text was refused or empty | Read the line for anything a safety filter would trip on |
| `did not split cleanly` | A line much faster or slower than the rest, or a missing pause | Usually fine: it falls back to one request per line. On a tight quota, shorten the outlier line |
| A line reads at 180+ wpm | Its per-line `style` dropped the pace phrase | Restate "speaking slowly and clearly" in it |
| A name is mispronounced | The model guessed | `say` with a phonetic spelling, then `--retake` |
