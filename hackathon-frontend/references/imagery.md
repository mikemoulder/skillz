# Imagery

An agent building a frontend cannot produce images, and the two things it does instead
are both worse than asking: it hotlinks something that dies, or it leaves grey
rectangles that read as unfinished.

So: **always ask the user, and describe precisely what you need.** Asking costs one
message. Guessing costs a broken hero image on a projector.

## The ask

Ask early, in hour two, at the same time you scaffold. Not at hour thirty when the
screen is otherwise done and the team is asleep.

Ask for everything at once, and for each item give purpose, size, format, and what
happens if they do not have it. A request the user can act on in five minutes gets
answered; a vague one gets ignored.

```markdown
I need a few images for the UI. For each one, tell me if you have it, and if not
I will use the fallback.

1. Favicon. The browser tab icon.
   512x512 PNG, square, works small. A letterform or a simple mark, not detail.
   Fallback: a letter mark generated from the project name in the brand color.

2. Social preview (og:image). Shown every time the URL is pasted into Slack,
   Discord, or the submission form.
   1200x630 PNG. Fallback: I screenshot the app once it looks finished.
   THIS IS THE ONE THAT MATTERS MOST. See below.

3. Logo or wordmark for the nav, if you have one.
   SVG preferred, or PNG with a transparent background, at least 200px wide.
   Fallback: the project name set in the brand color. This is fine and common.

4. Any images the product itself shows: [name them specifically, for example
   "the three property photos the listing card displays"].
   Any size over 800px wide. Fallback: I use a colored block with the item's
   initials, which looks deliberate rather than missing.

If you have nothing, say so and I will build it image-free. That is a normal and
good-looking outcome, not a compromise.
```

Adapt item 4 to the actual product. The generic version gets a generic answer.

## What is actually needed, ranked

| # | Image | Why | If missing |
|---|---|---|---|
| 1 | **og:image**, 1200x630 | Renders every time the URL is pasted. Judges paste it | Screenshot the app |
| 2 | **Favicon** | The tab. A default Next.js icon is a visible cost | Letter mark |
| 3 | **Product content images** | Only if the demo shows them | Colored block plus initials |
| 4 | Logo or wordmark | Nice, not required | Type in the accent color |
| 5 | Empty state illustration | Almost never worth it | An icon |

**The og:image is the highest return image in a hackathon project and it is not a
design task.** It is a screenshot of your own product, cropped to 1200x630, taken once
the UI looks finished. It appears in the submission form preview, in every Slack paste,
and in whatever the organizers post. Teams skip it and lose a free impression.

```tsx
// src/app/layout.tsx
export const metadata = {
  title: "Project name",
  description: "One sentence, the same one as the README.",
  openGraph: { images: ["/og.png"] },
};
```

Verify it by pasting the deployed URL into Slack. If nothing renders, it is not working,
and the cause is usually a relative path or a missing deployment.

## With no images at all

The common case, and it is fine. These techniques look deliberate rather than missing:

- **Type-led hero.** A large heading in the brand accent, set well, with generous space.
  Most strong product sites are mostly type anyway.
- **A wordmark instead of a logo.** The project name in the accent color, one weight
  heavier than body text. Judges do not score logos.
- **CSS gradients or a mesh background.** A soft radial gradient behind the hero costs
  three lines and reads as designed. Keep it subtle and inside the palette.
- **Initials blocks for avatars and thumbnails.** Deterministic color from the id, the
  first letters on top. Looks like a product decision because it is one.
- **Icons instead of illustrations.** `lucide-react` is already installed. One icon at
  the top of an empty state does the whole job.
- **A screenshot of your own product** wherever a picture is genuinely needed.

```tsx
// initials block: deterministic, no asset needed, never breaks
function Initials({ name, id }: { name: string; id: string }) {
  const hue = [...id].reduce((h, c) => h + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className="grid h-10 w-10 place-items-center rounded-md text-sm font-medium text-white"
      style={{ backgroundColor: `oklch(0.55 0.12 ${hue})` }}
      aria-hidden
    >
      {name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
    </div>
  );
}
```

## Never

- **Never hotlink.** Not from a CDN you do not control, not from a chat service, not from
  Google Drive, not from Unsplash by URL. They expire, they rate limit, they fail behind
  venue wifi, and a broken image is worse than no image. Everything goes in `/public`
  and gets committed.
- **Never use stock photography.** Smiling people at a laptop is the single clearest
  signal of a template. Judges discount the product on sight.
- **Never fabricate a company or sponsor logo.** Using a sponsor's real logo from their
  brand page is normally fine and often encouraged; drawing an approximation of one is
  not, and neither is any arrangement implying an endorsement or partnership you do not
  have.
- **Never invent an image the user did not give you.** If the product needs a photograph
  of a specific real thing, ask. Do not substitute something that merely resembles it.
- **Never put an image on the critical path.** With `demo.offline_safe: true`, every
  image is local and the hero screen renders with all of them missing.

## Mechanics

```tsx
import Image from "next/image";

<Image
  src="/hero.png"
  alt="The review queue with three flagged items"   // real description, not "hero image"
  width={1200}
  height={630}
  priority                                          // above the fold only
/>
```

Four rules:

- **Always width and height.** Without them the layout jumps as images load, which looks
  broken on a slow connection, which is exactly the venue connection.
- **Real alt text.** Describe what is in the image. Judges tab and some check
  accessibility, and `alt="image"` is a visible miss. Decorative images get `alt=""`.
- **`priority` only above the fold.** On everything else it fights the content for
  bandwidth.
- **Check the file size.** A 4MB PNG hero is eight seconds on venue wifi.
  ```bash
  find public -type f \( -name '*.png' -o -name '*.jpg' \) -size +500k -exec ls -lh {} \;
  ```
  Anything over about 500KB gets resized or converted to WebP.

## Dark mode

An image with a white background on a dark ground is a glowing rectangle. If
`brand.mode` includes dark:

- Logos and marks: SVG with `currentColor`, or a transparent PNG.
- Screenshots: take them in the mode the demo runs in, and no other.
- Never a JPEG for anything with a flat background. The edges band visibly.

## The check

```bash
grep -rn 'src="http' src/ --include='*.tsx'          # hotlinks. there should be none
grep -rn '<img' src/ --include='*.tsx'               # raw img, missing dimensions
grep -rn 'alt=""' src/ --include='*.tsx'             # confirm each is truly decorative
ls -lh public/*.png public/*.jpg 2>/dev/null         # sizes
```

Then paste the deployed URL into Slack and confirm the preview renders.
