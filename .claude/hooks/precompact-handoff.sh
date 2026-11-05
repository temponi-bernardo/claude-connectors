#!/usr/bin/env bash
# Hook PreCompact: rede de segurança. Antes de a conversa ser compactada, gera um
# handoff em docs/STATE.md a partir do transcript, usando `claude -p` em processo
# separado. Nunca falha a compactação: toda saída é 0. Desative com
# CLAUDE_HANDOFF_AUTOGEN=0.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
# shellcheck source=hook-lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/hook-lib.sh"

[ "${CLAUDE_HANDOFF_AUTOGEN:-1}" = "0" ] && exit 0

input="$(cat 2>/dev/null || true)"
transcript="$(json_field "$input" transcript_path "")"
[ -n "$transcript" ] && [ -f "$transcript" ] || exit 0
command -v claude >/dev/null 2>&1 || exit 0

# Só o fim do transcript (últimos 300 KB) para caber no prompt e no tempo.
excerpt="$(tail -c 300000 "$transcript" 2>/dev/null || true)"
[ -n "$excerpt" ] || exit 0

prompt="Você vai escrever o arquivo docs/STATE.md (handoff de contexto) de um projeto de software, em português do Brasil.
Baseie-se SOMENTE no transcript JSONL abaixo. Responda apenas com o conteúdo Markdown do arquivo, começando por '# Estado atual', sem cercas de código.
Seções obrigatórias, nesta ordem: '## Tarefa atual', '## Feito', '## Em andamento', '## Próximos passos', '## Arquivos tocados', '## Decisões e pendências'.
Seja concreto: ids de tarefa, nomes de arquivo, comandos, erros abertos. Máximo de 60 linhas.

TRANSCRIPT:
$excerpt"

# `timeout` é do GNU coreutils: ausente no macOS padrão (lá pode existir como `gtimeout`).
limit=()
for t in timeout gtimeout; do
  if command -v "$t" >/dev/null 2>&1; then limit=("$t" "${CLAUDE_HANDOFF_TIMEOUT:-45}"); break; fi
done

out="$(printf '%s' "$prompt" | (cd "${TMPDIR:-/tmp}" && env -u CLAUDECODE CLAUDE_HANDOFF_AUTOGEN=0 \
  ${limit[@]+"${limit[@]}"} claude -p --output-format text 2>/dev/null) || true)"

case "$out" in
  "# Estado atual"*)
    mkdir -p "$(dirname "$STATE_FILE")"
    {
      printf '%s\n' "$out"
      printf '\n_Gerado automaticamente pelo hook PreCompact em %s._\n' "$(date +%Y-%m-%d\ %H:%M)"
    } > "$STATE_FILE"
    write_marker "$(current_head)" "$(file_hash "$STATE_FILE")"
    ;;
esac
exit 0
