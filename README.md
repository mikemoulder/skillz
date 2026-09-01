# Hackathon Skills

A Claude Code plugin: nine skills for winning hackathons. Each skill is a
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
| [recon](skills/recon/) | Learning the field before ideating: official-source research, running the sponsor quickstarts to verify what works, what is saturated, where the openings are | ready |
| [ideation](skills/ideation/) | Picking the idea in 60 minutes: the three gates, sponsor prize math, idea shapes that win and lose, scoring, the aha moment | ready |
| [architecture](skills/architecture/) | The smallest design that survives: default stack, parallel lanes, a fixture behind every dependency, risk-first build order, agent and on-chain boundaries | ready |
| [frontend](skills/frontend/) | Next.js + Tailwind v4 + shadcn scaffold, design tokens, UI copy, imagery, semantics, the five screen states, motion, demo-proofing, deploy | ready |
| [polish](skills/polish/) | Making real work discoverable: evidence comments, the evaluation map, technical decisions, and renames gated on a green build and the clock | ready |
| [readme](skills/readme/) | The judge-facing README and repo surface: the first fifteen lines, sponsor integration sections, evidence, setup that works on a stranger's machine, docs gates | ready |
| [judge](skills/judge/) | Adversarial review before the real judges: requirements matrix, evidence sweep, four hostile lenses, and a fix list that fits the hours left | ready |
| [workflow](skills/workflow/) | Running the build across sessions: the drop-in CLAUDE.md, memory and handoff files, what to work on next, scope control, verification | ready |
| `version-control` | Git under time pressure: branch strategy for 4 people at 3am, commit hygiene that survives judging, recovery from the merge that ate the demo | planned |

## Install

This repo is a Claude Code plugin marketplace. Two commands, from any terminal:

```bash
claude plugin marketplace add MikeMoulder/skillz
claude plugin install skillz@skillz
```

Restart Claude Code, then invoke any skill as `/skillz:recon`, `/skillz:ideation`, and
so on. Claude also loads them on its own when a request matches a skill's description,
so you rarely have to type them.

In the terminal CLI you can use the slash forms instead (`/plugin marketplace add ...`,
`/plugin install ...`). Those are not available in the VSCode extension, so the `claude
plugin` commands above are the ones that work everywhere.

Private repos work the same way: add your friends as collaborators and they run the
same two commands. For quiet auto-updates on a private repo, they need SSH configured
(`ssh-agent`) or a git credential helper.

Update to the latest version with `claude plugin marketplace update skillz`. Pin to a tag
with `claude plugin marketplace add MikeMoulder/skillz@v1.0`.

### Developing on it

If you are editing the skills, symlink instead so changes take effect live:

```bash
# Git Bash / macOS / Linux
ln -s "$PWD/skills" ~/.claude/skills/skillz
```

```powershell
# PowerShell, as Administrator
New-Item -ItemType SymbolicLink `
  -Path "$env:USERPROFILE\.claude\skills\skillz" -Target "$PWD\skills"
```

## Customize

**Do not edit `CONFIG.md` inside the plugin.** A plugin update overwrites it.

At the start of an event, copy the relevant skill's `CONFIG.md` into a `hackathon.yml`
at the root of your hackathon project and edit that copy. Every skill reads
`hackathon.yml` first and falls back to its own `CONFIG.md` for defaults.

```bash
cp ~/.claude/plugins/*/skillz/skills/ideation/CONFIG.md ./hackathon.yml
```

`SKILL.md` holds the reasoning, which rarely changes between hacks. `hackathon.yml`
holds this weekend's specifics: sponsors, rubric weights, brand color, demo surface,
hours remaining. The reasoning stays; the parameters travel.

## How discovery works

Claude Code reads only the YAML frontmatter (`name` and `description`) of every skill
at session start. The body loads when a request matches, or when you type the command.
`references/` and `assets/` load only when a skill tells Claude to read one.

So nine skills cost you nine descriptions of context, not nine thousand lines.

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

`skills/readme/assets/check-docs.sh` enforces both.

## Design principle

These skills are opinionated on purpose. A hackathon is a constraint-satisfaction
problem under a hard deadline, and most losing decisions are decisions that should
never have been open in the first place. Where a choice does not change the
outcome, the skill picks one so you do not spend the hour.
