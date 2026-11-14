#!/bin/sh
# Local PR gate: replaces GitHub Actions CI, which is disabled in this repository
# (ADR 0006 — no Actions cost). Runs what the CI jobs used to run:
#   1. npm run check (format, lint, types, tests with coverage, docs, duplication, gitleaks)
#   2. npm run bridge:test (WhatsApp Go bridge: gofmt, vet, tests) and npm run whatsapp:build (Worker bundle)
#   3. npm run build (each connector's plugin points to a remote server and the bundle compiles) and
#      checks that the versioned bundle (server/remote.js) is committed and current
#   4. claude plugin validate --strict on the marketplace and on each connector plugin (ADR 0022)
#   5. commitlint on every branch commit since main
#   6. commitlint on the PR title (it becomes the main commit on squash)
# Usage: npm run pr:check -- "feat(canvas): PR title"
set -e
title="${1:-}"
if [ -z "$title" ]; then
  echo "[pr:check] give the PR title: npm run pr:check -- \"type(scope): description\"" >&2
  exit 1
fi

echo "→ full check"
npm run -s check
echo "→ WhatsApp Go bridge"
npm run -s bridge:test
echo "→ WhatsApp Worker bundle"
npm run -s whatsapp:build >/dev/null
echo "→ connector build"
npm run -s build
if ! git diff --quiet -- connectors || [ -n "$(git ls-files --others --exclude-standard connectors)" ]; then
  echo "[pr:check] the connector bundle changed with the build: commit server/remote.js." >&2
  git status --short connectors >&2
  exit 1
fi
echo "→ plugin manifests (claude plugin validate --strict)"
npm run -s plugin:validate
echo "→ commitlint on the branch commits"
git fetch -q origin main
npx --no-install commitlint --from origin/main --to HEAD
echo "→ commitlint on the PR title"
printf '%s\n' "$title" | npx --no-install commitlint
echo "✔ pr:check green — ready to open/merge the PR"
