#!/usr/bin/env bash
# SessionEnd hook: safety net for /clear and the end of the session. If the session did work
# (file edit or git commit/merge/push) after the last docs/STATE.md, generates the handoff
# via `claude -p`, like PreCompact. Chat-only session or one that already ran /handoff: does nothing.
# SessionEnd does not block; every exit is 0. Disable with CLAUDE_HANDOFF_AUTOGEN=0.
# SessionEnd's default budget is 1.5 s; this hook's `timeout` in settings.json raises it (max. 60 s).
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
