// PreToolUse hook (Bash): blocks dangerous commands regardless of flag order.
// Exit 2 = block and return the reason to Claude. See docs/WORKFLOW.md and CLAUDE.md.
import { readFileSync } from 'node:fs';

// `git` followed directly by the subcommand, global options allowed in between (git -C dir push), so text that
// only mentions git and push (a heredoc, `git hook pre-push`, `git stash push`) does not match.
// An option value: quoted (with spaces) or a single token.
const OPTION_VALUE = String.raw`(?:"[^"]*"|'[^']*'|\S+)`;
const GIT_OPTIONS = String.raw`\bgit(?:\s+(?:(?:-[Cc]|--(?:git-dir|work-tree|namespace|exec-path|super-prefix|config-env))\s+${OPTION_VALUE}|--?[\w-]+(?:=${OPTION_VALUE})?))*\s+`;
/** Pattern for `git <one of names> ...<rest>` within one command segment. */
function gitSubcommand(names, rest) {
  return new RegExp(`${GIT_OPTIONS}(?:${names})\\b[^|;&\\n]*${rest}`);
}
// The protected branch only as a whole refspec (origin main, HEAD:main, +main, refs/heads/main), never inside
// a name like fix/main-menu.
// Quotes around the refspec and a closing `)` of a subshell do not hide it.
const PROTECTED_REFSPEC = String.raw`\s['"]?\+?(?:[^\s'"]*:)?\+?(?:refs\/heads\/)?(?:main|master)['"]?(?=\s|$|[;&|)])`;

const RULES = [
  {
    pattern: gitSubcommand(
      'push',
      String.raw`(\s--force(?!-with-lease)\b|\s-f\b|\s--force-with-lease\b)`,
    ),
    reason: 'force push is forbidden (docs/WORKFLOW.md).',
  },
  {
    pattern: gitSubcommand('push', PROTECTED_REFSPEC),
    reason: 'direct push to main is forbidden: open a PR (docs/WORKFLOW.md).',
  },
  {
    pattern: gitSubcommand('commit|push|merge', String.raw`(\s--no-verify\b|\s-n\b)`),
    reason: '--no-verify is forbidden: fix what the hook reported.',
  },
  {
    pattern: gitSubcommand('branch', String.raw`\s-D\s+(main|master)(?=\s|$|[;&|])`),
    reason: 'do not delete main.',
  },
  {
    pattern: /\bgh\s+workflow\s+(run|enable)\b|actions\/workflows\/\S+\/(enable|dispatches)\b/,
    reason: 'GitHub Actions is not used: the checks run locally (ADR 0006).',
  },
  {
    pattern:
      /(^|[\s;&|(])(cat|less|more|head|tail|bat|grep|rg|sed|awk|source|\.|xxd|strings|base64)\s+(?:[^|;&]*?[\s'"=/])?\.env(?:\.(?!example)[\w.-]+)?(?![\w.-])/,
    reason: 'reading .env is forbidden: use .env.example for the variable names.',
  },
  {
    pattern: /['"`][^'"`]*\/?\.env(?:\.(?!example)[\w.-]+)?['"`]/,
    reason: 'accessing .env from a script is forbidden: use .env.example.',
  },
  {
    pattern: /\brm\s+-[a-zA-Z]*r[a-zA-Z]*f?\s+(\/|~|\$HOME)(\s|$)/,
    reason: 'rm -rf on the root or home directory is forbidden.',
  },
  {
    pattern: /\bgit\s+config\s+[^|;&]*core\.hooksPath\s+(\/dev\/null|'' |"" )/,
    reason: 'do not disable the git hooks.',
  },
];

function readInput() {
  try {
    return JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    return {};
  }
}

const input = readInput();
const command = String(input?.tool_input?.command ?? '');
const hit = RULES.find((rule) => rule.pattern.test(command));
if (hit) {
  process.stderr.write(`Command blocked by the project: ${hit.reason}\nCommand: ${command}\n`);
  process.exit(2);
}
