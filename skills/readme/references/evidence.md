# Evidence

A hackathon README makes claims to a reader who has been told many things that turned
out to be aspirational. Evidence is what separates your claims from those, and it is
cheap to produce while the project works and impossible to produce afterward.

Capture evidence **while things are working**, not at the end. Every artifact below
takes two minutes during the build and is unavailable at 4am when the key has expired.

## The artifacts, ranked by what they buy

| Artifact | Cost | Buys |
|---|---|---|
| **A live URL that loads** | Already paid, if you deployed early | The most, by a wide margin |
| **A GIF of the aha moment** | 5 min | The first screen. Judges believe a moving image |
| **A 90 second video** | 20 min | Survives a dead demo, and many judges watch before clicking |
| **A verified contract link** | 5 min | Proof you deployed, not just compiled |
| **A real transaction hash** | free | Proof it transacted, not just simulated |
| **Static screenshots** | 5 min | Every section that describes a screen |
| **A working fresh clone** | 15 min | The developer judge, and the "is this real" question |

The live URL outranks everything. A judge who clicks it and sees the product has
resolved every question the README was written to answer.

## The hero image

The first image is the highest value object on the page. It should show the product
doing the interesting thing, not a logo and not an empty state.

A GIF beats a screenshot when the aha moment is a process (an agent working, a value
updating, a transaction confirming). Keep it under about 5 seconds and under a few MB;
a GIF that has not loaded when the judge scrolls past is not an asset.

```bash
# capture a clip, then convert. any screen recorder plus ffmpeg
ffmpeg -i demo.mov -vf "fps=12,scale=900:-1:flags=lanczos" -loop 0 assets/screenshots/hero.gif
```

**Commit images to the repo** under `assets/screenshots/`. Never hotlink from a chat
service, a temporary upload host, or a Google Drive link. Those expire, get access
walled, or fail to render inline, and a broken image at the top of the README is worse
than no image at all.

Check that it renders on the hosted page, not just in your editor preview. Relative
paths behave differently once the README is displayed by the git host.

## The video

Record it while the project works, at the point where the demo path first runs end to
end. That is usually hours before you think you are ready, and it is the only time you
are guaranteed to have working software.

- Under 2 minutes. Most judges stop at 90 seconds.
- Open with the product running, not with slides or a title card.
- Say the one liner in the first sentence, then show the aha moment.
- Screen recording with voice over is fine. Production value scores nothing on its own;
  what it buys is legibility. `/skillz:demo-video` makes a directed, narrated cut of the
  real product once this raw recording exists.
- Unlisted is fine; **private is not.** Verify the link works while logged out, in a
  private window. A permission wall on a submission video is a common and total loss.

This recording is also your demo fallback. If the live run fails on stage, you cut to
it and keep talking, which turns a catastrophe into a five second detour.

## On chain evidence

If the project transacts, these three links are worth more than any paragraph:

```markdown
Contract: [0xabc...def](https://sepolia.etherscan.io/address/0xabc...def) (verified)
Example run: [0x123...789](https://sepolia.etherscan.io/tx/0x123...789)
Network: Sepolia testnet
```

**Verify the contract on the explorer.** It takes one command while the deploy is
fresh, and it converts "we deployed a contract" into source a judge can read. An
unverified address is a claim; a verified one is proof.

```bash
forge verify-contract <address> <Contract> --chain sepolia --watch
```

Include a real transaction hash even if the demo runs on fixtures. One genuine
transaction, linked, proves the path works end to end, and it is the difference
between "this settles on chain" being a claim and being a fact the reader can check.

## The what is real section

The highest credibility per word available in the document. It belongs in the README,
not hidden in `docs/`.

```markdown
## What is real, what is not

**Real:** the agent loop, tool selection, and USDC settlement on Base Sepolia.
Every completed task in the demo produces an on chain transfer you can open above.

**Recorded:** the market data feed. The provider rate limits at 20 requests per
hour, so the demo replays a captured response with its original latency.

**Not built:** multi user accounts, mainnet, and the dispute flow described under
Vision.
```

Three paragraphs, no defensiveness, no apology. Judges ask "is that live?" because
they have seen many demos; answering before they ask costs one point of apparent
completeness and buys back several of credibility.

The asymmetry is the point. A disclosed fixture is a reasonable engineering decision.
An undisclosed one that a judge discovers is a reason to doubt every other claim on
the page, including the true ones, and that doubt is far more expensive than the
disclosure.

## Screenshots for the body

One per major section that describes a screen. Rules:

- **Current UI only.** A screenshot from hour 10 showing a layout you have since
  replaced tells the judge the documentation is stale.
- **Real seed data, never lorem ipsum.** Judges read the content of your fake data,
  and it tells them whether you understood the problem.
- **Crop to the interesting region.** A full desktop screenshot at 3000px wide renders
  as an unreadable strip.
- **Light mode**, unless the product is deliberately dark. Git hosts render on white,
  and a dark screenshot on a white page reads as a hole.

## Numbers

Any number in the README needs a method attached, in the same sentence:

```text
Weak:     "10x faster than doing it manually"
Better:   "About 8 seconds, against roughly 4 minutes by hand for the same three
           quotes. Measured once, on one task."
```

The second is more credible precisely because it admits its own limits, and it is the
version that survives a judge asking how you measured. "Measured once" is a perfectly
respectable qualifier at a hackathon; an unqualified 10x is not.

Never quote a number you did not measure. Latency, throughput, cost savings and
accuracy are all easy to check and all commonly invented, so they are exactly where a
skeptical judge looks first.

## The capture checklist

Run this the moment the demo path first works end to end, not at the end:

```text
[ ] Screen record the full flow. Save it. This is the fallback and the video
[ ] GIF the aha moment, 5 seconds, committed to assets/screenshots/
[ ] Screenshot each screen the README will describe
[ ] Copy the deployed URL into the README
[ ] Verify the contract, copy the explorer link
[ ] Run one real transaction, copy the hash
[ ] Open every one of these links in a private window
```

That last line catches the two most common failures: a private video and a preview
deployment URL that requires being logged into the hosting account. Both look fine
from your machine and are dead for everyone else, which is the worst possible failure
mode because you will not notice it.
