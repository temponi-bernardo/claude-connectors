// PreToolUse hook (Edit, Write, MultiEdit, NotebookEdit): blocks writes to protected files before they happen
// (the pre-commit only catches them at commit time). Exit 2 = block and return the reason to Claude.
// See CLAUDE.md and ADR 0006 (no GitHub Actions).
import { readFileSync, realpathSync } from 'node:fs';
import { basename, dirname, join, resolve, sep } from 'node:path';

// Every rule ignores case: on macOS APFS `.GitHub/Workflows` and `.ENV` are the same files.
const RULES = [
  {
    pattern: /(^|\/)\.github\/workflows\//i,
    reason: 'GitHub Actions workflows are not used: the checks run locally (ADR 0006).',
  },
  {
    pattern: /(^|\/)\.(env|dev\.vars)(\.(?!example$)[\w.-]+)?$/i,
    reason: '.env and .dev.vars files hold secrets: edit only .env.example (variable names).',
  },
  {
    pattern: /\.(pem|key|p12|pfx)$/i,
    reason: 'key or certificate file: do not write secrets through Claude Code.',
  },
];

function readInput() {
  try {
    return JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    return {};
  }
}

/** Real path of `absolute`, or the parent's real path plus the name when the file does not exist yet. */
function realPath(absolute) {
  try {
    return realpathSync(absolute);
  } catch {
    try {
      return join(realpathSync(dirname(absolute)), basename(absolute));
    } catch {
      return absolute;
    }
  }
}

/** Paths to check: the normalized one (`//`, `./`, `../`) from the project root and the real one (symlinks). */
function candidatePaths(file) {
  const absolute = resolve(process.env.CLAUDE_PROJECT_DIR ?? process.cwd(), file);
  return [absolute, realPath(absolute)].map((p) => p.split(sep).join('/'));
}

const input = readInput();
const path = String(input?.tool_input?.file_path ?? input?.tool_input?.notebook_path ?? '');
const candidates = path ? candidatePaths(path) : [];
const hit = RULES.find((rule) => candidates.some((candidate) => rule.pattern.test(candidate)));
if (hit) {
  process.stderr.write(`Write blocked by the project: ${hit.reason}\nFile: ${path}\n`);
  process.exit(2);
}
