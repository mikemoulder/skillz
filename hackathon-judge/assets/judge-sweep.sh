#!/usr/bin/env bash
# judge-sweep.sh - gather evidence for an adversarial hackathon review.
#
# This script GATHERS, it does not judge. It answers the questions a grep can
# answer, so the review spends its time on the questions a grep cannot.
#
#   bash judge-sweep.sh
#   bash judge-sweep.sh --url https://app.vercel.app --sponsors @circle-fin,@okx
#   bash judge-sweep.sh --url ... --since 2026-08-29     # event start date
#
# Run from the project root. On Windows use Git Bash.
# Exit is always 0: findings are for a human to weigh, not a gate.

set -uo pipefail

URL=""
SPONSORS=""
SINCE=""
SRC="src"

while [ $# -gt 0 ]; do
  case "$1" in
    --url)      URL="${2:-}"; shift 2 ;;
    --sponsors) SPONSORS="${2:-}"; shift 2 ;;
    --since)    SINCE="${2:-}"; shift 2 ;;
    --src)      SRC="${2:-}"; shift 2 ;;
    *) echo "unknown flag: $1"; exit 2 ;;
  esac
done

hdr() { printf '\n\033[1m== %s\033[0m\n' "$*"; }
red() { printf '\033[31m%s\033[0m\n' "$*"; }
ylw() { printf '\033[33m%s\033[0m\n' "$*"; }
grn() { printf '\033[32m%s\033[0m\n' "$*"; }
note() { printf '   %s\n' "$*"; }

[ -d "$SRC" ] || { ylw "no $SRC/ directory. pass --src <dir> if the code lives elsewhere"; SRC=""; }

# ── 1. Is the deployed thing real ──────────────────────────────────────────
hdr "deployment"
if [ -n "$URL" ]; then
  if command -v curl >/dev/null 2>&1; then
    COLD=$(curl -s -o /dev/null -w '%{http_code} %{time_total}' -L --max-time 30 "$URL" 2>/dev/null)
    WARM=$(curl -s -o /dev/null -w '%{http_code} %{time_total}' -L --max-time 30 "$URL" 2>/dev/null)
    CODE=${COLD%% *}; CT=${COLD##* }; WT=${WARM##* }
    note "status $CODE   cold ${CT}s   warm ${WT}s"
    case "$CODE" in
      200) grn "   URL responds" ;;
      401|403) red "   FINDING: auth wall. a judge cannot open this. check a private window" ;;
      000) red "   FINDING: no response. the demo URL is dead" ;;
      *)   red "   FINDING: HTTP $CODE" ;;
    esac
    # crude float compare without bc
    if [ "${CT%%.*}" -ge 3 ] 2>/dev/null; then
      red "   FINDING: cold start ${CT}s. the judge's first impression is a blank screen"
    fi
    note "verify by hand: open $URL in a PRIVATE window. preview deploys often ask for login"
  else
    ylw "curl not found. check the URL by hand, logged out"
  fi
else
  ylw "no --url given. the deployment requirement stays UNKNOWN, not PASS"
fi

# ── 2. Sponsor integrations ────────────────────────────────────────────────
hdr "sponsor integrations"
if [ -n "$SPONSORS" ] && [ -n "$SRC" ]; then
  OLDIFS=$IFS; IFS=','
  for pkg in $SPONSORS; do
    IFS=$OLDIFS
    [ -z "$pkg" ] && continue
    IMPORTS=$(grep -rl --include='*.ts' --include='*.tsx' --include='*.js' \
              "from ['\"]$pkg\|require(['\"]$pkg" "$SRC" 2>/dev/null | head -5)
    CALLS=$(grep -rc --include='*.ts' --include='*.tsx' "$pkg" "$SRC" 2>/dev/null \
            | awk -F: '{s+=$2} END {print s+0}')
    # grep -c prints 0 and exits 1 on no match; take the first line and default it
    IN_PKG=$(grep -c "\"$pkg" package.json 2>/dev/null | head -1)
    IN_PKG=${IN_PKG:-0}

    printf '   %-28s ' "$pkg"
    if [ -z "$IMPORTS" ] && [ "$IN_PKG" -gt 0 ]; then
      red "DECORATIVE: in package.json, imported nowhere in $SRC/"
    elif [ -z "$IMPORTS" ]; then
      red "ABSENT: not in package.json and not imported. any claim about it is false"
    else
      grn "imported ($CALLS refs)"
      echo "$IMPORTS" | sed 's/^/        /'
      note "     read the call site: is it ON the demo path, or beside it?"
    fi
    IFS=','
  done
  IFS=$OLDIFS
else
  ylw "no --sponsors given. sponsor depth stays a claim, not evidence"
fi

# ── 3. What is mocked ──────────────────────────────────────────────────────
hdr "mocks and placeholders"
if [ -n "$SRC" ]; then
  MOCKS=$(grep -rniE "mock|dummy|fake|placeholder|hardcod|not implemented|stub" \
          --include='*.ts' --include='*.tsx' "$SRC" 2>/dev/null | grep -viE "fixture|seed" | head -12)
  TODOS=$(grep -rnE "TODO|FIXME|XXX|HACK" --include='*.ts' --include='*.tsx' "$SRC" 2>/dev/null | head -8)
  if [ -n "$MOCKS" ]; then
    ylw "possible mocks. a DISCLOSED fixture is fine; an undisclosed one is a finding:"
    echo "$MOCKS" | sed 's/^/        /'
  else
    grn "   no obvious mocks"
  fi
  [ -n "$TODOS" ] && { ylw "TODO markers:"; echo "$TODOS" | sed 's/^/        /'; }
  note "compare against the README's 'what is real, what is not' section"
  grep -qi "what is real\|currently mocked\|demo data\|recorded" README.md 2>/dev/null \
    && grn "   README discloses fixtures" \
    || red "   FINDING: README has no disclosure section. judges ask 'is that live?'"
fi

# ── 4. README claims with no code signal ───────────────────────────────────
hdr "claim gap"
if [ -f README.md ] && [ -n "$SRC" ]; then
  check_claim() { # $1 claim regex, $2 code-signal regex, $3 message
    if grep -qiE "$1" README.md 2>/dev/null; then
      if grep -rqiE "$2" "$SRC" 2>/dev/null; then
        grn "   '$3' claimed, code signal present"
      else
        red "   FINDING: README claims '$3', no matching code signal in $SRC/"
      fi
    fi
  }
  check_claim "real.?time"        "EventSource|websocket|new WebSocket|text/event-stream" "real time"
  check_claim "autonomous"        "while |for \(|maxSteps|MAX_STEPS|agent" "autonomous"
  check_claim "on.?chain|smart contract" "ethers|viem|web3|wagmi" "on chain"
  check_claim "multi.?agent"      "agents\[|Agent\(.*Agent\(" "multi agent"
  note "each of these needs a human read. a grep proves a signal, not a claim"
else
  ylw "no README.md or no source dir. skipped"
fi

# ── 5. Provenance ──────────────────────────────────────────────────────────
hdr "provenance"
if git rev-parse --git-dir >/dev/null 2>&1; then
  FIRST=$(git log --reverse --format='%ad' --date=short 2>/dev/null | head -1)
  LAST=$(git log -1 --format='%ad' --date=short 2>/dev/null)
  N=$(git rev-list --count HEAD 2>/dev/null)
  note "$N commits, $FIRST to $LAST"
  if [ -n "$SINCE" ] && [ -n "$FIRST" ] && [ "$FIRST" \< "$SINCE" ]; then
    red "   FINDING: commits predate $SINCE. check the rules on pre-existing code"
    git log --format='%ad %s' --date=short --until="$SINCE" 2>/dev/null | tail -3 | sed 's/^/        /'
  fi
  git log --all -p 2>/dev/null | grep -qE 'sk-[a-zA-Z0-9]{20}|PRIVATE_KEY=[^[:space:]]' \
    && red "   FINDING: secret in git history. ROTATE the key" \
    || grn "   no secrets in history"
  git log --format='%b' 2>/dev/null | grep -qiE "co-authored-by:.*(claude|copilot|gpt|cursor)" \
    && red "   FINDING: AI co-author trailer in history. see hackathon-readme/references/voice.md" \
    || grn "   no AI attribution in history"
else
  ylw "not a git repository"
fi

# ── 6. Submission surface ──────────────────────────────────────────────────
hdr "submission surface"
[ -f README.md ]     && grn "   README.md present" || red "   FINDING: no README"
[ -f .env.example ]  && grn "   .env.example present" || ylw "   no .env.example. nobody outside the team can run this"
[ -f LICENSE ]       && grn "   LICENSE present" || note "no LICENSE (required at some events)"
ls package-lock.json yarn.lock pnpm-lock.yaml >/dev/null 2>&1 \
  && grn "   lockfile present" || ylw "   no lockfile. a fresh clone may resolve different versions"
if [ -f README.md ]; then
  head -15 README.md | grep -qE '\]\(https?://' \
    && grn "   link in the first 15 lines" \
    || red "   FINDING: no demo link above the fold"
  head -15 README.md | grep -qE '!\[' \
    && grn "   image in the first 15 lines" \
    || red "   FINDING: no screenshot above the fold"
fi

# ── What this cannot see ───────────────────────────────────────────────────
hdr "not checked by this script"
cat <<'EOT'
   Whether the demo actually runs on venue wifi, on a projector
   Latency and feel. A 4s interaction reads fine in code and badly on stage
   Whether the video exists, is under the limit, and plays logged out
   Console errors on load. Open devtools yourself
   Whether the integration is GOOD, only that it exists
   The field. Whether three other teams built this
   Live Q&A, which is where technical depth is really tested
EOT
printf '\n'
ylw "these need a human. list them as unchecked in the verdict, not as passed"
exit 0
