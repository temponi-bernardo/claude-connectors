#!/usr/bin/env bash
# Hook SessionEnd: rede de segurança do /clear e do fim de sessão. Se a sessão fez trabalho
# (edição de arquivo ou git commit/merge/push) depois do último docs/STATE.md, gera o handoff
# via `claude -p`, como o PreCompact. Sessão só de conversa ou já com /handoff: não faz nada.
# SessionEnd não bloqueia; toda saída é 0. Desative com CLAUDE_HANDOFF_AUTOGEN=0.
# O orçamento padrão do SessionEnd é 1,5 s; o `timeout` deste hook no settings.json o eleva (máx. 60 s).
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
# shellcheck source=hook-lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/hook-lib.sh"

[ "${CLAUDE_HANDOFF_AUTOGEN:-1}" = "0" ] && exit 0

input="$(cat 2>/dev/null || true)"
transcript="$(json_field "$input" transcript_path "")"
[ -n "$transcript" ] && [ -f "$transcript" ] || exit 0

[ "$(handoff_is_stale "$transcript" "$STATE_FILE")" = "yes" ] || exit 0
generate_handoff "$transcript" "SessionEnd"
exit 0
