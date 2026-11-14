#!/bin/sh
# Runs gitleaks on the history and the files. With no CI in this repository (ADR 0006), this is the ONLY
# barrier against committed secrets: without gitleaks installed, it FAILS.
# In the Claude Code cloud it installs itself through Go (scripts/install-gitleaks.sh), pre-push included.
# On a PC: `winget install Gitleaks.Gitleaks` (Windows) or `brew install gitleaks` (macOS).
set -e
if ! command -v gitleaks >/dev/null 2>&1 && [ "${CLAUDE_CODE_REMOTE:-}" = "true" ]; then
  sh "$(dirname "$0")/install-gitleaks.sh"
fi
if command -v gitleaks >/dev/null 2>&1; then
  gitleaks git --no-banner --redact --config .gitleaks.toml .
  gitleaks dir --no-banner --redact --config .gitleaks.toml .
else
  echo "[secrets:check] gitleaks is not installed and is required (there is no CI to stop secrets)." >&2
  echo "Install: winget install Gitleaks.Gitleaks  |  brew install gitleaks  |  sh scripts/install-gitleaks.sh (with Go)" >&2
  exit 1
fi
