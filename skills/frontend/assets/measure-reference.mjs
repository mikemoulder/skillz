#!/usr/bin/env node
/* measure-reference.mjs: shoot and measure any URL at real breakpoints.
 *
 * Two jobs, one tool:
 *   - Calibration (Step 1): measure a reference site, so the system is built
 *     from values that work in the wild instead of values that feel right.
 *   - Critique (Step 8): measure your own build with the same instrument and
 *     compare it with DESIGN.md. Drift shows up as numbers, not vibes.
 *
 * Usage:
 *   node measure-reference.mjs <url> [--out dir] [--widths 1440,390] [--scheme light|dark]
 *                                     [--slices 10] [--no-full] [--hide "<css selector>"]
 *
 * --hide removes overlays that cover the design (a cookie banner, a chat
 * bubble) from the shots without clicking anything on the page.
 *
 * Writes, per width:  <w>-01.png ... (viewport slices, easy to read one at a
 * time), <w>-full.png (whole page), <w>.json (measure.js output), and one
 * summary.md for all widths.
 *
 * Needs Playwright once per machine, outside the judged repo if you like:
 *   npm i -D playwright && npx playwright install chromium
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const url = args.find((a) => /^https?:\/\//.test(a));
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : fallback;
};
if (!url) {
  console.error("usage: node measure-reference.mjs <url> [--out dir] [--widths 1440,390] [--scheme light|dark] [--slices 10] [--no-full] [--hide selector]");
  process.exit(2);
}

// Resolve Playwright from the project you run this in first, then from here,
// so the script works straight out of the plugin folder.
async function loadChromium() {
  for (const base of [process.cwd(), dirname(fileURLToPath(import.meta.url))]) {
    try {
      const req = createRequire(join(base, "noop.js"));
      const mod = await import(pathToFileURL(req.resolve("playwright")).href);
      const chromium = mod.chromium ?? mod.default?.chromium;
      if (chromium) return chromium;
    } catch {
      /* try the next base */
    }
  }
  return null;
}
const chromium = await loadChromium();
if (!chromium) {
  console.error("Playwright is not installed here. Run: npm i -D playwright && npx playwright install chromium");
  process.exit(2);
}

const host = new URL(url).host.replace(/[^a-z0-9.-]/gi, "_");
const out = resolve(flag("out", join(".design", "measure", host)));
const widths = flag("widths", "1440,390").split(",").map((w) => parseInt(w, 10)).filter(Boolean);
const scheme = flag("scheme", "light");
const maxSlices = parseInt(flag("slices", "10"), 10);
const full = !args.includes("--no-full");
const hide = flag("hide", "");
const here = dirname(fileURLToPath(import.meta.url));
const measureSource = await readFile(join(here, "measure.js"), "utf8");

await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const results = [];

for (const width of widths) {
  const height = width < 600 ? 844 : width < 1100 ? 1024 : 900;
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    colorScheme: scheme,
    reducedMotion: "no-preference",
    isMobile: width < 600,
    hasTouch: width < 600,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e.message || e)));
  page.on("console", (m) => {
    // network failures are logged with their URL below; skip the generic duplicate
    if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) errors.push(m.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(`${r.status()} ${r.url()} (a dead link or a missing asset)`);
  });

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  } catch {
    await page.goto(url, { waitUntil: "load", timeout: 45000 });
  }
  await page.waitForTimeout(600);
  if (hide) await page.addStyleTag({ content: `${hide}{display:none!important}` });

  // Walk the page so scroll reveals and lazy media fire, then return to top.
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += Math.round(height * 0.6)) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(140);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(700);

  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const slices = Math.min(maxSlices, Math.ceil(pageHeight / height));
  for (let i = 0; i < slices; i++) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), i * height);
    await page.waitForTimeout(450);
    await page.screenshot({ path: join(out, `${width}-${String(i + 1).padStart(2, "0")}.png`) });
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(300);
  if (full) await page.screenshot({ path: join(out, `${width}-full.png`), fullPage: true });

  const metrics = await page.evaluate(measureSource);
  metrics.consoleErrors = errors.slice(0, 10);
  results.push([width, metrics]);
  await writeFile(join(out, `${width}.json`), JSON.stringify(metrics, null, 2));
  console.log(`${width}px  ${slices} slices  page ${pageHeight}px  ${errors.length} console errors${metrics.horizontalOverflow ? "  HORIZONTAL OVERFLOW" : ""}`);
  await context.close();
}
await browser.close();

// ── summary.md: the numbers a design review actually needs.
const lines = [`# Measured: ${url}`, "", `Scheme: ${scheme}. Widths: ${widths.join(", ")}. Files in this folder.`, ""];
for (const [w, m] of results) {
  lines.push(`## ${w}px`, "");
  lines.push(`- Body: ${m.body.size} ${m.body.font.split(",")[0]} ${m.body.weight}, line-height ${m.body.lineHeight}, ${m.body.color} on ${m.body.bg}`);
  lines.push(`- Fonts loaded: ${m.fontsLoaded.join(", ") || "none detected"}`);
  lines.push(`- Page height ${m.pageHeight}px. Horizontal overflow: ${m.horizontalOverflow ? "YES" : "no"}. Console errors: ${m.consoleErrors.length}`);
  if (m.nav) lines.push(`- Nav: ${m.nav.position}, ${m.nav.height}px tall, inner ${m.nav.inner.width}x${m.nav.inner.height} radius ${m.nav.inner.radius}, bg ${m.nav.inner.bg}, ${m.nav.inner.backdrop || m.nav.backdrop}`);
  lines.push("", "Type ramp (family | size | weight | line-height | tracking):", "");
  for (const t of m.typeRamp.slice(0, 16)) lines.push(`- ${t.value}  x${t.count}  ${t.example ?? ""}`);
  lines.push("", "Headings:", "");
  for (const h of m.headings.slice(0, 10)) lines.push(`- ${h.tag} ${h.size}px/${h.lh} ${h.weight} ${h.tracking} ${h.align} ${h.wrap} w${h.width}: ${h.text}`);
  const list = (title, arr) => {
    lines.push("", `${title}:`, "");
    for (const x of arr.slice(0, 8)) lines.push(`- ${x.value}  x${x.count}${x.example ? "  " + x.example : ""}`);
  };
  list("Text colors", m.textColors);
  list("Backgrounds", m.backgrounds);
  list("Borders", m.borders);
  list("Radii", m.radii);
  list("Shadows", m.shadows);
  list("Gaps", m.gaps);
  list("Max widths", m.maxWidths);
  list("Content left edges", m.contentLeftEdges);
  list("Buttons", m.buttons);
  list("Transitions", m.transitions);
  list("Animations", m.animations);
  lines.push("", "Sections (top, height, padding):", "");
  for (const s of m.sections.slice(0, 14)) lines.push(`- ${s.top}px  h${s.height}  pad ${s.padding}  ${s.bg}  r${s.radius}  ${s.heading}`);
  lines.push("");
}
await writeFile(join(out, "summary.md"), lines.join("\n"));
console.log(`wrote ${out}`);
