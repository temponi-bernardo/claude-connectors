#!/usr/bin/env bash
# Stop hook: ensures the handoff at the end of a task.
# "Task finished" criterion: there is a new commit, made by this person, since the last recognized
# handoff. Commits brought by git pull (squash merge on GitHub) don't count.
# If docs/STATE.md was updated in this turn, records it and lets go. Otherwise, blocks
# with an instruction to update STATE.md and tell the user to run /clear.
# Never blocks twice in a row (stop_hook_active) nor in a turn without a new commit.
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
# shellcheck source=hook-lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/hook-lib.sh"

input="$(cat 2>/dev/null || true)"

# Loop guard: we already blocked in this cycle, Claude went on and stopped again.
if [ "$(json_field "$input" stop_hook_active false)" = "true" ]; then
  exit 0
fi

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

head="$(current_head)"
state="$(file_hash "$STATE_FILE")"
read -r last_head last_state <<<"$(read_marker)"

# First run in this clone: adopts the current state as the reference.
if [ "$last_head" = "none" ] && [ "$last_state" = "none" ]; then
  write_marker "$head" "$state"
  exit 0
fi

# STATE.md changed since the last handoff: handoff done, record it and let go.
if [ "$state" != "$last_state" ]; then
  write_marker "$head" "$state"
  exit 0
fi

# No new own commit: work in progress, conversation or just git pull; don't interrupt.
# If HEAD moved only through other people's commits, adopt the new HEAD as the reference.
if [ "$(own_commits_since "$last_head")" = "0" ]; then
  [ "$head" = "$last_head" ] || write_marker "$head" "$state"
  exit 0
fi

# New commit and untouched STATE.md: require the handoff before ending.
reason="Task finished (there is a new commit since the last handoff). Before ending: "
reason+="update docs/STATE.md with the /handoff skill (done, in progress, next steps, files touched), "
reason+="and tell the user to run /clear (STATE.md is local, it is not committed)."
printf '{"decision":"block","reason":%s}\n' "$(printf '%s' "$reason" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>process.stdout.write(JSON.stringify(d)))')"
exit 0
