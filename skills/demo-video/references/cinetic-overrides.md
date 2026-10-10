# Running cinetic for a demo video

cinetic directs. This file says which of its steps run on each path, and the few places
where a hackathon demo changes its defaults. Written against cinetic v1.1.0; paths below are
inside the film project, where `new-film.sh` has copied cinetic's scripts.

## Step by step

| cinetic step | Lean path | Full path | Changes for a demo |
|---|---|---|---|
| 0 Intake → `BRIEF.md` | Yes | Yes | Spec line names the voice-over. The app's brand is brand-supplied |
| 1 Concept → `TREATMENT.md` | One page | Yes | The script is the beat sheet. The device is the product's own object |
| 2 Brand → `src/brand/` | App tokens only | App tokens, cinetic's stills checks | No invented brand, no new mark |
| 3 Timeline → `src/timeline.ts` | Yes | Yes | Chapters sized from the voice |
| 4 Build → `src/acts/` | Frame around footage | Yes | Proof beats are footage |
| 5 Sound → `soundtrack.wav` | Light bed | Yes | Typing muted, then `vo_mix.py` |
| 6 Render → `out/film.mp4` | Sharp | Sharp, blur only where asked | `--audio` is the voice mix |
| 7 Review | 1 round | 2 rounds | Plus the voice-over checks below |
| 8 Deliver | Master, SRT, poster | Same | No social variants unless asked |

## Step 0: the brief

```text
1920x1080@60, 120s, 100BPM, audio: synthesized score + voice-over (Gemini TTS, Charon)
```

Copy cinetic's hard bans into `BRIEF.md` as it asks, then list the app's own brand as
brand-supplied exceptions: its typeface, its accent, its logo. A hackathon app built with
`/skillz:frontend` has its tokens in `globals.css`; if they include something cinetic bans (a
purple accent, a serif heading), the app wins, it is recorded in `BRIEF.md`, and the lines
that set it carry `// cinetic:brand-supplied <what>`. The film must look like the app the
judge opens next.

## Step 1: the treatment

- The script is the beat sheet. Each line is a chapter; copy the lines into the treatment's
  copy column. Do not write a second story.
- Still run cinetic's three tests on the script: deletion, specificity ("would this be just
  as true of a simpler product?") and feature-word. The specificity test is the one that
  catches a demo that shows the easy part.
- **The device** is the product's own object (the refund, the receipt, the row, the agent's
  step) carried from chapter to chapter, never a bare dot.
- **Techniques:** `python3 scripts/pick.py --format walkthrough --energy calm --seconds <s> --json out/qa/picks.json`.
  On the lean path draw only for the opening hook and the end card
  (`--category`, see `pick.py --list` for the names) and use cinetic's walkthrough chapter
  template for everything between.

## Step 2: brand

Take the brand from the app; do not run cinetic's personality-to-brand derivation or mark
exploration. Write `src/brand/tokens.ts` from the app's CSS variables, vendor the app's font
with `node scripts/add-font.mjs <family>`, and put the app's logo in `src/brand/Mark.tsx`
(an SVG import, or the wordmark in the app's font if it has no logo). Remove cinetic's
`// cinetic:placeholder` markers as you replace each one; `lint-film.mjs` fails until they
are gone.

## Step 3: the timeline, driven by the voice

`voiceover.py` writes `src/vo.ts` with each take's length in frames. The timeline sizes each
chapter in whole bars from it, places each line, and exports `VO` for `vo-cues.ts`:

```ts
// src/timeline.ts, after FPS, BPM, BEAT, BAR, b(), TAIL from the starter
import { VO_LINES, type VoId } from './vo';

const LEAD = BEAT / 2; // the picture moves first; the voice follows half a beat later
const LAND = BEAT * 2; // after the line, two beats for the result to hold before the next chapter
const barsFor = (id: VoId) => Math.ceil((LEAD + VO_LINES[id].frames + LAND) / BAR);

const ORDER = ['hook', 'oneliner', 'aha', 'how', 'sponsor', 'close'] as const satisfies readonly VoId[];
type Chapter = (typeof ORDER)[number];

let bar = 1;
export const ACT = {} as Record<Chapter | 'end', { from: number; dur: number }>;
for (const id of ORDER) {
  const n = barsFor(id);
  ACT[id] = { from: b(bar), dur: b(bar + n) - b(bar) };
  bar += n;
}
ACT.end = { from: b(bar), dur: b(bar + 2) - b(bar) + TAIL }; // the end card: name, line, URL
export const TOTAL = b(bar + 2) + TAIL;

/** Voice-over placements, read by scripts/vo-cues.ts. Every line starts on the 8th grid. */
export const VO = ORDER.map((id) => ({ id, at: ACT[id].from + LEAD }));
```

- Give the aha's chapter more `LAND` (a bar) if its result needs to be read: cinetic's hold
  rule (36 f + 6 f per word) applies to what is on screen after the line ends.
- `npm run vo:cues` checks the placements and writes `out/vo-cues.json` and
  `out/captions.srt`. Run it after every retake: a new take is a new length.
- `COPY` still holds the burned-in chapter captions, 6 words or fewer each, and they still go
  through `grid-check.ts`. The spoken words live in `VO_LINES`, not `COPY`.
- At 100 BPM a bar is 2.4 s, so a chapter can run up to a bar longer than its line. If the
  film lands over the target, cut words, not `LAND`.

## Step 4: building around footage

- One act per chapter, as cinetic's long-walkthrough rule asks, so a re-shoot re-renders one
  chapter.
- The proof inside a chapter is `<OffthreadVideo>` or a still (`references/footage.md`), with
  cinetic's anchor camera pushing into the region the line talks about, its cursor on the
  frames where a human acts, and the chapter caption in the lower third.
- cinetic's text-speed, safe-area and overlap rules apply to everything the film draws.
  `layout-audit.sh` does not see text inside a recording, so check readable UI in footage
  by eye on the 480 px legibility sheet.
- cinetic's "a screenshot never carries the hero shot" is about floating, soft screenshots.
  A sharp 2x still of the real app that the camera explores is footage, not decoration.

## Step 5: sound under a voice

In `audio/score.json`:

- `"typing": "muted"`: per-key typing under a voice is clutter (cinetic's own rule for VO).
- Keep sections light under the lines: pad, bass and a soft pulse. Put the score's events
  (the drop, the stop, the re-entry) in the gaps between lines, above all right after the aha
  line ends, so the music answers the line instead of fighting it.
- UI clicks stay at cinetic's levels; a click under a word is fine. Hits, drops and whooshes
  inside a line are what `vo_mix.py --cues` warns about.

Then:

```bash
npx tsx scripts/export-cues.ts && npm run audio   # score.py writes out/stems/
npm run vo:mix                                    # vo-cues, then vo_mix.py over the stems
```

`vo_mix.py` writes `public/audio/soundtrack.wav`, the same path `score.py` writes, so
`render.sh`, `check-sync.py` and `av-audit.py` pick up the voiced mix unchanged. Re-running
`npm run audio` overwrites it with the score alone; always follow it with `npm run vo:mix`.

## Step 6: render

```bash
bash scripts/render.sh Film out/preview.mp4 --preview --audio public/audio/soundtrack.wav
bash scripts/render.sh Film out/film.mp4 --audio public/audio/soundtrack.wav
```

A two-minute film at 60 fps is 7,200 frames. Iterate on per-act previews (`--frames A-B`),
render the master once, and use `scripts/render-chunks.sh` if a single render is too slow on
the machine. `--blur` only when `measure-speed.py` lists moves over 12 px/f, and then only on
those acts' ranges.

## Step 7: review additions

Run cinetic's lenses as it describes, then these, on the preview:

- **Line and picture agree.** At each line's start, end and every noun it names, grab the
  frame (`scripts/grab.sh`) and check the thing named is on screen.
- **The aha lands by 0:30**, and its result holds after the line ends.
- **Every spoken number is the number on screen** at that moment.
- **Muted pass:** captions alone tell the story. **Audio-only pass:** the voice alone does.
- **No designed sound on a word that matters** (`vo_mix.py` warnings resolved or accepted).
- **A cold viewer** says the one-liner back correctly.

A P0 here is anything a judge could call misleading: a number, a speed or a feature the app
does not have. It blocks the ship gate like any cinetic P0.

## Step 8: deliver

`bash scripts/deliver.sh out/film.mp4` for the poster and manifest. The captions are
`out/captions.srt` from `vo-cues.ts`, not cinetic's `srt.ts` (which captions `COPY`, the
chapter titles). Social cut-downs (`--variants`) only if the event asks for a vertical clip.

## Where cinetic and a demo disagree

| cinetic says | A demo does | Why |
|---|---|---|
| Rebuild hero UI as components; recordings are texture | Proof beats are real recordings and stills | The video is evidence. A judge compares it with the live app |
| Invent the brand from three adjectives | Use the app's brand as brand-supplied | The film must look like the product the judge opens |
| UI walkthrough: 20-90 s | Up to the event's cap, 120 s by default | Submission videos run 1-3 minutes |
| Sound is a score with designed effects | A score under a voice, events in the gaps | Speech carries the story; the music supports it |
| Captions are the on-screen `COPY` | Chapter captions burned in, every spoken word in the SRT | Judges watch with sound; platforms want a transcript |
| Motion-blurred master by default for launch films | Sharp master unless the speed check asks | A calm walkthrough rarely needs it, and blur multiplies render time |
