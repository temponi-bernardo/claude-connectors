#!/usr/bin/env bash
# Funções compartilhadas pelos hooks de handoff. Carregue com `source`.
# Sem dependências além de bash, git e node (já exigidos pelo projeto).

STATE_FILE="docs/STATE.md"
MARKER_FILE=".claude/.last-handoff"

# Lê um campo de primeiro nível do JSON recebido no stdin do hook.
# Uso: json_field "$input" session_id [padrão]
json_field() {
  local input="$1" field="$2" default="${3:-}"
  printf '%s' "$input" | node -e '
    const [field, def] = process.argv.slice(1);
    let d = "";
    process.stdin.on("data", (c) => (d += c)).on("end", () => {
      try {
        const v = JSON.parse(d)[field];
        process.stdout.write(v === undefined || v === null ? def : String(v));
      } catch {
        process.stdout.write(def);
      }
    });' "$field" "$default" 2>/dev/null || printf '%s' "$default"
}

# Hash do HEAD atual ou "none" (repositório sem commits / fora do git).
current_head() {
  git rev-parse --verify HEAD 2>/dev/null || echo "none"
}

# Hash do conteúdo de um arquivo ou "none" se não existir.
file_hash() {
  if [ -f "$1" ]; then
    git hash-object "$1" 2>/dev/null || echo "none"
  else
    echo "none"
  fi
}

# Grava o marcador "head state_hash" do último handoff reconhecido.
write_marker() {
  mkdir -p "$(dirname "$MARKER_FILE")"
  printf '%s %s\n' "$1" "$2" > "$MARKER_FILE"
}

# Lê o marcador; imprime "head state_hash" ou "none none".
read_marker() {
  if [ -f "$MARKER_FILE" ]; then
    read -r h s < "$MARKER_FILE" || true
    printf '%s %s\n' "${h:-none}" "${s:-none}"
  else
    echo "none none"
  fi
}

# Conta commits feitos por esta pessoa (e-mail de `git var GIT_COMMITTER_IDENT`, que respeita
# GIT_COMMITTER_EMAIL e user.email) desde $1 até o HEAD.
# Commits trazidos por git pull (ex.: squash merge feito no GitHub) têm outro committer e não contam.
# Marcador inválido ou sem e-mail configurado: conta todos os commits ou devolve 0 se o git falhar.
own_commits_since() {
  local since="$1" email
  email="$(git var GIT_COMMITTER_IDENT 2>/dev/null | sed -n 's/.*<\(.*\)>.*/\1/p')"
  if [ -n "$email" ]; then
    git rev-list --count -F --committer="$email" "$since..HEAD" 2>/dev/null || echo 0
  else
    git rev-list --count "$since..HEAD" 2>/dev/null || echo 0
  fi
}

# Gera docs/STATE.md a partir do fim do transcript via `claude -p` (processo separado).
# Uso: generate_handoff "$transcript" "PreCompact". Só grava se a resposta começar por "# Estado atual".
# Nunca falha: sem `claude`, timeout ou resposta inválida, deixa o STATE.md como estava.
generate_handoff() {
  local transcript="$1" label="$2" excerpt prompt out limit=() t
  command -v claude >/dev/null 2>&1 || return 0
  # Só o fim do transcript (últimos 300 KB) para caber no prompt e no tempo.
  excerpt="$(tail -c 300000 "$transcript" 2>/dev/null || true)"
  [ -n "$excerpt" ] || return 0
  prompt="Você vai escrever o arquivo docs/STATE.md (handoff de contexto) de um projeto de software, em português do Brasil.
Baseie-se SOMENTE no transcript JSONL abaixo. Responda apenas com o conteúdo Markdown do arquivo, começando por '# Estado atual', sem cercas de código.
Seções obrigatórias, nesta ordem: '## Tarefa atual', '## Feito', '## Em andamento', '## Próximos passos', '## Arquivos tocados', '## Decisões e pendências'.
Seja concreto: ids de tarefa, nomes de arquivo, comandos, erros abertos. Máximo de 60 linhas.

TRANSCRIPT:
$excerpt"
  # `timeout` é do GNU coreutils: ausente no macOS padrão (lá pode existir como `gtimeout`).
  for t in timeout gtimeout; do
    if command -v "$t" >/dev/null 2>&1; then limit=("$t" "${CLAUDE_HANDOFF_TIMEOUT:-45}"); break; fi
  done
  out="$(printf '%s' "$prompt" | (cd "${TMPDIR:-/tmp}" && env -u CLAUDECODE CLAUDE_HANDOFF_AUTOGEN=0 \
    ${limit[@]+"${limit[@]}"} claude -p --output-format text 2>/dev/null) || true)"
  case "$out" in
    "# Estado atual"*)
      mkdir -p "$(dirname "$STATE_FILE")"
      {
        printf '%s\n' "$out"
        printf '\n_Gerado automaticamente pelo hook %s em %s._\n' "$label" "$(date +%Y-%m-%d\ %H:%M)"
      } > "$STATE_FILE"
      write_marker "$(current_head)" "$(file_hash "$STATE_FILE")"
      ;;
  esac
  return 0
}

# Decide se o handoff está defasado: imprime "yes" se o transcript tem trabalho (Edit, Write,
# MultiEdit, NotebookEdit fora do STATE.md, ou Bash com git commit/merge/push) depois da última
# modificação do STATE.md (ou se ele não existe); senão "no". Sessão só de conversa/leitura: "no".
handoff_is_stale() {
  node -e '
    const fs = require("fs");
    const [transcript, state] = process.argv.slice(1);
    const EDITS = new Set(["Edit", "Write", "MultiEdit", "NotebookEdit"]);
    const isWork = (u) =>
      (EDITS.has(u.name) && !/(^|\/)docs\/STATE\.md$/.test(String(u.input?.file_path ?? u.input?.notebook_path ?? ""))) ||
      (u.name === "Bash" && /\bgit\b[^|;&]*\b(commit|merge|push)\b/.test(String(u.input?.command ?? "")));
    let last = 0;
    for (const line of fs.readFileSync(transcript, "utf8").split("\n")) {
      let e;
      try { e = JSON.parse(line); } catch { continue; }
      const content = Array.isArray(e?.message?.content) ? e.message.content : [];
      if (content.some((c) => c?.type === "tool_use" && isWork(c))) last = Math.max(last, Date.parse(e.timestamp) || 0);
    }
    let mtime = 0;
    try { mtime = fs.statSync(state).mtimeMs; } catch {}
    process.stdout.write(last > 0 && last > mtime ? "yes" : "no");
  ' "$1" "$2" 2>/dev/null || echo "no"
}
