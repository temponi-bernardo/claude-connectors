#!/bin/sh
# Testa a ponte Go do conector WhatsApp: formatação, vet e testes (o go.mod pede Go 1.26+; com GOTOOLCHAIN=auto o
# Go baixa o toolchain certo sozinho). Chamado pelo `pr:check`.
set -eu
cd "$(dirname "$0")/../connectors/whatsapp/bridge"
if ! command -v go >/dev/null 2>&1; then
  echo "✖ Go não encontrado: instale o Go (https://go.dev/dl) para testar a ponte do WhatsApp." >&2
  exit 1
fi
export GOTOOLCHAIN="${GOTOOLCHAIN:-auto}"
unformatted=$(gofmt -l .)
if [ -n "$unformatted" ]; then
  echo "✖ Arquivos Go sem gofmt:" >&2
  echo "$unformatted" >&2
  exit 1
fi
go vet ./...
go test -cover ./...
echo "✔ ponte Go verde"
