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
