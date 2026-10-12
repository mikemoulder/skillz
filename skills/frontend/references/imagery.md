# Imagery and art direction

The best image a product has is the product. Both sites this skill was calibrated
against use almost no pictures: Teampot shows its running app in phones and draws its
mechanism in line art; Gloam shows live payment cards and paints a luminous field with
engraved money hidden in it. Neither has a stock photo, an illustration pack or a 3D
blob.

## The order of preference

| # | Imagery | When | How |
|---|---|---|---|
| 1 | **Live product UI** | always, if there is a product | real components with seed data inside a `Frame`, or the running app in an iframe scaled down |
| 2 | **Line diagrams** | the mechanism needs explaining | SVG drawn with tokens (`line`, `fg`, one accent path), drawn in on view |
| 3 | **Atmosphere** | the brand needs a mood behind the hero | `.field`: blurred radial light from the `--field` tokens; or a WebGL noise field with the CSS field as fallback |
| 4 | **Generative motif** | the metaphor has a texture | Gloam's engraved banknotes and seal dots; a dot matrix; a ruler; drawn in canvas or SVG from code, deterministic |
| 5 | **Photography** | the product is physical or human and the user has real photos | only what the user supplies, color-graded to the palette |

Never: stock photography (people smiling at laptops is the clearest template signal
there is), illustration packs, AI-generated images with their tells (warped text, extra
fingers, glossy plastic), 3D blobs and orbs, isometric servers, and screenshots tilted in
3D perspective for drama.

## Live product UI

- Build mocks from the real components and the real seed data, so the landing page and
  the app cannot drift apart. Teampot's tab panels are white HTML mocks of its own
  screens; Gloam's live cards are its real send and prove forms.
- Make it interactive where it is cheap: a segmented toggle, amount chips, a role
  switcher. "Try the controls" beats any animation.
- Show realistic states: a pending row, a refused payment, a non-round balance
  (`$2,981.40`, not `$1,000.00`).
- Label it honestly: "The middle phone is the real app on the Tempo testnet."

## Line diagrams

Draw on a grid (viewBox in multiples of 8), 1px strokes in `line` or `line-strong`, the
one path that matters in `fg` at 1.5px, nodes as small pills with 10 to 12px labels,
labels in the sans at 500. One color path at most, carrying the accent's meaning. The
still frame must explain the mechanism on its own; motion adds the direction of flow.

## The atmosphere field

One per screen, inside a `.panel-atmos` container, behind the content:

```tsx
<Surface kind="panel" className="min-h-[560px] p-10">
  <div className="field field-drift" aria-hidden />
  {/* content */}
</Surface>
```

Mixed only from `--field-a/b/c`, which the direction sets: graphite and one tint glint
(luminous), white and soft gray (quiet), paper and a warm blush (editorial). It should be
noticeable only when it is gone. If someone describes the hero as "a gradient", it is too
strong.

## Icons and marks

- **One set**, one stroke width (1.3 to 1.5), drawn on a 24 grid. `lucide-react` at
  `strokeWidth={1.5}`, or a small custom set inline as SVG.
- **The logo**: an SVG mark with `currentColor` so it works on both grounds, plus a
  wordmark set in the brand face. A wordmark alone is common and fine.
- **Favicon**: the mark as SVG, plus a 512 PNG. A letter mark in the action color if
  there is no mark.

## Ask the user, early

An agent cannot invent the team's logo, photos of their hardware or a sponsor's mark. Ask
in hour two, once, for everything, with a size, a format and a fallback for each, so the
request can be answered in five minutes:

```markdown
I need a few images. For each, tell me if you have it; if not, I use the fallback.

1. Logo or mark. SVG preferred, or a transparent PNG at least 512px.
   Fallback: the project name set in the brand typeface as a wordmark.
2. Social preview (og:image), 1200 x 630.
   Fallback: I generate it from the hero headline and the wordmark with next/og.
3. Favicon, 512 x 512, simple enough to read at 16px.
   Fallback: a letter mark in the brand color.
4. [Images the product itself shows, named specifically: "photos of the three sites in
   the demo inspection".] Any size over 1200px wide.
   Fallback: [a deliberate placeholder: initials blocks, a map tile, a diagram].

If you have nothing, say so. A type-led build with live product UI is a strong outcome,
not a compromise.
```

Never hotlink, never fabricate a company or sponsor logo, never imply a partnership. A
sponsor's real logo from their brand page, used as their guidelines allow, is fine.

## The og:image

It renders every time the URL is pasted into Slack, Discord, X or the submission form,
which makes it the highest-return image in the project. Generate it from the tokens so it
always matches:

```tsx
// src/app/opengraph-image.tsx
import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column",
        justifyContent: "flex-end", padding: 72, background: "#F5F5F5", color: "#000" }}>
        <div style={{ fontSize: 28, opacity: 0.56 }}>projectname</div>
        <div style={{ fontSize: 76, letterSpacing: "-0.04em", lineHeight: 0.95, marginTop: 16 }}>
          The hero headline, word for word
        </div>
      </div>
    ),
    size,
  );
}
```

Use the token hex values directly (ImageResponse does not read CSS variables). Check it by
pasting the deployed URL into Slack.

## Mechanics

- `next/image` with `width` and `height` always, `priority` above the fold only, real
  `alt` text (or `alt=""` when decorative).
- Everything in `/public`, committed. Over 500KB gets resized or converted to WebP.
- Screenshots taken in the mode the page uses, at 2x, cropped to the region that matters.

```bash
grep -rn 'src="http' src/ --include='*.tsx'        # hotlinks: should be none
find public -type f \( -name '*.png' -o -name '*.jpg' \) -size +500k
```
