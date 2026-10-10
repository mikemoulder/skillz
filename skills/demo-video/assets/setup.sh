#!/usr/bin/env bash
# setup.sh: fetch the cinetic director skill (pinned), check the machine, and start a demo film.
#
# Usage:
#   bash setup.sh --locate          print the cinetic skill directory, fetching it if needed
#   bash setup.sh --check           check the machine against cinetic's requirements
#   bash setup.sh <film-dir> [--fps 60] [--bpm 100] [--size 1920x1080] [--name demo]
#                            [-- extra new-film.sh args, e.g. --font figtree]
#
# cinetic is found in this order: $CINETIC_DIR, ~/.claude/skills/cinetic, ./.claude/skills/cinetic,
# a Claude Code plugin install (~/.claude/plugins/{marketplaces,cache}/cinetic/...), then a shallow
# clone of $CINETIC_REPO at $CINETIC_REF (default v1.1.0) in ~/.cache/skillz/cinetic-<ref>. The
# clone is pinned so every film on a team is directed by the same version of the rules.
#
# A film project is cinetic's starter (new-film.sh, UI walkthrough defaults: 60 fps, 100 BPM)
# plus this skill's tools: scripts/voiceover.py, scripts/vo-cues.ts, scripts/capture.mjs,
# scripts/audio/vo_mix.py, vo/script.json, and npm scripts vo, vo:dry, vo:cues and vo:mix.
#
# cinetic's scripts are bash and target macOS and Linux. On Windows run this inside WSL2, in the
# Linux filesystem (~/films/...), not under /mnt/c, which is several times slower to render from.
#
# Exit codes: 0 done; 1 a missing requirement or a failed step (the message says which).
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="${CINETIC_REPO:-https://github.com/Leonxlnx/cinetic}"
REF="${CINETIC_REF:-v1.1.0}"
CACHE="${XDG_CACHE_HOME:-$HOME/.cache}/skillz/cinetic-$REF"

die() { echo "setup: $*" >&2; exit 1; }
usage() { sed -n '2,/^set -euo/p' "$0" | sed '$d' | sed 's/^# \{0,1\}//'; }

locate() {
  local d
  for d in "${CINETIC_DIR:-}" "$HOME/.claude/skills/cinetic" "$PWD/.claude/skills/cinetic" \
           "$HOME/.claude/plugins/marketplaces/cinetic/skills/cinetic" \
           $(ls -d "$HOME"/.claude/plugins/cache/cinetic/cinetic/*/skills/cinetic 2>/dev/null | sort -V | tail -1); do
    [[ -n "$d" && -f "$d/SKILL.md" ]] && { echo "$d"; return; }
  done
  if [[ ! -f "$CACHE/skills/cinetic/SKILL.md" ]]; then
    command -v git >/dev/null || die "git is needed to fetch cinetic"
    echo "setup: fetching cinetic $REF from $REPO" >&2
    rm -rf "$CACHE"
    mkdir -p "$(dirname "$CACHE")"
    git -c advice.detachedHead=false clone -q --depth 1 --branch "$REF" "$REPO" "$CACHE" 2>&1 | sed 's/^/  /' >&2 \
      || die "could not clone $REPO at $REF"
    [[ -f "$CACHE/skills/cinetic/SKILL.md" ]] || die "the clone has no skills/cinetic/SKILL.md; is $REF a cinetic tag?"
  fi
  echo "$CACHE/skills/cinetic"
}

# version_ge <have> <need>: dotted numeric comparison
version_ge() { [[ "$(printf '%s\n%s\n' "$2" "$1" | sort -V | head -1)" == "$2" ]]; }

check() {
  local bad=0 v
  ok() { printf '  ok    %s\n' "$*"; }
  no() { printf '  MISS  %s\n' "$*"; bad=1; }
  case "$(uname -s)" in
    MINGW*|MSYS*|CYGWIN*) no "Windows shell: cinetic's scripts need macOS or Linux. Run inside WSL2 (wsl -d Ubuntu)";;
    *) ok "$(uname -s)";;
  esac
  if command -v node >/dev/null; then
    v="$(node -p 'process.versions.node')"; version_ge "$v" 22.0.0 && ok "node $v" || no "node $v (need 22+)"
  else no "node (need 22+)"; fi
  if command -v ffmpeg >/dev/null; then
    v="$(ffmpeg -version | head -1 | sed -E 's/^ffmpeg version n?([0-9.]+).*/\1/')"
    version_ge "$v" 6.0 && ok "ffmpeg $v" || no "ffmpeg $v (need 6+)"
    ffmpeg -hide_banner -encoders 2>/dev/null | grep -q libx264 && ok "libx264" || no "ffmpeg without libx264"
    command -v ffprobe >/dev/null && ok "ffprobe" || no "ffprobe"
  else no "ffmpeg 6+ with libx264, and ffprobe"; fi
  if command -v python3 >/dev/null; then
    v="$(python3 -c 'import sys; print("%d.%d.%d" % sys.version_info[:3])')"
    version_ge "$v" 3.11 && ok "python $v" || no "python $v (need 3.11+)"
    local mods
    mods="$(python3 - <<'PY'
import importlib.util as u
need = ['numpy', 'scipy', 'soundfile', 'pyloudnorm', 'cv2', 'librosa']
print(' '.join(m for m in need if u.find_spec(m) is None))
PY
)"
    [[ -z "$mods" ]] && ok "python packages" \
      || no "python packages: $mods (pip install numpy scipy soundfile pyloudnorm opencv-python librosa fonttools brotli uharfbuzz pillow, in a venv)"
  else no "python3 (need 3.11+)"; fi
  [[ -n "${GEMINI_API_KEY:-}" ]] && ok "GEMINI_API_KEY set" \
    || printf '  note  GEMINI_API_KEY not in the environment; voiceover.py also reads it from .env.local\n'
  return $bad
}

[[ $# -gt 0 ]] || { usage; exit 1; }
case "$1" in
  -h|--help) usage; exit 0;;
  --locate) locate; exit 0;;
  --check) echo "cinetic requirements:"; check && exit 0 || exit 1;;
esac

DIR="$1"; shift
FPS=60; BPM=100; SIZE=1920x1080; NAME=""; EXTRA=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --fps) FPS="$2"; shift 2;;
    --bpm) BPM="$2"; shift 2;;
    --size) SIZE="$2"; shift 2;;
    --name) NAME="$2"; shift 2;;
    --) shift; EXTRA=("$@"); break;;
    *) die "unknown option $1 (see --help)";;
  esac
done

echo "cinetic requirements:"
check || die "fix the MISS lines above, then run this again"
CINETIC="$(locate)"
echo "cinetic: $CINETIC"

args=("$DIR" --fps "$FPS" --bpm "$BPM" --size "$SIZE")
[[ -n "$NAME" ]] && args+=(--name "$NAME")
bash "$CINETIC/scripts/new-film.sh" "${args[@]}" ${EXTRA[@]+"${EXTRA[@]}"}

cp "$HERE/voiceover.py" "$HERE/vo-cues.ts" "$HERE/capture.mjs" "$DIR/scripts/"
cp "$HERE/vo_mix.py" "$DIR/scripts/audio/"
mkdir -p "$DIR/vo"
[[ -f "$DIR/vo/script.json" ]] || cp "$HERE/script.json" "$DIR/vo/script.json"
grep -qxF '.env*' "$DIR/.gitignore" 2>/dev/null || printf '\n# API keys (GEMINI_API_KEY). Never commit.\n.env*\n' >> "$DIR/.gitignore"
grep -qxF 'public/footage/' "$DIR/.gitignore" 2>/dev/null \
  || printf '\n# Recordings and stills are large and regenerable from the app. Back them up elsewhere.\npublic/footage/\npublic/stills/\n' >> "$DIR/.gitignore"

node - "$DIR/package.json" "$FPS" <<'JS'
const fs = require('fs');
const [file, fps] = process.argv.slice(2);
const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
Object.assign(pkg.scripts, {
  'vo': `python3 scripts/voiceover.py --fps ${fps}`,
  'vo:dry': 'python3 scripts/voiceover.py --dry-run',
  'vo:cues': 'tsx scripts/vo-cues.ts',
  'vo:mix': 'tsx scripts/vo-cues.ts && python3 scripts/audio/vo_mix.py',
});
fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
JS

cat <<EOF

Film project ready: $DIR
  Director   $CINETIC/SKILL.md (read it; this skill's references/cinetic-overrides.md says what changes)
  Script     $DIR/vo/script.json
  Next       npm run vo:dry, then npm run vo, then the timeline (src/timeline.ts: VO placements)
EOF
