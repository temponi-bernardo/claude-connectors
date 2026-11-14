#!/usr/bin/env bash
# Stop hook: every plugin change (connectors/ or .claude-plugin/) requires documentation in the same change.
# Looks at the working tree and the branch's commits since main. If a plugin file changed and no
# documentation file did (docs/, CHANGELOG.md, README.md, a connector README), blocks and asks for the
# /update-docs skill. Never blocks twice in a row (stop_hook_active).
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
# shellcheck source=hook-lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/hook-lib.sh"

input="$(cat 2>/dev/null || true)"
if [ "$(json_field "$input" stop_hook_active false)" = "true" ]; then
  exit 0
fi
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

# Changed files: commits since main (origin/main or local main) + working tree (new files included).
changed_files() {
  local base
  base="$(git merge-base HEAD origin/main 2>/dev/null || git merge-base HEAD main 2>/dev/null || true)"
  [ -n "$base" ] && git diff --name-only "$base" HEAD 2>/dev/null
  git status --porcelain --untracked-files=all 2>/dev/null | sed -E 's/^.. //; s/^.* -> //'
}

files="$(changed_files | sort -u)"
plugin="$(printf '%s\n' "$files" | grep -E '^(connectors/|\.claude-plugin/)' | grep -vE '^connectors/[^/]+/(plugin/)?README\.md$' || true)"
[ -z "$plugin" ] && exit 0
docs="$(printf '%s\n' "$files" | grep -E '^(docs/|CHANGELOG\.md$|README\.md$|connectors/[^/]+/(plugin/)?README\.md$)' || true)"
[ -n "$docs" ] && exit 0

reason="Plugin changed without documentation in the same change: $(printf '%s' "$plugin" | head -5 | paste -sd ',' - | sed 's/,/, /g'). "
reason+="Run the /update-docs skill: classify each change with the table in docs/DOCUMENTATION.md "
reason+="(CHANGELOG, connector README, FUNCTIONS, PROCESSES, ARCHITECTURE...) and document everything that was done."
printf '{"decision":"block","reason":%s}\n' "$(printf '%s' "$reason" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>process.stdout.write(JSON.stringify(d)))')"
exit 0
