#!/usr/bin/env node
/**
 * fetch-notion-mmp.mjs — re-pull the three MMP guides from Notion.
 *
 * The Adjust / AppsFlyer / Singular pages under publisher/mmp/ are transcribed
 * from Lou's Notion pages (decisions.md D-034). Those pages are the source of
 * truth: if a step changes there, re-run this, diff the output against the MDX
 * and re-transcribe. Do not edit the pages from memory.
 *
 * The pages are publicly shared, so Notion's internal API answers without auth.
 * Two things that are easy to get wrong and cost a cycle each:
 *
 *   1. Node's bare fetch() is 403'd by Cloudflare — it sends no browser
 *      User-Agent. Shell out to curl instead.
 *   2. loadPageChunk returns only the blocks it walks to. Children referenced
 *      in a parent's `content` array must be pulled with syncRecordValues,
 *      looping until nothing referenced is still missing.
 *
 *   node scripts/fetch-notion-mmp.mjs [out-dir]     (default: .notion-mmp/)
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const OUT = process.argv[2] || '.notion-mmp';
const SPACE = '1a8032d4-2378-48fb-b1da-affb24953b82';

const PAGES = {
  adjust: '248c92df215b8059a538daef587aec93',
  appsflyer: '262c92df215b801f8582ef6167c00c3e',
  singular: '2cbc92df215b800b8db6c1e82dc74da0',
};

const dash = (id) =>
  `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;

const post = (url, body) =>
  JSON.parse(
    execFileSync(
      'curl',
      ['-s', '-X', 'POST', url, '-H', 'Content-Type: application/json', '--data-binary', '@-'],
      { input: JSON.stringify(body), maxBuffer: 1 << 28 },
    ).toString(),
  );

const val = (blocks, id) => blocks[id]?.value?.value ?? blocks[id]?.value ?? null;

function load(pageId) {
  const blocks = {};
  let cursor = { stack: [] };
  let chunkNumber = 0;
  for (let i = 0; i < 40; i++) {
    const json = post('https://www.notion.so/api/v3/loadPageChunk', {
      pageId: dash(pageId),
      limit: 100,
      cursor,
      chunkNumber,
      verticalColumns: false,
    });
    Object.assign(blocks, json.recordMap?.block ?? {});
    if (!json.cursor?.stack?.length) break;
    cursor = json.cursor;
    chunkNumber += 1;
  }
  for (let round = 0; round < 12; round++) {
    const missing = new Set();
    for (const id of Object.keys(blocks)) {
      for (const c of val(blocks, id)?.content ?? []) if (!blocks[c]) missing.add(c);
    }
    if (!missing.size) break;
    const ids = [...missing];
    for (let i = 0; i < ids.length; i += 50) {
      const batch = ids.slice(i, i + 50);
      const json = post('https://www.notion.so/api/v3/syncRecordValues', {
        requests: batch.map((id) => ({
          pointer: { table: 'block', id, spaceId: SPACE },
          version: -1,
        })),
      });
      Object.assign(blocks, json.recordMap?.block ?? {});
      for (const id of batch) if (!blocks[id]) blocks[id] = { value: { value: { id, type: 'gone' } } };
    }
  }
  return blocks;
}

const text = (rich) =>
  (rich ?? [])
    .map(([t, fmts]) =>
      (fmts ?? []).reduce((s, [k, a]) => {
        if (k === 'b') return `**${s}**`;
        if (k === 'i') return `*${s}*`;
        if (k === 'c') return `\`${s}\``;
        if (k === 's') return `~~${s}~~`;
        if (k === 'a') return `[${s}](${a})`;
        return s;
      }, t),
    )
    .join('');

function render(blocks, id, depth, out, media) {
  const v = val(blocks, id);
  if (!v) return;
  const p = v.properties ?? {};
  const pad = '  '.repeat(depth);
  const kids = (d) => (v.content ?? []).forEach((c) => render(blocks, c, d, out, media));

  switch (v.type) {
    case 'page': out.push(`# ${text(p.title)}`); kids(0); break;
    case 'header': out.push(`\n## ${text(p.title)}`); kids(0); break;
    case 'sub_header': out.push(`\n### ${text(p.title)}`); kids(0); break;
    case 'text': out.push(pad + text(p.title)); kids(depth + 1); break;
    case 'bulleted_list': out.push(`${pad}- ${text(p.title)}`); kids(depth + 1); break;
    case 'numbered_list': out.push(`${pad}1. ${text(p.title)}`); kids(depth + 1); break;
    case 'callout': out.push(`${pad}> [!] ${text(p.title)}`); kids(depth + 1); break;
    case 'code': out.push(`${pad}\`\`\`\n${text(p.title)}\n${pad}\`\`\``); break;
    case 'divider': out.push(`${pad}---`); break;
    case 'image':
    case 'video': {
      const src = text(p.source) || v.format?.display_source || '';
      media.push({ n: media.length + 1, id, src, caption: text(p.caption) });
      out.push(`${pad}[[${v.type.toUpperCase()} #${media.length}]] ${src}`);
      break;
    }
    default: out.push(`${pad}[${v.type}] ${text(p.title)}`); kids(depth + 1);
  }
}

mkdirSync(OUT, { recursive: true });
for (const [name, id] of Object.entries(PAGES)) {
  const blocks = load(id);
  const out = [];
  const media = [];
  render(blocks, dash(id), 0, out, media);
  writeFileSync(join(OUT, `${name}.md`), out.join('\n') + '\n');

  mkdirSync(join(OUT, name), { recursive: true });
  for (const m of media) {
    const url = `https://www.notion.so/image/${encodeURIComponent(m.src)}?table=block&id=${m.id}&cache=v2`;
    const tmp = join(OUT, name, `${String(m.n).padStart(2, '0')}.bin`);
    const ct = execFileSync('curl', ['-sL', '-o', tmp, '-w', '%{content_type}', url]).toString();
    const ext = ct.includes('jpeg') ? 'jpg' : ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'bin';
    const final = join(OUT, name, `${String(m.n).padStart(2, '0')}.${ext}`);
    execFileSync('mv', [tmp, final]);
    console.log(`  ${final}  ${ct}`);
  }
  console.log(`${name}: ${out.length} lines, ${media.length} media\n`);
}
console.log(`Written to ${OUT}/ — diff against publisher/mmp/*.mdx before changing anything.`);
