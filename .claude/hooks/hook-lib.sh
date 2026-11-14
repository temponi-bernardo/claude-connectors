#!/usr/bin/env bash
# Functions shared by the handoff hooks. Load with `source`.
# No dependencies beyond bash, git and node (already required by the project).

STATE_FILE="docs/STATE.md"
MARKER_FILE=".claude/.last-handoff"

# Reads a top-level field of the JSON the hook received on stdin.
# Usage: json_field "$input" session_id [default]
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

# Hash of the current HEAD or "none" (repository without commits / outside git).
current_head() {
  git rev-parse --verify HEAD 2>/dev/null || echo "none"
}

# Hash of a file's content or "none" if it does not exist.
file_hash() {
  if [ -f "$1" ]; then
    git hash-object "$1" 2>/dev/null || echo "none"
  else
    echo "none"
  fi
}

# Writes the "head state_hash" marker of the last recognized handoff.
write_marker() {
  mkdir -p "$(dirname "$MARKER_FILE")"
  printf '%s %s\n' "$1" "$2" > "$MARKER_FILE"
}

# Reads the marker; prints "head state_hash" or "none none".
read_marker() {
  if [ -f "$MARKER_FILE" ]; then
    read -r h s < "$MARKER_FILE" || true
    printf '%s %s\n' "${h:-none}" "${s:-none}"
  else
    echo "none none"
  fi
}

# Counts commits made by this person (e-mail from `git var GIT_COMMITTER_IDENT`, which honors
# GIT_COMMITTER_EMAIL and user.email) from $1 to HEAD.
# Commits brought by git pull (e.g. a squash merge done on GitHub) have another committer and don't count.
# Invalid marker or no e-mail configured: counts every commit, or returns 0 if git fails.
own_commits_since() {
  local since="$1" email
  email="$(git var GIT_COMMITTER_IDENT 2>/dev/null | sed -n 's/.*<\(.*\)>.*/\1/p')"
  if [ -n "$email" ]; then
    git rev-list --count -F --committer="$email" "$since..HEAD" 2>/dev/null || echo 0
  else
    git rev-list --count "$since..HEAD" 2>/dev/null || echo 0
  fi
}

# Generates docs/STATE.md from the end of the transcript via `claude -p` (separate process).
# Usage: generate_handoff "$transcript" "PreCompact". Only writes if the reply starts with "# Current state"
# (or the older Portuguese "# Estado atual").
# Never fails: without `claude`, on timeout or an invalid reply, leaves STATE.md as it was.
generate_handoff() {
  local transcript="$1" label="$2" excerpt prompt out limit=() t
  command -v claude >/dev/null 2>&1 || return 0
  # Only the end of the transcript (last 300 KB) to fit the prompt and the time budget.
  excerpt="$(tail -c 300000 "$transcript" 2>/dev/null || true)"
  [ -n "$excerpt" ] || return 0
  prompt="You will write the docs/STATE.md file (context handoff) of a software project, in English.
Base it ONLY on the JSONL transcript below. Reply only with the file's Markdown content, starting with '# Current state', without code fences.
Required sections, in this order: '## Current task', '## Done', '## In progress', '## Next steps', '## Files touched', '## Decisions and open items'.
Be concrete: task ids, file names, commands, open errors. At most 60 lines.

TRANSCRIPT:
$excerpt"
  # `timeout` comes from GNU coreutils: missing on stock macOS (it may exist there as `gtimeout`).
  for t in timeout gtimeout; do
    if command -v "$t" >/dev/null 2>&1; then limit=("$t" "${CLAUDE_HANDOFF_TIMEOUT:-45}"); break; fi
  done
  out="$(printf '%s' "$prompt" | (cd "${TMPDIR:-/tmp}" && env -u CLAUDECODE CLAUDE_HANDOFF_AUTOGEN=0 \
    ${limit[@]+"${limit[@]}"} claude -p --output-format text 2>/dev/null) || true)"
  case "$out" in
    "# Current state"* | "# Estado atual"*)
      mkdir -p "$(dirname "$STATE_FILE")"
      {
        printf '%s\n' "$out"
        printf '\n_Generated automatically by the %s hook on %s._\n' "$label" "$(date +%Y-%m-%d\ %H:%M)"
      } > "$STATE_FILE"
      write_marker "$(current_head)" "$(file_hash "$STATE_FILE")"
      ;;
  esac
  return 0
}

# Decides whether the handoff is stale: prints "yes" if the transcript has work (Edit, Write,
# MultiEdit, NotebookEdit outside STATE.md, or Bash with git commit/merge/push) after the last
# modification of STATE.md (or if it does not exist); otherwise "no". Chat/read-only session: "no".
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
