# Motion

Motion explains change: something arrived, something was pressed, something moved from
one state to another. Motion that explains nothing is decoration, and decoration that
moves is the loudest kind. The goal is an interface that feels alive, not animated.

## The motion budget

Per page:

| Kind | How many | Example |
|---|---|---|
| Ambient | one | the hero field drifting over 22 seconds |
| Signature | one | Gloam's seal stream; Teampot's light along the key tree |
| Reveals | section content, once | fade and rise 8 to 12px as it enters |
| Reactive | every interactive element | hover, press, focus, open, close |
| Delight | one | a number counting up, a block lighting, at the money shot |

Everything else is still. If a second thing loops, one of them goes.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--motion-out` | `cubic-bezier(0.22, 1, 0.36, 1)` (luminous), `(0.2, 0.8, 0.2, 1)` (quiet) | entrances, hover, most things |
| `--motion-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | things that move from A to B: drawing lines, sliding panels |
| `--dur-micro` | 120 to 180ms | hover, press, color |
| `--dur-ui` | 180 to 260ms | sheets, tabs, popovers, accordions |
| `--dur-reveal` | 300 to 500ms | section reveals |
| stagger | 60ms per item, at most 8 items | lists and grids entering |
| signature loop | 30 to 40s linear, or 3 to 5s cycles for light along a path | |
| ambient | 20 to 30s alternate | the field |

Never linear easing for UI (only for marquees and constant streams). Never bounce or
elastic overshoot on anything larger than a toggle knob.

## Patterns

### Reveal on scroll

`<Reveal>` from `assets/motion.tsx`. Opacity 0 to 1 and `translateY(var(--reveal-y))` to
0, once, when 15% is visible, with a 40px bottom margin so it triggers just before the
element is fully in view. Stagger siblings with `delay={i * 60}`.

Reveal sections, not atoms: one reveal on a heading block and one on the grid, not on
every word. Never hide the hero; it is visible at first paint.

### Line art that draws itself (Teampot)

```tsx
<LineArt viewBox="0 0 560 320" label="Treasury funds three departments">
  <path className="draw" pathLength={1} d="M30 160 L130 160" stroke="var(--fg)" strokeWidth={1.5} />
  <path className="draw" pathLength={1} d="M130 160 C 180 160, 180 60, 230 60"
        stroke="var(--line-strong)" style={{ "--d": "0.3s" } as React.CSSProperties} />
</LineArt>
```

`pathLength={1}` normalizes every path so one dash rule draws them all. Stagger with
`--d`. The resting state (reduced motion, no JS) is the fully drawn diagram.

### Light along a path (Teampot beams)

A second copy of the main path with a short dash (`stroke-dasharray: .16 1.2`) animated
along it, a `drop-shadow` glow in the path's color, and the destination node's stroke
lighting when the light arrives. Three to five seconds per cycle with a pause. One path
carries light; the rest stay quiet. A refused path stops halfway and turns `danger`.

### Transformation stream (Gloam)

Two identical tracks of cards moving in lockstep at 38s per loop. The left half is
clipped to show the readable version, the right half the transformed version, and a
frosted slab covers the seam. Edges masked. Paused offscreen with `PauseOffscreen`. On
low-end devices the slab's backdrop blur becomes a near-opaque fill.

### Press and hover

- Buttons: background one step, `scale(0.98)` on press. No lift, no glow, no shadow grow.
- Cards that link: `translateY(-3px)` over 200ms, or a border shift to `line-strong`.
  Pick one per site.
- Arrow links: the arrow moves 3px.
- Rows: background to `fill`.
- Images in cards: never zoom on hover. It is the template move.

### Sheets, tabs and accordions

Sheets slide up 250ms `--motion-out` with the backdrop fading to 40%. Tabs move an
indicator (shared layout animation with `motion` if installed, or a transform). Panel
content cross-fades in 200ms; it does not slide. Accordions animate height with the
`grid-template-rows: 0fr -> 1fr` technique, not `max-height` guesses.

### Numbers

`<CountUp>` once, for the money shot, below the fold. Tabular figures so the width does
not jitter. For live values that change (a balance after a payment), animate the change,
not the whole number: a brief highlight on the digits that changed.

### Marquee

`<Marquee>`: words, 40s, edges masked, paused offscreen and on hover, static under
reduced motion.

## Performance rules

- **Animate `transform` and `opacity` only.** Not `width`, `height`, `top`, `left`,
  `box-shadow` or `filter` in loops.
- **Pause what is offscreen.** Loops, canvases and WebGL stop when not visible.
- **Canvas and WebGL at 30fps and low resolution** for soft fields (they are blurry by
  design), with a CSS fallback underneath.
- **Lite mode for weak devices.** Gloam sets `html.gl-lite` from a device check and drops
  backdrop blur and drifting fields there. At minimum, honor reduced motion.
- **`will-change` only while animating**, never in a stylesheet on dozens of elements.

## Accessibility rules

- **Reduced motion gets the final state instantly.** `globals.css` has the global block;
  `useReducedMotion()` covers JS-driven motion. The signature must have an honest still
  frame that still explains the idea.
- **Content is visible without JS.** Reveals hide content only after `html.js` is set,
  and `MOTION_BOOT` shows everything if the app never hydrates. Never ship a page that is
  blank until JavaScript runs.
- **Nothing flashes more than three times a second.**
- **No scroll-jacking, no parallax that moves text,** no autoplaying motion that cannot be
  paused if it runs longer than five seconds (marquees pause on hover and offscreen).

## Smells

- Everything fades up, including the nav and the footer.
- A 0.8s reveal with a 40px rise: slow and theatrical.
- Floating elements that bob forever.
- Three different easing curves on one page.
- A hover that changes size, color, shadow and border at once.
- Motion that only works in Chrome on a fast laptop. Test it on a phone.
