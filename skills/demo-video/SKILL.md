---
name: demo-video
description: Make the hackathon demo video, a narrated walkthrough of the real product. Fetches the cinetic film skill to direct the picture, voices the script with Gemini TTS (voice Charon), times every chapter to its line, mixes the voice over cinetic's score and renders a captioned master under the event's time cap. Use when the submission needs a video, when recording or re-cutting the demo, when writing a voice-over script, when the existing video is a raw screen recording that undersells the build, or when judges will watch before they click. Read CONFIG.md first.
---

# Demo video

The video is the one artifact every judge sees, often before the repo and sometimes instead
of the live demo. This skill turns the demo path into a short film: real footage of the
running product, directed by **cinetic** (an open-source film skill for coding agents),
narrated by a Gemini TTS voice, with burned-in chapter captions and an SRT of every word.

Run it after the demo path works end to end and `/skillz:readme` has the one-liner. Hand the
link to `/skillz:judge`, which scores the video requirement UNKNOWN until one exists.

**Read `CONFIG.md` before anything else.** If the hackathon repo has a `hackathon.yml` at
its root, read that first; the values in `CONFIG.md` are defaults.

## The rule that governs everything

> The video is evidence, not an ad. Every product moment on screen happened in the real app.

Judges open the deployed app after watching, and organizers compare the two. A rebuilt UI
that behaves better than the real one, a number the product never computed, or a feature that
exists only in the film turns the best-directed video into a credibility problem that spreads
to everything else you claimed. cinetic directs the film; the product supplies the proof.

## Before anything: the fallback recording

If no raw recording of the working demo path exists, make one first. Ten minutes, any screen
recorder, one take, you narrating or silent. It is the submission's insurance and the live
demo's fallback (`../readme/references/evidence.md`), and nothing below is allowed to put it
at risk. This skill makes the good version; that recording makes sure there is a version.

## Two paths, chosen by the clock

cinetic is thorough: its own evaluation averaged 95 minutes and about 626k tokens for films of
10 to 25 seconds. A two-minute walkthrough is bigger. Pick the path from the hours left
(`time.hours_remaining` in CONFIG, `path: auto`):

| Path | When | What cinetic directs | Wall clock |
|---|---|---|---|
| **Lean** | under 8 hours left, or a solo team | The hook, chapter cards, transitions, captions, end card, sound. Footage carries every product beat | 2-3 h |
| **Full** | 8+ hours, someone free to own it | Everything in cinetic's UI walkthrough format, including the review rounds | 4-6 h |

Both paths use the same script, voice and mix. Lean skips cinetic's technique draw beyond the
hook and end card, uses the app's own brand tokens instead of cinetic's brand step, renders
sharp (no motion blur pass) and runs one review round.

## Step 0: Fetch the director

```bash
bash <this skill>/assets/setup.sh --check            # requirements
bash <this skill>/assets/setup.sh ~/films/<project>-demo --name <project>-demo
```

`setup.sh` finds an installed cinetic (`~/.claude/skills/cinetic`, a project copy, or the
Claude Code plugin) or clones `Leonxlnx/cinetic` at the pinned tag (`director.ref`, v1.1.0)
into `~/.cache/skillz/`. It then runs cinetic's `new-film.sh` with walkthrough defaults
(60 fps, 100 BPM, 1920x1080) and adds this skill's voice-over tools to the film project.

**Then read cinetic's `SKILL.md`** (`setup.sh --locate` prints where it is) and treat it as the
director for every craft decision: timing grid, motion tokens, transitions, type, sound, render
and review. Read it the way it asks, one reference per step, not all at once. Where it and this
skill disagree, `references/cinetic-overrides.md` says which wins and why. Read that file now.

- **Platform.** cinetic's scripts are bash and target macOS and Linux. On Windows, work inside
  WSL2, with the film in the Linux filesystem (`~/films/...`), not under `/mnt/c`.
- **Location.** The film project lives outside the hackathon repo by default
  (`video.location: sibling`). It is a Remotion project with footage and renders; inside the
  judged repo it adds noise, skews the language bar and buries the product's commit history.

**Gate:** `setup.sh --check` passes and the film project exists.

## Step 1: The script → `vo/script.json`

Read `references/script.md`. The script is written before anything is captured, because the
voice sets the timing and the script decides what footage you need.

- Start from the demo arc in `../ideation/references/demo-narrative.md`: problem with a face,
  the aha by 0:30, the one hard part shown, stop.
- One line per chapter beat. The first sentence carries the one-liner from the README.
- Every claim is something the product visibly does in the footage. Name sponsor technology
  where it is on screen, the way a sponsor judge would want to find it.
- Use `"say"` for anything a voice will mangle: `x402`, `USDC`, `zkSync`, version numbers.

```bash
npm run vo:dry          # words, estimated length at 155 wpm, against target_seconds
```

**Gate:** the dry run fits: speech fills at most 85% of `target_seconds`, and the target is
at least 10 s under the event's cap.

## Step 2: The voice → `vo/takes/`, `src/vo.ts`

Read `references/voice.md`. The voice is Gemini TTS, voice **Charon** ("Informative"), model
`gemini-3.8-flash-tts`, through `scripts/voiceover.py`.

```bash
npm run vo                         # voices changed lines, writes takes, manifest, src/vo.ts
npm run vo -- --retake aha         # one line again: a misread word, a flat reading
```

- **The key** comes from `GEMINI_API_KEY` in the environment, or a `GEMINI_API_KEY=` line in
  the film's or the hackathon repo's `.env.local`. Never in `script.json`, never in a commit,
  never in a skill file. `setup.sh` gitignores `.env*` in the film project.
- **The free tier allows 10 TTS requests a day per model.** `voiceover.py` voices all pending
  lines in one batch request and splits the take at the pauses, so a full script costs one
  request. Run the dry run before every voiced run, and batch your retakes.
- **Listen to every take** before building on it. Mispronounced names, a flat payoff line and a
  rushed hook are fixed with `say`, the line's `style` and `--retake`, not in the edit.
- Takes are kept until their text, style, voice or model changes, so the timing you build on
  does not move under you.

**Gate:** every line has a take you listened to; `vo/manifest.json` shows 130-175 wpm per line.

## Step 3: The footage → `public/footage/`, `public/stills/`

Read `references/footage.md`. Capture the real product on its deployed URL, following the
script line by line.

- **Real-time recordings** (60 fps, 1440p or larger) for anything whose motion is the proof:
  a stream, a trace filling in, a balance changing, a transaction confirming.
- **High-DPI stills** (`assets/capture.mjs`, device scale 2) for states the camera will push
  into and move between.
- Seed the demo data first, so names, amounts and dates are specific and consistent, and
  record against fixtures only where the architecture already uses them for the demo.

**Gate:** every script line has the footage that proves it; nothing is shot from localhost
chrome, a dev overlay or a browser full of personal tabs.

## Step 4: Direct the film → `TREATMENT.md`, `src/`

Follow cinetic's workflow with the UI walkthrough format (its `references/formats.md` §6) and
the overrides in `references/cinetic-overrides.md`. The ones that change the most:

- **The voice drives the timeline.** Each chapter is sized in whole bars from its line's
  frames in `src/vo.ts`, and each line is placed in `VO` in `src/timeline.ts`. The picture is
  cut to the voice, never the voice stretched to the picture.
- **The brand is the app's.** Take tokens from the product's own CSS (the frontend skill's
  `globals.css`). A brand you supply always wins in cinetic, and the film must look like the
  app the judge opens next.
- **Proof beats are footage.** The aha and every claim play from real recordings, framed with
  cinetic's camera, cursor and type around them.
- **Captions.** One burned-in chapter caption of 6 words or fewer (cinetic's rule), plus
  `out/captions.srt` with every spoken word, written by `npm run vo:cues`.

**Gate:** cinetic's own gates for each step it runs on your path, plus `npm run vo:cues`
passing (every line placed once, in order, inside the film, with air between lines).

## Step 5: Sound, mix, render

```bash
npx tsx scripts/export-cues.ts && npm run audio     # cinetic's score and stems (typing: muted)
npm run vo:mix                                       # voice over the stems, mastered once
bash scripts/render.sh Film out/film.mp4 --audio public/audio/soundtrack.wav   # sharp master
```

`vo_mix.py` ducks the music under each whole line, sets the voice 12 dB over what remains,
and masters through cinetic's own `master.py` to -14 LUFS with a -1.5 dBTP ceiling. It warns
when a hit, drop, whoosh, riser, swell or suck lands inside a line. Use `--blur` on the render
only where cinetic's speed check asks for it; a calm walkthrough usually renders sharp.

**Gate:** `vo_mix.py` exits 0 and `render.sh` passes its sync and spec checks.

## Step 6: Review

Run cinetic's review loop (its §8) on a preview, with one round on the lean path and two on
the full path, and add the voice-over checks from `references/cinetic-overrides.md`:

- The line and its picture agree: the narrator never describes something that is not on screen
  at that moment, and never says "as you can see".
- The aha is on screen by 0:30, and the product is named in the first line or two.
- Watch it once muted with the burned-in captions, once audio-only with eyes closed. Each must
  still tell the story.
- A teammate who did not make it watches it once, cold, and says what the product does.

**Gate:** cinetic's ship gate on your path, and the cold viewer gets the one-liner right.

## Step 7: Deliver

```bash
bash scripts/deliver.sh out/film.mp4          # poster and manifest (cinetic)
python3 scripts/probe.py out/film.mp4 --spec 1920x1080@60 --dur <s>
```

- Upload **unlisted, never private**, to the host the rules name (YouTube by default). Add
  `out/captions.srt` as the captions track.
- Open the link logged out, in a private window, on a phone. Check the length shown is under
  the cap.
- Title and description: the project name and one-liner, the repo and live links. No AI
  attribution in the description (house rule). If the event's rules ask about AI tool use,
  answer them truthfully: the narration is synthesized.
- Put the link in `hackathon.yml` (`artifacts.video_url`), the README's link row and the
  submission form.

**Gate:** the link plays logged out and the duration is under the cap.

## What not to do

- **Do not rebuild the product's screens to look better than the product.** Fix the product.
- **Do not fake a beat the product cannot do live.** If a step is slow, cut on the wait and
  say so in the line ("forty seconds later"), the way a documentary would.
- **Do not let the video eat the build.** If the product is not working yet, this skill is
  not next.
- **Do not put the API key anywhere but the environment or a gitignored `.env.local`.**
- **Do not retake lines one at a time on the free tier.** Ten requests a day goes fast.
- **Do not chase cinetic's launch-film look in a walkthrough.** Its format table gives the
  walkthrough a calmer grid, fewer words and a lighter bed for a reason.

## Time traps

- **Rewriting the script after the timeline exists.** Every changed line moves every cue after
  it. Lock the script at the dry run.
- **Recording footage before the script.** You will shoot the wrong things and reshoot.
- **A blurred master of a two-minute film.** It can take hours. Walkthroughs rarely need it.
- **Polishing the end card.** Two seconds, the name, the one-liner, the URL. Done.

## Report

```text
DEMO VIDEO

Path         lean | full        cinetic v1.1.0 from <path>
Length       1:52 (cap 3:00)    speech 78 s at 151 wpm, 7 lines, Charon
Footage      5 recordings, 9 stills, all from <deployed url>
Mix          -14.0 LUFS, -2.3 dBTP, speech +12 dB over music
Gates        vo:cues pass, vo_mix pass, render sync/spec pass, review rounds: 1
Delivered    out/deliver/film.mp4, captions.srt, poster.png
Link         <url>  (unlisted, plays logged out)

Unverified   [anything not checked, e.g. "not watched on a phone"]
Next         /skillz:judge with artifacts.video_url set
```

## Handoff

`/skillz:judge` next, with `artifacts.video_url` set, so the video requirement moves from
UNKNOWN to PASS and the demo lens scores the artifact rather than its absence. If the judge
pass changes the product, re-shoot only the affected chapter: each chapter is its own act, so
a fix re-renders one range and splices it.
