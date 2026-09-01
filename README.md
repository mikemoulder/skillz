# Hackathon Skills

A customizable set of Claude Code skills for winning hackathons. Each skill is a
directory with a `SKILL.md` (the instructions Claude follows), a `CONFIG.md` (the
knobs you edit), plus `references/` for depth and `assets/` for drop-in code.

## Skills

Run roughly in this order. Each hands specific artifacts to the next.

```text
recon → ideation → architecture → frontend → polish → readme → judge
                        ↑______ workflow runs alongside all of them ______↑
```

| Skill | Covers | Status |
|---|---|---|
| [hackathon-recon](hackathon-recon/) | Learning the field before ideating: official-source research, running the sponsor quickstarts to verify what works, what is saturated, where the openings are | ready |
| [hackathon-ideation](hackathon-ideation/) | Picking the idea in 60 minutes — the three gates, sponsor prize math, idea shapes that win and lose, scoring, the aha moment | ready |
| [hackathon-architecture](hackathon-architecture/) | The smallest design that survives — default stack, parallel lanes, a fixture behind every dependency, risk-first build order, agent and on-chain boundaries | ready |
| [hackathon-frontend](hackathon-frontend/) | Next.js + Tailwind v4 + shadcn scaffold, design tokens, UI copy, imagery, semantics, the five screen states, motion, demo-proofing, deploy | ready |
| [hackathon-polish](hackathon-polish/) | Making real work discoverable: evidence comments, the evaluation map, technical decisions, and renames gated on a green build and the clock | ready |
| [hackathon-readme](hackathon-readme/) | The judge-facing README and repo surface: the first fifteen lines, sponsor integration sections, evidence, setup that works on a stranger's machine, docs gates | ready |
| [hackathon-judge](hackathon-judge/) | Adversarial review before the real judges: requirements matrix, evidence sweep, four hostile lenses, and a fix list that fits the hours left | ready |
| [hackathon-workflow](hackathon-workflow/) | Running the build across sessions: the drop-in CLAUDE.md, memory and handoff files, what to work on next, scope control, verification | ready |
| `hackathon-version-control` | Git under time pressure — branch strategy for 4 people at 3am, commit hygiene that survives judging, recovery from the merge that ate the demo | planned |

## Install

Skills are picked up from `~/.claude/skills/` (all projects) or `.claude/skills/`
(one project). Symlink rather than copy, so edits here take effect everywhere:

```bash
# PowerShell, as Administrator
New-Item -ItemType SymbolicLink `
  -Path "$env:USERPROFILE\.claude\skills\hackathon-frontend" `
  -Target "$PWD\hackathon-frontend"
```

```bash
# Git Bash / macOS / Linux
ln -s "$PWD/hackathon-frontend" ~/.claude/skills/hackathon-frontend
```

Restart Claude Code, then confirm it loaded by asking for it by name.

## Customize

**Edit `CONFIG.md`, not `SKILL.md`.** Each skill reads its config first and adapts
every command, token and component it emits — stack, brand color, demo surface,
time budget, rubric weights. `SKILL.md` holds the reasoning, which rarely needs to
change between hacks; `CONFIG.md` holds this weekend's specifics.

Per-hackathon workflow: copy the skill directory, edit `CONFIG.md` for that event,
point Claude at it. The reasoning stays; the parameters travel.

## House rules

These bind every skill here, including ones not written yet, and they are not
configurable.

**Never add AI attribution to a repository.** No `Co-Authored-By` trailer naming an AI
tool, no "generated with" footer, no robot emoji, in commit messages, pull request
bodies, the README, `docs/`, code comments, the submission form, or the video
description. Turn it off in your tooling before the first commit; stripping it later
rewrites history, and a history rewrite near a deadline is a risk with no upside.

**No em dashes in generated project text.** Use a comma, colon, period, semicolon or
parentheses.

Both rules exist for one reason. Commit history and the README are surfaces judges
read, and organizers check history to confirm the work happened during the event. A
machine authorship marker on every commit is the clearest available signal that a
project was generated rather than engineered, and it invites scrutiny that costs more
than the marker was ever worth. Neither rule is about concealing tool use. They are
about not planting a machine-readable authorship claim in the documents being judged.

`hackathon-readme/assets/check-docs.sh` enforces both.

## Design principle

These skills are opinionated on purpose. A hackathon is a constraint-satisfaction
problem under a hard deadline, and most losing decisions are decisions that should
never have been open in the first place. Where a choice does not change the
outcome, the skill picks one so you do not spend the hour.
