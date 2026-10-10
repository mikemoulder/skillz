// capture.mjs: high-DPI stills of the real product, one per demo state, for the film to push
// into and move between. The film's camera can zoom a 2x still to 2x before it softens, which a
// screen recording at 1080p cannot survive.
//
// Edit STEPS for the project's demo path: each step acts on the page, then names the still it
// leaves behind. Steps run in order in one page, so state carries from one to the next, the way
// a user would click through.
//
// Usage (from the film project root, once: npm i -D playwright && npx playwright install chromium):
//   node scripts/capture.mjs --url https://app.example.com [--out public/stills] [--scale 2]
//                            [--size 1920x1080] [--dark] [--headed]
//
// Exit codes: 0 every still written; 1 a step failed (the stills before it are kept, and the
// page at the moment of failure is saved as <out>/_failed.png).
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const STEPS = [
  { still: '01-start', run: async (page) => {} },
  {
    still: '02-entered',
    run: async (page) => {
      await page.getByLabel('Amount').fill('42.50');
    },
  },
  {
    still: '03-result',
    run: async (page) => {
      await page.getByRole('button', { name: 'Refund' }).click();
      await page.getByText('Settled').waitFor({ timeout: 30_000 });
    },
  },
];

const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const url = arg('--url', process.env.DEMO_URL);
if (!url) {
  console.error('capture: pass --url (the deployed app) or set DEMO_URL');
  process.exit(1);
}
const out = arg('--out', 'public/stills');
const scale = Number(arg('--scale', '2'));
const [width, height] = arg('--size', '1920x1080').split('x').map(Number);
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: scale,
  colorScheme: process.argv.includes('--dark') ? 'dark' : 'light',
});
await page.goto(url, { waitUntil: 'networkidle' });
// no scrollbars or blinking caret in the stills (re-add after a step that does a full page load)
await page.addStyleTag({ content: '::-webkit-scrollbar{display:none} *{caret-color:transparent!important}' });

let status = 0;
for (const step of STEPS) {
  try {
    await step.run(page);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(400); // let the app's own transitions settle
    const file = join(out, `${step.still}.png`);
    await page.screenshot({ path: file });
    console.log(`  ${file}  ${width * scale}x${height * scale}`);
  } catch (e) {
    console.error(`capture: step "${step.still}" failed: ${e.message.split('\n')[0]}`);
    await page.screenshot({ path: join(out, '_failed.png') }).catch(() => {});
    status = 1;
    break;
  }
}
await browser.close();
process.exit(status);
