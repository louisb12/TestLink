# Contrast audit

**Generated** by `node scripts/contrast-audit.mjs` from `styles/00-tokens.css`.
Do not edit by hand — regenerate whenever a colour changes.

Generated: 2026-09-01

Thresholds: body text **4.5** (AAA 7.0) · large text **3.0** (AAA 4.5) · UI/borders **3.0**.
Translucent tokens are composited over their backdrop before measuring.

## Light mode

| Pair | Foreground | Background | Ratio | Required | Rating |
|---|---|---|---|---|---|
| Body text on page | `--text` #0D2A4C | `--surface` #F1EFEA | **12.58** | 4.5 | AAA |
| Body text on raised card | `--text` #0D2A4C | `--surface-raised` #FFFFFF | **14.46** | 4.5 | AAA |
| Muted text on page | `--text-muted` #56697F | `--surface` #F1EFEA | **4.91** | 4.5 | AA |
| Muted text on raised card | `--text-muted` #56697F | `--surface-raised` #FFFFFF | **5.64** | 4.5 | AA |
| Link / accent on page | `--accent` #0021F3 | `--surface` #F1EFEA | **7.28** | 4.5 | AAA |
| Link / accent on raised card | `--accent` #0021F3 | `--surface-raised` #FFFFFF | **8.36** | 4.5 | AAA |
| Button label on accent fill | `--accent-contrast` #FFFFFF | `--accent` #0021F3 | **8.36** | 4.5 | AAA |
| Label on bold (Lead Blue) fill | `--accent-bold-contrast` #FFFFFF | `--accent-bold` #0021F3 | **8.36** | 4.5 | AAA |
| Text on callout ground | `--text` #0D2A4C | `--callout-bg` #F1EFEA | **12.56** | 4.5 | AAA |
| Text on inverse panel | `--text-inverse` #FFFFFF | `--surface-inverse` #0D2A4C | **14.46** | 4.5 | AAA |
| Heading on sunken well | `--text` #0D2A4C | `--surface-sunken` #E3E3E1 | **11.27** | 3.0 | AAA |
| Focus ring on page | `--accent` #0021F3 | `--surface` #F1EFEA | **7.28** | 3.0 | AAA |
| Focus ring on raised card | `--accent` #0021F3 | `--surface-raised` #FFFFFF | **8.36** | 3.0 | AAA |
| Decorative border on page | `--border-strong` #B6BCC1 | `--surface` #F1EFEA | **1.67** | n/a | decorative — exempt |
| Decorative border on card | `--border-strong` #C0C8D0 | `--surface-raised` #FFFFFF | **1.70** | n/a | decorative — exempt |

## Dark mode

| Pair | Foreground | Background | Ratio | Required | Rating |
|---|---|---|---|---|---|
| Body text on page | `--text` #FFFFFF | `--surface` #0D2440 | **15.64** | 4.5 | AAA |
| Body text on raised card | `--text` #FFFFFF | `--surface-raised` #0D2A4C | **14.46** | 4.5 | AAA |
| Muted text on page | `--text-muted` #BBC3CD | `--surface` #0D2440 | **8.82** | 4.5 | AAA |
| Muted text on raised card | `--text-muted` #BBC3CD | `--surface-raised` #0D2A4C | **8.15** | 4.5 | AAA |
| Link / accent on page | `--accent` #739AC1 | `--surface` #0D2440 | **5.31** | 4.5 | AA |
| Link / accent on raised card | `--accent` #739AC1 | `--surface-raised` #0D2A4C | **4.90** | 4.5 | AA |
| Button label on accent fill | `--accent-contrast` #0D2A4C | `--accent` #739AC1 | **4.90** | 4.5 | AA |
| Label on bold (Lead Blue) fill | `--accent-bold-contrast` #FFFFFF | `--accent-bold` #0021F3 | **8.36** | 4.5 | AAA |
| Text on callout ground | `--text` #FFFFFF | `--callout-bg` #19375A | **12.04** | 4.5 | AAA |
| Text on inverse panel | `--text-inverse` #0D2A4C | `--surface-inverse` #F1EFEA | **12.58** | 4.5 | AAA |
| Heading on sunken well | `--text` #FFFFFF | `--surface-sunken` #0D1F34 | **16.68** | 3.0 | AAA |
| Focus ring on page | `--accent` #739AC1 | `--surface` #0D2440 | **5.31** | 3.0 | AAA |
| Focus ring on raised card | `--accent` #739AC1 | `--surface-raised` #0D2A4C | **4.90** | 3.0 | AAA |
| Decorative border on page | `--border-strong` #516175 | `--surface` #0D2440 | **2.48** | n/a | decorative — exempt |
| Decorative border on card | `--border-strong` #51667E | `--surface-raised` #0D2A4C | **2.43** | n/a | decorative — exempt |

## Banned pairs — measured, not assumed

These are prohibited by the **brand book**, which is a stricter rule than WCAG alone.
Measured here so the prohibition is evidence-based and nobody re-introduces them.
**None appear anywhere on this site.**

| Pair | Ratio | Measured verdict | Status |
|---|---|---|---|
| Lead Blue on Clay | **4.65** | passes AA, fails AAA | **Prohibited by brand rule.** Brand book: FAIL. Never. |
| Lead Blue on Sky | **2.84** | fails AA | **Prohibited by brand rule.** Brand book: FAIL. Never. |
| Lead Blue on Midnight | **1.73** | fails AA | **Prohibited by brand rule.** Why the dark accent is Sky, not Lead Blue. |

> **Discrepancy with the build brief.** The brief's table labels *Clay + Lead Blue* an
> outright contrast **FAIL**. It actually measures **4.65** — a marginal AA pass that fails
> AAA. The prohibition still stands: it is a brand rule, and 4.65 on a warm neutral is too
> thin for a colour meant to carry CTAs. Recorded so the reasoning is not mistaken for a
> measurement error. *Sky + Lead Blue* (2.84) and *Lead Blue + Midnight* (1.73) both fail
> outright exactly as the brief states.

## Reference — brand pairings from the brand book

All reproduce the brief's stated figures exactly, with one exception noted below.

| Background | Text | Ratio | Rating |
|---|---|---|---|
| lead-blue | white | 8.36 | AAA |
| midnight | white | 14.46 | AAA |
| cream | midnight | 12.58 | AAA |
| clay | midnight | 8.05 | AAA |
| sky | midnight | 4.90 | AA |

> **Clay + Midnight** measures **8.05**, not the **8.36** the brief states — the brief
> appears to have copied the Lead Blue + White figure into that row. Both are comfortably
> AAA, so nothing in the design changes.

---

## ✅ Zero failures

Every pair the design uses meets its threshold in both modes. All three brand-prohibited pairs are excluded from the site.
