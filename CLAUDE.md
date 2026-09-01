# Almedia Launchpad

Documentation site for **Almedia Link**, published on [Mintlify](https://mintlify.com).
Canonical domain: `dev.almedia.co`. (`developers.almedia.co` is a DNS-level 301 → configured
**outside** Mintlify. Never touch DNS without asking Lou.)

Read this file before touching anything. It exists so a cold session does not re-derive the
project or waste an afternoon on something the platform cannot do.

---

## 1. Who reads this site

Three audiences, ascending technical depth:

1. **Commercial stakeholders** — deciding whether to integrate at all.
2. **Product / design leads** — implementing the player-facing experience.
3. **Engineers** — doing the SDK work.

> **The rule that governs every editorial decision:** every top-level page must make sense to
> the *least* technical of the three. Technical depth lives **only** inside Technical Docs.

The site's one job is to fork a visitor onto the right path — technical or everything else —
without making them read a paragraph to find it.

---

## 2. Toolchain

The package is **`mint`**, not `mintlify` (deprecated). If both are ever installed:
`npm uninstall -g mintlify`.

- Requires **Node ≥ 20.17.0**. (Verified here on v24.19.0.)
- `npm i -g mint`
- On this machine `/usr/local/lib` is not writable, so `mint` is installed to a user prefix:
  `npm i -g --prefix "$HOME/.npm-global" mint` → binary at `$HOME/.npm-global/bin/mint`.
  Add `$HOME/.npm-global/bin` to `PATH`, or use the full path.

### Verification loop — run after every slice

```bash
export PATH="$HOME/.npm-global/bin:$PATH"
cd "/Users/louis.b/Downloads/site 2"

mint validate        # strict schema validation — must be clean
mint broken-links    # must be clean
mint a11y            # accessibility audit — triage everything it reports
mint score           # agent-readiness grade (first-class requirement, check before launch)
mint format          # canonical MDX formatting

mint dev --port 3000 # local preview (--port IS supported; see decisions.md D-011)
node scripts/contrast-audit.mjs   # regenerate .claude/docs/contrast-audit.md
node scripts/screenshot.mjs       # both modes, desktop + mobile → .claude/screenshots/
```

`scripts/verify.sh` runs validate + broken-links together; it is also wired as a git
pre-commit hook via `scripts/install-hooks.sh`.

---

## 3. Hard limits — design within these, do not fight them

Verbatim from the build brief, all confirmed against Mintlify's docs. **This is the list that
stops you trying to `npm install framer-motion`.**

1. **Tailwind v3 is available in MDX, but arbitrary values are NOT supported.** No
   `w-[350px]`, `bg-[#0021F3]`, `duration-[850ms]`. Brand-exact values must live in the
   `.css` files as real classes.
2. **No `tailwind.config.js` / no documented way to extend the Tailwind theme.** You cannot
   register `bg-lead-blue` as a utility. Write plain CSS classes.
3. **No third-party npm packages in MDX or React components.** Mintlify: *"Use browser
   built-ins or write the logic inline."* → **framer-motion, GSAP, motion.dev, three.js,
   anime.js are all unusable.** Every animation here is CSS.
4. **React components in MDX:** hooks (`useState`, `useEffect`, `useRef`, `useCallback`,
   `useMemo`, `useContext`, `useReducer`) are pre-injected, no import needed. **Named exports
   only** — `export const Thing = () => {}`. No default exports, no function declarations in
   snippets, no `React.lazy`, no dynamic `import()`, no JSON imports, and **a snippet file
   cannot import another snippet file.**
5. **`<MDX>` limits: 8 levels of nesting, 500 fragments per page.** Exceeding either fails
   the build.
6. **The navbar cannot be removed** by any page mode. Sidebar, navbar and footer *markup*
   cannot be replaced — only restyled via the selector surface.
7. **Typed callouts (`<Note>`, `<Warning>`, `<Info>`, `<Tip>`, `<Check>`, `<Danger>`) accept
   only `children`** — they cannot be recoloured or re-iconed. For brand-coloured callouts
   use the generic `<Callout icon="..." color="#0021F3">`.
8. **Avoid the `style` prop.** Mintlify's own warning: it *"can cause a layout shift on page
   load, especially on custom mode pages."* Everything goes in the `.css` files.
9. **Images:** root-relative paths only (`/images/x.png`) — `./x.png` does not work.
   **20 MB per file.** Paths are **case-sensitive**. Allowed on all plans: `png jpg jpeg gif
   webp svg ico mp4 webm mp3 wav json yaml css js woff woff2 ttf eot`. Enterprise-only:
   `pdf txt xml csv zip`. `node_modules`, `build`, `dist`, `.git` are auto-ignored — never
   stash assets there.
10. **SVG `foreignObject` is stripped in production.** Any SVG with text-in-foreignObject
    (draw.io exports) breaks. Convert text to paths.
11. **Redirect `source` values cannot contain anchors or query params.**
12. **Snippets do not work in the web editor.** See §4 — this constrains page ownership.
13. **Branch protection blocks the GitHub App from pushing**, which breaks the web editor's
    publish flow. Coordinate before enabling it on the SDK repo.
14. **`thumbnails.fonts.family` is Google-Fonts-only** — the self-hosted brand headline font
    will not render in social/OG thumbnails. Closest Google fallback there, and accept it.
15. **Static file serving is disabled entirely on sites with authentication enabled.**

Two capabilities were **smoke-tested and proven** here rather than assumed — see
`.claude/docs/decisions.md` D-001/D-002:

- ✅ **Custom `@keyframes` in a content-directory `.css` file works.** The whole motion layer
  depends on this. Verified by computed style + `getAnimations()` in headless Chrome.
- ❌ **Inline `<style>` tags in MDX are silently dropped.** They do not render and do not
  error. Never use them. This is why the old `almedia-link-showcase.mdx` was visually broken.

---

## 4. Page ownership — this is load-bearing

**Snippets and custom React components do not work in Mintlify's web editor.** The commercial
team maintains the Publisher Guide *in the web editor*. Therefore:

| Path | Owner | Constraint |
|---|---|---|
| `publisher/**` | **Commercial team** (web editor) | **Plain MDX + built-in components ONLY.** No snippets, no custom components, no `import`. |
| `publisher/best-practices.mdx` | **Engineering** — the one carve-out | Interactive guide with inline React components. **Not web-editor editable.** Edit in the repo. See §5 and decisions.md D-028. |
| `overview/**` | Engineering | Snippets and custom components allowed. |
| `index.mdx` (landing) | Engineering | Snippets and custom components allowed. |
| `technical/**` | Engineering — **synced from the SDK repo** | Never hand-write. See §5. |

Before shipping, verify a `publisher/**` page by **actually opening it in the web editor**.
"It looks like plain MDX" is not verification.

---

## 5. Don't-invent rules

- **Do not invent product facts.** No revenue-share percentages, no pricing, no SDK method
  signatures, no MMP event names, no integration steps beyond what is already approved.
- **The approved stats are exactly two:**
  - **~15% average install-to-link rate**
  - **10%+ LTV lift for linked users**

  Anything else needs a real number from the team. Leave a clearly marked placeholder
  (`<!-- TODO(copy) -->` / the `PlaceholderNote` pattern) instead.
- **`publisher/best-practices.mdx` carries additional approved facts**, because it was ported
  verbatim from Lou's own guide rather than written here: the **$10 sign-up bonus**, the
  **$3 CPA** per completed Earn Tab offer, **80 million players**, **SDK 1.1+** for Rewarded
  Progression and the Earn Tab, and the Link Coins scoring. These are approved *on that page*.
  Do not spread them to other pages without checking, and do not treat them as licence to
  invent new figures anywhere.
- **Never hand-write Technical Docs content.** README, Integration Guide and API Reference
  sync from **`github.com/almedia-tm/almedia-link-sdk`** — the single source of truth. The
  current pages are honest placeholders that say so. Keep them honest until sync is live.
- **The best-practices guide is now hosted here, not linked out.** It was ported from the
  standalone Lovable SPA into `publisher/best-practices.mdx` (decisions.md D-028), so
  `/publisher/best-practices` is the single canonical copy. The old bridge-page rule is
  retired. Two things follow:
  - **Do not re-introduce a link-out**, and do not let a second copy appear anywhere.
  - **All its media is local** under `images/best-practices/`. Nothing is fetched from
    Lovable at runtime. `scripts/fetch-guide-assets.mjs` re-downloads from the export if
    assets are ever lost.
- **Do not rewrite approved prose** while doing design work. If copy genuinely blocks a
  layout, propose the change; do not ship it silently.
- **Voice:** energetic, pioneering, committed. Short, punchy, concrete. Tie claims to real
  outcomes — install-to-link rate, LTV, retention — never vague hype. Speak to publishers as
  peers evaluating a technical decision, never as prospects being pitched. No exclamation-mark
  inflation.

---

## 6. Where the brand lives

**Every raw hex value in this project appears in exactly one file: `styles/00-tokens.css`.**

Nothing else — no CSS file, no MDX page, no component — may contain a hex literal. Everything
references the custom properties defined there. The one unavoidable exception is `docs.json`,
which is JSON and cannot read CSS variables; its colours are duplicated from the token file
and must be kept in sync by hand.

```
styles/00-tokens.css       :root custom properties — every brand value, defined once
styles/10-base.css         type scale, body, headings, links, focus states
styles/20-mintlify.css     overrides against Mintlify's selector surface
styles/30-components.css   cards, callouts, pills, badges, stat tiles
styles/40-landing.css      html[data-current-path="/"] scoped landing page
styles/50-motion.css       every @keyframes and transition
```

Numeric prefixes exist so cascade order is predictable — Mintlify injects **every** `.css`
file in the content directory, alphabetically (verified: D-003).

Full brand system — palette, type scale, radii, motion principles, contrast table, logo
rules — is in **`.claude/docs/brand-tokens.md`**.

### Colour mode rules

- `appearance.default: "system"`, `strict: false`. The light/dark toggle must work.
- **Define the complete light palette on bare `:root`.** Redefine **only** the semantic layer
  (`--surface`, `--text`, `--accent`, …) for dark mode. **Never let a colour's only
  definition live inside a dark-mode block.**
- Light mode is **Cream-based** (`#F1EFEA` page, white raised cards) — not white. Dark mode is
  **Midnight-based** — not black.
- **Lead Blue does not survive on Midnight.** Dark mode's accent is Sky. Contrast-checked.
- **Check every page in both modes.** A page that only works in light mode is not done.

---

## 7. Repo map

```
docs.json                  # config; navigation is $ref-split out
config/navigation.json     # tabs, groups, pages
styles/*.css               # the design system (auto-injected, see §6)
snippets/*.mdx             # engineering-owned reusable blocks — NOT usable in web editor
overview/*.mdx             # engineering-owned
publisher/**/*.mdx         # COMMERCIAL-OWNED — plain MDX only (§4)
technical/*.mdx            # synced from the SDK repo — never hand-write
images/                    # root-relative URLs, case-sensitive
  product/                 # real product media (popup screenshot, demo recording)
  decor/                   # organic blob accents, light + dark variants
logos/                     # brand symbol; Almedia Link lockups pending from Lou
fonts/                     # Daimito Expanded SemiBold .woff2 (pending from Lou)
scripts/                   # contrast audit, screenshots, verify, hook installer
.claude/docs/              # the reference files below
```

### `.claude/docs/`

| File | What it is |
|---|---|
| `mintlify-facts.md` | Verified platform capabilities + the styling selector surface, with a doc URL beside each fact. **Append `.md` to any Mintlify docs URL for raw Markdown** — cheap re-verification. |
| `brand-tokens.md` | The full brand system. Source of truth for `00-tokens.css`. |
| `decisions.md` | Append-only log. Every deviation from the brief, both smoke-test results, theme/icon/accent choices, anything Mintlify's docs contradicted. |
| `contrast-audit.md` | **Generated** by `scripts/contrast-audit.mjs`. Regenerate whenever a colour changes. |
| `open-questions.md` | Everything blocked on Lou, with status. Short and actionable — this is what Lou reads. |

---

## 8. Guardrails

- No npm packages in MDX or components. No arbitrary Tailwind values. No `style` props for
  layout. No inline `<style>` as a design mechanism (**it does not work** — D-002). No raw hex
  outside `styles/00-tokens.css`. No `!important` except in the reduced-motion block. No
  colour defined only inside a dark-mode block. No assets in `node_modules`/`build`/`dist`.
  No `foreignObject` SVGs. No animation that loops forever near reading content.
- **China Red `#E9223D` is for China events only — it must never appear on this site.**
- **Clay + Lead Blue and Sky + Lead Blue both FAIL contrast. They appear nowhere.**
- No DNS changes, no GitHub App installation, no branch-protection changes, no plan upgrades,
  no domain configuration without asking Lou.
- Do not migrate to headless Astro (`@mintlify/astro`) without making the case to Lou first.
  It abandons the web editor and is a different project.
