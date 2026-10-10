# Demo video customization

Defaults. Copy into `hackathon.yml` at your project root and edit there.

```yaml
# ── The video ───────────────────────────────────────────────────────────────
video:
  cap_seconds:     auto        # from the rules. 180 if the rules say nothing
  target_seconds:  auto        # 120, or cap - 15 if the cap is shorter. readme says judges
                               # stop at ~90 s: put the aha before 0:30 whatever the length
  aspect:          16:9        # 16:9 | 9:16 | 1:1. submissions are almost always 16:9
  path:            auto        # lean | full | auto. auto: lean under 8 hours left
  location:        sibling     # sibling: ~/films/<project>-demo | in-repo: ./video
  host:            youtube     # youtube | vimeo | loom | drive. whatever the rules name
  visibility:      unlisted    # never private

# ── The director ────────────────────────────────────────────────────────────
director:
  skill:           cinetic
  repo:            https://github.com/Leonxlnx/cinetic
  ref:             v1.1.0      # pinned tag. CINETIC_REF overrides it for setup.sh
  engine:          remotion    # remotion | hyperframes. cinetic's default is remotion
  fps:             60
  bpm:             100         # walkthrough grid: 90-110. 100 BPM = 36 f per beat at 60 fps
  blur:            auto        # auto: only where cinetic's speed check asks for it
  review_rounds:   auto        # lean 1, full 2

# ── The voice ───────────────────────────────────────────────────────────────
voiceover:
  provider:        gemini
  model:           gemini-3.8-flash-tts   # or gemini-3.8-flash-lite-tts (separate quota)
  voice:           Charon      # "Informative". one of Gemini's 30 prebuilt voices
  style:           "speaking slowly and clearly, a calm, confident product walkthrough narrator: warm but never salesy, like an engineer showing a colleague something that works"
  api_key_env:     GEMINI_API_KEY         # environment, or a gitignored .env.local. never a file in git
  batch:           true        # one request for every pending line. the free tier is 10 a day
  wpm:             155         # dry-run estimate. Charon with the style above: 140-160
  speech_share:    0.85        # speech fills at most this share of the film

# ── The mix ─────────────────────────────────────────────────────────────────
mix:
  lufs:            -14         # YouTube's playback target
  duck_db:         10          # music dip under each line
  speech_over_db:  12          # voice over the ducked music, K-weighted
  typing:          muted       # cinetic's typing sound under a voice-over

# ── Captions ────────────────────────────────────────────────────────────────
captions:
  burned_in:       chapters    # chapters: one 6-word caption per chapter (cinetic's rule)
                               # transcript: the spoken words burned in too (for silent feeds)
  srt:             true        # out/captions.srt, every spoken word. upload it with the video

# ── Footage ─────────────────────────────────────────────────────────────────
footage:
  source:          deployed    # deployed | local. judges compare against the deployed app
  recording_fps:   60
  recording_size:  2560x1440   # recordings larger than the frame survive a 1.3x push-in
  still_scale:     2           # device scale factor for capture.mjs stills
```

## How the knobs bite

| Knob | Effect |
|---|---|
| `video.path: lean` | cinetic directs the frame around the footage: hook, chapter cards, transitions, end card, sound. One review round, sharp render. About half the time of `full` |
| `video.location: in-repo` | The film goes in `./video` with its own `.gitignore` for `out/`, `public/footage/` and renders. The Remotion source shows up in the judged repo and its language bar |
| `director.ref` | A different cinetic tag. Read its CHANGELOG first: the overrides here were written against v1.1.0 |
| `voiceover.model` | Each model has its own daily quota on the free tier. Flash-Lite is the fallback when Flash is used up; the voice is the same Charon, a little faster |
| `voiceover.batch: false` | One request per line (`--per-line`). Only on a paid tier: separate requests drift in pace, 160-230 wpm on the same text |
| `voiceover.style` | A per-line `style` in `script.json` replaces this for that line, so it must restate the pace |
| `mix.speech_over_db` | Below 10 the voice fights the music in the 1-4 kHz band and `vo_mix.py` fails its gate |
| `captions.burned_in: transcript` | Every spoken word on screen. Right for a feed that autoplays muted; heavy for a judge who has sound on |
| `footage.source: local` | Allowed for a product that cannot be deployed. Say so in the video's description, because judges will look for the URL |

## The one that is usually wrong

`video.target_seconds`. It gets set to the cap because the cap feels like a budget. It is a
ceiling. Most judges decide in the first 90 seconds, and a two-minute film that lands its aha
at 0:25 beats a three-minute film that lands it at 1:10, every time. Write to 120 and cut
from there.
