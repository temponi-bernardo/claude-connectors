#!/bin/sh
# Portão local de PR: substitui o CI do GitHub Actions, que está desligado neste repositório
# (ADR 0006 — nenhum custo de Actions). Roda o que os jobs de CI rodavam:
#   1. npm run check (formato, lint, tipos, testes com cobertura, docs, duplicação, gitleaks)
#   2. npm run pack:all (todos os conectores compilam e empacotam em .mcpb)
#   3. commitlint em todos os commits da branch desde a main
#   4. commitlint no título do PR (vira o commit da main no squash)
# Uso: npm run pr:check -- "feat(canvas): título do PR"
set -e
title="${1:-}"
if [ -z "$title" ]; then
  echo "[pr:check] informe o título do PR: npm run pr:check -- \"tipo(escopo): descrição\"" >&2
  exit 1
fi

echo "→ check completo"
npm run -s check
echo "→ empacotamento dos conectores"
npm run -s pack:all
echo "→ commitlint nos commits da branch"
git fetch -q origin main
npx --no-install commitlint --from origin/main --to HEAD
echo "→ commitlint no título do PR"
printf '%s\n' "$title" | npx --no-install commitlint
echo "✔ pr:check verde — pode abrir/mergear o PR"
