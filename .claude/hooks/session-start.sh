#!/usr/bin/env bash
# SessionStart hook: injects the handoff (docs/STATE.md), the roadmap's next task
# and points to the documentation index. Runs on startup, resume, clear and compact.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

if [ -s docs/STATE.md ]; then
  echo "=== Handoff from the previous session (docs/STATE.md) ==="
  cat docs/STATE.md
  echo "=== End of handoff ==="
else
  echo "No saved handoff (docs/STATE.md missing or empty)."
fi

# Accepts the English heading and the older Portuguese one ("Próxima tarefa").
next="$(awk '/^## (Next task|Próxima tarefa)/{flag=1; next} flag && NF {print; exit}' docs/ROADMAP.md 2>/dev/null)"
echo "Next roadmap task: ${next:-see docs/ROADMAP.md}"
echo "Start with docs/README.md (I want... → read...). Rules in CLAUDE.md."
