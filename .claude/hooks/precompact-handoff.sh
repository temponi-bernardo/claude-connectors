#!/usr/bin/env bash
# PreCompact hook: safety net. Before the conversation is compacted, generates a
# handoff in docs/STATE.md from the transcript, using `claude -p` in a separate
# process. Never fails the compaction: every exit is 0. Disable with
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
