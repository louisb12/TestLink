#!/usr/bin/env node
/**
 * fetch-guide-assets.mjs — pull the best-practices guide's media into the repo.
 *
 * The Lovable export ships most assets as `.asset.json` pointers to Lovable's
 * CDN, not as real files. Those URLs only resolve while that project is live,
 * so the guide cannot be self-hosted until they are downloaded. This does that
 * once; after it runs, Mintlify serves everything and Lovable is not a
 * dependency any more.
 *
 *   node scripts/fetch-guide-assets.mjs [path-to-lovable-export]
 */
import { readdirSync, readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, basename, extname } from 'node:path';

const SRC = process.argv[2] || 'Best Practises Guide LInk (1)';
const ORIGIN = 'https://almedia-link-best-practices.lovable.app';
const OUT = 'images/best-practices';
mkdirSync(OUT, { recursive: true });

const assetsDir = join(SRC, 'src', 'assets');
const files = readdirSync(assetsDir);

// content_type is authoritative — several .png-named assets are actually webp.
const EXT = {
  'image/webp': '.webp', 'image/png': '.png', 'image/jpeg': '.jpg',
  'image/svg+xml': '.svg', 'image/gif': '.gif', 'video/mp4': '.mp4', 'video/webm': '.webm',
};

const results = [];
let downloaded = 0, copied = 0, failed = 0;

for (const f of files) {
  if (!f.endsWith('.asset.json')) continue;
  const meta = JSON.parse(readFileSync(join(assetsDir, f), 'utf8'));
  const stem = basename(meta.original_filename, extname(meta.original_filename));
  const ext = EXT[meta.content_type] || extname(meta.original_filename) || '.bin';
  const outName = `${stem}${ext}`;
  const outPath = join(OUT, outName);

  if (existsSync(outPath)) { results.push([f, outName, 'exists']); continue; }

  const url = ORIGIN + meta.url;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0) throw new Error('empty body');
    writeFileSync(outPath, buf);
    downloaded++;
    results.push([f, outName, `${(buf.length / 1024).toFixed(0)} KB  ${meta.content_type}`]);
  } catch (e) {
    failed++;
    results.push([f, outName, `FAILED — ${e.message}`]);
  }
}

// Real binaries that shipped in the export.
for (const [from, to] of [
  [join(assetsDir, 'popup-do-tight.webp'), 'popup-do-tight.webp'],
  [join(assetsDir, 'popup-timing-do-trimmed.mp4'), 'popup-timing-do-trimmed.mp4'],
  [join(assetsDir, 'placement-banner-rounded.png'), 'placement-banner-rounded.png'],
  [join(assetsDir, 'hero-blob-blue.png'), 'hero-blob-blue.png'],
  [join(assetsDir, 'link-logo-blue.png'), 'link-logo-blue.png'],
]) {
  if (existsSync(from) && !existsSync(join(OUT, to))) {
    copyFileSync(from, join(OUT, to)); copied++;
    results.push([basename(from), to, 'copied from export']);
  }
}

for (const [a, b, c] of results) console.log(`  ${b.padEnd(34)} ${c}`);
console.log(`\ndownloaded ${downloaded}, copied ${copied}, failed ${failed}`);
process.exit(failed ? 1 : 0);
