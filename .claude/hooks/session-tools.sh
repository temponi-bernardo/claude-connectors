#!/usr/bin/env bash
# Hook SessionStart (só na nuvem do Claude Code): deixa a sessão pronta para `npm run check`/`pr:check`.
# 1. gitleaks na versão fixa, pelo Go (scripts/install-gitleaks.sh).
# 2. npm install só quando package.json ou package-lock.json mudaram desde o último install.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi
cd "${CLAUDE_PROJECT_DIR:-.}"

sh scripts/install-gitleaks.sh

hashes=node_modules/.session-start.sha256
if ! sha256sum --check --status "$hashes" 2>/dev/null; then
  rm -f "$hashes"
  echo "[session-tools] npm install..." >&2
  npm install --no-audit --no-fund --silent >&2
  mkdir -p node_modules
  sha256sum .claude/hooks/session-tools.sh scripts/install-gitleaks.sh package.json package-lock.json \
    > "$hashes" || rm -f "$hashes"
fi
