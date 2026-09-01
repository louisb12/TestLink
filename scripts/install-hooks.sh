#!/usr/bin/env bash
# Installs a pre-commit hook that runs the fast verification loop.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .git/hooks
cat > .git/hooks/pre-commit <<'HOOK'
#!/usr/bin/env bash
# Almedia Launchpad — pre-commit verification.
# Skip a single commit with:  git commit --no-verify
exec ./scripts/verify.sh --fast
HOOK
chmod +x .git/hooks/pre-commit
echo "installed .git/hooks/pre-commit (skip once with: git commit --no-verify)"
