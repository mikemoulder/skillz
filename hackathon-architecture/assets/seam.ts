/* The dependency seam — src/lib/seam.ts
 *
 * Every call that leaves your process goes through here. It is the server-side
 * counterpart to hackathon-frontend/assets/seed.ts (which is the browser→API
 * seam). A demo-proof project has both.
 *
 * What it buys, in order of how often each one saves a demo:
 *   - Venue wifi dies              → fixture, silently
 *   - Rate limit mid-rehearsal     → fixture, silently
 *   - Key expires during judging   → fixture, silently
 *   - The UI lane needs the API    → fixture, before the integration exists
 *   - You rehearse 40 times        → zero quota burned
 *
 * Usage:
 *   export const complete = (p: string) =>
 *     withFixture("llm.complete", () => openai.responses.create(...), fx.llm);
 *
 * ONE RULE: the SDK is imported in exactly one file per dependency. If it is
 * imported in three places you have three integrations, not a seam. Check:
 *   grep -rn "from \"openai\"" src/ --include=*.ts | grep -v "src/lib/"
 */

export type DemoMode = "live" | "fixture" | "auto";

/* live    — every call is real. use while building the integration
 * fixture — nothing leaves the process. USE THIS ON STAGE
 * auto    — try live, fall back on failure or timeout. the sane default
 */
export const DEMO_MODE: DemoMode = (process.env.DEMO_MODE as DemoMode) || "auto";

type Opts = {
  timeoutMs?: number;
  retries?: number;
  /** Fake latency for the fixture path. 0ms looks fake and hides your loading states. */
  fixtureDelayMs?: number;
};

/** Which path the last call for each name took. Render this as a "demo data" badge. */
export const callLog = new Map<string, "live" | "fixture">();

export function usedFixture(name?: string): boolean {
  if (name) return callLog.get(name) === "fixture";
  return [...callLog.values()].includes("fixture");
}

export async function withFixture<T>(
  name: string,
  live: () => Promise<T>,
  fixture: T | (() => T | Promise<T>),
  opts: Opts = {},
): Promise<T> {
  const { timeoutMs = 8_000, retries = 1, fixtureDelayMs = 400 } = opts;

  const serveFixture = async (why: string): Promise<T> => {
    callLog.set(name, "fixture");
    if (process.env.NODE_ENV !== "production") console.warn(`[seam] ${name}: ${why}`);
    // Jittered latency so the demo does not flash, and so skeletons actually render.
    await sleep(fixtureDelayMs + Math.random() * 300);
    return typeof fixture === "function" ? (fixture as () => T | Promise<T>)() : fixture;
  };

  if (DEMO_MODE === "fixture") return serveFixture("DEMO_MODE=fixture");

  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await withTimeout(live(), timeoutMs, name);
      callLog.set(name, "live");
      return result;
    } catch (err) {
      lastErr = err;
      // Do not burn the clock retrying a rate limit or a bad key — neither improves.
      if (attempt < retries && isRetryable(err)) {
        await sleep(300 * (attempt + 1));
        continue;
      }
      break;
    }
  }

  if (DEMO_MODE === "live") throw lastErr; // building: fail loudly so you see it
  return serveFixture(`live failed (${errMessage(lastErr)})`);
}

/* ── Recording ─────────────────────────────────────────────────────────────
 * Record fixtures the moment the live call works. "Later" is 4am and the key
 * is exhausted. Record three per dependency: happy path, slow, and an error.
 *
 *   RECORD=1 npx tsx spike.ts     # then COMMIT the output. gitignored
 *                                 # fixtures are fixtures the deployer lacks
 */
export async function record<T>(name: string, live: () => Promise<T>): Promise<T> {
  const result = await live();
  if (process.env.RECORD === "1") {
    const { writeFileSync, mkdirSync } = await import("node:fs");
    mkdirSync("fixtures", { recursive: true });
    writeFileSync(`fixtures/${name}.json`, JSON.stringify(result, null, 2));
    console.log(`[seam] recorded fixtures/${name}.json`);
  }
  return result;
}

/* ── Internals ─────────────────────────────────────────────────────────── */

function withTimeout<T>(p: Promise<T>, ms: number, name: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${name} timed out after ${ms}ms`)), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

function isRetryable(err: unknown): boolean {
  const status = (err as { status?: number })?.status;
  if (status === 429 || (status && status >= 500)) return true;
  return /timed out|ECONNRESET|ETIMEDOUT|fetch failed/i.test(errMessage(err));
}

function errMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
