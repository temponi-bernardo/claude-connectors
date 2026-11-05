#!/usr/bin/env bash
# Hook Stop: se a resposta alterou código ou docs, roda o docs:check e devolve os erros ao Claude (saída 2).
# Na segunda passagem da mesma sessão deixa passar, para não travar o Claude em loop.
set -u
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

input="$(cat)"
session_id="$(printf '%s' "$input" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{process.stdout.write(String(JSON.parse(d).session_id||"sem-sessao"))}catch{process.stdout.write("sem-sessao")}})')"
marker="${TMPDIR:-/tmp}/claude-stop-docs-check-${session_id//[^a-zA-Z0-9_-]/_}"

if [ -f "$marker" ]; then
  rm -f "$marker"
  exit 0
fi

# Só roda se houver mudança (staged, unstaged ou arquivo novo) nas pastas que o docs:check observa.
if [ -z "$(git status --porcelain -- src tools docs docs.config.json 2>/dev/null)" ]; then
  exit 0
fi

output="$(npm run -s docs:check 2>&1)"
status=$?
if [ "$status" -ne 0 ]; then
  touch "$marker"
  {
    echo "docs:check falhou. Corrija antes de encerrar (rode npm run docs:generate se forem blocos gerados):"
    echo "$output"
  } >&2
  exit 2
fi
exit 0
