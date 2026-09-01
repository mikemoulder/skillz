# Recon brief: [HACKATHON]

<!--
  Two pages. Front-loaded: the parts that change decisions come first.
  Nobody reads fifteen sections at hour one.

  Rules:
    - CONFIRMED / INFERRED / UNKNOWN never blur
    - Nothing here that you have not read in official docs or run yourself
    - The "could not verify" section is required. An empty one is a warning sign
    - No em dashes
-->

**Researched:** [date] · **Deadline:** [date] · **Time on the clock:** [hours]

## The one thing that matters

<!-- If the team reads one line, this is it. Usually the capability that makes this
     event different from any other hackathon they could enter. -->

[One sentence.]

## Decide these first

| Question | Answer | Basis |
|---|---|---|
| Which tracks are we entering? | | prize per likely entrant |
| Which technologies are we learning? | | [2 to 3 max] |
| Which are we skipping, and why? | | [a decision, not an omission] |
| Is there a blocking unknown? | | [ASK ORGANIZERS items below] |

## The hackathon

```text
CONFIRMED   [dates, deadline, tracks, judging criteria and weights,
             submission requirements, prize table]

INFERRED    [reasonable but unstated. marked, always]

UNKNOWN     [you looked and could not find it. this is a finding]
```

**Judging weights:** [the official ones. this decides what to build]

## The technologies

<!-- One card each, max three. Budgets in references/teaching.md.
     A technology the team already uses gets one line, not a card. -->

### [Technology 1]

**What it is.** [Two sentences, plain language, no marketing vocabulary.]

**Why it exists.** [The problem that made someone build it.]

**What it replaces.**

```text
BEFORE  [what you had to do without it. concrete: accounts, waiting, humans]
AFTER   [the call you make, and what comes back]
SO      [what class of application becomes buildable. not "faster"]
```

**You can:**
- [concrete capability]
- [concrete capability]
- [concrete capability]

**You cannot:** <!-- do not skip. this is what kills plans at hour twelve -->
- [limit, quota, unsupported runtime or chain]
- [approval delay, or a key that is not self-serve]

**Costs you:** [setup time, key availability, quota ceiling]

**Spike result:** [ran clean / ran after a fight / did not run. see spike-log.md]

### [Technology 2]

<!-- same shape -->

## How it fits together

<!-- At most seven boxes. Every box is a real thing with a name.
     A box labeled "magic" means you cannot teach this yet. -->

```text
[your app]
    ↓
[the primitive]
    ↓
[what it talks to]
    ↓
[result]
```

## Vocabulary

| Term | Means | Why it matters |
|---|---|---|
| | | |

<!-- Six to ten. Only what is needed to build. Not the glossary. -->

## Already saturated

<!-- Be blunt. This list only works if it names what people will actually build.
     It becomes ideation's novelty floor. -->

```text
[the sponsor's own example app, with a UI]
[the obvious dashboard]
[the obvious chatbot]
```

## Where the openings are

<!-- CAPABILITIES, not projects. "X becomes possible because Y", not "build a Z".
     A project written here makes every later option feel like a worse version of it. -->

```text
[capability that recently became possible, and why]
[an unusual pair: one infrastructure primitive plus one intelligence primitive]
[something in the SDK the docs barely mention]
```

## Could not verify

<!-- Required. Naming uncertainty is more useful than covering it. -->

```text
[claim]                    [why it is unresolved, and what would settle it]
[ASK ORGANIZERS] [anything that decides eligibility. ask before ideation starts]
```

## Idea parking

<!-- One line each. UNEVALUATED. These go to hackathon-ideation, not here. -->

```text
-
-
```

## Sources

```text
[official docs URL]           [version read]
[official GitHub examples]
[changelog]
```

---

**Next:** `hackathon-ideation`. Fill its CONFIG from this brief: `sponsors[]` from the
technology cards, `strategy.avoid` and `novelty_floor` from the saturated list,
`hackathon.*` from the confirmed facts, and the parking list as raw ideas.
