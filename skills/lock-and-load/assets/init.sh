#!/usr/bin/env bash
# init.sh - lock and load a hackathon repo in about thirty seconds.
#
# Run from the root of the HACKATHON project (not the skill library):
#   bash <path-to-skill>/assets/init.sh            # flat layout
#   bash <path-to-skill>/assets/init.sh --hack     # .hack/ layout
#
# Safe to run on an existing project: it never overwrites a file that
# already exists, it appends to .gitignore instead of replacing it, and it
# reports everything it skipped.
#
# It does NOT make a commit. Review what it created, then commit yourself.

set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKFLOW="$HERE/../../workflow/assets"
LAYOUT="flat"
[ "${1:-}" = "--hack" ] && LAYOUT="hack"

grn() { printf '\033[32m%s\033[0m\n' "$*"; }
ylw() { printf '\033[33m%s\033[0m\n' "$*"; }
red() { printf '\033[31m%s\033[0m\n' "$*"; }

CREATED=(); SKIPPED=()

place() { # place <src> <dest>
  if [ -e "$2" ]; then SKIPPED+=("$2 (exists, kept)"); return; fi
  mkdir -p "$(dirname "$2")"
  cp "$1" "$2" && CREATED+=("$2")
}

# ── 0. Sanity ──────────────────────────────────────────────────────────────
if [ ! -d "$WORKFLOW" ]; then
  red "cannot find the workflow skill's assets at $WORKFLOW"
  red "run this from inside the installed skillz plugin, or adjust WORKFLOW"
  exit 1
fi

# ── 1. Git ─────────────────────────────────────────────────────────────────
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  git init -q . && CREATED+=(".git")
fi

# ── 2. .gitignore: append, never replace ───────────────────────────────────
if [ -f .gitignore ]; then
  if grep -q "Deliberately NOT ignored" .gitignore; then
    SKIPPED+=(".gitignore (already has the lock-and-load block)")
  else
    { echo ""; echo "# ── lock-and-load ──"; cat "$HERE/gitignore"; } >> .gitignore
    CREATED+=(".gitignore (appended)")
  fi
else
  cp "$HERE/gitignore" .gitignore && CREATED+=(".gitignore")
fi

# Warn about the markdown trap if someone already set it
if grep -qE '^\*\.md$' .gitignore 2>/dev/null; then
  red "WARNING: .gitignore ignores *.md. That hides docs/ (judge evidence) and"
  red "         handoff.md (shared continuity). See references/repo-hygiene.md"
fi

# ── 3. .env.example ────────────────────────────────────────────────────────
if [ ! -e .env.example ]; then
  printf '# Every key the app reads, with an empty value and where to get one.\n' > .env.example
  if [ -d src ]; then
    grep -rhoE 'process\.env\.[A-Z_0-9]+' src/ 2>/dev/null \
      | sed 's/process\.env\.//' | sort -u | sed 's/$/=/' >> .env.example
  fi
  CREATED+=(".env.example")
fi

# ── 4. The three files ─────────────────────────────────────────────────────
place "$WORKFLOW/CLAUDE.md" "CLAUDE.md"
if [ "$LAYOUT" = "hack" ]; then
  place "$WORKFLOW/handoff.md" ".hack/handoff.md"
  place "$WORKFLOW/memory.md"  ".hack/memory.md"
else
  place "$WORKFLOW/handoff.md" "handoff.md"
  place "$WORKFLOW/memory.md"  "memory.md"
fi

# ── 5. Secrets check ───────────────────────────────────────────────────────
LEAK=0
git ls-files 2>/dev/null | grep -qE '^\.env(\.local)?$' && { red "TRACKED .env file: git rm --cached it and ROTATE the keys"; LEAK=1; }
if git log -1 >/dev/null 2>&1 && git log --all -p 2>/dev/null | grep -qE 'sk-[a-zA-Z0-9]{20}|PRIVATE_KEY=[^[:space:]]'; then
  red "A SECRET IS IN GIT HISTORY. Rotate it. Rewriting history is not enough."; LEAK=1
fi

# ── 6. Pre-existing work ───────────────────────────────────────────────────
if git log -1 >/dev/null 2>&1; then
  FIRST=$(git log --reverse --format='%ad' --date=short | head -1)
  ylw "first commit: $FIRST. if that predates the event, check the rules on prior work"
fi

# ── Report ─────────────────────────────────────────────────────────────────
echo
grn "LOCKED AND LOADED  (layout: $LAYOUT)"
for f in "${CREATED[@]}"; do echo "  created   $f"; done
for f in "${SKIPPED[@]}"; do echo "  kept      $f"; done
[ $LEAK -eq 0 ] && grn "  no secrets tracked or in history"
echo
ylw "next:"
echo "  1. fill in CLAUDE.md: the commands, the demo path files, the deployed URL"
echo "  2. note where to get each key in .env.example"
echo "  3. review, then commit:  git add -A && git commit -m \"chore: initialize project workflow\""
[ "$LAYOUT" = "hack" ] && echo "  4. set /skillz:workflow continuity paths to .hack/ in hackathon.yml"
exit 0
