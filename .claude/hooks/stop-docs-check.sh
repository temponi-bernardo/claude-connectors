#!/usr/bin/env bash
# Stop hook: if the reply changed code or docs, runs docs:check and returns the errors to Claude (exit 2).
# On the second pass in the same session it lets go, so Claude doesn't get stuck in a loop.
set -u
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

input="$(cat)"
session_id="$(printf '%s' "$input" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{try{process.stdout.write(String(JSON.parse(d).session_id||"no-session"))}catch{process.stdout.write("no-session")}})')"
marker="${TMPDIR:-/tmp}/claude-stop-docs-check-${session_id//[^a-zA-Z0-9_-]/_}"

if [ -f "$marker" ]; then
  rm -f "$marker"
  exit 0
fi

# Only runs if there is a change (staged, unstaged or new file) in the folders docs:check watches.
if [ -z "$(git status --porcelain -- src tools docs docs.config.json 2>/dev/null)" ]; then
  exit 0
fi

output="$(npm run -s docs:check 2>&1)"
status=$?
if [ "$status" -ne 0 ]; then
  touch "$marker"
  {
    echo "docs:check failed. Fix it before ending (run npm run docs:generate for generated blocks):"
    echo "$output"
  } >&2
  exit 2
fi
exit 0
