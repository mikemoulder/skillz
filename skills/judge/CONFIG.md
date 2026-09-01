# Judge skill customization

Edit this file, not the skill body. `SKILL.md` reads these values and adapts the rubric
it scores against, how harsh it is, which lenses run, and how large a fix list it is
allowed to return. Anything left at `auto` is researched or read from the repository at
review time, never assumed.

The two that change the output most are `rubric` (score against the real criteria, not a
generic one) and `time.hours_remaining` (which decides whether findings are actionable at
all).

```yaml
# ── The event ───────────────────────────────────────────────────────────────
hackathon:
  name:            auto
  url:             auto        # official rules page. research it, do not assume
  tracks_entered:  auto        # every track, each judged separately
  field_size:      auto        # rough project count. calibrates the novelty bar

# ── Official rubric. Mirror it exactly; generic weights are a wrong answer ───
rubric:
  source:          auto        # official | inferred | generic. say which in the verdict
  technical:       20
  sponsor_usage:   20
  innovation:      20
  impact:          15
  demo:            10
  ux:              10
  completeness:    5

# ── Mandatory requirements. Each becomes a row in the matrix ────────────────
requirements:
  - name:          auto        # e.g. "public repo", "video under 3 min", "on testnet"
    source:        auto        # rules page, track page, sponsor page
    mandatory:     true
    severity:      critical    # critical | high | medium | low, if unmet

# ── Artifacts the review can actually inspect ───────────────────────────────
artifacts:
  repo_path:       .
  demo_url:        auto        # checked live. a slow cold start is a finding
  video_url:       none        # none => the video requirement is UNKNOWN, not PASS
  contract:        none        # address + network, if the project transacts
  submission_text: none        # paste it. the form vs repo diff is a top finding source
  sponsor_pkgs:    auto        # npm scopes to verify, e.g. @circle-fin,@okx

# ── Review behaviour ────────────────────────────────────────────────────────
review:
  depth:           auto        # triage | full. auto picks from hours_remaining
  harshness:       hostile     # fair | hostile. hostile is the default and correct one
  lenses:          all         # all | product,technical,sponsor,demo
  max_findings:    8           # hard cap. a longer list gets nothing fixed
  require_evidence: true       # every score cites a file, a URL or an observation

# ── Time. Decides whether this review is worth running at all ───────────────
time:
  hours_remaining: auto        # under 1 => run cheap points only, and say so
  fix_budget_ratio: 0.5        # the other half is rehearsal, recording, submission
  review_cap_min:  45
```

## How the knobs bite

| Knob | Effect on the review |
|---|---|
| `rubric.source: official` | Scores against the event's real weights. Always research this first |
| `rubric.source: generic` | The verdict must say so. A generic score on a rubric-published event misleads |
| `hackathon.field_size` large | The novelty bar rises. At 200 projects, several teams built your idea |
| `artifacts.video_url: none` | The video requirement is UNKNOWN, never PASS. Most common critical miss |
| `artifacts.submission_text` set | Enables the form versus repo contradiction pass, a top finding source |
| `artifacts.sponsor_pkgs` | The sweep verifies the imports exist. Without it, sponsor depth is a claim |
| `review.harshness: fair` | Use only when the team is demoralized and needs a triage list, not a critique |
| `review.max_findings` | Above roughly 8, nothing gets fixed. The cap is the point |
| `time.hours_remaining < 8` | Forces TRIAGE. Requirements and demo risk only |
| `time.hours_remaining < 1` | Refuses the full review. Returns the cheap points list and says why |

## The one that is usually wrong

`review.harshness`. Teams set it to `fair` because a hostile review is uncomfortable at
hour 30. That is the wrong trade: the discomfort of a hostile review is cheap, and the
discomfort of a real judge finding the same thing is not. The setting exists for one
narrow case, which is a team that is already spiralling and needs a short actionable list
rather than an accurate critique. Everywhere else, `hostile` is correct, and pairing it
with the winning case in step 5 is what keeps it usable rather than demoralizing.
