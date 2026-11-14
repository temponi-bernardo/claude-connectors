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

generate_handoff "$transcript" "PreCompact"
exit 0
