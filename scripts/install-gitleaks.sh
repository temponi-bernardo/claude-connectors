#!/bin/sh
# Installs gitleaks at the pinned version, built with Go (single source: SessionStart hook and secrets:check).
# In the Claude Code cloud, direct downloads from GitHub are blocked and apt ships an old version without
# `gitleaks git`/`dir`; `go install` goes through the Go module proxy. Does nothing if the version is there.
set -e
GITLEAKS_VERSION="${GITLEAKS_VERSION:-8.28.0}"
if [ "$(gitleaks version 2>/dev/null || true)" = "$GITLEAKS_VERSION" ]; then
  exit 0
fi
if ! command -v go >/dev/null 2>&1; then
  echo "[install-gitleaks] Go not found: install gitleaks $GITLEAKS_VERSION by hand." >&2
  exit 1
fi
echo "[install-gitleaks] installing gitleaks $GITLEAKS_VERSION with Go..." >&2
GOBIN="${GITLEAKS_BIN_DIR:-/usr/local/bin}" go install \
  -ldflags "-X github.com/zricethezav/gitleaks/v8/cmd.Version=$GITLEAKS_VERSION" \
  "github.com/zricethezav/gitleaks/v8@v$GITLEAKS_VERSION" >&2
