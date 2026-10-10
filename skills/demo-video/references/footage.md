# Footage of the real product

The film's proof is footage of the product running on its deployed URL. cinetic frames it:
the camera pushes into it, the cursor and captions sit on top of it, the cuts land on the
grid. The pixels in the proof beats come from the app.

## What has to be real

| Beat | Source | Why |
|---|---|---|
| The aha | Real-time recording | It is the claim the whole video makes. A judge will try it |
| Anything that streams or settles (tokens, a trace, a balance, a confirmation) | Real-time recording | The timing is the proof. A rebuild that settles faster than the app is a fabricated number |
| A state the camera explores (a dashboard, a result, a detail panel) | High-DPI still, or a recording | Stills stay sharp under a push-in |
| Sponsor proof (an explorer page, a dashboard of the sponsor's service) | Recording or still of the real page | Sponsor judges recognize their own UI |
| The hook's problem state | Footage of the pain, or a cinetic-built scene | The problem may not be your product. Building it in code is fine |
| Chapter cards, captions, end card | cinetic | Film, not product |

cinetic's `product-ui.md` says to rebuild hero moments as components, because a component can
be timed to the beat and a recording cannot. For a demo video that trade goes the other way:
time the cut to the recording, not the recording to the beat. Rebuilt components are allowed
only when they are the project's own components fed its own real data, so the rebuild is the
product.

## Before recording

- **Seed the data.** Specific names, amounts and dates that agree with the script: "Maya,
  42.50, refunded 14:02". Generic seed data ("Test User", "$100.00") reads as a mock.
  `../../frontend/assets/seed.ts` has the pattern.
- **Clean the surface.** A fresh browser profile, no extensions, no bookmarks bar, no other
  tabs, no notifications. Zoom at 100%. Dark or light to match the film's stage.
- **Warm it up.** Run the flow once before recording so caches, cold starts and wallet
  prompts are out of the way. A 6-second cold start is a 6-second cut you will have to hide.
- **Use the deployed URL.** Localhost in the address bar tells the judge the demo might not
  exist anywhere else. If the address bar is not in the frame, still use deployed: it is what
  the judge will compare against.

## Real-time recordings

- **60 fps, larger than the frame.** 2560x1440 recorded, used in a 1920x1080 film, survives a
  1.3x push-in sharp. OBS: Settings > Video, base and output 2560x1440, 60 FPS; Output >
  Recording, a quality preset, MP4 or MKV (remux to MP4).
- **Record the browser window's content area, not the desktop.** OBS's window capture with
  the browser's chrome cropped, or the browser in kiosk or app mode.
- **One take per chapter, following the script line.** Read the line aloud while you do the
  action, so the action's pace matches the voice that will sit on it.
- **Move the cursor like a person, and less.** cinetic draws a designed cursor
  (`src/fx/Cursor.tsx`); hide the system cursor in OBS and add one in the film on the
  frames where a human acts. Once the product acts on its own, no cursor.
- **Leave handles.** Two seconds of still screen before and after each action, so the cut has
  somewhere to land.

## Stills

`assets/capture.mjs` drives the deployed app with Playwright and writes a 2x screenshot after
each step of the demo path. Edit its `STEPS` to match the flow:

```bash
npm i -D playwright && npx playwright install chromium
node scripts/capture.mjs --url https://<deployed> --out public/stills --scale 2
```

Each still is 3840x2160 for a 1920x1080 film. Re-run it whenever the UI changes; the film
picks up the new pixels with no other change.

Flows behind a login or a wallet do not script well. Record those in real time in the real
browser instead.

## In the film

Footage lives in the film's `public/footage/` and `public/stills/`, which `setup.sh`
gitignores because they are large. Keep the original recordings backed up somewhere else; they
are the one thing a re-render cannot regenerate.

```tsx
import { OffthreadVideo, Img, staticFile } from 'remotion';

// a recording, trimmed to the chapter, muted (the soundtrack is muxed by render.sh)
<OffthreadVideo src={staticFile('footage/aha.mp4')} trimBefore={f60(132)} muted
  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

// a 2x still the anchor camera pushes into (cinetic's src/lib/camera.ts)
<Img src={staticFile('stills/03-result.png')} style={{ width: W, height: H }} />
```

- `trimBefore` is in frames of the film's fps. Find the action's frame in the recording once
  and name it in `timeline.ts`, so a re-shoot changes one number.
- Recordings at 30 fps play every frame twice in a 60 fps film. It is invisible on a static
  UI and visible under a camera pan, so pan over stills and 60 fps footage only.
- Never scale footage up past its own pixels. If a push-in needs more, record bigger.
- Put the product inside a frame that belongs to the film (a stage from the app's own colors,
  a margin, a soft shadow) rather than edge to edge with browser chrome. cinetic's layout
  rules (a product window at 70-92% of the frame width, ideally overflowing an edge) apply.
