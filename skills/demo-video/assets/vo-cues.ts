/**
 * vo-cues.ts: writes out/vo-cues.json, where each voice-over line sits in the film (read by
 * scripts/audio/vo_mix.py), and out/captions.srt, the spoken words timed from the same frames.
 *
 * Placements live in src/timeline.ts as `VO: { id, at }[]` (at = the line's first frame, from b()).
 * Lengths live in src/vo.ts, written by scripts/voiceover.py. The picture, the mix and the captions
 * all read those two files, so they cannot drift apart.
 *
 * Usage (from the project root):
 *   npx tsx scripts/vo-cues.ts [--timeline src/timeline.ts] [--vo src/vo.ts]
 *                              [--out out/vo-cues.json] [--srt out/captions.srt]
 *
 * Checks: VO_FPS equals FPS; every placed id has a take and every take is placed exactly once;
 * lines start in order, leave at least 6 f of air and end inside TOTAL. Captions are cut at
 * sentence and clause breaks into cues of at most two 42-character lines, timed by their share
 * of the line's characters.
 *
 * Exit codes: 0 written; 1 on an import failure or a failed check (nothing is written).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const MIN_GAP = 6;
const LINE = 42;

const arg = (name: string, fallback: string) => {
  const i = process.argv.indexOf(name);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const die = (msg: string): never => {
  console.error(`vo-cues: ${msg}`);
  process.exit(1);
};

async function load(path: string) {
  try {
    return await import(pathToFileURL(resolve(path)).href);
  } catch (e) {
    return die(`cannot import ${path}: ${(e as Error).message}`);
  }
}

/**
 * Captions of at most 2 * LINE characters: split at sentences, a long sentence at its clauses, a
 * long clause by words; then merge neighbours back while they fit, so no caption is a lone
 * "Under the hood," that flashes for half a second.
 */
function chunks(text: string): string[] {
  const clean = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wrap = (s: string, max: number) => {
    const out: string[] = [];
    let cur = '';
    for (const w of s.split(' ')) {
      if (cur && cur.length + 1 + w.length > max) {
        out.push(cur);
        cur = w;
      } else cur = cur ? `${cur} ${w}` : w;
    }
    if (cur) out.push(cur);
    return out;
  };
  const pieces: string[] = [];
  for (const sentence of clean.match(/[^.!?]+[.!?]*\s*/g) ?? [clean]) {
    const s = sentence.trim();
    if (s.length <= 2 * LINE) pieces.push(s);
    else for (const clause of s.split(/(?<=[,;:])\s+/)) pieces.push(...wrap(clause, 2 * LINE));
  }
  const out: string[] = [];
  for (const p of pieces.filter(Boolean)) {
    const last = out[out.length - 1];
    if (last && last.length + 1 + p.length <= 2 * LINE) out[out.length - 1] = `${last} ${p}`;
    else out.push(p);
  }
  return out;
}

/** A caption longer than one line, broken where the two halves are closest in length. */
function twoLines(c: string): string {
  if (c.length <= LINE) return c;
  const w = c.split(' ');
  let best = 1;
  let diff = Infinity;
  for (let k = 1; k < w.length; k++) {
    const d = Math.abs(w.slice(0, k).join(' ').length - w.slice(k).join(' ').length);
    if (d < diff) [best, diff] = [k, d];
  }
  return `${w.slice(0, best).join(' ')}\n${w.slice(best).join(' ')}`;
}

const ts = (f: number, fps: number) => {
  const ms = Math.round((f / fps) * 1000);
  const p = (n: number, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

async function main() {
  const tl = await load(arg('--timeline', 'src/timeline.ts'));
  const vo = await load(arg('--vo', 'src/vo.ts'));
  const { FPS, TOTAL, VO } = tl as { FPS: number; TOTAL: number; VO?: { id: string; at: number }[] };
  const { VO_FPS, VO_LINES } = vo as { VO_FPS: number; VO_LINES: Record<string, { frames: number; text: string; file: string }> };

  if (!Array.isArray(VO)) die('src/timeline.ts exports no VO array. Add `export const VO = [{ id, at: b(...) }, ...]`.');
  if (VO_FPS !== FPS) die(`src/vo.ts was written at ${VO_FPS} fps but the film runs at ${FPS}. Re-run voiceover.py --fps ${FPS}.`);

  const placed = [...VO!].sort((x, y) => x.at - y.at);
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const [i, v] of placed.entries()) {
    const line = VO_LINES[v.id];
    if (!line) {
      errors.push(`VO places "${v.id}", which has no take in src/vo.ts`);
      continue;
    }
    if (seen.has(v.id)) errors.push(`"${v.id}" is placed twice`);
    seen.add(v.id);
    const end = v.at + line.frames;
    if (v.at < 0 || end > TOTAL) errors.push(`"${v.id}" runs frames ${v.at}-${end}, outside the film (TOTAL ${TOTAL})`);
    const next = placed[i + 1];
    if (next && end + MIN_GAP > next.at)
      errors.push(`"${v.id}" ends at ${end}; "${next.id}" starts at ${next.at} (need ${MIN_GAP} f of air)`);
  }
  for (const id of Object.keys(VO_LINES)) if (!seen.has(id)) errors.push(`take "${id}" is never placed in VO`);
  if (errors.length) die(`\n  ${errors.join('\n  ')}`);

  const lines = placed.map((v) => ({ id: v.id, at: v.at, frames: VO_LINES[v.id].frames, file: VO_LINES[v.id].file, text: VO_LINES[v.id].text }));
  const out = arg('--out', 'out/vo-cues.json');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, `${JSON.stringify({ fps: FPS, total: TOTAL, lines }, null, 2)}\n`);

  const cues: string[] = [];
  for (const l of lines) {
    const parts = chunks(l.text);
    const chars = parts.reduce((s, c) => s + c.length, 0);
    let f = l.at;
    for (const [j, c] of parts.entries()) {
      const g = j === parts.length - 1 ? l.at + l.frames : f + Math.round((l.frames * c.length) / chars);
      cues.push(`${cues.length + 1}\n${ts(f, FPS)} --> ${ts(g, FPS)}\n${twoLines(c)}\n`);
      f = g;
    }
  }
  const srt = arg('--srt', 'out/captions.srt');
  mkdirSync(dirname(srt), { recursive: true });
  writeFileSync(srt, cues.join('\n'));

  const spoken = lines.reduce((s, l) => s + l.frames, 0);
  console.log(`vo-cues: ${lines.length} lines, ${(spoken / FPS).toFixed(1)} s of speech in ${(TOTAL / FPS).toFixed(1)} s; wrote ${out} and ${srt} (${cues.length} captions)`);
}

main();
