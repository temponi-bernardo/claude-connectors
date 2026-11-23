#!/bin/bash
# Docker wrapper for cloud sessions behind a TLS-intercepting proxy (Claude Code on the web). Use it as
# WRANGLER_DOCKER_BIN so `wrangler deploy` / `wrangler deploy --dry-run` can build the WhatsApp bridge image:
#   WRANGLER_DOCKER_BIN="$PWD/scripts/docker-proxy-ca.sh" npm run whatsapp:deploy
# On `docker build`, it copies the context to a temp folder, adds the proxy CA (DOCKER_PROXY_CA, default
# /root/.ccr/ca-bundle.crt) and trusts it in the `AS build` stage only, so `go mod download` works; the final
# image never gets the CA. Without the CA file, and for every other command, docker runs unchanged.
set -euo pipefail
ca="${DOCKER_PROXY_CA:-/root/.ccr/ca-bundle.crt}"
if [ "${1:-}" != "build" ] || [ ! -f "$ca" ]; then exec docker "$@"; fi

args=("$@")
ctx="${args[${#args[@]} - 1]}"
dockerfile="$ctx/Dockerfile"
rest=()
for ((i = 0; i < ${#args[@]} - 1; i++)); do
  case "${args[$i]}" in
    -f | --file) i=$((i + 1)); dockerfile="${args[$i]}" ;;
    *) rest+=("${args[$i]}") ;;
  esac
done

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
cp -a "$ctx/." "$tmp/"
cp "$ca" "$tmp/ccr-proxy-ca.crt"
if [ -f "$tmp/.dockerignore" ]; then printf '\n!ccr-proxy-ca.crt\n' >>"$tmp/.dockerignore"; fi
awk '{ print } /^FROM .* AS build$/ && !done {
  print "COPY ccr-proxy-ca.crt /usr/local/share/ca-certificates/ccr-proxy-ca.crt"
  print "RUN update-ca-certificates"; done = 1 }' "$dockerfile" >"$tmp/Dockerfile.proxy-ca"
if ! grep -q ccr-proxy-ca "$tmp/Dockerfile.proxy-ca"; then
  echo "[docker-proxy-ca] $dockerfile has no \"AS build\" stage to add the proxy CA to." >&2
  exit 1
fi

proxy="${HTTPS_PROXY:-${https_proxy:-}}"
docker "${rest[@]}" -f "$tmp/Dockerfile.proxy-ca" --network host \
  --build-arg "HTTPS_PROXY=$proxy" --build-arg "https_proxy=$proxy" "$tmp"
