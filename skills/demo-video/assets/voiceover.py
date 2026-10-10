#!/usr/bin/env python3
"""
voiceover.py: renders the demo's voice-over, one take per line, with Gemini TTS.

Reads vo/script.json (voice, model, style, lines), voices every line that changed, trims each
take's edge silence and writes:

  vo/takes/<id>.wav    the take, 24 kHz mono 16-bit, as Gemini returns it, edges trimmed
  vo/manifest.json     per line: text, what was spoken, hash, seconds, frames at --fps, words/min
  src/vo.ts            VO_FPS and VO_LINES {id: {frames, text, file}} for timeline.ts to size acts

Takes are not deterministic: the same text read twice comes back with a different length and
reading. So a take is kept until its inputs change. A line is re-voiced only when its spoken text,
style, voice or model changes, or when it is named in --retake. That keeps the picture's timing
stable across runs and avoids paying for takes nobody asked for.

When several lines need voicing they go out as ONE request, one content item per line with a
<long pause> between them, and the take is cut back into lines at the pauses nearest where each
line's share of the words puts it. One reading keeps the narrator's pace and energy consistent
across the film (separate requests drifted from 160 to 230 wpm on the same text), and it costs one
request: the free tier allows 10 TTS requests a day per model. If the cut is not trustworthy the
lines are voiced one by one instead. --per-line forces that.

Usage (from the film project root):
  python3 scripts/voiceover.py [--script vo/script.json] [--fps 60] [--ts src/vo.ts]
                               [--retake hook,aha] [--only hook] [--per-line] [--dry-run] [--wpm 155]
                               [--voice Charon] [--model gemini-3.8-flash-tts] [--style "..."]

  --dry-run   no API calls: prints each line's word count and its estimated length at --wpm,
              and the total against the script's "target_seconds". Run it before spending takes.
  --retake    comma-separated ids to voice again even though nothing changed (a misread word,
              a flat reading). Every other line keeps its take.

The API key comes from the environment variable GEMINI_API_KEY (or --key-env NAME), falling back
to a GEMINI_API_KEY= line in .env.local or .env in this directory or up to three parents. It is
never printed and never written anywhere.

Script lines: {"id", "text", "say"?, "style"?}. "text" is what the captions show; "say", when
present, is what the voice reads instead (a phonetic spelling: "x four oh two" for x402). "style"
replaces the script's style for one line, so restate the pace in it ("speaking slowly and
clearly" is what holds Charon near 150 wpm; without it takes run 180-230). Style is delivery direction only: the model reads
"text" verbatim, so never put stage directions in it. Pause and vocal tags such as <short pause>
go inline in "say" or "text".

Exit codes: 0 every line has a take; 1 bad input, a missing key or a failed request.
"""
import argparse
import base64
import hashlib
import io
import json
import math
import os
import re
import struct
import sys
import time
import urllib.error
import urllib.request
import wave

ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions'
DEFAULTS = {
    'voice': 'Charon',
    'model': 'gemini-3.8-flash-tts',
    'style': 'speaking slowly and clearly, a calm, confident product walkthrough narrator: warm but '
             'never salesy, like an engineer showing a colleague something that works',
}
TRIM_DB = -50.0     # edge silence threshold, dBFS
TRIM_PAD = 0.03     # s of silence kept on each edge after trimming
RETRIES = 4
MAX_WAIT = 75       # s, the longest single retry wait
GAP_DB = -45.0      # batch split: a gap is a run of 10 ms windows under this, dBFS
MIN_GAP = 0.45      # s, the shortest pause accepted as a line boundary in a batch take


def die(msg):
    print(f'voiceover: {msg}', file=sys.stderr)
    sys.exit(1)


def find_key(env_name):
    key = os.environ.get(env_name, '').strip()
    if key:
        return key
    d = os.getcwd()
    for _ in range(4):
        for name in ('.env.local', '.env'):
            p = os.path.join(d, name)
            if os.path.isfile(p):
                for line in open(p, encoding='utf-8', errors='replace'):
                    m = re.match(rf'^\s*(?:export\s+)?{re.escape(env_name)}\s*=\s*(.*)$', line)
                    if m:
                        v = m.group(1).strip().strip('"').strip("'")
                        if v:
                            return v
        parent = os.path.dirname(d)
        if parent == d:
            break
        d = parent
    return None


def words(s):
    return len(re.findall(r"[A-Za-z0-9][A-Za-z0-9'.\-]*", re.sub(r'<[^>]*>', ' ', s)))


def take_hash(model, voice, style, spoken):
    return hashlib.sha256('\x1f'.join([model, voice, style, spoken]).encode()).hexdigest()[:16]


def request_take(key, model, voice, items):
    """One take of [(text, style), ...]: one content item per line, each with its own style."""
    content = []
    for text, style in items:
        c = {'type': 'text', 'text': text}
        if style:
            c['annotations'] = [{'type': 'speech_metadata', 'style': style}]
        content.append(c)
    body = {
        'model': model,
        'input': [{'type': 'user_input', 'content': content}],
        'response_format': {'type': 'audio'},
        'generation_config': {'speech_config': [{'voice': voice}]},
    }
    data = json.dumps(body).encode()
    for attempt in range(RETRIES + 1):
        req = urllib.request.Request(ENDPOINT, data=data, method='POST',
                                     headers={'x-goog-api-key': key, 'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                resp = json.load(r)
            break
        except urllib.error.HTTPError as e:
            detail = e.read().decode(errors='replace')
            try:
                detail = json.loads(detail).get('error', {}).get('message', detail)
            except ValueError:
                pass
            if e.code in (401, 403):
                die(f'the key was rejected ({e.code}): {detail[:300]}. Check {ARGS.key_env} holds a Google AI Studio key.')
            if e.code == 404:
                die(f'model "{model}" not found ({detail[:200]}). Set "model" in vo/script.json to a current TTS model.')
            try:
                wait = float(e.headers.get('Retry-After') or 0)
            except ValueError:
                wait = 0
            if e.code == 429 and (wait > MAX_WAIT or 'per day' in detail):
                # the daily cap (10 requests a day on the free tier): retrying cannot help
                die(f'daily request quota used up: {detail[:300]} Every take kept so far is intact. '
                    'Wait for the reset, or enable billing on the AI Studio project.')
            if (e.code == 429 or e.code >= 500) and attempt < RETRIES:
                wait = min(max(wait, 2 ** (attempt + 2)), MAX_WAIT)  # per-minute limits ask ~30 s
                print(f'  {e.code}, retrying in {wait:.0f} s', file=sys.stderr)
                time.sleep(wait)
                continue
            if e.code == 429:
                die(f'still rate-limited after {RETRIES} retries: {detail[:300]} Free-tier keys have low '
                    'per-minute limits; wait a minute, or enable billing on the AI Studio project.')
            die(f'HTTP {e.code}: {detail[:500]}')
        except (urllib.error.URLError, TimeoutError) as e:
            if attempt < RETRIES:
                time.sleep(2 ** (attempt + 1))
                continue
            die(f'request failed: {e}')
    audio = [c for s in resp.get('steps', []) if s.get('type') == 'model_output'
             for c in s.get('content', []) if c.get('type') == 'audio']
    if not audio:
        die(f'no audio in the response (status {resp.get("status")!r}); the text may have been refused')
    return base64.b64decode(audio[-1]['data']), audio[-1].get('mime_type', 'audio/wav')


def decode(raw, mime):
    """(samples as a list of ints, sample rate). WAV as returned, or headerless 24 kHz L16."""
    if raw[:4] == b'RIFF':
        w = wave.open(io.BytesIO(raw))
        if w.getsampwidth() != 2:
            die(f'unexpected sample width {w.getsampwidth()} in the returned WAV')
        frames = w.readframes(w.getnframes())
        ch, sr = w.getnchannels(), w.getframerate()
    else:
        m = re.search(r'rate=(\d+)', mime or '')
        frames, ch, sr = raw, 1, int(m.group(1)) if m else 24000
    pcm = struct.unpack(f'<{len(frames) // 2}h', frames[: len(frames) // 2 * 2])
    if ch > 1:
        pcm = pcm[::ch]
    return list(pcm), sr


def trim(pcm, sr):
    """Drop edge silence below TRIM_DB (10 ms windows), keeping TRIM_PAD on each side."""
    thr = 32768 * 10 ** (TRIM_DB / 20)
    win = max(1, sr // 100)
    loud = [i for i in range(0, len(pcm), win) if max((abs(v) for v in pcm[i:i + win]), default=0) > thr]
    if not loud:
        return pcm, 0.0, 0.0
    pad = int(TRIM_PAD * sr)
    a, b = max(0, loud[0] - pad), min(len(pcm), loud[-1] + win + pad)
    return pcm[a:b], a / sr, (len(pcm) - b) / sr


def split(pcm, sr, word_counts):
    """Cut a batch take into len(word_counts) lines. A <long pause> renders at about 1 s, but a
    sentence break inside a line can run 0.8 s, so the longest pauses alone pick wrong cuts. Each
    boundary is expected where its share of the words says it should be; the cut takes the pause
    that is both long and near that point. Returns None when the cut is not trustworthy: no pause
    of MIN_GAP near a boundary, or a line whose pace strays from the take's median, which is what a
    misplaced cut looks like."""
    n = len(word_counts)
    win = max(1, sr // 100)
    thr = 32768 * 10 ** (GAP_DB / 20)
    quiet = [max((abs(v) for v in pcm[i:i + win]), default=0) <= thr for i in range(0, len(pcm), win)]
    pauses, i = [], 0  # (length s, middle s), interior pauses of MIN_GAP or more
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]:
                j += 1
            if i > 0 and j < len(quiet) and (j - i) * win / sr >= MIN_GAP:
                pauses.append(((j - i) * win / sr, (i + j) / 2 * win / sr))
            i = j
        else:
            i += 1
    dur, total = len(pcm) / sr, sum(word_counts)
    sigma = 0.05 * dur  # a cut 5% of the take away from where it is expected costs 1 s of pause
    cuts, prev, acc = [], -1.0, 0
    for w in word_counts[:-1]:
        acc += w
        expect = acc / total * dur
        options = [p for p in pauses if p[1] > prev]
        if not options:
            return None
        best = max(options, key=lambda p: p[0] - abs(p[1] - expect) / sigma)
        cuts.append(best[1])
        prev = best[1]
    edges = [0] + [int(c * sr) for c in cuts] + [len(pcm)]
    segs = [pcm[edges[k]:edges[k + 1]] for k in range(n)]
    paces = []
    for seg, w in zip(segs, word_counts):
        s = len(trim(seg, sr)[0]) / sr
        if s <= 0:
            return None
        paces.append(w / s)
    med = sorted(paces)[n // 2]
    if any(not 0.6 * med <= p <= 1.6 * med for p in paces):
        return None
    return segs


def write_wav(path, pcm, sr):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with wave.open(path, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(struct.pack(f'<{len(pcm)}h', *pcm))


def write_ts(path, fps, rows):
    os.makedirs(os.path.dirname(path) or '.', exist_ok=True)
    out = ['// Generated by scripts/voiceover.py from vo/script.json. Re-run it after editing the script;',
           '// do not edit by hand. frames: the take at VO_FPS, edge silence trimmed. timeline.ts sizes',
           '// each chapter from these and places each line in VO.',
           f'export const VO_FPS = {fps};',
           'export const VO_LINES = {']
    for r in rows:
        out.append(f'  {json.dumps(r["id"])}: {{ frames: {r["frames"]}, text: {json.dumps(r["text"])}, '
                   f'file: {json.dumps(r["file"])} }},')
    out += ['} as const;', 'export type VoId = keyof typeof VO_LINES;', '']
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(out))


def main():
    global ARGS
    ap = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    ap.add_argument('--script', default='vo/script.json')
    ap.add_argument('--fps', type=int, default=60)
    ap.add_argument('--ts', default='src/vo.ts', help="where to write VO_LINES ('' to skip)")
    ap.add_argument('--manifest', default='vo/manifest.json')
    ap.add_argument('--takes', default='vo/takes')
    ap.add_argument('--retake', default='', help='comma-separated ids to voice again')
    ap.add_argument('--only', default='', help='comma-separated ids: voice only these')
    ap.add_argument('--per-line', action='store_true', help='one request per line instead of one batch take')
    ap.add_argument('--dry-run', action='store_true', help='estimate lengths, call nothing')
    ap.add_argument('--wpm', type=float, default=155, help='pace for --dry-run estimates (Charon, default style: 140-160)')
    ap.add_argument('--voice')
    ap.add_argument('--model')
    ap.add_argument('--style')
    ap.add_argument('--key-env', default='GEMINI_API_KEY')
    ARGS = a = ap.parse_args()

    try:
        script = json.load(open(a.script, encoding='utf-8'))
    except (OSError, ValueError) as e:
        die(f'cannot read {a.script}: {e}')
    voice = a.voice or script.get('voice') or DEFAULTS['voice']
    model = a.model or script.get('model') or DEFAULTS['model']
    style = a.style if a.style is not None else script.get('style', DEFAULTS['style'])
    lines = script.get('lines') or die(f'{a.script} has no "lines"')
    ids = [ln.get('id') for ln in lines]
    if not all(isinstance(i, str) and re.fullmatch(r'[A-Za-z][A-Za-z0-9_]*', i) for i in ids):
        die('every line needs an "id" made of letters, digits and _ (it becomes a TypeScript key)')
    if len(set(ids)) != len(ids):
        die('line ids must be unique')
    retake = {s for s in a.retake.split(',') if s}
    only = {s for s in a.only.split(',') if s}
    for s in (retake | only) - set(ids):
        die(f'no line "{s}" in {a.script}')

    total_words = sum(words(ln.get('text', '')) for ln in lines)
    if a.dry_run:
        est = 0.0
        for ln in lines:
            w = words(ln.get('say') or ln['text'])
            s = w / (a.wpm / 60)
            est += s
            print(f'  {ln["id"]:<14} {w:>3} words  ~{s:5.1f} s   {ln["text"][:70]}')
        tgt = script.get('target_seconds')
        gaps = 0.6 * (len(lines) - 1)
        print(f'voice {voice}, model {model}')
        print(f'{total_words} words, ~{est:.0f} s of speech at {a.wpm:.0f} wpm, ~{est + gaps:.0f} s with breaths'
              + (f' (target {tgt} s)' if tgt else ''))
        if tgt and est + gaps > 0.85 * tgt:
            print(f'over budget: speech should fill at most 85% of the film. Cut to ~{int(0.85 * tgt * a.wpm / 60 - gaps * a.wpm / 60)} words.')
        return

    old = {}
    if os.path.isfile(a.manifest):
        try:
            old = {r['id']: r for r in json.load(open(a.manifest, encoding='utf-8')).get('lines', [])}
        except (ValueError, KeyError):
            old = {}

    # decide, per line, whether its take stands or it gets voiced now
    plan = []
    for ln in lines:
        lid, text = ln['id'], ln.get('text', '').strip()
        if not text:
            die(f'line "{lid}" has no text')
        spoken = (ln.get('say') or text).strip()
        lstyle = ln.get('style', style)
        h = take_hash(model, voice, lstyle, spoken)
        path = os.path.join(a.takes, f'{lid}.wav').replace('\\', '/')
        prev = old.get(lid) or {}
        current = prev.get('hash') == h and os.path.isfile(path)
        status = 'voice'
        if only and lid not in only:
            if not os.path.isfile(path):
                print(f'  {lid:<14} skipped (--only), and it has no take yet')
                continue
            if not current:
                h = prev.get('hash')  # stale: the next run without --only re-voices it
            status = 'kept' if current else 'kept, STALE (inputs changed)'
        elif current and lid not in retake:
            status = 'kept'
        plan.append(dict(id=lid, text=text, spoken=spoken, style=lstyle, hash=h, path=path, status=status))

    # voice what is pending: one batch take when there are several, so the narrator keeps one
    # pace and energy across the film and the run costs one request instead of one per line
    todo = [p for p in plan if p['status'] == 'voice']
    spent = 0
    if todo:
        key = find_key(a.key_env) or die(
            f'no API key. Set {a.key_env} in the environment, or add {a.key_env}=... to .env.local '
            '(gitignored). Get one at https://aistudio.google.com/apikey')
    if len(todo) > 1 and not a.per_line:
        items = [(p['spoken'] + ('' if k == len(todo) - 1 else ' <long pause>'), p['style'])
                 for k, p in enumerate(todo)]
        raw, mime = request_take(key, model, voice, items)
        spent += 1
        pcm, sr = decode(raw, mime)
        segs = split(pcm, sr, [words(p['spoken']) for p in todo])
        if segs is None:
            print(f'  the batch take did not split cleanly into {len(todo)} lines; voicing them one by one',
                  file=sys.stderr)
        else:
            for p, seg in zip(todo, segs):
                seg, lead, tail = trim(seg, sr)
                write_wav(p['path'], seg, sr)
                p['status'] = 'voiced (batch)'
    for p in todo:
        if p['status'] == 'voice':
            raw, mime = request_take(key, model, voice, [(p['spoken'], p['style'])])
            spent += 1
            pcm, sr = decode(raw, mime)
            pcm, lead, tail = trim(pcm, sr)
            write_wav(p['path'], pcm, sr)
            p['status'] = f'voiced (trimmed {lead:.2f} s / {tail:.2f} s)'

    rows = []
    for p in plan:
        lid, text, spoken, lstyle, h, path, status = (p[k] for k in ('id', 'text', 'spoken', 'style', 'hash', 'path', 'status'))
        w = wave.open(path)
        seconds = w.getnframes() / w.getframerate()
        w.close()
        nw = words(spoken)
        wpm = nw / seconds * 60 if seconds else 0
        rows.append({'id': lid, 'text': text, 'say': spoken if spoken != text else None, 'style': lstyle,
                     'hash': h, 'file': path, 'seconds': round(seconds, 3),
                     'frames': int(math.ceil(seconds * a.fps)), 'words': nw, 'wpm': round(wpm)})
        flag = '  <- fast' if wpm > 175 else '  <- slow' if 0 < wpm < 125 else ''
        print(f'  {lid:<14} {seconds:5.2f} s {rows[-1]["frames"]:>5} f {wpm:4.0f} wpm  {status}{flag}')

    speech = sum(r['seconds'] for r in rows)
    manifest = {'voice': voice, 'model': model, 'style': style, 'fps': a.fps,
                'speech_seconds': round(speech, 2), 'words': total_words, 'lines': rows}
    os.makedirs(os.path.dirname(a.manifest) or '.', exist_ok=True)
    with open(a.manifest, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
        f.write('\n')
    if a.ts:
        write_ts(a.ts, a.fps, rows)
    tgt = script.get('target_seconds')
    print(f'{len(rows)} lines, {spent} voiced, {speech:.1f} s of speech'
          + (f', {100 * speech / tgt:.0f}% of the {tgt} s target' if tgt else '')
          + f'. Wrote {a.manifest}' + (f' and {a.ts}' if a.ts else ''))
    if tgt and speech > 0.85 * tgt:
        print('over budget: speech fills more than 85% of the film, so the picture has no room to land. Cut words.')


if __name__ == '__main__':
    main()
