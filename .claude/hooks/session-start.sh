#!/usr/bin/env bash
# Hook SessionStart: injeta o handoff (docs/STATE.md), a próxima tarefa do roadmap
# e lembra do índice da documentação. Roda em startup, resume, clear e compact.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

if [ -s docs/STATE.md ]; then
  echo "=== Handoff da sessão anterior (docs/STATE.md) ==="
  cat docs/STATE.md
  echo "=== Fim do handoff ==="
else
  echo "Sem handoff salvo (docs/STATE.md ausente ou vazio)."
fi

next="$(awk '/^## Próxima tarefa/{flag=1; next} flag && NF {print; exit}' docs/ROADMAP.md 2>/dev/null)"
echo "Próxima tarefa do roadmap: ${next:-ver docs/ROADMAP.md}"
echo "Comece por docs/README.md (quero... → leia...). Regras em CLAUDE.md."
