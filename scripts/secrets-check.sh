#!/bin/sh
# Roda o gitleaks no histórico e nos arquivos. Sem CI neste repositório (ADR 0006), esta é a ÚNICA
# barreira contra segredos versionados: sem gitleaks instalado, FALHA.
# Na nuvem do Claude Code, instala sozinho pelo Go (scripts/install-gitleaks.sh), inclusive no pre-push.
# No PC: `winget install Gitleaks.Gitleaks` (Windows) ou `brew install gitleaks` (macOS).
set -e
if ! command -v gitleaks >/dev/null 2>&1 && [ "${CLAUDE_CODE_REMOTE:-}" = "true" ]; then
  sh "$(dirname "$0")/install-gitleaks.sh"
fi
if command -v gitleaks >/dev/null 2>&1; then
  gitleaks git --no-banner --redact --config .gitleaks.toml .
  gitleaks dir --no-banner --redact --config .gitleaks.toml .
else
  echo "[secrets:check] gitleaks não está instalado e é obrigatório (não há CI para barrar segredos)." >&2
  echo "Instale: winget install Gitleaks.Gitleaks  |  brew install gitleaks  |  sh scripts/install-gitleaks.sh (com Go)" >&2
  exit 1
fi
