# Workflow skill customization

Edit this file, not the skill body. `SKILL.md` reads these values to know where the
continuity files live, how to verify work, and how strictly to hold the freeze.

Most of this is discoverable from the repo. The two worth filling by hand are
`verify.demo_path` (the files that must be clicked through, which no tool can infer) and
`time.freeze_at`, because the freeze is a decision rather than a fact.

```yaml
# ── Continuity ──────────────────────────────────────────────────────────────
continuity:
  memory:          memory.md      # the project. changes rarely
  handoff:         handoff.md     # the cursor. changes constantly
  claude_md:       CLAUDE.md      # the ambient stance. copy assets/CLAUDE.md in hour one
  update_on:       checkpoint     # checkpoint | session-end. checkpoint is correct:
                                  # you do not know which checkpoint is the last one
  commit_sha:      required       # anchor every handoff to a SHA so it can be verified

# ── Verification ────────────────────────────────────────────────────────────
verify:
  typecheck:       auto           # e.g. npx tsc --noEmit. cheapest useful check
  test:            auto
  build:           auto           # must pass before any commit
  demo_path:       auto           # FILL THIS IN. the files a browser must exercise
  browser_check:   required       # a green build does not prove the button works

# ── Team ────────────────────────────────────────────────────────────────────
team:
  size:            auto
  sessions:        auto           # how many people or agents touch this repo
  lanes:           auto           # from hackathon-architecture. who owns which files
  handoff_audience: both          # human | agent | both. both is the real case

# ── Time ────────────────────────────────────────────────────────────────────
time:
  deadline:        auto
  freeze_at:       auto           # deadline minus 2h. after this, demo-path bugs only
  session_start_min: 3
  session_end_min:   5

# ── Priorities. Reorder only if this event genuinely differs ────────────────
priority:
  - deploy_broken                 # undeployed is unjudged
  - demo_path_broken
  - requirement_unmet
  - aha_moment_not_real
  - rest_of_demo_path
  - states_and_errors
  - readme_and_recording
  - differentiation
  - everything_else
```

## How the knobs bite

| Knob | Effect |
|---|---|
| `continuity.update_on: checkpoint` | Handoff updates at every natural pause, not at session end. This is the setting that survives an unplanned interruption |
| `continuity.commit_sha: required` | Every handoff names a SHA, so the next reader can diff what changed since and catch a stale handoff |
| `verify.demo_path` | Any change touching these files requires a browser check before it is reported done |
| `verify.browser_check: required` | "Build passes" is never accepted as verification for demo path work |
| `team.sessions > 1` | Handoffs get written for a stranger, not for yourself. Assume no shared context |
| `time.freeze_at` | After this, the skill refuses to prioritize anything but demo path bug fixes |
| `priority` | Reordered only for an event whose rules genuinely differ. The default order is correct almost everywhere |

## The one that is usually wrong

`continuity.update_on`. Teams set it to `session-end` because writing a handoff at every
checkpoint feels like overhead. The overhead is about ninety seconds; the cost of not
having one is the forty minutes it takes to reconstruct where work stopped, paid by
whoever picks it up, usually at 4am, usually while the person who knows is asleep.

The interruptions that actually hurt are the ones nobody plans for, and by definition no
handoff gets written for those. `checkpoint` is the only setting that covers them.
