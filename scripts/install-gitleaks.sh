#!/bin/sh
# Instala o gitleaks na versão fixa, compilado pelo Go (fonte única: hook SessionStart e secrets:check).
# Na nuvem do Claude Code, o download direto do GitHub é bloqueado e o apt traz uma versão antiga sem
# `gitleaks git`/`dir`; `go install` passa pelo proxy de módulos do Go. Não faz nada se a versão já está.
set -e
GITLEAKS_VERSION="${GITLEAKS_VERSION:-8.28.0}"
if [ "$(gitleaks version 2>/dev/null || true)" = "$GITLEAKS_VERSION" ]; then
  exit 0
fi
if ! command -v go >/dev/null 2>&1; then
  echo "[install-gitleaks] Go não encontrado: instale o gitleaks $GITLEAKS_VERSION à mão." >&2
  exit 1
fi
echo "[install-gitleaks] instalando gitleaks $GITLEAKS_VERSION pelo Go..." >&2
GOBIN="${GITLEAKS_BIN_DIR:-/usr/local/bin}" go install \
  -ldflags "-X github.com/zricethezav/gitleaks/v8/cmd.Version=$GITLEAKS_VERSION" \
  "github.com/zricethezav/gitleaks/v8@v$GITLEAKS_VERSION" >&2
