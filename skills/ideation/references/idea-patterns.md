# Idea patterns

Hackathon ideas are not infinitely varied. There are maybe a dozen shapes that keep
winning and a dozen that keep losing, and which one you are in is usually decided
before any code exists. Steal the **shape**, not the idea.

## The shapes that win

### 1. The autonomous loop

Give a system a goal. It plans, acts, recovers from a failure, and finishes, on
screen, unscripted.

Why it wins: agency is legible. A judge watching a machine make a decision they did
not anticipate feels something a feature list cannot produce. It also happens to be
genuinely hard, so the technical score follows the demo score.

The trap: a scripted loop that always does the same three steps. Judges ask "what if I
gave it a different task?", have an answer, and ideally run it live.

### 2. The impossible-before

The project could not have been built eighteen months ago. Cheap long-context models,
a new proving system, a new settlement rail, a new device API.

Why it wins: it answers "why now?" by construction, and novelty is the axis where
most projects score worst.

The trap: the technology is new but you use it for something old. New tech + dashboard
is still a dashboard.

### 3. The compression

A thing that takes two hours takes one click. Show both. Literally side by side, with
a timer if you can.

Why it wins: it is the easiest possible demo to understand, and the value is
self-evident to anyone who has done the slow version.

The trap: judges must believe the slow version is real. Show the actual painful
artifact (the spreadsheet, the 40-tab browser, the form) for five seconds first.

### 4. The live wire

Something in the real world happens, and your screen reacts, live, during judging. A
transaction lands, a sensor fires, a webhook arrives, a price moves.

Why it wins: liveness is the one thing a video cannot fake, and judges know it.

The trap: this is the highest-variance demo there is. Have a recorded fallback, and
rehearse the failure line ("the network is being slow, here it is from ten minutes
ago") so a dead wire costs five seconds instead of the pitch.

### 5. The inversion

Flip who does the work. The agent negotiates and you approve. The contract enforces
and no one arbitrates. The system asks and the human answers, instead of the reverse.

Why it wins: inversions are memorable and one-sentence-able, which is exactly what
survives the judges' room.

### 6. The visible internal

Take a process that is normally invisible and render it. The agent's reasoning, the
dependency graph, the trace, the proof, the money moving between accounts.

Why it wins: it converts backend work (which judges cannot see and therefore cannot
score) into demo material. This is the highest-leverage move available to a team
whose real work is not on the screen.

Use it as an amplifier on any other shape. Almost every strong backend project
improves by adding a panel that shows the machine thinking.

### 7. The unusual pair

Two sponsor technologies nobody combined, where the combination is obviously right
once someone says it.

Why it wins: it scores novelty and integration simultaneously, and it makes you the
only entrant in your category. Sponsors also love it: you gave them a story about
their SDK doing something they did not plan for.

How to find one: list what each available technology is uniquely good at, then look
for a problem that needs exactly two of those superpowers at once. The pair is
usually one infrastructure primitive plus one intelligence primitive.

## The shapes that lose

| Shape | The pitch it produces | Why it dies |
|---|---|---|
| **The dashboard** | "A unified dashboard for your X" | Nothing happens on screen. Charts are not events. Judges have seen forty |
| **The chatbot wrapper** | "ChatGPT, but for Y" | Everyone shipped one. A system prompt is not technical depth, and the judge knows what the model did versus what you did |
| **X, but on-chain** | "Airbnb, but decentralized" | Cosmetic by construction, the tech was chosen before the problem |
| **The marketplace** | "Connecting A with B" | Two-sided by nature; your demo has one side, so the interesting half is imaginary |
| **The platform** | "A platform for building Z" | "Platform" means you did not choose. Nothing to demo but an empty framework |
| **The social app** | "A network for people who Q" | The product *is* other users. With one account it looks broken, not early |
| **The aggregator** | "All your R in one place" | The value is coverage, and you will have three sources by Sunday |
| **The invisible win** | "We built a novel algorithm for S" | The clever part never appears. Rescue it with the visible internal, or lose the score |
| **The form** | "Users submit T and we process it" | The demo peaks on a successful submit. There is no moment |
| **The wrapper on a wrapper** | "A nicer UI for [existing tool]" | The judge is thinking about the existing tool now, not yours |
| **The compliance project** | "It uses the sponsor SDK for auth" | Sponsor prizes go to depth, and the sponsor's engineer is judging |
| **The two-project project** | "It does U, and also V" | Neither half gets finished, and the sentence needs an "and" |

## Rescuing a losing shape

You usually do not need a new idea. You need a different cut of the same idea.

| If you are in | Try |
|---|---|
| The dashboard | Find the one number that changes, and make something *act* on it |
| The chatbot wrapper | Give it tools and let it execute. The loop is the product, not the chat |
| X-but-on-chain | Ask what becomes possible with verifiability that was impossible without. If nothing, drop the chain |
| The marketplace | Build one side and simulate the other convincingly. Demo the matching moment, not the listings |
| The platform | Ship the single best thing the platform would enable. Call it the product |
| The social app | Make it valuable with one user, and better with many. Single-player first |
| The aggregator | Pick the one source with the best data and go deep instead of wide |
| The invisible win | Add the visible internal. Show the algorithm working, not its output |
| The form | Move the moment after the submit. What happens *because* of it is the demo |

## The one test that catches most bad ideas early

Describe the demo in three sentences, out loud, with no interface words.

Not "the user clicks the button and sees a list", no clicks, no lists, no screens.
What *happens*. If you cannot describe it without describing a UI, there is no moment
in it, and the polish you add later will be polish on nothing.

## A note on cloning

Building something that exists is fine. Most winning hacks are a known product with
one capability that could not exist before. The question is never "does this exist?"
It is "does the new part show up in the first 45 seconds?"

If your differentiator only appears in the architecture diagram, you have built a
clone with an appendix.
