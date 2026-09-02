#!/usr/bin/env bash
# verify-build.sh — the ONLY check that catches production-only MDX failures.
#
# `mint validate` and `mint dev` both accept MDX that the real build rejects.
# When that happens the deployed page is replaced with:
#   "🚧 A parsing error occured. Please contact the owner of this website."
# ...and there is no local signal at all. This produces a real build with
# `mint export`, serves it, and asserts every page actually renders.
#
# Slow (~1-2 min) so it is not in the pre-commit hook. Run it before any push
# that touches MDX with `export const` blocks. See decisions.md D-031.
#
#   ./scripts/verify-build.sh

set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
export PATH="$HOME/.npm-global/bin:$PATH"

PORT="${PORT:-4899}"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"; [ -n "${SRV:-}" ] && kill "$SRV" 2>/dev/null' EXIT

command -v mint >/dev/null 2>&1 || { echo "mint not found"; exit 1; }

printf '\033[1m── building a production export\033[0m\n'
if ! mint export --output "$WORK/site.zip" >"$WORK/export.log" 2>&1; then
  echo "   ✗ mint export failed:"; tail -20 "$WORK/export.log" | sed 's/^/     /'; exit 1
fi
unzip -q "$WORK/site.zip" -d "$WORK/site" || { echo "   ✗ could not unpack export"; exit 1; }
printf '   ✓ exported\n'

( cd "$WORK/site" && PORT="$PORT" node serve.js >"$WORK/serve.log" 2>&1 & echo $! > "$WORK/pid" )
SRV="$(cat "$WORK/pid")"
for _ in $(seq 1 25); do
  curl -s -o /dev/null "http://localhost:$PORT/" && break
  sleep 1
done

printf '\033[1m── checking every page renders\033[0m\n'
PAGES=$(python3 - <<'PYEOF'
import json, pathlib
nav = json.loads(pathlib.Path("config/navigation.json").read_text())
out = ["/"]
def walk(node):
    if isinstance(node, str):
        out.append("/" + node.removesuffix("/index"))
    elif isinstance(node, list):
        for n in node: walk(n)
    elif isinstance(node, dict):
        for k in ("tabs", "groups", "pages"):
            if k in node: walk(node[k])
        if "root" in node: walk(node["root"])
walk(nav)
print("\n".join(dict.fromkeys(out)))
PYEOF
)

FAILED=0
while read -r path; do
  [ -z "$path" ] && continue
  BODY=$(curl -sL --max-time 20 "http://localhost:$PORT$path" 2>/dev/null)
  if [ -z "$BODY" ]; then
    printf '   \033[31m✗\033[0m %-44s no response\n' "$path"; FAILED=1
  elif printf '%s' "$BODY" | grep -q "parsing error occured"; then
    printf '   \033[31m✗\033[0m %-44s PARSING ERROR in production build\n' "$path"; FAILED=1
  else
    printf '   \033[32m✓\033[0m %-44s renders\n' "$path"
  fi
done <<< "$PAGES"

printf '\n'
if [ "$FAILED" -eq 0 ]; then
  printf '\033[32m✓ production build renders every page\033[0m\n'
else
  printf '\033[31m✗ production build has failing pages\033[0m\n'
  printf '  Most likely a comment inside an `export const` block, or an MDX\n'
  printf '  comment closed early. Run: python3 scripts/lint-mdx.py\n'
fi
exit $FAILED
