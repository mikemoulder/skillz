#!/usr/bin/env bash
# verify-polish.sh - confirm a polish pass did not break anything.
#
# Run BEFORE the pass to establish a green baseline, and AFTER every mutative
# change. A rename that compiles is not a rename that works, so this checks the
# things a build does not: leftover references, demo path files, doc paths.
#
#   bash verify-polish.sh --build "npm run build"
#   bash verify-polish.sh --build "npm run build" --renamed "utils,run" \
#                         --demo-path "src/app/page.tsx,src/lib/agent.ts"
#
# Run from the project root. On Windows use Git Bash.
# Exit 1 on any failure, so it can gate a commit.

set -uo pipefail

BUILD=""
TYPECHECK=""
RENAMED=""
DEMO_PATH=""

while [ $# -gt 0 ]; do
  case "$1" in
    --build)     BUILD="${2:-}"; shift 2 ;;
    --typecheck) TYPECHECK="${2:-}"; shift 2 ;;
    --renamed)   RENAMED="${2:-}"; shift 2 ;;
    --demo-path) DEMO_PATH="${2:-}"; shift 2 ;;
    *) echo "unknown flag: $1"; exit 2 ;;
  esac
done

FAILS=0
red() { printf '\033[31m%s\033[0m\n' "$*"; }
grn() { printf '\033[32m%s\033[0m\n' "$*"; }
ylw() { printf '\033[33m%s\033[0m\n' "$*"; }
fail() { red "FAIL  $*"; FAILS=$((FAILS + 1)); }
pass() { grn "ok    $*"; }

# ── 1. Checkpoint exists ───────────────────────────────────────────────────
# The whole safety model is "revert in one command". Without a commit there is
# nothing to revert to.
if git rev-parse --git-dir >/dev/null 2>&1; then
  if git log -1 >/dev/null 2>&1; then
    pass "git history exists (revert target: $(git log -1 --format='%h %s' | cut -c1-50))"
  else
    fail "no commits. make a checkpoint before polishing: git commit -am 'checkpoint'"
  fi
  DIRTY=$(git status --porcelain | wc -l | tr -d ' ')
  [ "$DIRTY" -gt 0 ] && ylw "WARN  $DIRTY uncommitted file(s). commit after each rename, not at the end"
else
  fail "not a git repository. polish without a revert path is not worth the risk"
fi

# ── 2. Build ───────────────────────────────────────────────────────────────
if [ -n "$BUILD" ]; then
  printf 'running: %s\n' "$BUILD"
  if OUT=$(eval "$BUILD" 2>&1); then
    pass "build passes"
  else
    fail "build FAILED. if the cause is not obvious in 60s: git reset --hard HEAD"
    echo "$OUT" | tail -20 | sed 's/^/        /'
  fi
else
  ylw "WARN  no --build given. an unverified rename is not worth the risk"
fi

# ── 3. Typecheck ───────────────────────────────────────────────────────────
if [ -n "$TYPECHECK" ]; then
  if eval "$TYPECHECK" >/dev/null 2>&1; then pass "typecheck clean"; else fail "typecheck failed"; fi
elif [ -f tsconfig.json ] && command -v npx >/dev/null 2>&1; then
  if npx --no-install tsc --noEmit >/dev/null 2>&1; then
    pass "typecheck clean (tsc --noEmit)"
  else
    ylw "WARN  tsc --noEmit reported errors, or tsc is unavailable. check by hand"
  fi
fi

# ── 4. Leftover references to renamed symbols ──────────────────────────────
# The compiler catches import breakage. It does not catch a name used as a
# STRING: dynamic imports, string-keyed registries, config paths, fixture names.
if [ -n "$RENAMED" ]; then
  OLDIFS=$IFS; IFS=','
  for name in $RENAMED; do
    IFS=$OLDIFS
    [ -z "$name" ] && continue
    HITS=$(grep -rn "$name" src/ app/ 2>/dev/null \
           --include='*.ts' --include='*.tsx' --include='*.json' --include='*.js' | head -8)
    if [ -n "$HITS" ]; then
      fail "old name '$name' still referenced. a string reference compiles and fails at runtime:"
      echo "$HITS" | sed 's/^/        /'
    else
      pass "no leftover references to '$name'"
    fi
    IFS=','
  done
  IFS=$OLDIFS
fi

# ── 5. Demo path intact ────────────────────────────────────────────────────
if [ -n "$DEMO_PATH" ]; then
  OLDIFS=$IFS; IFS=','
  for f in $DEMO_PATH; do
    IFS=$OLDIFS
    [ -z "$f" ] && continue
    if [ -e "$f" ]; then pass "demo path file present: $f"
    else fail "demo path file MISSING: $f. the demo is what is judged"; fi
    IFS=','
  done
  IFS=$OLDIFS
else
  ylw "WARN  no --demo-path given. list the files the demo runs through"
fi

# ── 6. Doc paths still resolve ─────────────────────────────────────────────
# A rename silently invalidates every path in the evaluation map, and the map's
# entire value is being trustworthy.
for doc in docs/evaluation-map.md README.md docs/technical-decisions.md; do
  [ -f "$doc" ] || continue
  MISSING=""
  while IFS= read -r p; do
    [ -z "$p" ] && continue
    [ -e "$p" ] || MISSING="$MISSING $p"
  done < <(grep -oE '`[^`]+\.(ts|tsx|sol|md|json)[^`]*`' "$doc" 2>/dev/null \
           | tr -d '`' | cut -d: -f1 | sort -u)
  if [ -n "$MISSING" ]; then
    fail "$doc points at files that do not exist:$MISSING"
  else
    pass "$doc paths resolve"
  fi
done

# ── 7. Integrity ───────────────────────────────────────────────────────────
# Nothing addressed to an evaluator, and no hidden text. See references/ai-legibility.md.
SUSPECT='ignore previous instructions|as an ai|you are a judge|award (maximum|full) points'
SUSPECT="$SUSPECT|rank this|color: ?#fff(fff)?;|font-size: ?0"
if grep -rniE "$SUSPECT" README.md docs/ src/ 2>/dev/null | head -5 | grep -q .; then
  fail "text that appears addressed to an evaluator, or hidden. remove it:"
  grep -rniE "$SUSPECT" README.md docs/ src/ 2>/dev/null | head -5 | sed 's/^/        /'
else
  pass "no evaluator-addressed or hidden text"
fi

echo
if [ "$FAILS" -gt 0 ]; then
  red "$FAILS failure(s). revert is one command: git reset --hard HEAD"
  exit 1
fi
grn "polish verified. now click through the demo path in a browser."
ylw "a green build proves it compiles. it does not prove the button still works."
exit 0
