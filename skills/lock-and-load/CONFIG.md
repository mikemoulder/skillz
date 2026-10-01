# Lock and load customization

Defaults. Copy into `hackathon.yml` at your project root and edit there.

```yaml
# ── Repo layout ─────────────────────────────────────────────────────────────
repo:
  layout:          flat        # flat | .hack/. see references/repo-hygiene.md
                               # flat: handoff.md, memory.md at root
                               # .hack/: both in a .hack/ folder, root stays tidy
  commit_ops_files: true       # handoff and memory are SHARED. never gitignore them
  ignore_markdown: false       # never blanket-ignore *.md. docs/ is judge evidence

# ── State on arrival ────────────────────────────────────────────────────────
project:
  state:           auto        # empty | scaffold | existing | pre-existing-code
  event_window:    auto        # start date. commits before it are a rules question

# ── Commits ─────────────────────────────────────────────────────────────────
commits:
  target:          50          # a direction, not a quota. real 30 beats fake 50
  format:          conventional # feat | fix | test | refactor | docs | chore | perf
  em_dashes:       forbidden
  ai_attribution:  forbidden   # not configurable
  roadmap_phases:  6

# ── Init scope ──────────────────────────────────────────────────────────────
init:
  cap_min:         20
  ci:              none        # none. a failing hook at 3am is a real risk
  hooks:           none
  blocks_deploy:   false       # the deploy in hour one outranks this skill
```

## How the knobs bite

| Knob | Effect |
|---|---|
| `repo.layout: .hack/` | `handoff.md` and `memory.md` go in `.hack/`. `CLAUDE.md` stays at root because Claude Code reads it from there. Update `/skillz:workflow`'s `continuity.*` paths to match |
| `repo.commit_ops_files: false` | Only safe for a solo dev on one machine. Breaks every handoff to another person |
| `repo.ignore_markdown: true` | Refused unless `docs/` is explicitly re-included, because it hides judge-facing evidence |
| `project.state: pre-existing-code` | Stops and checks the event's rules on prior work before anything else |
| `commits.target` | Shapes the roadmap granularity. Never justifies a padding commit |
| `init.ci` / `init.hooks` | Left off. Neither scores and both can fail at the worst moment |

## The one that is usually wrong

`repo.ignore_markdown`. It is set to true because a root full of markdown files looks
messy and the obvious fix is to hide them. The problem is that the files it hides are
exactly the ones other people need: the docs a sponsor judge clicks, and the handoff a
teammate wakes up to. Use `layout: .hack/` instead. It gets the tidy root without hiding
anything.
