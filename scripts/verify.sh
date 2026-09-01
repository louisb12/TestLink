#!/usr/bin/env bash
# verify.sh — the verification loop. Run after every slice.
#
#   ./scripts/verify.sh          full run
#   ./scripts/verify.sh --fast   skip mint's slower checks (used by the git hook)
#
# Exits non-zero on any failure so it can gate a commit or CI.

set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
export PATH="$HOME/.npm-global/bin:$PATH"

FAST=0
[ "${1:-}" = "--fast" ] && FAST=1

FAILED=0
step() { printf '\n\033[1m── %s\033[0m\n' "$1"; }
ok()   { printf '   \033[32m✓\033[0m %s\n' "$1"; }
bad()  { printf '   \033[31m✗\033[0m %s\n' "$1"; FAILED=1; }

if ! command -v mint >/dev/null 2>&1; then
  echo "mint not found. Install: npm i -g --prefix \"\$HOME/.npm-global\" mint"
  exit 1
fi

# ── 1. Brand rule: raw hex lives in exactly one file ────────────────────────
# docs.json is the one unavoidable exception — JSON cannot read CSS variables.
# SVG assets are also exempt: they cannot reference CSS variables either, and
# scripts/make-assets.mjs is their single generator.
step "Brand token discipline"
STRAY=$(grep -rnoE '#[0-9A-Fa-f]{3,8}\b' \
          --include='*.css' --include='*.mdx' --include='*.js' --include='*.mjs' \
          styles overview publisher technical index.mdx snippets 2>/dev/null \
        | grep -v '^styles/00-tokens.css' || true)
if [ -n "$STRAY" ]; then
  bad "raw hex outside styles/00-tokens.css:"
  echo "$STRAY" | sed 's/^/       /'
else
  ok "no raw hex outside styles/00-tokens.css"
fi

# China Red must never appear anywhere. It is for China events only.
if grep -rqiE 'E9223D' --include='*.css' --include='*.mdx' --include='*.json' \
     --include='*.js' --include='*.mjs' --include='*.svg' . 2>/dev/null; then
  bad "China Red (#E9223D) found — it must never appear on this site"
else
  ok "no China Red anywhere"
fi

# !important is permitted only in the reduced-motion block.
BANG=$(grep -rn '!important' styles/*.css | grep -v '50-motion.css' || true)
if [ -n "$BANG" ]; then
  bad "!important outside the reduced-motion block:"
  echo "$BANG" | sed 's/^/       /'
else
  ok "!important confined to the reduced-motion block"
fi

# ── 2. Web-editor safety: publisher/** must stay plain MDX ──────────────────
step "Web-editor safety (publisher/** is commercial-owned)"
UNSAFE=$(grep -rln -E '^import |<Snippet|/snippets/' publisher 2>/dev/null || true)
if [ -n "$UNSAFE" ]; then
  bad "snippet or import found in commercial-owned pages:"
  echo "$UNSAFE" | sed 's/^/       /'
else
  ok "no snippets or imports in publisher/**"
fi

# ── 3. Contrast ─────────────────────────────────────────────────────────────
step "Contrast audit"
if node scripts/contrast-audit.mjs >/dev/null 2>&1; then
  ok "zero failing pairs in both modes (.claude/docs/contrast-audit.md)"
else
  bad "contrast audit failed — see .claude/docs/contrast-audit.md"
  node scripts/contrast-audit.mjs 2>&1 | tail -12 | sed 's/^/       /'
fi

# ── 4. Mintlify ─────────────────────────────────────────────────────────────
step "mint validate"
if mint validate 2>&1 | sed 's/\x1b\[[0-9;]*[A-Za-z]//g' | grep -q 'validation passed'; then
  ok "build validation passed"
else
  bad "mint validate failed"
  mint validate 2>&1 | sed 's/\x1b\[[0-9;]*[A-Za-z]//g' | grep -vE '^\s*$|validating build' | tail -20 | sed 's/^/       /'
fi

step "mint broken-links"
if mint broken-links 2>&1 | sed 's/\x1b\[[0-9;]*[A-Za-z]//g' | grep -q 'no broken links'; then
  ok "no broken links"
else
  bad "broken links found"
  mint broken-links 2>&1 | sed 's/\x1b\[[0-9;]*[A-Za-z]//g' | grep -vE '^\s*$' | tail -20 | sed 's/^/       /'
fi

if [ "$FAST" -eq 0 ]; then
  step "mint a11y"
  A11Y=$(mint a11y 2>&1 | sed 's/\x1b\[[0-9;]*[A-Za-z]//g')
  if echo "$A11Y" | grep -q 'no accessibility issues found'; then
    ok "no MDX accessibility issues"
  else
    bad "MDX accessibility issues"
    echo "$A11Y" | grep -A5 'Found .* accessibility' | sed 's/^/       /'
  fi
  # Known false positive — see .claude/docs/decisions.md D-020.
  if echo "$A11Y" | grep -q 'Dark Color .* FAIL'; then
    printf '   \033[33m!\033[0m %s\n' "colors.dark flagged — known false positive, see decisions.md D-020"
  fi
fi

# ── 5. Outstanding copy ─────────────────────────────────────────────────────
step "Outstanding copy"
TODOS=$(grep -rc 'TODO(copy)' --include='*.mdx' . 2>/dev/null | awk -F: '{s+=$2} END {print s+0}')
printf '   \033[33m!\033[0m %s placeholder(s) awaiting approved copy\n' "$TODOS"
printf '     find them: grep -rn "TODO(copy)" --include=*.mdx .\n'

printf '\n'
if [ "$FAILED" -eq 0 ]; then
  printf '\033[32m✓ verification passed\033[0m\n'
else
  printf '\033[31m✗ verification FAILED\033[0m\n'
fi
exit $FAILED
