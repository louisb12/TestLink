# Almedia brand system — the single source of truth

This document is the *specification*. `styles/00-tokens.css` is the *implementation*.
If they disagree, this file wins and the CSS is wrong.

**Every raw hex in this project lives in `styles/00-tokens.css` and nowhere else.** The one
unavoidable exception is `docs.json` (JSON cannot read CSS variables) — its colour values are
duplicated by hand and must be kept in sync.

---

## 1. Colour

| Token | Hex | Role |
|---|---|---|
| **Lead Blue** | `#0021F3` | **Primary.** CTAs, bold backgrounds, primary highlights. Be bold with it. |
| **Midnight** | `#0D2A4C` | Headings, body text on light, logo, dark-mode surfaces |
| **Sky** | `#739AC1` | Secondary accent — **and the dark-mode accent**, because Lead Blue dies on Midnight |
| **Clay** | `#CBC0AE` | Neutral/warm backgrounds, UI |
| **Cream** | `#F1EFEA` | Page and section backgrounds |
| **White** | `#FFFFFF` | Text on dark; raised cards in light mode |
| **Black** | `#0C0C0E` | Text |
| **China Red** | `#E9223D` | **China events only — NEVER on this site.** |

### Pairings

- **Subtle** = Cream base + one secondary + Midnight text.
- **Strong** = Lead Blue + Midnight, White text.

### Don'ts (from the brand book)

- Don't use more than a few colours in one application.
- Nothing outside the palette.
- **No coloured body type** — Midnight on light, White on dark.
- Maximise digital contrast.

### Semantic layer

Raw brand tokens are never referenced directly by components. A semantic layer sits on top,
and **only the semantic layer is redefined per colour mode**:

`--surface` · `--surface-raised` · `--surface-sunken` · `--text` · `--text-muted` ·
`--text-inverse` · `--border` · `--border-strong` · `--accent` · `--accent-hover` ·
`--accent-contrast` · `--decor`

**Define the complete light palette on bare `:root`. Never let a colour's only definition live
inside a dark-mode block.**

- **Light mode is Cream-based**, not white: page `#F1EFEA`, raised cards `#FFFFFF`. That
  page-vs-card contrast is what makes light mode read as designed rather than default.
- **Dark mode is Midnight-based**, not black.
- **Dark-mode accent is Sky `#739AC1`**, not Lead Blue.

---

## 2. Accessibility — non-negotiable

| Background | Text | Ratio | Rating |
|---|---|---|---|
| Lead Blue | White | 8.36 | AAA |
| Midnight | White | 14.46 | AAA |
| Cream | Midnight | 12.58 | AAA |
| Clay | Midnight | 8.36 | AAA |
| Sky | Midnight | 4.90 | AA |
| **Clay** | **Lead Blue** | — | **FAIL — never** |
| **Sky** | **Lead Blue** | — | **FAIL — never** |

Every colour pair introduced must be contrast-checked programmatically **in both modes**, with
results written to `contrast-audit.md`. Regenerate with `node scripts/contrast-audit.mjs`.
Run `mint a11y` as part of the loop.

---

## 3. Typography

| Role | Face | Weight | Tracking | Leading |
|---|---|---|---|---|
| Headlines | **Daimito Expanded** | SemiBold (600) | −3 (`-0.03em`) | 80–95% |
| Subheads | DM Sans | Medium (500) | −2 to 0 | 100–130% |
| Body | DM Sans | Regular (400) | −0.5 to −2 | 115–135% |
| Buttons | DM Sans | Bold (700) | −2 | — |

DM Sans loads automatically from Google by naming `family` only. Daimito is self-hosted at
`/fonts/DaimitoExpanded-SemiBold.woff2` (**file pending from Lou** — see open-questions.md).

### Web type scale — derived, not copied

The brand scale (H1 180 / H2 110 / H3 48 / H4 28) is a **print/presentation scale**. This is a
re-derivation with the same *proportions and character* — tight tracking, tight leading, large
display sizes — fluid via `clamp()`.

| Token | `clamp()` | Range | Leading | Tracking |
|---|---|---|---|---|
| `--fs-display` | `clamp(2.75rem, 1.35rem + 6.2vw, 6rem)` | 44 → 96px | 0.88 | −0.03em |
| `--fs-h1` | `clamp(2.25rem, 1.55rem + 3.2vw, 4rem)` | 36 → 64px | 0.92 | −0.03em |
| `--fs-h2` | `clamp(1.75rem, 1.35rem + 1.9vw, 2.75rem)` | 28 → 44px | 0.95 | −0.03em |
| `--fs-h3` | `clamp(1.375rem, 1.2rem + 0.8vw, 1.75rem)` | 22 → 28px | 1.05 | −0.02em |
| `--fs-h4` | `clamp(1.125rem, 1.05rem + 0.35vw, 1.3125rem)` | 18 → 21px | 1.2 | −0.02em |
| `--fs-body` | `1rem` | 16px | **1.65** | −0.011em |
| `--fs-small` | `0.875rem` | 14px | 1.5 | −0.006em |
| `--fs-eyebrow` | `0.75rem` | 12px | 1.3 | +0.08em (uppercase) |

**Body leading is deliberately looser than a typical API reference** (~1.65). The Publisher
Guide is read casually by non-technical people. The brand's tighter 115–135% is kept for UI
text — buttons, badges, cards, sidebar — not for long-form prose.

---

## 4. Design language

- **Rounded corners on everything. Nothing square.**

  | Token | Value | Use |
  |---|---|---|
  | `--r-xs` | 6px | badges, inline code |
  | `--r-sm` | 10px | inputs, small chips |
  | `--r-md` | 14px | code blocks, callouts |
  | `--r-lg` | 20px | cards |
  | `--r-xl` | 28px | route cards, stat tiles |
  | `--r-2xl` | 36px | hero panels, section wells |
  | `--r-pill` | 999px | **all** buttons, tags, badges |

- **Pill-shaped tags and badges.** Buttons are full pills: Lead Blue fill, White DM Sans Bold,
  tracking −2.
- **Organic blob SVGs as background accents** — never sharp geometric shapes. Brand shape sets
  are *Engage, Expand, Boost* (beliefs) and *Spotlight, Highlight, Connect, Process*
  (behaviours). Three usage approaches: **Background** (textured backdrop), **Container**
  (framing content), **Engagement** (interacting with type/imagery). Low-opacity, decorative
  only — **never behind body text.**
- **Generous whitespace.** A brand rule, not a preference. Err spacious.

  Spacing scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128` px
  (`--sp-1` … `--sp-10`).

- **Left-aligned by default.** Centre only for hero statements above the fold.
- **Logo:** top-left or bottom-left in combination with content; centred when standalone.

---

## 5. Motion

Three brand principles — the brief for every animation:

- **Growth** — motion conveys growth and progression.
- **Simple** — not overly complicated; a simple tool to bring graphics to life.
- **Precise** — sleek; simple but done with care and craft.

Read that as: **no bouncing, no spinning, no attention-grabbing. Short, eased, purposeful.**

| Token | Value |
|---|---|
| `--dur-fast` | 150ms |
| `--dur-base` | 250ms |
| `--dur-slow` | 400ms |
| `--ease-brand` | `cubic-bezier(0.16, 1, 0.3, 1)` — decelerating, precise |
| `--ease-soft` | `cubic-bezier(0.22, 0.61, 0.36, 1)` |

Rules:

- **Everything is CSS.** No animation library is available (no npm packages in MDX).
- Animate **only `transform` and `opacity`** for anything on scroll or loop. No
  layout-triggering properties.
- **Nothing loops forever near reading content.**
- The landing page carries the most motion; doc pages carry almost none. Someone reading the
  Publisher Guide for the fifth time should not be animated at.
- If an animation is decorative rather than communicative, **cut it**.
- `prefers-reduced-motion: reduce` is mandatory and is the **only** place `!important` is
  allowed.

---

## 6. Logo

### The symbol

The stylised "A" plus data funnel — "engagement in motion". Two paths, viewBox `0 0 125 133`.
Held in `logos/symbol-*.svg`.

### The four approved colour combinations — only these

| Combination | Background |
|---|---|
| Midnight logo | White |
| Midnight wordmark + Lead Blue symbol | Cream |
| White logo | Lead Blue |
| White wordmark + Lead Blue symbol | Midnight |

### Minimum sizes

- Horizontal / vertical lockup: **120px** wide
- Symbol alone: **35px**
- Favicon: **16px** (symbol only)
- Avatar: symbol at 60% of a square; 55% optically centred in a circle

### Don'ts

No stretching, rotating, mirroring, recolouring outside the four combos, separating symbol
from wordmark, mixing orientations, outlining the symbol, adding elements, or using secondary
colours for the symbol.

---

## 7. Approved product facts

**Exactly two stats are approved for use:**

- **~15% average install-to-link rate**
- **10%+ LTV lift for linked users**

Everything else — revenue share, pricing, SDK signatures, MMP event names — must come from the
team. Placeholder, never invent. See `CLAUDE.md` §5.
