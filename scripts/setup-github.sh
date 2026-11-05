#!/usr/bin/env bash
# Configura o repositório no GitHub depois do primeiro push:
#   bash scripts/setup-github.sh <owner>/<repo> [--template]
# - branch protection da main (sem force push/delete, histórico linear). Sem status checks obrigatórios:
#   não há CI (ADR 0006); o portão é o `npm run pr:check` local.
# - GitHub Actions desligado (nenhum custo de minutos)
# - squash merge como único modo, apagar branch após merge
# - alertas de vulnerabilidade, Dependabot security updates, relatório privado de vulnerabilidades
# - --template marca o repositório como template
set -euo pipefail

repo="${1:?uso: setup-github.sh <owner>/<repo> [--template]}"
template_flag="${2:-}"

echo "→ GitHub Actions: desligado (ADR 0006)"
gh api -X PUT "repos/$repo/actions/permissions" -F enabled=false >/dev/null

echo "→ merges: só squash, apagar branch, atualizar branch sugerido"
gh repo edit "$repo" \
  --enable-squash-merge --enable-merge-commit=false --enable-rebase-merge=false \
  --delete-branch-on-merge \
  --allow-update-branch >/dev/null

echo "→ segurança: alertas, Dependabot security updates, relatório privado"
gh api -X PUT "repos/$repo/vulnerability-alerts" >/dev/null || true
gh api -X PUT "repos/$repo/automated-security-fixes" >/dev/null || true
gh api -X PUT "repos/$repo/private-vulnerability-reporting" >/dev/null || true

echo "→ branch protection: main"
# Em repositório privado no plano gratuito, a API devolve 403 ("Upgrade to GitHub Pro"): avisa e segue,
# para não deixar o resto (ex.: --template) sem rodar.
if ! gh api -X PUT "repos/$repo/branches/main/protection" \
  -H "Accept: application/vnd.github+json" \
  --input - <<'JSON' >/dev/null
{
  "required_status_checks": null,
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true,
  "lock_branch": false
}
JSON
then
  protection_failed=1
  echo "⚠ branch protection não aplicada. Repositório privado exige GitHub Pro/Team; alternativas:" >&2
  echo "  tornar o repositório público ou proteger a main à mão depois do upgrade." >&2
  echo "  Sem ela, só os hooks locais (guard-bash, pre-push) impedem push direto na main." >&2
fi

if [ "$template_flag" = "--template" ]; then
  echo "→ marcando como template"
  gh repo edit "$repo" --template >/dev/null
fi

if [ "${protection_failed:-0}" = "1" ]; then
  echo "✔ GitHub configurado para $repo, MENOS a branch protection (ver aviso acima)"
  exit 1
fi
echo "✔ GitHub configurado para $repo"
