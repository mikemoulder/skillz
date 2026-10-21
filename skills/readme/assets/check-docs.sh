#!/usr/bin/env bash
# check-docs.sh - documentation gates for a hackathon submission.
#
# Runs the checks a manual read always misses. Run it before every submission,
# and again after the last edit, since em dashes get reintroduced by editing.
#
#   bash assets/check-docs.sh            # from the project root
#   bash assets/check-docs.sh --strict   # warnings become failures too
#
# On Windows use Git Bash. Everything here is POSIX plus bash arrays.
#
# Exit codes: 0 clean, 1 at least one FAIL (or WARN under --strict).

set -uo pipefail

STRICT=0
[ "${1:-}" = "--strict" ] && STRICT=1

FAILS=0
WARNS=0

red()  { printf '\033[31m%s\033[0m\n' "$*"; }
grn()  { printf '\033[32m%s\033[0m\n' "$*"; }
ylw()  { printf '\033[33m%s\033[0m\n' "$*"; }

fail() { red  "FAIL  $*"; FAILS=$((FAILS + 1)); }
warn() { ylw  "WARN  $*"; WARNS=$((WARNS + 1)); }
pass() { grn  "ok    $*"; }

# Documentation files to scan. Adjust if your docs live elsewhere.
DOCS=()
[ -f README.md ] && DOCS+=(README.md)
[ -d docs ] && while IFS= read -r f; do DOCS+=("$f"); done < <(find docs -name '*.md' 2>/dev/null)

if [ ${#DOCS[@]} -eq 0 ]; then
  fail "no README.md found. run this from the project root"
  exit 1
fi

echo "checking: ${DOCS[*]}"
echo

# ── 1. Em dashes ───────────────────────────────────────────────────────────
# The character is U+2014, bytes e2 80 94. Reads as machine written text and
# discounts every claim on the page. Also flags the en dash as a warning.
if grep -n $'\xe2\x80\x94' "${DOCS[@]}" 2>/dev/null; then
  fail "em dash found (see above). replace with a comma, colon, period or parens"
else
  pass "no em dashes"
fi

if grep -qn $'\xe2\x80\x93' "${DOCS[@]}" 2>/dev/null; then
  warn "en dash found. fine in a numeric range, replace it anywhere else"
fi

# ── 2. Machine written tells ───────────────────────────────────────────────
TELLS='seamlessly|cutting.edge|revolutioniz|game.chang|endless possibilities'
TELLS="$TELLS|in today's fast|delve into|unlock(ing)? the power|robust and scalable"
if grep -rniE "$TELLS" "${DOCS[@]}" 2>/dev/null; then
  warn "generic phrasing above. replace each with the specific fact it stands in for"
else
  pass "no generic phrasing"
fi

# ── 3. Unverifiable claims ─────────────────────────────────────────────────
CLAIMS='production.ready|enterprise.grade|battle.tested|fully audited|military.grade'
if grep -rniE "$CLAIMS" "${DOCS[@]}" 2>/dev/null; then
  fail "unverifiable claim above. a hackathon prototype is none of these"
else
  pass "no unverifiable claims"
fi

# ── 4. Placeholders left in ────────────────────────────────────────────────
PLACEHOLDERS='\[PROJECT NAME\]|\[url\]|\[Sponsor|lorem ipsum|TODO|TBD|coming soon|FIXME'
if grep -rniE "$PLACEHOLDERS" "${DOCS[@]}" 2>/dev/null; then
  fail "unfilled placeholder above"
else
  pass "no placeholders"
fi

# ── 5. Local links and images resolve ──────────────────────────────────────
BROKEN=0
while IFS= read -r line; do
  f=${line%%:*}
  target=${line#*:}
  dir=$(dirname "$f")
  # strip any #anchor and ?query
  clean=${target%%#*}; clean=${clean%%\?*}
  [ -z "$clean" ] && continue
  if [ ! -e "$dir/$clean" ] && [ ! -e "$clean" ]; then
    red "      $f references missing file: $clean"
    BROKEN=$((BROKEN + 1))
  fi
# -H always prefixes the file name, so every line is file:target whether one doc or
# many is scanned, and the URL filter applies to the target, not to the file name.
done < <(grep -HoE '\]\([^)#][^)]*\)' "${DOCS[@]}" 2>/dev/null \
         | sed -E 's/\]\(//; s/\)$//' \
         | grep -vE '^[^:]*:(https?:|mailto:|#)' || true)

if [ "$BROKEN" -gt 0 ]; then
  fail "$BROKEN local link(s) or image(s) point at files that do not exist"
else
  pass "local links and images resolve"
fi

# ── 6. Committed secrets ───────────────────────────────────────────────────
if git rev-parse --git-dir >/dev/null 2>&1; then
  if git ls-files --error-unmatch .env .env.local >/dev/null 2>&1; then
    fail ".env or .env.local is tracked by git. remove it and ROTATE the keys"
  else
    pass "no .env tracked"
  fi

  if git log --all -p 2>/dev/null \
     | grep -qE 'sk-[a-zA-Z0-9]{20}|PRIVATE_KEY=[^[:space:]]|SECRET_KEY=[^[:space:]]'; then
    fail "a secret appears in git history. ROTATE the key. rewriting history is not enough"
  else
    pass "no secrets in history"
  fi

  if [ -z "$(git status --porcelain 2>/dev/null)" ]; then
    pass "working tree clean"
  else
    warn "uncommitted changes. the judge clones what is pushed, not what is on disk"
  fi

  # AI authorship markers in commit history. Judges browse history, and a machine
  # co-author on every commit is the most legible "this was generated" signal there is.
  AI_TRAILER='co-authored-by:.*(claude|copilot|chatgpt|gpt-|cursor|codeium|devin|aider)'
  AI_TRAILER="$AI_TRAILER|generated with .*(claude|copilot|cursor|chatgpt)|🤖"
  if git log --format='%n%an <%ae>%n%s%n%b' 2>/dev/null | grep -qiE "$AI_TRAILER"; then
    fail "AI attribution in commit history. see references/voice.md to strip it"
    git log --format='%h %s%n%b' 2>/dev/null | grep -iE "$AI_TRAILER" | head -5 \
      | sed 's/^/        /'
  else
    pass "no AI attribution in commit history"
  fi
else
  warn "not a git repository. skipped secret, history and attribution checks"
fi

# AI attribution in the documentation itself
if grep -rniE 'co-authored-by:.*(claude|copilot|gpt|cursor)|generated with .*(claude|copilot|cursor)|🤖' "${DOCS[@]}" 2>/dev/null; then
  fail "AI attribution in documentation above. remove it"
else
  pass "no AI attribution in docs"
fi

# ── 7. .env.example completeness ───────────────────────────────────────────
if [ -f .env.example ]; then
  if grep -qE '^[A-Z_]+=.+' .env.example; then
    fail ".env.example contains real values. every value must be empty"
  else
    pass ".env.example has no values"
  fi

  if [ -d src ]; then
    MISSING=$(comm -13 \
      <(grep -oE '^[A-Z_0-9]+' .env.example | sort -u) \
      <(grep -rhoE 'process\.env\.[A-Z_0-9]+' src/ 2>/dev/null \
        | sed 's/process\.env\.//' | sort -u) || true)
    if [ -n "$MISSING" ]; then
      warn "read by the code but absent from .env.example:"
      echo "$MISSING" | sed 's/^/        /'
    else
      pass ".env.example covers every variable the code reads"
    fi
  fi
else
  warn "no .env.example. a stranger cannot run this without one"
fi

# ── 8. README shape ────────────────────────────────────────────────────────
WORDS=$(wc -w < README.md | tr -d ' ')
if [ "$WORDS" -gt 1200 ]; then
  warn "README is $WORDS words. over ~800, move sections into docs/"
else
  pass "README length $WORDS words"
fi

# The first fifteen lines carry the submission. Check they contain a link and an image.
HEAD15=$(head -15 README.md)
echo "$HEAD15" | grep -qE '!\[' || warn "no image in the first 15 lines. add the hero screenshot"
echo "$HEAD15" | grep -qE '\]\(https?://' || warn "no link in the first 15 lines. add the demo URL"

# ── Result ─────────────────────────────────────────────────────────────────
echo
echo "$FAILS fail, $WARNS warn"
if [ "$FAILS" -gt 0 ] || { [ "$STRICT" -eq 1 ] && [ "$WARNS" -gt 0 ]; }; then
  red "not ready to submit"
  exit 1
fi
grn "docs gates passed. now verify by hand: links open logged out, screenshots are current"
exit 0
