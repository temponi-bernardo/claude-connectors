#!/bin/sh
# Tests the WhatsApp connector's Go bridge: formatting, vet and tests (go.mod asks for Go 1.26+; with
# GOTOOLCHAIN=auto Go downloads the right toolchain by itself). Called by `pr:check`.
set -eu
cd "$(dirname "$0")/../connectors/whatsapp/bridge"
if ! command -v go >/dev/null 2>&1; then
  echo "✖ Go not found: install Go (https://go.dev/dl) to test the WhatsApp bridge." >&2
  exit 1
fi
export GOTOOLCHAIN="${GOTOOLCHAIN:-auto}"
unformatted=$(gofmt -l .)
if [ -n "$unformatted" ]; then
  echo "✖ Go files not formatted with gofmt:" >&2
  echo "$unformatted" >&2
  exit 1
fi
go vet ./...
go test -cover ./...
echo "✔ Go bridge green"
