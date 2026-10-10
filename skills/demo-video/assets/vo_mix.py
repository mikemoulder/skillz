#!/usr/bin/env python3
"""
vo_mix.py: lays the voice-over into cinetic's score and masters the result once.

cinetic's score.py masters music and effects to the film's target and also writes stems that sum
to the pre-master mix. Mixing a voice into the mastered WAV would master it twice, and a voice put
in score.json's "bed" joins the music bus and pumps with the kick. So this works from the stems:

  out/stems (music + sfx) + vo/takes placed at the frames in out/vo-cues.json
    -> the music ducks under each whole line (never per syllable, which pumps)
    -> the voice is levelled to sit --speech-over dB above the ducked music, K-weighted, over the
       lines only, so a quiet bed and a loud one give the same intelligibility
    -> master.py's finish(): the same bus, loudness passes and true-peak limiter score.py uses
    -> public/audio/soundtrack.wav, which render.sh muxes exactly as before

Usage (from the film project root, after `npm run audio` and `npx tsx scripts/vo-cues.ts`):
  python3 scripts/audio/vo_mix.py [--stems out/stems] [--vo out/vo-cues.json]
        [--out public/audio/soundtrack.wav] [--score audio/score.json] [--cues out/cues.json]
        [--json out/qa/vo-mix.json] [--duck-db 10] [--speech-over 12] [--lufs -14] [--no-music]

  --no-music     voice only (no score yet, or a deliberate dry read); stems are not read
  --score        reads master.lufs and master.ceiling from score.json, as score.py does
  --cues         cinetic's out/cues.json: warns when a loud designed sound (hit, drop, whoosh,
                 riser, swell, suck) lands inside a line, because effects stay off the syllables
                 that matter (references/sound.md 5.6)

The report gives each line's placement, the speech-over-music level broadband and in the
1-4 kHz band (cinetic's rule: music 10-12 dB under speech there), the master's loudness and true
peak, and warnings.

Exit codes: 0 written and every gate passed (LUFS within 0.5 of target, true peak <= -1.5 dBTP,
last 480 samples zero, every line inside the film, no two lines closer than 6 frames, 1-4 kHz
speech over music >= 10 dB); 1 on bad input or a failed gate. On a failed gate the WAV is still
written, so it can be auditioned.
"""
import argparse
import glob
import json
import math
import os
import sys

import numpy as np
from scipy import signal

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
try:
    import master as M  # cinetic's mastering chain; new-film.sh copies it into scripts/audio/
except ImportError:
    sys.exit('vo_mix: master.py not found next to vo_mix.py. Copy vo_mix.py into the film\'s scripts/audio/.')

SR = M.SR
LOUD_KINDS = {'hit', 'drop', 'whoosh', 'riser', 'swell', 'suck'}
MIN_GAP_F = 6       # frames of air required between the end of one line and the next
ATTACK = 0.12       # s the music takes to duck before a line starts
RELEASE = 0.40      # s it takes to come back after a line ends
VO_HP = 80          # Hz high-pass on the voice
EDGE = 0.004        # s raised-cosine fade on each take's edges


def die(msg):
    print(f'vo_mix: {msg}', file=sys.stderr)
    sys.exit(1)


def cos_ramp(k, up=True):
    r = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, k, endpoint=False))
    return r if up else r[::-1]


def duck_envelope(n, regions):
    """0..1 'speech present' curve: 1 over each line, raised-cosine ramps ATTACK before and
    RELEASE after. Lines close together keep the music down through the gap."""
    g = np.zeros(n)
    for a, b in regions:
        a1, b0 = int(a * SR), int(b * SR)
        a0, b1 = max(0, a1 - int(ATTACK * SR)), min(n, b0 + int(RELEASE * SR))
        g[max(0, a1):min(n, b0)] = 1
        if a1 > a0:
            g[a0:a1] = np.maximum(g[a0:a1], cos_ramp(a1 - a0, up=True))
        if b1 > b0:
            g[b0:b1] = np.maximum(g[b0:b1], cos_ramp(b1 - b0, up=False))
    return g


def region_mask(n, regions):
    m = np.zeros(n, dtype=bool)
    for a, b in regions:
        m[max(0, int(a * SR)):min(n, int(b * SR))] = True
    return m


def loud_db(x, mask):
    """K-weighted loudness of x over the masked samples (ungated, LUFS-like)."""
    if not mask.any():
        return -math.inf
    z = M._kw(M._stereo(x))[mask]
    ms = float(np.sum(np.mean(z ** 2, axis=0)))
    return -0.691 + 10 * math.log10(ms) if ms > 1e-12 else -math.inf


def band_db(x, mask, lo=1000, hi=4000):
    if not mask.any():
        return -math.inf
    sos = signal.butter(4, [lo, hi], 'bandpass', fs=SR, output='sos')
    z = signal.sosfilt(sos, M._stereo(x), axis=0)[mask]
    ms = float(np.mean(z ** 2))
    return 10 * math.log10(ms) if ms > 1e-12 else -math.inf


def fit(x, n):
    return x[:n] if len(x) >= n else np.vstack([x, np.zeros((n - len(x), x.shape[1]))])


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    ap.add_argument('--stems', default='out/stems')
    ap.add_argument('--vo', default='out/vo-cues.json')
    ap.add_argument('--out', default='public/audio/soundtrack.wav')
    ap.add_argument('--score', default='audio/score.json')
    ap.add_argument('--cues', default='out/cues.json')
    ap.add_argument('--json', default='out/qa/vo-mix.json')
    ap.add_argument('--duck-db', type=float, default=10.0, help='music dip under each line (default 10)')
    ap.add_argument('--speech-over', type=float, default=12.0, help='voice over ducked music, dB (default 12)')
    ap.add_argument('--lufs', type=float, help='target integrated loudness (default: score.json, else -14)')
    ap.add_argument('--no-music', action='store_true')
    a = ap.parse_args()

    try:
        vo = json.load(open(a.vo, encoding='utf-8'))
    except (OSError, ValueError) as e:
        die(f'cannot read {a.vo} ({e}). Run `npx tsx scripts/vo-cues.ts` first.')
    fps, total = vo['fps'], vo['total']
    n = int(round(total / fps * SR))

    lufs, ceiling = -14.0, 0.77
    if os.path.isfile(a.score):
        mas = json.load(open(a.score, encoding='utf-8')).get('master', {})
        lufs, ceiling = float(mas.get('lufs', lufs)), float(mas.get('ceiling', ceiling))
    if a.lufs is not None:
        lufs = a.lufs

    fails, warns = [], []

    # ── the voice ───────────────────────────────────────────────────────────────────────────
    lines = sorted(vo['lines'], key=lambda r: r['at'])
    hp = signal.butter(2, VO_HP, 'high', fs=SR, output='sos')
    voice = np.zeros((n, 2))
    regions, rows = [], []
    for i, ln in enumerate(lines):
        if not os.path.isfile(ln['file']):
            die(f'take not found: {ln["file"]}. Run scripts/voiceover.py.')
        x = signal.sosfilt(hp, M._read(ln['file']), axis=0)
        k = min(len(x) // 2, int(EDGE * SR))
        if k:
            x[:k] *= cos_ramp(k, True)[:, None]
            x[-k:] *= cos_ramp(k, False)[:, None]
        s0 = int(round(ln['at'] / fps * SR))
        end_f = ln['at'] + math.ceil(len(x) / SR * fps)
        if ln['at'] < 0 or s0 + len(x) > n:
            fails.append(f'line "{ln["id"]}" runs outside the film (frames {ln["at"]}-{end_f}, total {total})')
        lo, hi = max(0, s0), min(n, s0 + len(x))
        if hi > lo:
            voice[lo:hi] += x[lo - s0:hi - s0]
        if i + 1 < len(lines) and end_f + MIN_GAP_F > lines[i + 1]['at']:
            fails.append(f'line "{ln["id"]}" ends at frame {end_f}, too close to "{lines[i + 1]["id"]}" '
                         f'at {lines[i + 1]["at"]} (need {MIN_GAP_F} f of air)')
        regions.append((s0 / SR, (s0 + len(x)) / SR))
        rows.append({'id': ln['id'], 'at': ln['at'], 'end': end_f,
                     'start_s': round(s0 / SR, 3), 'seconds': round(len(x) / SR, 3)})

    speech = region_mask(n, regions)

    # ── the score ───────────────────────────────────────────────────────────────────────────
    music, sfx = np.zeros((n, 2)), np.zeros((n, 2))
    if not a.no_music:
        files = sorted(glob.glob(os.path.join(a.stems, '*.wav')))
        if not files:
            die(f'no stems in {a.stems}. Run `npm run audio` (score.py --stems out/stems), or pass --no-music.')
        for f in files:
            name = os.path.splitext(os.path.basename(f))[0]
            if name.startswith('vo'):
                continue
            x = fit(M._read(f), n)
            if name == 'sfx':
                sfx += x
            else:
                music += x
    duck = 1 - (1 - 10 ** (-a.duck_db / 20)) * duck_envelope(n, regions)
    bed = music * duck[:, None] + sfx

    # ── level the voice against what sits under it ──────────────────────────────────────────
    l_bed, l_vo = loud_db(bed, speech), loud_db(voice, speech)
    if not math.isfinite(l_vo):
        die('the voice-over is silent')
    gain_db = (l_bed + a.speech_over - l_vo) if math.isfinite(l_bed) else 0.0
    voice *= 10 ** (gain_db / 20)
    over = (loud_db(voice, speech) - l_bed) if math.isfinite(l_bed) else None
    band = (band_db(voice, speech) - band_db(bed, speech)) if math.isfinite(l_bed) else None
    if band is not None and band < 10:
        fails.append(f'speech sits only {band:.1f} dB over the music in 1-4 kHz (need >= 10): '
                     'raise --speech-over or --duck-db, or thin the score under the lines')

    # ── loud designed sounds on top of words ────────────────────────────────────────────────
    if os.path.isfile(a.cues):
        for ev in json.load(open(a.cues, encoding='utf-8')).get('events', []):
            if ev.get('kind') in LOUD_KINDS:
                for r in rows:
                    if r['at'] <= ev['f'] < r['end']:
                        warns.append(f'{ev["kind"]} at frame {ev["f"]:.0f} lands inside line "{r["id"]}" '
                                     f'({r["at"]}-{r["end"]}): move the line or drop the effect')

    # ── master once ─────────────────────────────────────────────────────────────────────────
    y, _ = M.finish(bed + voice, lufs, ceiling, fade=0)
    import soundfile as sf
    os.makedirs(os.path.dirname(a.out) or '.', exist_ok=True)
    sf.write(a.out, y.astype(np.float32), SR, subtype='PCM_24')
    rep = M.measure(y)
    fails += M.gate(rep, lufs, 0.5, -1.5)
    if a.no_music:
        warns.append('voice only: no score under it (--no-music)')

    report = {
        'out': a.out, 'fps': fps, 'total': total, 'lufs_target': lufs,
        'duck_db': a.duck_db, 'speech_over_target_db': a.speech_over,
        'voice_gain_db': round(gain_db, 2),
        'speech_over_music_db': None if over is None else round(over, 1),
        'speech_over_music_1k4k_db': None if band is None else round(band, 1),
        'speech_seconds': round(sum(r['seconds'] for r in rows), 2),
        'speech_share': round(sum(r['seconds'] for r in rows) / (total / fps), 3),
        'lines': rows, 'master': rep, 'warnings': warns, 'fails': fails, 'pass': not fails,
    }
    if a.json:
        os.makedirs(os.path.dirname(a.json) or '.', exist_ok=True)
        with open(a.json, 'w', encoding='utf-8', newline='\n') as f:
            json.dump(report, f, indent=2)
            f.write('\n')

    print(f'vo_mix: {len(rows)} lines, {report["speech_seconds"]} s of speech '
          f'({100 * report["speech_share"]:.0f}% of the film), voice {gain_db:+.1f} dB')
    if over is not None:
        print(f'  speech over music: {over:.1f} dB broadband, {band:.1f} dB in 1-4 kHz')
    print(f'  master: {rep["lufs"]} LUFS, {rep["true_peak_db"]} dBTP -> {a.out}')
    for w in warns:
        print(f'  warn: {w}')
    for f in fails:
        print(f'  FAIL: {f}')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
