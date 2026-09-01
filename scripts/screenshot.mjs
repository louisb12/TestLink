#!/usr/bin/env node
/**
 * screenshot.mjs — capture every page in both colour modes, desktop + mobile.
 *
 * Requires `mint dev` to already be running (default port 3000).
 * Writes to .claude/screenshots/ and prints a summary.
 *
 *   node scripts/screenshot.mjs [--port 3000] [--only /path]
 */
import { mkdirSync } from 'node:fs';

const PUPPETEER =
  '/Users/louis.b/.npm-global/lib/node_modules/mint/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';
const { default: puppeteer } = await import(PUPPETEER);

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = '.claude/screenshots';

const arg = (f, d) => {
  const i = process.argv.indexOf(f);
  return i > -1 ? process.argv[i + 1] : d;
};
const PORT = arg('--port', '3000');
const ONLY = arg('--only', null);
const BASE = `http://localhost:${PORT}`;

const PAGES = [
  ['landing', '/'],
  ['overview-index', '/overview'],
  ['overview-what-is', '/overview/what-is-almedia-link'],
  ['overview-experiences', '/overview/experiences'],
  ['overview-revenue', '/overview/how-revenue-works'],
  ['overview-get-started', '/overview/get-started'],
  ['publisher-index', '/publisher'],
  ['publisher-prerequisites', '/publisher/prerequisites'],

  ['publisher-best-practices', '/publisher/best-practices'],
  ['publisher-adjust', '/publisher/mmp/adjust'],
  ['technical-index', '/technical'],
  ['technical-integration', '/technical/integration-guide'],
].filter(([, p]) => !ONLY || p === ONLY);

const VIEWPORTS = [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844, isMobile: true, hasTouch: true }],
];

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const problems = [];

for (const [scheme] of [['light'], ['dark']]) {
  for (const [vpName, vp] of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: scheme },
    ]);

    for (const [name, path] of PAGES) {
      try {
        await page.goto(BASE + path, { waitUntil: 'networkidle0', timeout: 60000 });
        await new Promise((r) => setTimeout(r, 1200));

        // Verify the theme actually applied, and check for horizontal overflow.
        const state = await page.evaluate(() => ({
          isDark: document.documentElement.classList.contains('dark'),
          scrollW: document.documentElement.scrollWidth,
          clientW: document.documentElement.clientWidth,
          bodyBg: getComputedStyle(document.body).backgroundColor,
        }));

        if (state.isDark !== (scheme === 'dark')) {
          problems.push(`${name} @${vpName}/${scheme}: theme class mismatch (isDark=${state.isDark})`);
        }
        if (state.scrollW > state.clientW + 1) {
          problems.push(
            `${name} @${vpName}/${scheme}: HORIZONTAL OVERFLOW ${state.scrollW} > ${state.clientW}`
          );
        }

        await page.screenshot({
          path: `${OUT}/${name}--${scheme}--${vpName}.png`,
          fullPage: vpName === 'desktop' && name === 'landing',
        });
      } catch (e) {
        problems.push(`${name} @${vpName}/${scheme}: ${e.message}`);
      }
    }
    await page.close();
  }
}

await browser.close();

console.log(`captured ${PAGES.length * 4} screenshots → ${OUT}`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log('  ✗ ' + p);
  process.exit(1);
}
console.log('no theme mismatches, no horizontal overflow');
