<!--
  README template. Fill in, delete what does not apply, delete every comment.
  Target: under 800 words. Anything longer moves to docs/.
  Hard rule: no em dashes anywhere. Run assets/check-docs.sh before submitting.

  The order below is deliberate. A judge reads the first fifteen lines and decides
  whether to continue, so the payload is at the top and depth accumulates downward.
-->

# [Project Name]

**[One sentence: what it does, for whom, and the thing that was previously hard.]**

[Live demo]([url]) · [90 second video]([url]) · [Verified contract]([explorer url])

![[The product doing the interesting thing]](assets/screenshots/hero.gif)

Built at [Hackathon] with [Sponsor A] and [Sponsor B].

<!-- Everything above this line is the part most judges read. If you run out of
     time, the five elements above plus the sponsor table below are the submission. -->

---

## The problem

<!-- 60 words. One person, one situation, in human terms. No market statistics,
     no "in today's world". Who suffers, what they do now, why that is bad. -->

[A named role does a specific painful thing today. It takes N hours, or it fails in a
specific way, or it requires trusting someone they should not have to trust.]

## What we built

<!-- 100 words. Concrete and flat. Let the screenshot carry the impression. -->

[What the user does, what happens, what they get. The actual workflow, not the vision.]

![[A second screen worth showing]](assets/screenshots/[name].png)

## Sponsor integrations

<!-- The `Where` column is what makes this evidence instead of a list of logos.
     Verify every path before committing:
       grep -rn "from ['\"]@sponsor" src/ --include=*.ts -->

| Technology | Role in the system | Where |
|---|---|---|
| [Sponsor SDK] | [Its structural role, in one clause] | [`src/lib/x.ts`](src/lib/x.ts) |
| [Sponsor API] | [Its structural role] | [`src/lib/y.ts`](src/lib/y.ts) |

### [Sponsor A]

<!-- Four sentences: what it provides, how you use it, what would be harder without
     it, where it lives. Sentence three is the one that wins track prizes. -->

[What the technology provides, in terms that show you read past the quickstart. What
your system uses it for, structurally. What would be harder or impossible without it.
Where the integration lives.]

<!-- If you hit a real edge of their SDK, say so here. It is the strongest signal
     available and it cannot be faked:
     **A note on [the thing].** [What surprised you, how you solved it, the file.] -->

## How it works

<!-- 150 words plus one diagram. Every box in the diagram is a folder in this repo
     or a URL you can open. Delete any box that is neither. -->

```text
      User
        │
        ▼
   [Frontend]  ──►  [API]  ──►  [The hard part]
                       │              │
                       ▼              ▼
                  [Database]     [External]
```

1. [User does the thing.]
2. [System does the thing.]
3. [The interesting step.]
4. [Result appears.]

## Technical highlights

<!-- Three bullets, 30 words each. The parts that were genuinely hard, and why. -->

- **[The hard part].** [What made it hard and what you did about it.]
- **[The second one].** [Same.]
- **[The third].** [Same.]

## Quick start

<!-- Test this from a fresh clone before you commit it. Every failure there is a
     bug here. See references/setup-that-works.md. -->

```bash
git clone [repo] && cd [dir]
cp .env.example .env.local     # fill in the keys below
npm install
npm run dev                    # http://localhost:3000
```

Requires Node 20 or later.

**You should see** [what a successful run looks like]. [With no API key set, runs
replay recorded fixtures, so the app works without credentials.]

| Variable | What it is | Where to get one |
|---|---|---|
| `DATABASE_URL` | Postgres connection string | [Supabase free tier] |
| `[KEY]` | [Purpose] | [url] |

## What is real, what is not

<!-- The highest credibility per word in this document. Do not move it to docs/. -->

**Real:** [the parts that genuinely work, and on which network].

**Recorded:** [what runs from a fixture during the demo, and why].

**Not built:** [what is described under Vision but does not exist].

## Limitations

- [Prototype assumption a reader would otherwise discover.]
- [Centralized component.]
- [Testnet dependency, rate limit, or manual step.]

## Roadmap

<!-- Never blend these three. A vision item written as if built is the most
     expensive error in this file. -->

**Built:** [what exists today]
**Next:** [what you would do with another week]
**Vision:** [where this goes, clearly marked as not yet built]

## Why it matters

<!-- Close by returning to the problem. One short paragraph. Ambitious framing,
     factual claims. This is the one place to be expansive. -->

[What becomes possible if this works, stated as a direction rather than an
achievement.]

---

Built by [names] at [Hackathon], [dates].
