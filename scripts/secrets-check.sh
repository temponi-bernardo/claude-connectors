#!/bin/sh
# Roda o gitleaks no histórico e nos arquivos. Sem gitleaks instalado:
# - no GitHub Actions (GITHUB_ACTIONS=true) passa, porque o job "segredos (gitleaks)" faz a checagem obrigatória;
# - localmente FALHA, para o pre-push não aprovar sem checar. Pule conscientemente com
#   SECRETS_CHECK=skip (ex.: SECRETS_CHECK=skip git push) — o CI ainda barra.
set -e
if command -v gitleaks >/dev/null 2>&1; then
  gitleaks git --no-banner --redact --config .gitleaks.toml .
  gitleaks dir --no-banner --redact --config .gitleaks.toml .
elif [ "${GITHUB_ACTIONS:-}" = "true" ]; then
  echo "[secrets:check] gitleaks ausente no runner; a checagem roda no job 'segredos (gitleaks)'."
elif [ "${SECRETS_CHECK:-}" = "skip" ]; then
  echo "[secrets:check] PULADO (SECRETS_CHECK=skip). O CI ainda roda o gitleaks."
else
  echo "[secrets:check] gitleaks não está instalado. Instale (brew install gitleaks) ou pule" >&2
  echo "conscientemente com SECRETS_CHECK=skip; o CI roda a checagem de qualquer forma." >&2
  exit 1
fi
