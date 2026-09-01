#!/usr/bin/env node
/**
 * make-assets.mjs — generate the decorative blob SVGs and logo colour variants.
 *
 * Deterministic: a fixed seed means re-running produces byte-identical files,
 * so regenerating never churns the diff.
 *
 * Blobs are organic (smooth closed splines through jittered radii), never
 * sharp geometric shapes. They ship in two forms:
 *   · currentColor  — for inlining in MDX, so one asset themes itself
 *   · light / dark  — flat-filled, for the documented <img> swap pattern on
 *                     pages where inlining isn't practical
 *
 *   node scripts/make-assets.mjs
 */
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';

mkdirSync('images/decor', { recursive: true });

/* ── deterministic PRNG (mulberry32) ─────────────────────────────────────── */
const rng = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * Closed organic spline. Points are placed around a circle at jittered radii,
 * then joined with a Catmull-Rom → cubic-Bézier conversion so every junction
 * is C1-continuous: no corners, no flat spots. That continuity is what makes
 * it read as organic rather than as a polygon with rounded joints.
 */
function blob({ seed, points = 7, size = 400, min = 0.68, max = 1.0 }) {
  const rand = rng(seed);
  const c = size / 2;
  const R = size / 2;

  const pts = Array.from({ length: points }, (_, i) => {
    const a = (i / points) * Math.PI * 2;
    const r = R * (min + rand() * (max - min));
    return [c + Math.cos(a) * r, c + Math.sin(a) * r];
  });

  const at = (i) => pts[(i + pts.length) % pts.length];
  const f = (n) => Math.round(n * 100) / 100;

  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < pts.length; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return { d: d + 'Z', size };
}

const svg = (b, fill) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${b.size} ${b.size}" ` +
  `fill="none" aria-hidden="true" focusable="false">\n` +
  `  <path d="${b.d}" fill="${fill}"/>\n</svg>\n`;

/* The brand shape sets: Engage / Expand / Boost (beliefs) and
   Spotlight / Highlight / Connect / Process (behaviours). Each gets a distinct
   seed and character — Engage rounder, Boost more elongated, and so on. */
const SHAPES = [
  { name: 'engage',    seed: 1042, points: 6, min: 0.78 },
  { name: 'expand',    seed: 2071, points: 8, min: 0.66 },
  { name: 'boost',     seed: 3310, points: 5, min: 0.62 },
  { name: 'spotlight', seed: 4127, points: 7, min: 0.74 },
  { name: 'highlight', seed: 5290, points: 6, min: 0.70 },
  { name: 'connect',   seed: 6483, points: 9, min: 0.72 },
  { name: 'process',   seed: 7615, points: 7, min: 0.64 },
];

// Flat fills for the <img> swap pattern. These are the only place outside
// 00-tokens.css that brand hex appears — SVG files cannot read CSS variables.
const SKY = '#739AC1';
const LEAD_BLUE = '#0021F3';

let n = 0;
for (const s of SHAPES) {
  const b = blob(s);
  writeFileSync(`images/decor/blob-${s.name}.svg`, svg(b, 'currentColor'));
  writeFileSync(`images/decor/blob-${s.name}-light.svg`, svg(b, SKY));
  writeFileSync(`images/decor/blob-${s.name}-dark.svg`, svg(b, LEAD_BLUE));
  n += 3;
}

/* ── logo colour variants ─────────────────────────────────────────────────
   The symbol has two paths. Only the fill changes — never the geometry.
   Approved combinations only: Lead Blue, White, Midnight. */
const src = readFileSync('logos/symbol-lead-blue.svg', 'utf8');
writeFileSync('logos/symbol-midnight.svg', src.replaceAll('#0021F3', '#0D2A4C'));
n += 1;

console.log(`generated ${n} assets`);
