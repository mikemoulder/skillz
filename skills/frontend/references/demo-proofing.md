# Demo-proofing

Everything here is about the ninety seconds when a stranger drives your app on
someone else's hardware while you talk. That is a different environment from
your laptop in every way that matters.

## What actually goes wrong on stage

Ranked by how often it kills a demo:

1. **Venue wifi.** Captive portals, 3 Mbps shared across 200 laptops, or none.
2. **A cold serverless function.** First request after 20 idle minutes takes
   8 seconds. Your demo is the first request.
3. **An API rate limit or expired key**, often an LLM provider, mid-sentence.
4. **The projector.** 1024x768 or 1280x720, washed out, 16:10 letterboxed.
5. **A red console error** visible on the shared screen while you talk.
6. **Someone types something you never tried.** Empty input, emoji, 500 chars.

Notice that only one of these is a code bug. Proof against the environment.

## The offline guarantee

`demo.offline_safe: true` means: **unplug the ethernet, hard-reload, and the
hero screen still tells the story.** Concretely:

- Seed fallback on every fetch, silently (see `assets/seed.ts`).
- No blocking third-party script, no analytics, no font CDN on the critical
  path. `next/font` self-hosts; a `<link>` to fonts.googleapis.com does not.
- No image that must load from a remote host. Put demo images in `/public`.
- If an LLM call is the demo: cache one real response as a JSON fixture and
  fall back to it. Judges cannot tell, and you will not be the team standing
  in silence watching a spinner.

Test it honestly:

```bash
npm run build && npm start          # production build, not dev
# then, in devtools: Network > Offline, and hard reload
```

Dev mode hides real problems, hydration mismatches, missing env vars,
unoptimized images. **Always rehearse against `npm run build && npm start`
or the deployed URL, never `npm run dev`.**

## The warm-up

Ten minutes before you present:

```bash
curl -s -o /dev/null -w "%{time_total}s\n" https://YOUR-APP.vercel.app
curl -s -o /dev/null -w "%{time_total}s\n" https://YOUR-APP.vercel.app/api/items
```

Run each twice. The second number is your real load time; the first is the
cold start the judge would have seen. Keep the tab open and warm from then on.

## Projector setup

- Add `projector` to `<html>` (`assets/globals.css` handles the rest).
- Browser at **1280x720**, or zoom to 125-150% on a 1080p display. Test at
  that size. A layout tuned for a 15" retina display loses its right column.
- Full screen, no bookmarks bar, no notifications. `Do Not Disturb` on.
- One tab. A visible tab strip of Stack Overflow searches undercuts the pitch.
- Dark mode in a bright room is a real risk. If the venue lights are on and
  you cannot test the projector in advance, light mode is the safer bet.

## The pre-demo pass

Fifteen minutes, run it exactly once, in order:

```
[ ] npm run build              : zero errors. a warning is fine, an error is not
[ ] open the DEPLOYED url, hard reload (Cmd/Ctrl+Shift+R)
[ ] console: zero red. fix or silence every one
[ ] network: offline, reload : hero screen still renders
[ ] resize to 1280x720 : nothing clips, nothing overlaps, no h-scroll
[ ] zoom 150% : same
[ ] walk the demo script end to end, clicking, not talking
[ ] type garbage into every input: empty, 500 chars, emoji, <script>
[ ] click the primary button twice fast : no double submit
[ ] tab through the hero screen : focus visible, order sane, no traps
[ ] check the tab title and favicon. "Create Next App" is a real cost
[ ] paste the URL into Slack : the og image renders
[ ] screen-record the full working flow. this is your parachute
```

That last line is the highest-value item on the list. A 90-second recording of
the app working means a dead network costs you nothing. Record it while the
app works, not while you are hoping it will.

## Things to delete before the demo

- `console.log` anywhere on a rendered path.
- Any route not in the demo script. If it exists, a judge will click it, and
  they will find the half-built one.
- Commented-out code in a file you might screen-share.
- `.env` values in client bundles: grep for your keys in `.next/static`:
  ```bash
  grep -rl "sk-\|API_KEY\|SECRET" .next/static 2>/dev/null && echo "LEAK"
  ```
  `NEXT_PUBLIC_*` is shipped to the browser. Nothing secret goes in one.

## The honest badge

If the demo runs on seed data, say so: `status="demo data"` in the shell, or
one line in the pitch. Judges find out anyway, usually by asking one question
you cannot answer. Volunteering it costs a point of "completeness" and buys
back several of "credibility". Getting caught costs both.
