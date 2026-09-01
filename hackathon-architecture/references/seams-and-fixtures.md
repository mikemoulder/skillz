# Seams and fixtures

A seam is the one place a dependency is called, wrapped so it can be replaced by a
recorded response. It is the cheapest insurance available at a hackathon and the
single highest-return hour of architecture work.

## Why this is not optional

Ranked by how often each has killed a demo:

1. **Venue wifi.** Captive portal, or 3 Mbps shared with 200 laptops.
2. **A rate limit**, usually on an LLM, usually mid-sentence, usually because you
   rehearsed four times in ten minutes.
3. **An expired or exhausted key.** Free trial credits end during judging.
4. **A cold start** on the dependency's side. Eight seconds of silence on stage.
5. **A testnet RPC going down.** They do, without warning, and there is no fix.
6. **The dependency changing its response shape** because you are on a preview API.

None of these are your bug, all of them are your problem, and every one costs zero if
there is a fixture behind the call.

The second reason is more mundane and matters just as much: **fixtures unblock the
team.** The UI lane cannot wait for the integration lane. With a seam, it never does.

## The shape

```text
route handler / agent
        │
        ▼
  src/lib/llm.ts          ← the seam. the ONLY file that imports the SDK
        ├── live()        ← the real call
        └── fixture()     ← a recorded response, committed to the repo
```

One rule keeps this honest: **the SDK is imported in exactly one file.** If
`import OpenAI` appears in three places, you do not have a seam, you have three
integrations. Grep for it before you claim to be demo-proof:

```bash
grep -rn "from \"openai\"\|from 'ethers'\|createClient(" src/ --include=*.ts | grep -v "src/lib/"
```

`assets/seam.ts` is the drop-in wrapper. It gives every dependency a timeout, one
retry, a fixture fallback, and a record of which path each call took so the UI can be
honest about it.

## Recording fixtures

Record the moment the live call works, not later. "Later" is 4am, and the key is
exhausted.

```ts
const res = await live();
if (process.env.RECORD === "1") {
  fs.writeFileSync(`fixtures/${name}.json`, JSON.stringify(res, null, 2));
}
```

```bash
RECORD=1 npx tsx spike.ts     # run once, while it works. commit the output
```

Record **three** responses per dependency, not one:

| Fixture | Why |
|---|---|
| The happy path | The demo |
| A slow one | So you can see your own loading states. Add fake latency |
| An error/refusal | So the error state is built and tested, not theoretical |

Commit them. Fixtures in `.gitignore` are fixtures the person deploying does not have.

## Which dependencies get which treatment

| Dependency | Treatment | Note |
|---|---|---|
| **LLM** | Full fixture, always | Slowest, most rate-limited, most non-deterministic |
| **Chain reads** (balances, state) | Fixture | RPCs die; reads are trivially recordable |
| **Chain writes** (transactions) | Pre-signed / pre-sent tx hash | Cannot fake a real send; can show a real prior one |
| **Third-party API** | Fixture | Especially anything with a free tier |
| **Payment rails** | Fixture + one real run recorded on video | The one place video is better than live |
| **Your own database** | No fixture | If your own DB is down, fixtures will not save you |
| **Auth provider** | Delete it | Hardcode a user. See `SKILL.md`, what not to build |

## Fake latency is a feature

A fixture that returns in 0ms makes the demo look fake and hides every loading state
you built. Add 300-800ms, and for an agent loop, stream the recorded steps out with
gaps between them.

```ts
await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));
```

This is not deception. It is the difference between a judge seeing the interface you
designed and a judge seeing a flash. The frontend skill makes the same argument about
seed data for the same reason.

## Demo mode

One environment variable, three settings:

```text
DEMO_MODE=live      every call is real. use while building
DEMO_MODE=fixture   nothing leaves the process. use on stage
DEMO_MODE=auto      try live, fall back to fixture on failure or timeout (default)
```

`auto` is right for development. **`fixture` is right for the live demo**, even when
the network is fine — it removes every variable you do not control from the three
minutes that decide your score. Set it in the host dashboard before you present, and
verify the deployed URL is actually running in that mode.

## Being honest about it

Judges find out. Usually by asking "is that live?", which they ask precisely because
they have seen a lot of demos.

Volunteering it costs almost nothing:

- A small `demo data` badge in the UI shell.
- One line in the pitch: "the counterparty is a recorded fixture; the agent loop and
  the settlement are real."
- A `## What is real` section in the README, listing both columns honestly.

Getting caught after claiming everything was live costs the judge's trust in every
other claim you made — including the true ones, which is the expensive part.

## The test

Fifteen minutes before you present, on the deployed URL:

```text
[ ] devtools → Network → Offline
[ ] hard reload
[ ] walk the entire demo path
[ ] the aha moment still happens
```

If it does not, the seam is incomplete, and you have found the exact call that will
fail on stage while there is still time to record it.
