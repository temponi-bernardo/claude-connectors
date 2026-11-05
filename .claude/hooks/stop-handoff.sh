#!/usr/bin/env bash
# Hook Stop: garante o handoff ao fim de uma tarefa.
# Critério de "tarefa concluída": há commit novo, feito por esta pessoa, desde o último handoff
# reconhecido. Commits trazidos por git pull (squash merge no GitHub) não contam.
# Se docs/STATE.md foi atualizado neste turno, registra e libera. Senão, bloqueia
# com instrução para atualizar o STATE.md e avisar o usuário de rodar /clear.
# Nunca bloqueia duas vezes seguidas (stop_hook_active) nem em turno sem commit novo.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
# shellcheck source=hook-lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/hook-lib.sh"

input="$(cat 2>/dev/null || true)"

# Guarda contra loop: já bloqueamos neste ciclo, Claude continuou e parou de novo.
if [ "$(json_field "$input" stop_hook_active false)" = "true" ]; then
  exit 0
fi

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

head="$(current_head)"
state="$(file_hash "$STATE_FILE")"
read -r last_head last_state <<<"$(read_marker)"

# Primeira execução neste clone: adota o estado atual como referência.
if [ "$last_head" = "none" ] && [ "$last_state" = "none" ]; then
  write_marker "$head" "$state"
  exit 0
fi

# STATE.md mudou desde o último handoff: handoff feito, registra e libera.
if [ "$state" != "$last_state" ]; then
  write_marker "$head" "$state"
  exit 0
fi

# Sem commit próprio novo: trabalho em andamento, conversa ou só git pull; não interrompe.
# Se o HEAD andou só por commits de outros, adota o novo HEAD como referência.
if [ "$(own_commits_since "$last_head")" = "0" ]; then
  [ "$head" = "$last_head" ] || write_marker "$head" "$state"
  exit 0
fi

# Commit novo e STATE.md intocado: exige o handoff antes de encerrar.
reason="Tarefa concluída (há commit novo desde o último handoff). Antes de encerrar: "
reason+="atualize docs/STATE.md com a skill /handoff (feito, em andamento, próximos passos, arquivos tocados), "
reason+="e avise o usuário para rodar /clear (o STATE.md é local, não vai para o commit)."
printf '{"decision":"block","reason":%s}\n' "$(printf '%s' "$reason" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>process.stdout.write(JSON.stringify(d)))')"
exit 0
