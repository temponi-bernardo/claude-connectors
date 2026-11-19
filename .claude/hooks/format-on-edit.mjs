// PostToolUse hook (Edit, Write, MultiEdit): formats the edited file with the project's Prettier, so
// `npm run check` does not fail on formatting. Honors .prettierignore and skips unknown extensions.
// Never fails the tool: without Prettier installed, a file outside the project or an error, it exits 0.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';

function readInput() {
  try {
    return JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    return {};
  }
}

const input = readInput();
const projectDir = resolve(process.env.CLAUDE_PROJECT_DIR ?? process.cwd());
const filePath = String(input?.tool_input?.file_path ?? '');
const prettier = join(projectDir, 'node_modules', '.bin', 'prettier');
const rel = filePath ? relative(projectDir, resolve(projectDir, filePath)) : '';
const insideProject = rel !== '' && !rel.startsWith('..') && !isAbsolute(rel);

if (insideProject && existsSync(prettier) && existsSync(join(projectDir, rel))) {
  try {
    // Leading `./`: a name starting with "-" does not become a Prettier option.
    const args = ['--write', '--ignore-unknown', '--log-level', 'silent', `./${rel}`];
    execFileSync(prettier, args, { cwd: projectDir, stdio: 'ignore', timeout: 20000 });
  } catch {
    // File with a syntax error: lint/typecheck will report it; do not get in the way of the edit.
  }
}
