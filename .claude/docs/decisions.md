# Decision log

Append-only. Newest entries at the bottom. Every deviation from the build brief, every
smoke-test result, and everything Mintlify's docs contradicted.

---

## D-001 — Smoke test A: custom `@keyframes` in a content-directory `.css` file — **PASS**

**Status:** verified locally (`mint dev`, `mint` 4.2.857, headless Chrome).
**Not yet verified on a production preview deploy** — no Mintlify account access. Re-run
against the real deployment before launch (open-questions.md Q6).

The entire motion layer depended on this and Mintlify never documents it. Tested with a
5-second linear animation so a mid-flight sample would prove it was actually *running*, not
just parsed.

```
animationName:        "smoke-rise"
animationDuration:    "5s"
keyframesRuleParsed:  true          // found as a CSSRule.KEYFRAMES_RULE in document.styleSheets
runningAnimations:    [{ playState: "running", name: "smoke-rise" }]
opacityNow:           "0.452151"    // mid-animation — genuinely interpolating
```

**Consequence:** the full motion spec (Section 8 of the brief) proceeds as designed. No
reduction needed, no fallback to Tailwind's stock animation utilities.

**Incidental finding:** Mintlify **inlines** custom CSS into a `<style>` tag in the document
head rather than emitting a `<link rel="stylesheet">`. A probe for
`link[rel=stylesheet][href*="smoke"]` returned `[]` while the CSS was fully applied. Do not
verify CSS injection by looking for a link tag — check computed styles.

---

## D-002 — Smoke test B: inline `<style>` tags in MDX — **FAIL, silently**

**Status:** verified locally.

```
inlineTargetExists:    true                  // the MDX itself rendered fine
styleTagRendered:      false                 // no <style> containing the rule in the DOM
inlineTargetBackground: "rgba(0, 0, 0, 0)"   // rule never applied
styleTagLeakedAsText:  false                 // not dumped as visible text either
```

Mintlify **strips inline `<style>` from MDX entirely**. It does not render, does not apply,
and does not error — the most expensive kind of failure.

**Consequence:** confirms the brief's instruction to build with `.css` files regardless. Also
**explains the repo's prior state**: the deleted `almedia-link-showcase.mdx` put its entire
design system inside a `<style>{...}</style>` block, so none of it ever applied. That is the
actual cause of the "heading-alignment bug that kept coming back no matter how it was
patched" described in the deleted `best-practices-2.mdx`. It was never a CSS bug; the CSS was
never there.

---

## D-003 — Multi-file CSS cascade order is **filename order**

**Status:** verified locally. Three files (`00-first.css`, `25-middle.css`, `50-last.css`)
each set the same property on the same selector at equal specificity.

```
declarationOrder: [ rgb(100,0,0), rgb(0,0,100), rgb(0,100,0) ]   // 00, 25, 50
winner:           rgb(0, 100, 0)                                  // 50-last.css
```

Files are injected in ascending filename order and the last one wins, exactly as plain CSS
cascade would predict.

**Consequence:** the numeric-prefix scheme (`00-tokens` → `50-motion`) is sound and load order
is predictable. Note this is **CSS only** — Mintlify explicitly documents that **`.js` load
order is *not* guaranteed**, which is why this project keeps JS to a single file.

---

## D-004 — Page-scoped CSS via `data-current-path` works, including specificity

**Status:** verified locally.

`html[data-current-path]` is present on every page. A page-scoped rule correctly overrode a
base rule of lower specificity:

```
/            → data-current-path="/",       .probe background = rgb(7,8,9)   (base rule)
/inline      → data-current-path="/inline", .probe background = rgb(4,5,6)   (scoped rule won)
```

**Consequence:** `styles/40-landing.css` can be scoped entirely under
`html[data-current-path="/"]` with no leakage into doc pages, as the brief requires. Prefix
matching (`^="/technical/"`) is documented and used for section-level treatments.

---

## D-005 — Custom JS **does** run in `mint dev` — prior note in the repo was wrong

**Status:** verified locally.

```
jsRan:      true
htmlAttr:   "ran"     // attribute set on <html> by the custom .js file
scriptTags: []        // inlined, not emitted as <script src>
```

The deleted `best-practices-2.mdx` claimed *"Custom JS didn't execute in local mint dev
preview during testing — no `<script>` tag for it, no network request for it."* That
conclusion was drawn from **looking for a `<script src>` tag**, which Mintlify never emits
because it inlines the script — the same inlining behaviour found for CSS in D-001. The JS
was running the whole time.

**Consequence:** noted for accuracy, but it changes nothing here. This build uses **zero
custom JS**. Everything is CSS, per the brand motion principles and the no-npm-packages limit.

---

## D-006 — Theme: **Aspen** (deviation from the brief's `willow`)

Previewed the realistic candidates at `https://<theme>.mintlify.site` and screenshotted each
at 1440×900.

| Theme | Why not |
|---|---|
| Willow *(the incumbent)* | "Stripped-back essentials for distraction-free documentation" — the least customisable direction, and it has no tab row for the audience fork. |
| Maple | No horizontal tab row at all. Navigation is sidebar-only — the three-audience split would be invisible. |
| Almond | Tabs sit top-right in the navbar competing with Login/Sign up. A weak, easily-missed place for the primary IA decision. |
| Sequoia | Has a tab row but splits it left/right across the header, and reads dense and monotone. |

**Aspen** — *"Modern documentation crafted for complex navigation and custom components."*
It is the only candidate with a **prominent horizontal tab row directly under the navbar**,
which is exactly where the Overview / Publisher Guide / Technical Docs fork has to live. It
also ships native **pill badges** and a **pill primary CTA**, which match the brand's pill
language without fighting the theme, and icon-led sidebar groups.

Bonus: Aspen is one of only four themes supporting `mode: frame`. `mode: custom` works on
**every** theme, so the landing page was never theme-gated.

**Confirmed with Lou** before the design was built on it.

---

## D-007 — The brief's Section 1 did not match the repo — **no approved copy exists**

The brief states 13 MDX pages "already written and reviewed" exist under `overview/`,
`publisher/` and `technical/`, and instructs: *"Do not rewrite the prose — the copy is
approved."*

**None of those files existed.** The repo contained the Mintlify starter kit
(`index.mdx`, `quickstart.mdx`, `README.md`, `AGENTS.md`, Mintlify's MIT `LICENSE`) plus three
experimental proof-of-concept pages (`almedia-link-showcase.mdx`, `best-practices-2.mdx`,
`webgl-test.mdx`) whose own copy flagged its stats and quotes as placeholders.

Combined with the brief's guardrail *"do not invent product facts"*, this made the content
genuinely undeliverable as specified.

**Resolved with Lou:** scaffold all 13 pages with correct frontmatter, IA, structure and
branded components, using **only** facts the brief itself supplies (the two approved stats and
the landing hero copy). Every unwritten paragraph is a **visible placeholder** — rendered
on-page, not a buried HTML comment — so nothing invented can be mistaken for approved copy.

---

## D-008 — Deleted the previous site

Per Lou's instruction to clear what was live. Everything is recoverable from commit `328044c`.

**Deleted:** `almedia-link-showcase.mdx`, `best-practices-2.mdx` + its `.css`/`.js`,
`index.mdx`, `quickstart.mdx`, `webgl-test.mdx`, `style.css`, `scroll-animations.css`/`.js`,
`README.md` and `AGENTS.md` (Mintlify starter-kit boilerplate), `LICENSE`
(**MIT, © Mintlify** — not Almedia's, and wrong for a proprietary docs site),
`second-logo.png` / `third-logo.png` (106px and 198px — below the brand's 120px lockup
minimum, provenance unclear).

**Preserved**, because they are real product assets that cost nothing to keep:
- `popup.png` → `images/product/link-popup.png` (1170×2532 — a real capture of the Link reward
  popup in a live game session)
- `link-demo-recording.mp4` → `images/product/link-demo.mp4` (8.3 MB, under the 20 MB cap)
- `logo/light.svg` → `logos/symbol-lead-blue.svg`, `logo/dark.svg` → `logos/symbol-white.svg`
  (the correct brand symbol, already in two of the four approved colours)

Neither media file is referenced by the new site — the brief's landing-page spec does not call
for them. They are kept as available assets. Say the word and they go.

---

## D-009 — `mint` installed to a user-local prefix

`npm i -g mint` failed with `EACCES` — `/usr/local/lib/node_modules` is not writable by this
user, and installing with `sudo` was not appropriate to do unasked.

Installed instead with `npm i -g --prefix "$HOME/.npm-global" mint` → `mint` 4.2.857 at
`$HOME/.npm-global/bin/mint`. Node here is v24.19.0 (≥ 20.17.0 ✓).

Add `$HOME/.npm-global/bin` to `PATH` to make `mint` a bare command.

---

## D-010 — `mint dev --port` **is** supported (brief listed it as an open question)

The brief's open question #7 called the port override "undocumented". It is documented on
`cli/commands`: `--port`, *"Port to run the local preview on. Defaults to `3000`."*
**Closed.**

---

## D-011 — Icon library: **lucide**

`icons.library` options are `fontawesome` (default), `lucide`, `tabler`.

Chose **lucide**. Its uniform 2px stroke weight and rounded line caps sit closer to the
brand's rounded, organic geometry than Font Awesome's mixed solid/regular styles. Tabler is
visually similar but has a sparser icon set and weaker coverage of the commercial concepts
this site needs (handshake, trending-up, wallet).

---

## D-012 — Dark-mode accent: **Sky `#739AC1`**

The brief's diagnosis was right: `colors.light` is the emphasis colour **in dark mode**, and
the old config set it to Lead Blue `#0021F3`, which is near-invisible on Midnight.

Lead Blue on Midnight measures **1.73:1** — far below the 4.5:1 floor (see
`contrast-audit.md`). Sky measures **4.90:1** on a Midnight card and **5.31:1** on the deeper
Midnight page ground: AA for body text at both, with headroom on the page. Sky is already the
brand's designated secondary accent, so this uses the palette as intended rather than
inventing a tint.

Sky is the tightest ratio in the system, so it is worth being deliberate about: it is used for
links, focus rings and accent fills, never for long-form body text (which is White at 14.46).
If Sky is ever pushed onto smaller or lighter text, re-run the audit first.

---

## D-013 — Analytics: none configured

Confirmed with Lou. `integrations` is omitted from `docs.json` entirely rather than stubbed
with an empty provider. Adding one later is an isolated config change.

---

## D-014 — Headline font: Daimito wired up, `.woff2` pending

The brand doc refers to *"Daimito **Trial** Expanded"*, and a trial font must not ship on a
public production site. **Lou confirmed a production web licence exists** and will supply the
`.woff2`.

`docs.json` is wired for `/fonts/DaimitoExpanded-SemiBold.woff2` exactly as the brief
specifies, so dropping the file into `fonts/` is the only remaining step. Until then a
documented fallback stack carries headings — see D-015.

---

## D-015 — Font fallback stack while Daimito is missing

A missing `source` file would otherwise mean headings silently fall back to the browser
default serif, which looks broken rather than provisional.

`--font-heading` therefore declares Daimito first, then a geometric/grotesque stack that keeps
the display character (wide, tight-tracked) as closely as a system stack can:

```
"Daimito Expanded", "DM Sans", "Avenir Next", "Segoe UI", system-ui, sans-serif
```

When the real `.woff2` lands, nothing needs to change — Daimito simply starts winning.

---

## D-016 — `thumbnails.fonts.family` uses DM Sans, not Daimito

Per the brief's hard limit #14, `thumbnails.fonts.family` is **Google-Fonts-only**, so the
self-hosted headline face cannot render in social/OG cards. Set to **DM Sans**, which is the
brand body face and genuinely available from Google — a real brand font in the thumbnails
rather than a guess at a Daimito lookalike. Accepted limitation.

---

## D-017 — GitHub link is icon-only and site-wide (per-tab variation is impossible)

The brief flagged an earlier request to hide GitHub chrome on Overview and Publisher Guide but
keep it on Technical Docs.

**Mintlify's `navbar` config is global. Per-tab navbar variation is not documented and not
achievable** through configuration or the CSS selector surface — the navbar is one element
shared across every tab, and `data-current-path` could in principle hide it per-section, but
doing so would mean a navigation control that appears and disappears as a reader moves between
tabs, which is worse than either consistent option.

Implemented the documented fallback: GitHub as an **icon-only, de-emphasised** `navbar.links`
entry, site-wide. No star count, no label. **The per-tab version is not available** — flagged
for Lou rather than faked.

---

## D-018 — Two arithmetic discrepancies in the brief's contrast table

The audit reproduces the brief's brand table from the real tokens
(`node scripts/contrast-audit.mjs`). Every stated figure matches exactly — Lead Blue+White
8.36, Midnight+White 14.46, Cream+Midnight 12.58, Sky+Midnight 4.90 — with two exceptions:

1. **Clay + Midnight measures 8.05, not 8.36.** The brief appears to have copied the Lead
   Blue + White figure into that row. Both are comfortably AAA, so no design consequence.

2. **Clay + Lead Blue is labelled an outright FAIL but measures 4.65** — a marginal AA pass
   that fails AAA. **The prohibition stands regardless**: it is a brand-book rule, and 4.65 on
   a warm neutral is too thin for the colour that carries CTAs. Logged so the reasoning is not
   later mistaken for a measurement error and "corrected" by someone re-reading the table.

The other two banned pairs fail outright exactly as stated: Sky + Lead Blue **2.84**,
Lead Blue + Midnight **1.73**.

**Consequence:** none for the design. All three pairs remain excluded from the site.

---

## D-019 — Decorative borders are exempt from WCAG 1.4.11; focus rings are not

The first audit run flagged `--border-strong` against the page ground as a failure (1.67
light, 2.48 dark) because it was classified as a UI component at 3:1.

That classification was wrong. **WCAG 1.4.11 covers UI components and *meaningful* graphical
objects — not ornamental dividers and card outlines.** A subtle card border carries no
information; the card is already delimited by its surface colour and elevation. Forcing those
borders to 3:1 would produce hard grey rules across a design whose brand direction is warmth
and generous whitespace.

The audit now:
- reports decorative borders as **`decorative — exempt`**, measured but never failed, and
- adds **focus ring** pairs as real 3:1 pass/fail, since focus indicators genuinely are
  covered by 1.4.11. Both pass with headroom (light **7.28**, dark **5.31**).

**Consequence:** zero failures, and the audit now fails on things that actually matter.

---

## D-020 — `mint a11y`'s `colors.dark` FAIL is a **false positive** (evidence below)

`mint a11y` reports:

```
Dark Color (#0021F3) vs Dark Background: FAIL  1.87:1  (required 3:1)
Overall Assessment: FAIL
```

That reads as a real contrast failure. It is not, and the difference matters — "fix" it by
swapping in a palette colour that passes and you drain every primary CTA of its punch.

**What was done instead of assuming either way:** `colors.dark` was temporarily set to
magenta and the rendered DOM scanned, in both modes, for any element painting it.

Exactly **one** element in the entire document uses it:

```html
<span class="absolute inset-0 bg-primary-dark rounded-xl group-hover:opacity-[0.9]"></span>
<!-- parent: <a class="group … inline-flex items-center"> — the navbar "Get started" CTA -->
<!-- 109×36 at (1257, 10) -->
```

`colors.dark` is the **background fill of the navbar primary CTA**. It is never used as text,
and never painted on the page ground. The button renders Lead Blue with a white label in both
modes — **8.36:1, AAA**.

The check compares `colors.dark` against the dark page background *as if it were foreground
text*. For a button fill, that comparison has no meaning.

**Decision:** keep `colors.dark: #0021F3`. Lead Blue is the brand's primary and the CTA is
exactly where the brief says to be bold with it. `scripts/verify.sh` prints this as a known
warning with a pointer here, so no future session has to re-derive it — but note it does mean
**`mint a11y`'s overall assessment will always read FAIL** on this site. The MDX portion of
the audit is clean, and that is the part that reflects real page content.

---

## D-021 — Navigation uses `tabs`, not `products`

The brief suggested evaluating `navigation.products` for the audience split, since products
carry a `description`, `icon` and `href`.

Chose **`tabs`**. The deciding factor is visibility: in Aspen, tabs render as a **persistent
horizontal row directly under the navbar** (confirmed in the theme screenshots and in the
built site), so the Overview / Publisher Guide / Technical Docs fork is on screen at all
times. `products` render behind a switcher control — the fork becomes a click away.

The site's stated job is that "no visitor has to read a paragraph to find their way". A
navigation primitive that hides the primary choice inside a menu loses to one that does not,
and the `description` field is not worth that trade. The two large route cards on the landing
page carry the descriptive weight instead.

Each tab uses a group `root` page plus `directory: "card"`, so every section also has a card
landing page — verified rendering at `/overview`, `/publisher` and `/technical`.

---

## D-022 — Aspen's theme control is a **menu**, not the documented toggle

`customize/custom-scripts` documents `[data-component-name="theme-toggle"]`. **Aspen does not
render that element.** A DOM scan of every `data-component-name` on a built page returns
exactly one value:

```
data-component-name="theme-preference-menu"
trigger id: #theme-preference-menu-trigger   (aria-label="Change theme preference")
content id: #theme-preference-menu-content   (role="menu" → System / Light / Dark)
```

The styling written against the documented selector was **dead code** — it matched nothing.
`20-mintlify.css` now targets the documented name *and* the real Aspen one, so the rule
survives either a theme change or a Mintlify rename.

This is precisely the fragility that layer exists to absorb: no documented token API means the
selector surface is an implementation detail, and the documented list is not exhaustive per
theme. **Verify selectors against the built DOM rather than trusting the docs page.**

---

## D-023 — Colour-mode switching verified end to end, including the hard edge case

Not just OS emulation — the real control was driven and the resulting tokens read back.

| Scenario | `<html>` class | `--surface` | Result |
|---|---|---|---|
| OS light, default | *(none)* | `#F1EFEA` | ✅ Cream |
| OS light → chose **Dark** | `dark` | `#0D2440` | ✅ Midnight |
| OS light → chose **Light** | `light` | `#F1EFEA` | ✅ Cream |
| OS light → chose **System** | *(none)* | `#F1EFEA` | ✅ follows OS |
| OS **dark**, default | `dark` | `#0D2440` | ✅ Midnight |
| OS **dark** → chose **Light** | `light` | `#F1EFEA` | ✅ Cream |

The last row is the one that breaks naive implementations. A bare
`@media (prefers-color-scheme: dark)` block would keep applying dark tokens while Mintlify
switched the chrome to light, producing white-on-Cream text.

**Mintlify adds an explicit `.light` class on manual override**, so the dark block is guarded
as `:root:not(.light)` and correctly stands down. Both the class hook and the media query are
needed: the class tracks the site toggle, the media query covers a first paint with no stored
preference.

---

## D-024 — `/llms.txt`, `/llms-full.txt`, `/mcp` and `.md` suffixes are **deploy-time only**

All of these return **404 from `mint dev`**:

```
/llms.txt                            404
/llms-full.txt                       404
/mcp                                 404
/.well-known/mcp                     404
/overview/what-is-almedia-link.md    404
```

They are generated by Mintlify's hosting layer, not by the local preview server, so they
**cannot be verified locally at all** — including the `.md`-suffix trick this project's own
notes recommend for re-verifying Mintlify's docs (that works against *their* deployed site).

`contextual` is configured in `docs.json` and validates, but the endpoints themselves are
**unverified**. The brief makes functional verification a launch requirement, and it can only
happen on a real deployment. Carried to open-questions.md #9.

---

## D-025 — `mint score` could not be run

```
erro No URL provided and no default subdomain set. Run `mint login` to set one,
     or pass a URL: `mint score <url>`.
```

It grades a **deployed** site and needs either an authenticated session or a live URL. No
Mintlify account access here, and `mint login` was not run unasked. **Not run.** Carried to
open-questions.md #9 alongside the AI endpoints — both clear the same way, on first deploy.

---

## D-026 — Daimito Expanded is in, and the configured path was wrong (case)

Lou supplied the licensed `.woff2`. It landed as:

```
fonts/DaimitoExpanded-Semibold.woff2      ← lowercase "b"
docs.json pointed at .../DaimitoExpanded-SemiBold.woff2   ← capital "B"
```

**Both return 200 locally**, because macOS's filesystem is case-insensitive — so this would
have looked perfectly fine right up until it 404'd on Mintlify's hosting, which is
case-sensitive (hard limit #9). Corrected `docs.json` to match the real filename.

Verified it is genuinely rendering rather than silently falling back:

```
DaimitoExpanded-Semibold.woff2          HTTP 200
document.fonts → "Daimito Expanded 600 loaded"
h1 computed font-family                 "Daimito Expanded"
"Overview Almedia" @600 64px:
   Daimito Expanded  680px
   DM Sans           532px   ← 28% narrower
```

A fallback would have measured the same as DM Sans. The 28% spread is the Expanded face doing
what it should. **No trial font shipped**; the fallback stack in `--font-heading` stays as the
safety net and now simply never wins.

---

## D-027 — The "weird bubble" nav: an over-broad attribute selector

Reported by Lou against the tab row and sidebar. Two separate causes, one of them mine.

**Cause 1 — accidental capture.** `20-mintlify.css` styled the navbar CTA with:

```css
#navbar a[class*="primary"] { background: var(--accent); border-radius: var(--r-pill); }
```

Aspen's **active** nav tab carries `hover:text-primary` in its utility class list:

```
link nav-tabs-item group relative h-full gap-2 flex items-center font-medium
[text-shadow:...] hover:text-primary dark:hover:text-primary-light ...
```

So `[class*="primary"]` captured it. Inactive tabs carry `hover:text-gray-800` and were
untouched — which is why only the active tab looked wrong. Confirmed with CDP
`CSS.getMatchedStylesForNode`, which named that exact rule as the one painting it.

The tab is `h-full` (40px) with `padding: 0`, so it rendered as a 82×40 Lead Blue shape with a
999px radius and no breathing room, touching the row's top and bottom edges: a bubble.

**Substring matching on utility classes is a trap in a Tailwind-based theme.** The CTA is now
matched precisely via `:has(> span[class*="bg-primary-dark"])` — the fill span that
`colors.dark` actually paints (D-020) — and Mintlify's own CTA styling is left alone, since it
was already correct.

**Cause 2 — pill radius on short, wide elements.** `--r-pill` (999px) on a 40px-tall tab or a
28px-tall sidebar row yields semicircular ends: a lozenge, not a button. Tabs and sidebar rows
now use `--r-sm` (10px) — a true rounded rectangle. Pills remain correct for what they were
meant for: tags, badges and standalone CTAs, which are sized for them.

Tabs are also now inset in the row (`height: auto`, `align-self: center`, vertical padding)
rather than filling it, so the active indicator no longer touches the row border.

**Note on specificity:** `.nav-tabs-item` is a **class** in Aspen, not the custom element the
docs imply. The rules use `a.nav-tabs-item` (0,1,1) to beat Aspen's own `.h-full` (0,1,0).

---

## D-028 — The best-practices guide is now hosted here, not linked out

Lou supplied the Lovable export and asked for the guide to live in Mintlify directly. This
**reverses** the previous rule (CLAUDE.md §5 used to say "never duplicate the best-practices
guide; keep it a bridge page"). That rule existed to avoid two copies drifting apart — porting
it satisfies the same goal from the other direction: there is now exactly one copy, here.

### What the export actually contained

A React + Vite + TanStack Router SPA. Two things mattered:

1. **`src/lib/guide-markdown.ts`** — a complete machine-readable version of the entire guide,
   maintained alongside the page for JSON-LD. It was the authoritative content source, far
   better than reverse-engineering 1,493 lines of JSX.
2. **Most media was not in the export.** 22 of 27 assets were `.asset.json` *pointers* to
   Lovable's CDN, not files:
   ```json
   { "url": "/__l5e/assets-v1/<uuid>/popup-do.png", "content_type": "image/webp" }
   ```
   Those resolve only while that Lovable project is live. Self-hosting was impossible until
   they were downloaded. `scripts/fetch-guide-assets.mjs` does that once — 25 downloaded,
   5 copied from the export, 0 failures. **Lovable is no longer a runtime dependency.**

   Note `content_type` is authoritative over the filename: several `.png`-named assets are
   actually WebP. The script maps by content type.

   11 downloaded assets turned out to be unreferenced by the page and were pruned. 19 remain,
   15 MB total, every file under the 20 MB cap.

### Feasibility was smoke-tested first

The port needs stateful React inside MDX, which the brief's hard limits circumscribe heavily.
Proven before writing any of it: inline `export const C = () => {}` in a **page** MDX renders,
`useState`/`useEffect`/`useRef` are pre-injected, object state works, and a dynamic `style`
prop works — zero page errors. (The "no function declarations / named exports only" limit
applies to **snippet** files; a page MDX is fine.)

### Ownership — the one carve-out

`publisher/**` is commercial-owned and must stay plain MDX for the web editor. This page
cannot be: it is an interactive guide. So `publisher/best-practices.mdx` is now an explicit,
documented exception — engineering-owned, edited in the repo, **not** web-editor editable.
Everything else under `publisher/**` is unchanged and still safe.

`scripts/verify.sh` enforces the split: it now checks the *other* publisher pages for
`import` / `export const` / snippets (best-practices excluded), verifies no link-out to the
old Lovable URL survives, and confirms all 19 referenced assets resolve locally.

The URL `/publisher/best-practices` is unchanged, so the existing `/best-practices` redirect
and every inbound link still work.

### Four bugs found and fixed during the port

1. **Mintlify draws list bullets with an absolutely-positioned `::before`, not `::marker`.**
   `list-style: none` does nothing. Measured, then cleared both the pseudo-element and the
   32px item padding. Affects any custom list anywhere on the site.
2. **Nested `<a>`.** GFM autolinks a bare email in text — including inside an anchor I had
   written myself — producing `<a><a>link@almedia.co</a></a>` and a React hydration error
   (#418). Fixed by letting Mintlify create the link rather than wrapping it.
3. **`mode: "wide"` hides the table of contents.** It was set for extra width; on a
   15,000px-tall guide the TOC matters more. Reverted to default mode, which yields a
   22-entry TOC.
4. **Markdown headings inside a JSX `<div>` never reach the TOC** — they render as spans. All
   section headings are therefore top-level markdown, with the CSS variables scoped by
   `html[data-current-path="/publisher/best-practices"]` instead of a wrapper class.

### Deviations from the original SPA

- **Dark mode.** The original was light-only. Everything runs on the semantic token layer, so
  the guide works in both modes.
- **Clipboard copy** has a three-tier fallback (async API → `execCommand` → reveal the prompt
  for manual selection). The async API is unavailable in plenty of real contexts.
- **Dropped:** the `UploadSlot` admin uploader, confetti/celebration modals, the "unlock
  anyway" confirmation dialog, `PointerArrow` overlays, and the scroll-reveal wrapper — all
  either authoring tooling or decoration that the brand's motion rules would cut anyway.
- **Kept faithfully:** every section and all prose, both AI audit prompts verbatim, Do/Don't
  comparisons, chaptered videos with click-to-seek, image lightbox, and the gamified staged
  checklist with Link Coins (240 core + 90 bonus).
- The **audit prompts' closing line** now points at `dev.almedia.co/publisher/best-practices`
  instead of the Lovable URL, since that is where the guide lives.

### Not changed

The two survey links still point at `link-asset-hub.lovable.app` — those are separate Lovable
apps (the Earn Tab survey and the integration survey), not the guide, and Lou did not ask for
them to move. Flagged in open-questions.md.

---

## D-029 — Hotspot annotations ported; overlays must use the top layer

The port in D-028 missed the guide's most substantive interaction: clicking an image opens it
with **annotation markers** pointing at individual UI elements, each revealing an explanation
on hover. That is where the guide does most of its actual teaching — "why is this pop-up
good" is answered element by element, not in the prose.

Recovered from the export's `src/lib/hotspots.ts`: **34 annotations across 8 images**, each
with an `x`/`y` percentage, `good`/`bad` type, a two-word chip label, a headline and a note.
Extracted programmatically rather than retyped, and re-keyed from Lovable's slot ids
(`the-pop-up-itself-do`) to image filenames (`popup-do-tight.webp`), so swapping a screenshot
only means editing coordinates.

Replicated one-to-one: dot → connector → chip, the connector flipping outward when `x < 50`
so the note never covers what it points at, and the full label + note on hover, focus or click.

### The blocker: Mintlify's content column traps fixed overlays

A plain `position: fixed; z-index: 200` overlay was **painted underneath the z-30 navbar**.
The overlay measured a correct full-viewport box, so it was not a sizing problem —
`elementFromPoint` at the top of the screen still returned the navbar's search button.

Cause: Mintlify's `#content` carries Tailwind's `@container/columns-container`, i.e.
`container-type: inline-size`. That **implies `contain: layout`, which creates a stacking
context**. Everything inside it is confined to that context, so a z-index of 200 competes only
with its siblings, never with the navbar.

Fix: a native **`<dialog>` opened with `showModal()`**, which renders in the browser's **top
layer** — above every stacking context on the page, by definition. It also brings
Escape-to-close and a focus trap for free. This is strictly better than the original SPA's
`createPortal`, which is not available in Mintlify MDX anyway.

**Generalise this:** any modal, popover or overlay anywhere on this site has the same problem.
Use `<dialog>` + `showModal()`, not a fixed div with a high z-index.

Two related details:
- The **scrim sits on the dialog itself, not `::backdrop`**. `::backdrop` inheriting custom
  properties from its originating element is a recent spec change and unevenly implemented, so
  tokens are unreliable there — and hard-coding the colour would break the one-token-file rule.
  The dialog already fills the viewport, so it scrims just as well.
- `showModal()` makes the page inert but does **not** stop it scrolling behind the dialog in
  every browser, so the body scroll lock is still applied explicitly.

### Coordinates must map to the image box, not the container

Hotspots are percentages **of the image**. A first pass positioned them against a
`width: fit-content` stage, which drifted ~1.8% vertically. The marker layer now sits on a
wrapper given the *same explicit pixel dimensions* as the image, so every marker lands exactly:
declared `19 / 73.9` measures `19 / 73.9`.

The image itself is sized from its natural dimensions, capped by viewport and device pixel
ratio, so a raster is never upscaled past what the display can resolve.

### Touch gets a different treatment, deliberately

On a 390px screen the floating chips were unusable — **4 of 7 rendered off-screen** — and
tapping opened nothing, because `mouseenter` fires before `click` on touch and the two
cancelled each other out.

Detected with `matchMedia("(hover: hover) and (pointer: fine)")` rather than a width
breakpoint, since a narrow window on a laptop should still get the chips. Without hover, the
image carries **numbered pins** only and the notes are listed underneath keyed by the same
number, selectable from either side. Verified: 7 pins, 0 off-screen, tapping pin 2 activates
note 2.

### Discoverability

An annotated image is worthless if nobody realises it is annotated. Each thumbnail now carries
a count badge — "7 · what to look at" — and the button's accessible name says the same.

---

## D-030 — Layout: sticky rails, wide screens, an auto-hiding navbar, and the img-margin bug

Four issues Lou reported, all on the guide/layout rather than content.

### 1. `overflow: hidden` on body was killing every sticky element

The navbar, sidebar and table of contents all scrolled away. Measured: after scrolling
1063px the navbar's `y` was **−1063** — it had moved exactly with the page, despite
`position: sticky; top: 0`.

Cause was **mine**: `10-base.css` had `body { overflow-x: hidden }` as a horizontal-overflow
guard. **`overflow-x: hidden` makes body a scroll container, which silently defeats
`position: sticky` for every descendant.** Mintlify's own wrapper uses `overflow-x: clip` —
which guards overflow *without* creating a scroll container. One-word fix.

Aspen already ships all three as sticky (`#navbar`, `nav#sidebar-content`,
`#content-side-layout`); nothing needed adding, only un-breaking. Verified at 0/3000/9000px
scroll: navbar `y=0`, sidebar `y=96`, TOC wrapper `y=152`, all constant.

Also added: each rail is capped to the viewport height minus the navbar with
`overflow-y: auto`, so a long sidebar or TOC scrolls internally instead of being cut off.

### 2. Wide screens wasted most of the viewport

Aspen caps `#body-content` at 1536px and `#content-container` at 1152px, so at 2560px the
content column was **664px with ~1400px of dead margin**. Raised both caps at ≥1536px and
≥1920px, by ID so specificity beats the Tailwind class.

| Viewport | Content column before | after |
|---|---|---|
| 1440px | 632px | 632px (unchanged, below breakpoint) |
| 1920px | 664px | **997px** |
| 2560px | 664px | **1232px** |

The rails move outward with it (TOC from x=1692 → x=1976 at 2560px). Prose stays readable
because running text is separately capped at `--measure`, so the extra width goes to cards,
tables and media.

### 3. Auto-hiding navbar — the one custom JS file

Hide on scroll down, reveal on scroll up. **Scroll *direction* cannot be detected in CSS** —
scroll-driven animations expose position, not direction — so this needs a listener.
`scroll-navbar.js` is now the only custom JS in the project (D-005 verified custom JS runs).

It is deliberately minimal and pure progressive enhancement: it only ever toggles
`data-nav-hidden` / `data-nav-scrolled` on `<html>`, and all the visual work is CSS. **If it
never runs the navbar simply stays visible and sticky**, which is a perfectly good outcome —
nothing structural depends on it. That matters because the brief's rule is one JS file only
(Mintlify does not guarantee order across several) and because production behaviour is
unverified until first deploy.

Handled: never hides within 120px of the top, never while a modal `<dialog>` is open, reveals
on focus entering the navbar (so keyboard focus can't land off-screen), reveals on
`hashchange`, ignores sub-threshold jitter and rubber-banding, and **does nothing at all under
`prefers-reduced-motion`** — sliding chrome is motion.

Verified: top → visible; scroll to 2000 → hidden (`y=-97`); scroll up to 1400 → visible; near
top → visible.

### 4. The real cause of the clipped placement screenshots

Lou reported the entry-point images "cut off at the bottom too strong" and wanting them the
same size. The frames had a fixed `aspect-ratio` with `object-fit: contain`, which should be
incapable of clipping — and computed styles confirmed `object-fit: contain`. It still clipped.

**Cause: Mintlify's prose styles put `margin: 2em 0` on `img`.** A `<button>` (which the frame
is, for the lightbox) establishes a block formatting context, so those margins do not collapse
out — they added 64px to the frame's height (593 + 32 + 32 = 657, measured exactly). Inside a
fixed aspect-ratio box the top margin pushed the picture down 32px and an equal amount was
clipped off the bottom: precisely the Freecash offer banner, which is the bottom ~6% of that
screenshot and the entire point of the card.

Fixed by zeroing image margins inside frames. The placement frames additionally now size to
their image (`aspect-ratio: auto`, `height: auto`) rather than to a fixed box, which removes
the whole class of problem — there is no box left to overflow — and makes the pointer arrows
exact, since a percentage now refers to the picture rather than to a box the picture floats
inside. Both cards render 274×598 and 274×593: a matched pair with nothing cropped.

### 5. Pointer arrows restored

`PointerArrow` was dropped in the D-028 port. Restored from the source guide: a red arrow with
its **tip** at a percentage position, rotated to point in any direction. Lovable had two
(homescreen, banner); a third was added for the shop tile, since the same "which element am I
looking at" problem applies there and Lou's note was about clarity.

The red is `--annotate-red`, a new token, documented as a **functional annotation colour** used
only on product screenshots, never in site UI. It is a different value from China Red, which
stays undefined and banned. Note the ban is enforced by `scripts/verify.sh` as a plain grep, so
China Red's hex must not appear even inside a comment — the first version of that token's
comment tripped the check, which is the check working.

### 6. Full user flow video

Capped to 330px wide. At full column width it was enormous, and more so now the content column
grows to ~1230px on a wide screen. It is a portrait phone recording; it should look like one.
