#!/usr/bin/env bash
# Functions shared by the Claude Code hooks. Load with `source`.
# No dependencies beyond bash and node (already required by the project).

# Reads a top-level field of the JSON the hook received on stdin.
# Usage: json_field "$input" stop_hook_active [default]
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
