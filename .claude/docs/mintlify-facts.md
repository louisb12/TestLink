# Mintlify platform facts — verified

> **Cheap re-verification:** append `.md` to any Mintlify docs URL to get raw Markdown, e.g.
> `https://www.mintlify.com/docs/customize/custom-scripts.md`. The full page index is at
> `https://mintlify.com/docs/llms.txt`. Re-verify before trusting anything here; Mintlify
> ships changes and **their docs win** over this file and over the build brief.
>
> Last verified: **2026-09-01**, against `mint` CLI **4.2.857**.

---

## Toolchain

| Fact | Source |
|---|---|
| Package is `mint`; `mintlify` is deprecated | `cli/commands` |
| `mint dev` previews locally, **default port 3000, `--port` flag IS supported** | `cli/commands` |
| Commands: `dev` `validate` `broken-links` `a11y` `format` `score` `export` `new` `update` `version` `index` `login` `logout` `signup` `status` `add-domain` `automations` `analytics` `config` | `cli/commands` |
| Node ≥ 20.17.0 (brief; **not stated** in the CLI docs page) | brief, unconfirmed upstream |

## Themes — all nine, verbatim descriptions

| Theme | Description |
|---|---|
| Mint | "Classic documentation theme with time-tested layouts and familiar navigation." |
| Maple | "Modern, clean aesthetics perfect for AI and SaaS products." |
| Palm | "Sophisticated fintech theme with deep customization for enterprise documentation." |
| Willow | "Stripped-back essentials for distraction-free documentation." |
| Linden | "Retro terminal vibes with monospace fonts for that 80s hacker aesthetic." |
| Almond | "Card-based organization meets minimalist design for intuitive navigation." |
| **Aspen** | **"Modern documentation crafted for complex navigation and custom components."** ← chosen |
| Sequoia | "Minimal, elegant layouts designed for large-scale content-focused documentation." |
| Luma | "Clean, minimal design for polished documentation." |

Source: `customize/themes`. Preview any theme at `https://<theme>.mintlify.site`.

## Page modes — and which themes support them

| Mode | Chrome removed | Themes |
|---|---|---|
| `default` | none | all |
| `wide` | "Hides the side panel, which includes the table of contents, `<Panel>` components, and API request and response examples" | all |
| `custom` | "Removes all elements except for the top navbar" — hides sidebar, TOC and footer | **all** |
| `frame` | table of contents only | Aspen, Almond, Luma, Sequoia |
| `center` | sidebar and table of contents | Mint, Linden, Willow, Maple |
| `assistant` | all page content replaced with a chat interface | all |

Source: `organize/pages`. **`mode: custom` works on every theme** — the landing page is not
theme-gated. `<Panel>` stops rendering entirely under `custom`.

### Valid page frontmatter fields

`title` `description` `sidebarTitle` `icon` `iconType` `tag` `hidden` `noindex` `searchable`
`boost` `deprecated` `hideFooterPagination` `related` `hideApiMarker` `contextual` `groups`
`mode` `api` `openapi` `url` `timestamp` `lastUpdatedDate` — plus custom fields (any valid YAML).

Source: `organize/pages`.

---

## Custom CSS / JS

Source: `customize/custom-scripts`.

- **Any `.css` file inside the content directory** (the folder holding `docs.json`) is injected
  on **every page**. No import, no registration, no magic filename. Same for `.js`.
  > "Mintlify includes any `.css` file inside your content directory on every page of your site"
- **JS load order across multiple files is not guaranteed.**
  > "When you include multiple `.js` files, they run without a guaranteed order"
  → keep JS to one file. Custom JS runs *after* page interactivity begins.
- **Subdirectories work (measured, not documented).** The docs say "inside your content
  directory"; they do not say whether nested folders count. They do — all five files in
  `styles/` are injected and applied. Verified by reading back a token, a component rule, a
  page-scoped rule and a parsed `@keyframes` from the built page.
- **Cascade order is filename order** across files, last wins (decisions.md D-003). This is
  CSS only — Mintlify explicitly does **not** guarantee `.js` order.
- **Implementation detail (measured, not documented):** Mintlify **inlines** custom CSS and JS
  into the document rather than emitting `<link>` / `<script src>` tags. A probe for
  `link[rel=stylesheet][href*=…]` finds nothing even when the CSS is fully applied. Do not
  verify injection by looking for a link tag — check computed styles.
- **Tailwind v3 is available in MDX. Arbitrary values are not.**
  > "Tailwind CSS arbitrary values are not supported."
- **The `style` prop is discouraged:**
  > "Using the `style` prop can cause a layout shift on page load, especially on custom mode
  > pages. Use Tailwind CSS classes or custom CSS files instead to avoid shifts or flickering."
- **`@keyframes` is not mentioned anywhere in the docs.** It was smoke-tested here and **works**
  (decisions.md D-001).

### ⛔ Comments inside `export const` blocks break the production build

**Undocumented, and invisible locally.** Any JS or JSX comment inside an `export const` block
makes the **production** MDX compiler fail, replacing the page with *"A parsing error
occured"*. `mint dev` renders it fine and `mint validate` reports success.

Fails: `//` line comments, `/* */` blocks, `{/* */}` inside returned JSX, comments inside a
data array, trailing comments on a code line.
Fine: MDX comments at page level, outside every export.

Also: **an MDX comment ends at the first terminator it meets.** Writing that sequence inside a
comment closes it early and spills the remainder into the page.

`mint export` is the **only** local reproduction — it builds a real production bundle. Hence
`scripts/verify-build.sh` and `scripts/lint-mdx.py`. Full bisection in decisions.md D-031,
including the list of constructs that turned out to be fine (early returns, IIFEs, useEffect
cleanups, long template literals, `<dialog>`, CSS custom properties in style objects).

### Layout facts that are not in the docs (all measured)

| Fact | Consequence |
|---|---|
| `#sidebar` **does not exist** in Aspen — it is `nav#sidebar-content` | Rules written against `#sidebar` are dead code. Aspen also uses `#content-side-layout` (sticky) wrapping `#table-of-contents`. |
| `#header` is the **page** header (title + description), not the navbar | The navbar is `#navbar`. Styling `#header` paints a box behind every page title. |
| The navbar, `#sidebar-content` and `#content-side-layout` are **already `position: sticky`** | They need no help — but **any `overflow: hidden` on `body` breaks all three**, because it makes body a scroll container. Use `overflow-x: clip`, which guards overflow without creating one. Mintlify's own wrapper uses `clip`. |
| `#body-content` caps at `max-w-8xl` (1536px), `#content-container` at `max-w-6xl` (1152px) | On a 2560px display the content column is only ~664px. Raise both caps by ID (specificity beats the Tailwind class) to use wide screens. |
| Headings are **flex containers** — the class list includes `flex`, the text sits in a `<span>`, and an anchor-link `<div>` sits beside it | `text-align: center` is **inert** on a heading. Use `justify-content: center`. This silently left-aligned the guide's hero title while everything around it centred. |
| Prose styles put **`margin: 2em 0` on `img`** | Inside any element that establishes a block formatting context (e.g. a `<button>` wrapper) those margins do not collapse out — they add 64px of height, and inside a fixed `aspect-ratio` box they push the picture down and clip it. Zero the margins on images inside custom frames. |
| List bullets are an absolutely-positioned **`::before`**, not `::marker`, plus 32px item padding | `list-style: none` does nothing. Clear the pseudo-element and the padding. |

### Overlays: use `<dialog>` + `showModal()`, never a fixed div

**Mintlify's `#content` creates a stacking context.** It carries Tailwind's
`@container/columns-container` (`container-type: inline-size`), which implies `contain: layout`
— and that creates a stacking context and a containing block. A `position: fixed` overlay with
`z-index: 200` inside the content column is therefore still painted **under the z-30 navbar**.

The reliable escape is the browser's **top layer**:

```jsx
const ref = useRef(null);
useEffect(() => { if (open) ref.current?.showModal(); else ref.current?.close(); }, [open]);
<dialog ref={ref} onClose={...} onCancel={...}>…</dialog>
```

`showModal()` renders above every stacking context, and brings Escape-to-close and a focus trap.
`createPortal` is not available in MDX. Measured — see decisions.md D-029.

Two gotchas: clear the UA defaults (`border`, `padding`, `margin`, `max-width/height`), and
put the scrim on the dialog rather than `::backdrop`, whose inheritance of custom properties is
unevenly implemented.

### Page-scoped CSS — the documented mechanism

> "Use `data-current-path` to style custom CSS on specific pages or subpaths"

```css
html[data-current-path="/"]                  { /* root page only */ }
html[data-current-path="/quickstart"]        { /* one page */ }
html[data-current-path^="/technical/"]       { /* a whole section, prefix match */ }
```

Verified working, including specificity over a base rule (D-004). The attribute is present on
the `<html>` element on every page.

### The styling selector surface — treat it as the API

There is **no documented CSS-variable / design-token API.** You are styling against an
implementation surface that can shift between releases. Mitigation: put every brand value in
*our own* custom properties (`styles/00-tokens.css`) and reference only those, so a Mintlify
change means editing selectors, never values.

- **ID selectors** (~40 documented): `#header` `#navbar` `#sidebar` `#content` `#content-area`
  `#footer` `#page-title` `#background-color` `#table-of-contents` `#search-bar-entry`
  `#assistant-entry` `#feedback-thumbs-up` …
- **Custom element selectors** (~90 documented): `card` `card-group` `callout` `steps` `step`
  `tabs` `frame` `accordion` `code-block` `panel` `breadcrumb-item` `nav-logo` `nav-tabs-item`
  `sidebar-group` `toc-item` `pagination-prev` `pagination-next` `api-section`
  `chat-assistant-sheet` …
- **Data attributes**: `[data-active]` (nav/sidebar/TOC active state),
  `[data-component-name="theme-toggle"]`, `[data-component-name="mermaid-container"]`,
  `[data-component-part="card-icon"]`, `[data-badge]` + colour/size filters,
  `[data-current-path]`.

Read the full list at `customize/custom-scripts` before inventing a selector — but **verify it
against the built DOM**, because the documented list is not accurate per theme:

| Documented | Reality in Aspen |
|---|---|
| `[data-component-name="theme-toggle"]` | **Does not exist.** Aspen renders `[data-component-name="theme-preference-menu"]`, trigger `#theme-preference-menu-trigger`, content `#theme-preference-menu-content` (`role="menu"` → System/Light/Dark). See D-022. |
| `#header` | Is the **page** header (title + description block), *not* the site navbar. The navbar is `#navbar`. Styling `#header` paints a box behind every page title. |

A quick way to get the real vocabulary for a theme:

```js
new Set([...document.querySelectorAll('[data-component-name]')]
  .map(e => e.getAttribute('data-component-name')))
```

---

## Fonts

Source: `customize/fonts`.

```json
{
  "fonts": {
    "heading": { "family": "InterDisplay", "source": "/fonts/InterDisplay-Bold.woff2",
                 "format": "woff2", "weight": 700 },
    "body":    { "family": "InterDisplay", "source": "/fonts/InterDisplay-Regular.woff2",
                 "format": "woff2", "weight": 400 }
  }
}
```

- `family` is **required**. `source` is a URL or local path — **not needed for Google Fonts**
  (name the family and it loads).
- `format` is **"Required when using the `source` field"**. Supported: `woff`, `woff2` only.
- `heading` and `body` each take `family` `weight` `source` `format`.

---

## `$ref` file splitting

`docs.json` supports `$ref`: `"navigation": { "$ref": "./config/navigation.json" }`.
Relative paths only, no traversal above the project root, no circular refs.
Source: `organize/settings-reference`.

## Images and files

Source: `create/image-embeds`, `create/files`.

- **Root-relative paths only** — `/images/x.png`. `./x.png` does not work.
- **20 MB per file.** Paths are **case-sensitive**. Repo structure maps to URL structure.
- All plans: `png jpg jpeg gif webp svg ico mp4 webm mp3 wav json yaml css js woff woff2 ttf eot`.
  Enterprise-only: `pdf txt xml csv zip`.
- `node_modules` `build` `dist` `.git` are auto-ignored — never stash assets there.
- **SVG `foreignObject` is stripped in production** (breaks draw.io exports with text).
- Dark/light asset swapping — the documented pattern:
  ```html
  <img className="block dark:hidden" src="/images/thing-light.svg" alt="…" />
  <img className="hidden dark:block" src="/images/thing-dark.svg" alt="…" />
  ```
- **Static file serving is disabled entirely on sites with authentication enabled.**

## Components

Source: `components`, `customize/react-components`, `create/reusable-snippets`.

Built-ins: `Card` `CardGroup` `Columns` `Tabs` `Steps` `Accordion` `AccordionGroup` `Callout`
`Frame` `Badge` `Tile` `Panel` `Expandable` `Update` `Tooltip` `Icon` `CodeGroup` `Mermaid`
`Tree` `Color` `Prompt` `GitHub.Repo`.

- **Typed callouts** (`Note` `Warning` `Info` `Tip` `Check` `Danger`) **accept only `children`** —
  not recolourable, not re-iconable. Use generic `<Callout icon="…" color="#hex">` for brand colour.
- React in MDX: hooks pre-injected (`useState` `useEffect` `useRef` `useCallback` `useMemo`
  `useContext` `useReducer`), no import needed. **Named exports only.** No default exports, no
  function declarations in snippets, no `React.lazy`, no dynamic `import()`, no JSON imports.
  **A snippet file cannot import another snippet file.**
- **`<MDX>` limits: 8 levels of nesting, 500 fragments per page.** Exceeding either fails the build.
- **Snippets do not work in the web editor.**
- Mermaid renders natively from ```mermaid fences.

## Navigation

Source: `organize/navigation`.

- `navigation.tabs`, `navigation.products`, `navigation.anchors`, `navigation.groups`,
  `navigation.pages`, `navigation.global`.
- **`products`** carry `description`, `icon` and `href` — a better fit for an audience fork
  than bare tabs.
- Group **`root`** page + **`directory: "card"`** renders a section landing page as cards
  rather than a bare list.
- `navbar.primary` (single CTA), `navbar.links`.
- **The navbar config is global. Per-tab navbar variation is NOT documented** — you cannot
  show GitHub chrome on one tab and hide it on another.
- `icons.library`: `fontawesome` (default), `lucide`, `tabler`.

## Redirects

`redirects: [{ source, destination, permanent }]` — default 308, `"permanent": false` → 307.
**`source` cannot contain anchors or query params.** Source: `organize/settings-reference`.

## AI readiness — free, zero config

Source: `ai/llmstxt`, `ai/model-context-protocol`, `ai/contextual-menu`.

- **`llms.txt` / `llms-full.txt` are automatic.** Served at `/llms.txt`, `/llms-full.txt` and
  the `/.well-known/` equivalents. Split indexes land under `/_llms/` past 100,000 characters.
  **Any page URL + `.md` returns raw Markdown.** Override by committing your own file at the
  project root — only if the generated one is wrong.
- **MCP is automatic:** `/mcp` (public), `/authed/mcp`, `/.well-known/mcp` (JSON discovery).
  Exposes search, a queryable docs filesystem, and feedback submission.
- **`contextual.options`**: `copy` `view` `claude` `chatgpt` `cursor` `vscode` `mcp`
  `perplexity` `grok`.
- These are a **launch requirement** — verify functionally by pointing an agent at `/mcp` and
  asking a real integration question. "The endpoint responds" is not verification.

## Escape hatch — know it exists, do not take it unasked

Headless: an Astro frontend via `@mintlify/astro`, reading `docs.json` + MDX at build time,
with `resolvePageData()` / `unwrapNav()` and the Search + Assistant APIs. **This abandons the
web editor and is a different project.** Source: `guides/custom-frontend`.

## Not confirmed upstream

- **Which plan gates custom CSS/JS, MCP, or headless.** Mintlify's docs do not say. Open
  question for Lou.
- Node ≥ 20.17.0 — from the brief, not found on the CLI docs page.
