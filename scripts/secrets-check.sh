#!/bin/sh
# Roda o gitleaks no histórico e nos arquivos. Sem CI neste repositório (ADR 0006), esta é a ÚNICA
# barreira contra segredos versionados: sem gitleaks instalado, FALHA.
# Instale com `winget install Gitleaks.Gitleaks` (Windows) ou `brew install gitleaks` (macOS).
set -e
if command -v gitleaks >/dev/null 2>&1; then
  gitleaks git --no-banner --redact --config .gitleaks.toml .
  gitleaks dir --no-banner --redact --config .gitleaks.toml .
else
  echo "[secrets:check] gitleaks não está instalado e é obrigatório (não há CI para barrar segredos)." >&2
  echo "Instale: winget install Gitleaks.Gitleaks  |  brew install gitleaks" >&2
  exit 1
fi
