#!/usr/bin/env bash
# Hook Stop: toda mudança em plugin (connectors/ ou .claude-plugin/) exige documentação na mesma mudança.
# Olha o working tree e os commits da branch desde a main. Se há arquivo de plugin alterado e nenhum
# arquivo de documentação (docs/, CHANGELOG.md, README.md, README de conector), bloqueia e pede a
# skill /atualizar-docs. Nunca bloqueia duas vezes seguidas (stop_hook_active).
set -uo pipefail
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
# shellcheck source=hook-lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/hook-lib.sh"

input="$(cat 2>/dev/null || true)"
if [ "$(json_field "$input" stop_hook_active false)" = "true" ]; then
  exit 0
fi
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

# Arquivos alterados: commits desde a main (origin/main ou main local) + working tree (inclui novos).
changed_files() {
  local base
  base="$(git merge-base HEAD origin/main 2>/dev/null || git merge-base HEAD main 2>/dev/null || true)"
  [ -n "$base" ] && git diff --name-only "$base" HEAD 2>/dev/null
  git status --porcelain --untracked-files=all 2>/dev/null | sed -E 's/^.. //; s/^.* -> //'
}

files="$(changed_files | sort -u)"
plugin="$(printf '%s\n' "$files" | grep -E '^(connectors/|\.claude-plugin/)' | grep -vE '^connectors/[^/]+/README\.md$' || true)"
[ -z "$plugin" ] && exit 0
docs="$(printf '%s\n' "$files" | grep -E '^(docs/|CHANGELOG\.md$|README\.md$|connectors/[^/]+/README\.md$)' || true)"
[ -n "$docs" ] && exit 0

reason="Plugin alterado sem documentação na mesma mudança: $(printf '%s' "$plugin" | head -5 | paste -sd ',' - | sed 's/,/, /g'). "
reason+="Rode a skill /atualizar-docs: classifique cada mudança pela tabela de docs/DOCUMENTATION.md "
reason+="(CHANGELOG, README do conector, FUNCTIONS, PROCESSES, ARCHITECTURE...) e documente tudo o que foi feito."
printf '{"decision":"block","reason":%s}\n' "$(printf '%s' "$reason" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>process.stdout.write(JSON.stringify(d)))')"
exit 0
