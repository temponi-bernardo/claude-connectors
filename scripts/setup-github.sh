#!/usr/bin/env bash
# Configura o repositório no GitHub depois do primeiro push:
#   bash scripts/setup-github.sh <owner>/<repo> [--template]
# - branch protection da main (PR + CI verdes obrigatórios, sem force push/delete, conversas resolvidas)
# - squash merge como único modo, apagar branch após merge
# - alertas de vulnerabilidade, Dependabot security updates, relatório privado de vulnerabilidades
# - --template marca o repositório como template
set -euo pipefail

repo="${1:?uso: setup-github.sh <owner>/<repo> [--template]}"
template_flag="${2:-}"

echo "→ merges: só squash, apagar branch, atualizar branch sugerido"
gh repo edit "$repo" \
  --enable-squash-merge --enable-merge-commit=false --enable-rebase-merge=false \
  --delete-branch-on-merge --enable-auto-merge \
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
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "check (lint, tipos, testes, docs, duplicação)",
      "mensagens de commit (Conventional Commits)",
      "título do PR (vira o commit da main no squash)",
      "segredos (gitleaks)",
      "dependências novas (vulnerabilidades e licenças)"
    ]
  },
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
