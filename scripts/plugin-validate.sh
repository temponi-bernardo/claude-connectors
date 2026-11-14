#!/bin/sh
# Validates the marketplace and every connector plugin with `claude plugin validate --strict` (warnings fail,
# ADR 0022). Called by `pr:check`; needs the Claude Code CLI.
set -eu
cd "$(dirname "$0")/.."
if ! command -v claude >/dev/null 2>&1; then
  echo "✖ Claude Code CLI not found: install it (https://claude.com/claude-code) to validate the plugins." >&2
  exit 1
fi
claude plugin validate . --strict
for plugin in connectors/*/plugin; do
  claude plugin validate "$plugin" --strict
done
echo "✔ plugins valid"
