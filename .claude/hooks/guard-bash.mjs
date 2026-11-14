// PreToolUse hook (Bash): blocks dangerous commands regardless of flag order.
// Exit 2 = block and return the reason to Claude. See docs/WORKFLOW.md and CLAUDE.md.
import { readFileSync } from 'node:fs';

const RULES = [
  {
    pattern:
      /\bgit\b[^|;&]*\bpush\b[^|;&]*(\s--force(?!-with-lease)\b|\s-f\b|\s--force-with-lease\b)/,
    reason: 'force push is forbidden (docs/WORKFLOW.md).',
  },
  {
    pattern: /\bgit\b[^|;&]*\bpush\b[^|;&]*\b(main|master)\b/,
    reason: 'direct push to main is forbidden: open a PR (docs/WORKFLOW.md).',
  },
  {
    pattern: /\bgit\b[^|;&]*\b(commit|push|merge)\b[^|;&]*(\s--no-verify\b|\s-n\b)/,
    reason: '--no-verify is forbidden: fix what the hook reported.',
  },
  {
    pattern: /\bgit\b[^|;&]*\bbranch\b[^|;&]*\s-D\s+(main|master)\b/,
    reason: 'do not delete main.',
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
