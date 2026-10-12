# The slop audit

"AI slop" is not a style. It is the visible residue of decisions nobody made: every
section the most probable version of itself, every value a default. This file names the
tells, explains why each one reads as generated, and gives the fix. Use it three times:
on the plan (imagination engine pass 7), on the screenshots (Step 8), and with
`assets/slop-check.sh` on the code.

## The catalogue

### Composition

| Tell | Why it reads as generated | Fix |
|---|---|---|
| Centered hero, pill badge above the headline ("Introducing X"), two buttons, three floating cards | the single most probable hero | a hero pattern from `sections.md` chosen for this product, with the product in it |
| Sections in the stock order: hero, logo strip, 3 features, how it works 1-2-3, testimonials, pricing, FAQ, CTA | the order is the template | a storyboard where each beat has a job this product needs |
| Two grids of cards in a row | nobody decided between them | alternate open, contained, open; ruled columns or rows for one of them |
| Every heading centered | no grid underneath | left-align to the container; center only hero, thesis, close |
| Every section the same padding and the same width | no rhythm | section padding to heading gap about 3 : 1; vary density |
| "How it works" as three numbered circles with icons | the numbered-circle cliche | a drawn mechanism or a spotlight split with the real UI |
| A dashboard screenshot tilted in 3D | drama without information | the real UI, flat, framed lightly, interactive if possible |
| Nothing above the fold shows the product | claims without proof | product on screen at second zero (split proof, stage, signature) |

### Surfaces

| Tell | Why | Fix |
|---|---|---|
| Everything in a `rounded-2xl` card with a shadow | the default container for everything | the surface decision tree in `components.md` |
| Border, tinted background, shadow and glow on one card | four signals where one would do | one signal: tone, or hairline, or soft shadow |
| Feature grid with icons in tinted rounded squares | the most generated component on the web | ruled columns with no icons, or line icons raw at 24px |
| Glassmorphism on every surface | effect as identity | blur the floating nav and one overlay only |
| Radii mixed (6, 8, 12, 16, 24) on one screen | no corner language | radius by component type, from the tokens |
| `shadow-lg` / `shadow-xl` on static content | elevation without meaning | flat; shadows only on things that float |

### Color

| Tell | Why | Fix |
|---|---|---|
| Purple to blue gradient anywhere | the AI default palette | monochrome plus one meaningful accent |
| Gradient text in the headline | the tell people name first | solid text; weight and size carry it |
| Glowing orbs or blobs behind the hero | ambience with nothing to say | one `.field` from palette tokens, or none |
| Indigo accent on slate dark mode | the shadcn and Tailwind default dark | a direction's ground and a chosen accent |
| `text-gray-500` on `bg-gray-50` everywhere | defaults, low contrast | the four text strengths, contrast checked |
| Five accent colors for five features | color as decoration | one accent with one meaning |

### Type

| Tell | Why | Fix |
|---|---|---|
| Bold 72px headline at default tracking | unstyled display type | the direction's display role: tracking -0.02 to -0.045em, line height under 1.06 |
| Display leading on body or body leading on display | no roles | the type roles in the tokens |
| Five weights, everything semibold | no hierarchy | two weights, three at most |
| Inter, Poppins or Montserrat at defaults as the brand | the anonymous defaults | a chosen face, tuned |
| Text under 12px for content | squeezed | 12px floor; labels only below |
| Every title in Title Case | slide-deck voice | sentence case |

### Copy

| Tell | Fix |
|---|---|
| "The future of X is here", "X, reimagined", "Supercharge your Y" | say what it is in twelve words a stranger understands |
| Seamless, effortless, empower, unlock, revolutionize, leverage, cutting-edge, next-gen, robust, elevate, harness | the plain verb: pay, send, check, find, prove |
| "Whether you're a startup or an enterprise" | one specific person |
| "Get started", "Learn more", "Submit" | verb plus object |
| Em dashes everywhere | comma, colon, period, parentheses |
| Exclamation marks | be more specific instead |
| "Trusted by" with logos of companies that never used it; invented testimonials; "10,000+ users" | real proof or nothing |
| "Lorem ipsum", "Test User 1", "Acme Inc" in seed data | domain-true seed data |

### Motion

| Tell | Fix |
|---|---|
| Everything fades up on scroll, slowly, including the nav | reveal section content once, 300 to 500ms, 8 to 12px |
| Floating or bobbing elements, forever | one ambient, one signature, both paused offscreen |
| Bounce, wiggle, ping | `--motion-out`, no overshoot |
| Hover that scales, recolors, shadows and borders at once | one property per hover |
| No reduced-motion path | the globals.css block and `useReducedMotion` |

### Detail

| Tell | Fix |
|---|---|
| Missing hover, focus, active, disabled states | the system sheet shows all of them |
| A spinner where a skeleton belongs | skeleton in the shape of the content |
| "No data" empty states | what goes here, why it is empty, the action |
| Mixed icon sets, emoji as icons, an icon on every heading | one set, one stroke, icons only where they help |
| Default favicon, "Create Next App" title, no og:image | brand all three |
| Nav links and footer links that go nowhere | every link real |
| A generic four-column footer with Product / Company / Resources / Legal | the footer pattern the direction calls for, with real links |
| Phone layout that is the desktop shrunk | the transform table in `layout.md` |

## The critique loop

Step 8 of the build. Up to three rounds; stop when the gate passes.

1. **Shoot.** `node <skill>/assets/measure-reference.mjs <url> --out .design/round-N`
   against the production build (`npm run build && npm start`) or the deployed URL.
2. **Look.** Open the 1440 and 390 slices one at a time. For each, write one line: what
   the eye hits first, what feels off.
3. **Score.** The rubric below, honestly, 0 to 3 per dimension. Write it in DESIGN.md
   section 8.
4. **Scan.** `bash <skill>/assets/slop-check.sh src`.
5. **Diff.** Compare `summary.md` with DESIGN.md: type sizes not in the scale, radii not
   in the tokens, extra left edges, horizontal overflow, console errors.
6. **Fix the three lowest things,** not twenty small ones. Then go to 1.

## The rubric

Score each 0 to 3. Zero: absent or broken. One: present but generic. Two: deliberate and
consistent. Three: distinctive, the thing someone would point at.

| # | Dimension | The question | 3 looks like |
|---|---|---|---|
| 1 | Identity | Cover the logo. Could this be any other product? | unmistakably this product |
| 2 | Hierarchy | Squint. Is the first thing the eye hits the most important thing? | headline, then product, then action, every viewport |
| 3 | Typography | Do sizes, tracking, leading and weights follow one scale? | the ramp is 6 to 10 styles, display tuned |
| 4 | Color | Grayscale the screenshot. Does the hierarchy survive? Is the accent under budget and meaningful? | value carries hierarchy; the accent means one thing |
| 5 | Layout | Do sections share edges and rhythm? | 2 to 4 left edges; consistent section gaps |
| 6 | Surfaces | Is every box earned? One corner language? | mostly open content; boxes where they mean something |
| 7 | Signature and proof | Is there one memorable, product-true element, and is the product visible? | someone would screenshot it |
| 8 | Copy | Specific, plain, verb-plus-object, no slop words? | headlines a person would say out loud |
| 9 | Motion and states | Purposeful motion, reduced-motion safe; all five states; every interaction state | it feels alive, nothing jitters, nothing is missing |
| 10 | Responsive | At 390: designed transforms, one action visible, no overflow? | the phone layout looks designed for a phone |

**Gate: 24 or more out of 30, nothing below 2, and `slop-check.sh` with zero failures.**

Below the gate after three rounds: take the lowest dimension back to its pass in the
imagination engine (identity and signature to pass 2, hierarchy and layout to pass 5,
typography and color to pass 6) rather than polishing around it.

## Honest scoring

The rubric is useless if every round scores 28. Rules that keep it honest:

- Score from the screenshots, not from memory of the code.
- A dimension cannot score 3 if its tell from the catalogue is present anywhere.
- Write the reason for every 3 in one line. If the line could describe another site, it
  is a 2.
- Have a teammate who did not build it score round 2 cold, if one is available.
