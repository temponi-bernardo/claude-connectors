#!/bin/sh
# Portão local de PR: substitui o CI do GitHub Actions, que está desligado neste repositório
# (ADR 0006 — nenhum custo de Actions). Roda o que os jobs de CI rodavam:
#   1. npm run check (formato, lint, tipos, testes com cobertura, docs, duplicação, gitleaks)
#   2. npm run bridge:test (ponte Go do WhatsApp: gofmt, vet, testes) e npm run whatsapp:build (bundle do Worker)
#   3. npm run build (o plugin de cada conector aponta para um servidor remoto e o bundle compila) e
#      confere que o bundle versionado (server/remote.js) está commitado e atual
#   4. claude plugin validate --strict on the marketplace and on each connector plugin (ADR 0022)
#   5. commitlint em todos os commits da branch desde a main
#   6. commitlint no título do PR (vira o commit da main no squash)
# Uso: npm run pr:check -- "feat(canvas): título do PR"
set -e
title="${1:-}"
if [ -z "$title" ]; then
  echo "[pr:check] informe o título do PR: npm run pr:check -- \"tipo(escopo): descrição\"" >&2
  exit 1
fi

echo "→ check completo"
npm run -s check
echo "→ ponte Go do WhatsApp"
npm run -s bridge:test
echo "→ bundle do Worker do WhatsApp"
npm run -s whatsapp:build >/dev/null
echo "→ build dos conectores"
npm run -s build
if ! git diff --quiet -- connectors || [ -n "$(git ls-files --others --exclude-standard connectors)" ]; then
  echo "[pr:check] o bundle dos conectores mudou com o build: commite server/remote.js." >&2
  git status --short connectors >&2
  exit 1
fi
echo "→ plugin manifests (claude plugin validate --strict)"
npm run -s plugin:validate
echo "→ commitlint nos commits da branch"
git fetch -q origin main
npx --no-install commitlint --from origin/main --to HEAD
echo "→ commitlint no título do PR"
printf '%s\n' "$title" | npx --no-install commitlint
echo "✔ pr:check verde — pode abrir/mergear o PR"
