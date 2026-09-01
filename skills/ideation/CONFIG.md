# Ideation skill customization

Edit this file, not the skill body. `SKILL.md` reads these values and adapts which
ideas it generates, how it scores them, and how hard it cuts. Anything left at `auto`
is researched or inferred at ideation time from the hackathon brief. Fill in the
sponsor block and the rubric if you fill in nothing else, those two change the output
more than everything below them combined.

```yaml
# ── The event ───────────────────────────────────────────────────────────────
hackathon:
  name:            auto
  theme:           auto        # the organizers' words, not your paraphrase
  url:             auto        # official page, the skill researches from here
  tracks:          auto        # list. each track is a separate prize pool
  format:          in-person   # in-person | online | hybrid
  size:            auto        # rough project count. drives how novel you must be

# ── Sponsors ────────────────────────────────────────────────────────────────
# The single highest-leverage block. Prize per entrant is usually far better on a
# sponsor track than on the grand prize.
sponsors:
  - name:          auto
    tech:          auto        # the SDK/API/chain you would actually integrate
    prize:         auto        # amount, or "swag", both are worth knowing
    must_use:      false       # true => hard requirement for that track
target_tracks:     2           # how many prizes to aim at. 2 is right. 4 is a tell.

# ── Constraints ─────────────────────────────────────────────────────────────
team:
  size:            auto
  strengths:       auto        # frontend | backend | ml | smart-contracts | design | data
  known_stack:     auto        # what you can write at 3am without reading docs
  new_tech_ok:     true        # false => never propose an SDK nobody has touched

time:
  total_hours:     auto
  build_hours:     auto        # total minus sleep, food, pitch prep. If < 8: SALVAGE
  ideation_cap_min: 60         # hard cap. the skill commits when this expires

requires:
  deployed_url:    true
  video:           false       # length, if required
  open_source:     true
  hardware:        none        # none | available | required

# ── Ambition ────────────────────────────────────────────────────────────────
strategy:
  risk:            balanced    # safe | balanced | swing, see the table below
  domain:          auto        # ai-agents | web3 | devtools | consumer | data | climate | health
  avoid:           auto        # shapes or topics you refuse to build. list.
  novelty_floor:   6           # 1-10. reject ideas scoring under this on novelty

# ── Judging rubric (mirror the official one; 0 if not scored) ───────────────
rubric:
  demo_wow:        20
  technical:       20
  innovation:      15
  tech_integration: 15
  impact:          15
  feasibility:     15          # not usually judged, kept because unfinished scores 0
```

## How the knobs bite

| Knob | Effect on what gets proposed |
|---|---|
| `sponsors[].must_use: true` | That technology becomes a gate, not a preference. Ideas without it are not generated. |
| `target_tracks: 2` | The skill looks for the idea that wins two prizes at once, and refuses to bolt on a third integration. |
| `time.build_hours < 8` | **SALVAGE MODE**, no new ideas, re-frame what already runs. |
| `team.new_tech_ok: false` | Every idea must be buildable in `known_stack`. Kills most ambitious proposals, on purpose. |
| `strategy.risk: safe` | Feasibility weighted double; nothing proposed that the team has not done something close to. |
| `strategy.risk: swing` | Novelty and technical depth weighted double; feasibility floor drops to 4. Play this only with a strong team and a full clock. |
| `hackathon.size` large | Novelty floor rises, at 200 projects, three teams have your safe idea. |
| `requires.hardware: none` | Physical-device ideas are not generated, however good. |
| `rubric.*` | Replaces the default scoring weights outright. Score what is actually scored. |

## The risk setting, concretely

| `strategy.risk` | Means | Choose when |
|---|---|---|
| `safe` | Known stack, one new API max, certain to finish | Small team, short clock, first hackathon |
| `balanced` | One genuinely hard component, everything else familiar | The default. Almost always correct |
| `swing` | The whole project is the hard part | Big clock, strong team, and a grand prize worth the variance |

A `swing` that does not finish scores below a `safe` that does. The variance is real,
and it is asymmetric: judges see the working modest thing, and never see what your
broken ambitious thing was supposed to be.
