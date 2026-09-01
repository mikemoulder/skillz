# Agent architecture

Applies when `components.agent: true`. An agent is a loop that calls tools until a
stop condition. Everything below is about making that loop finish, stay bounded, and
be watchable, in that order.

## The loop

```text
input → plan → select tool → execute → observe → decide ──┐
                    ▲                                      │
                    └──────────────── continue ────────────┘
                                      or stop
```

Five things must be decided before any code, and four of them are usually skipped:

| Decision | The question | Hackathon answer |
|---|---|---|
| **Tools** | What can it actually call? | 3-6. An explicit allowlist, hand-written |
| **Context** | What does it see each turn? | The task, the last N observations, the tool list |
| **Memory** | What survives between runs? | Usually nothing. Add only if the demo shows it |
| **Termination** | When does it stop? | Goal met, or max steps, or wall clock. All three |
| **Failure** | What happens when a tool throws? | Return the error as an observation, let it retry once |

## Termination, three ways, all of them

An unbounded loop is the standard way an agent hackathon project burns its API credits
at 2am and 504s on stage. Bound it three times over:

```ts
const MAX_STEPS = 8;              // it is not smarter at step 20
const DEADLINE = Date.now() + 45_000;
// and: the model signalling done, via a `finish` tool or a stop token

while (steps < MAX_STEPS && Date.now() < DEADLINE && !done) { ... }
```

`MAX_STEPS` around 8 is right for a demo. If your task genuinely needs thirty steps,
the demo is too long anyway, a judge stops watching at ninety seconds.

## Tools

A tool is a typed function with a description. Keep them coarse: one tool that does a
meaningful unit of work beats five that must be chained, because every chain link is
another chance for the model to go sideways on stage.

```ts
export const tools = {
  search_flights: {
    description: "Find flights between two airports on a date.",
    parameters: z.object({ from: z.string(), to: z.string(), date: z.string() }),
    execute: async (a) => withFixture("flights", () => api.search(a), fx.flights),
  },
} satisfies Record<string, Tool>;
```

Note the `withFixture` in `execute`. **Every tool goes through the seam**, tools are
where an agent touches the outside world, so they are exactly where the demo breaks.

Give the model a `finish` tool that takes the final answer. An explicit finish is far
more reliable than parsing free text for a completion signal, and it gives you a clean
place to hang the demo's final render.

## The authorization boundary

The most important design decision in an agent project that touches money, keys, or
anything irreversible, and the first thing a sponsor judge asks about.

> The agent **proposes**. Ordinary code **decides**.

Never give a model an unbounded signer, an arbitrary shell, an arbitrary HTTP client,
or an unbounded SQL string. Concretely:

```ts
// the boundary. plain code, no model involved in the decision.
function authorize(call: ToolCall): "allow" | "confirm" | "deny" {
  if (!ALLOWLIST.has(call.name)) return "deny";
  if (call.name === "send_payment") {
    if (call.args.amount > MAX_AUTO) return "confirm";   // human clicks
    if (!RECIPIENTS.has(call.args.to)) return "deny";
  }
  return "allow";
}
```

Three properties, all enforced outside the model:

- **Allowlist, not blocklist.** The set of callable things is enumerated by you.
- **A hard cap** on any amount, checked in code, that the model cannot argue past.
- **A human confirmation** on anything irreversible, and put that confirmation *on
  screen*, because "the human approves the transfer" is a good demo beat, not an
  interruption to one. A judge watching you click approve sees a designed system.

Prompt instructions are not a boundary. "Never send more than $100" in a system prompt
is a preference; the `if` statement is the control. Say exactly that when asked, and
be able to point at the line.

## Making the loop watchable

An agent that thinks for 40 seconds and prints an answer scores far below the same
agent that shows its work, this is the single biggest scoring gap in agent projects,
and it is a rendering decision, not a modelling one.

Emit an event per step and stream it:

```ts
type Step =
  | { type: "plan"; text: string }
  | { type: "tool_call"; name: string; args: unknown }
  | { type: "observation"; name: string; result: unknown; ok: boolean }
  | { type: "finish"; answer: string };
```

Render them as a live timeline: the plan appears, then each tool name *before* its
result, then the result filling in. Showing the tool name before the call is what
makes it read as *deciding* rather than *replaying*.

Persist steps as rows. It costs nothing, and it means a judge can scroll back through
a run that already happened, which is also your fallback when the live run
misbehaves.

## The timeout problem

An agent loop is the canonical operation that outlives a serverless request. Decide the
shape at design time:

| Loop duration | Shape |
|---|---|
| Under ~5s (one or two tools) | Plain request handler |
| ~5-30s | SSE from a route handler, stream steps as they happen |
| Over ~30s, or unpredictable | Job row + worker + poll/stream the steps table |

The job-row version is barely more work than SSE and removes the entire class of
problem, so if there is any doubt, write the job row. Retrofitting it at hour 20 means
rewriting the route, the client and the state model simultaneously.

## Non-determinism on stage

The demo runs the same prompt every rehearsal and then a judge changes one word.

- **Temperature 0** for anything on the demo path.
- **Pin the model version.** A silently updated default model has changed behavior
  mid-hackathon before.
- **Rehearse the judge's prompt**, not just yours. Try three variations of the task and
  watch what the loop does. Fix the prompt, or constrain the tools, until all three
  finish.
- **Have the recorded run.** `DEMO_MODE=fixture` replays a known-good run, step by
  step, with latency. Judges cannot tell, and you keep your ninety seconds.

## Multi-agent

Do not, unless the multiplicity is the point. Two agents that must agree is twice the
failure surface, twice the latency and twice the cost, for a demo that looks the same
as one agent with more tools.

The exception is when the *interaction itself* is the aha moment (agents negotiating,
competing, or reviewing each other's work) where the second agent is the product
rather than an implementation detail. In that case, keep both loops tiny (3-4 steps
each), constrain the protocol between them hard, and render the exchange as a
conversation, because the exchange is what the judge came to see.
