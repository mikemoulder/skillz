# Recon skill customization

Edit this file, not the skill body. `SKILL.md` reads these values to decide how many
technologies to learn, how deep to go, and how much to explain versus assume.

The one that changes the output most is `user.knows`. Explaining a primitive the user
already uses daily wastes the hour this skill has; assuming familiarity they do not have
produces a brief they cannot act on.

```yaml
# ── Inputs. Whatever the user has. Partial is normal ────────────────────────
input:
  announcement:    auto        # pasted text, a URL, or a name
  hackathon_url:   auto        # fetch this. never trust the announcement alone
  sponsors_known:  auto        # what the user already named
  deadline:        auto

# ── The user ────────────────────────────────────────────────────────────────
user:
  knows:           auto        # technologies they already build with. do not explain these
  new_to:          auto        # what needs the full treatment
  depth:           working     # overview | working | deep
                               # working = enough to design and build. the default
  stack:           auto        # their language and framework. gates what is learnable

# ── Scope of the research ───────────────────────────────────────────────────
learn:
  max_technologies: 3          # learning six shallowly is the same as learning none
  official_only:   true        # third party for context, never for a technical claim
  spike:           required    # RUN the quickstart. docs say what it should do
  spike_minutes:   15          # per technology
  saturated_scan:  required    # what everyone will build. sets ideation's novelty floor

# ── Honesty ─────────────────────────────────────────────────────────────────
verify:
  from_memory:     forbidden   # model memory of an SDK goes stale. always fetch
  unverified_list: required    # an empty "could not verify" section is a warning sign
  mark_inferred:   required    # confirmed / inferred / unknown never blur
  ask_organizers:  auto        # ambiguous rules become a Discord question, not a guess

# ── Output ──────────────────────────────────────────────────────────────────
brief:
  template:        assets/brief.md
  max_pages:       2           # front-loaded. nobody reads 15 sections at hour one
  idea_parking:    true        # capture sparks, do not develop them. that is ideation
  populate_ideation_config: true

# ── Time ────────────────────────────────────────────────────────────────────
time:
  recon_cap_min:   60
  stop_when:       explainable # you can explain it without hedging. not "read everything"
```

## How the knobs bite

| Knob | Effect |
|---|---|
| `user.knows` | Those technologies get one line, not a card. Never explain what they use daily |
| `user.depth: overview` | Cards only, no spike. Correct when the user is choosing between events, not building yet |
| `user.depth: deep` | Adds the API surface and the failure modes. Costs a second hour |
| `user.stack` | An SDK with no binding for their language is flagged as a lane cost, not a feature |
| `learn.max_technologies: 3` | Hard cap. The fourth is skipped explicitly, with the reason recorded |
| `learn.spike: required` | The quickstart is run. Without it, everything in the brief is a claim |
| `verify.from_memory: forbidden` | Docs get fetched even when the model is confident. Especially then |
| `verify.unverified_list: required` | Uncertainty is named rather than covered |
| `brief.populate_ideation_config` | Recon writes ideation's CONFIG directly, so it skips its own research |

## The one that is usually wrong

`learn.max_technologies`. Teams raise it because a hackathon lists eight sponsors and
skipping five feels like leaving prizes on the table. It is the opposite: the prizes go
to depth, the sponsor judge is an engineer who can spot a shallow integration in one
question, and a brief covering eight technologies at a paragraph each teaches nothing
about any of them.

Three is the ceiling for a weekend. Two is often better. The right move for the other
five is to name them and say why you skipped them, which is a decision you can defend
rather than an omission you have to explain.
