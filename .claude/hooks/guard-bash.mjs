// Hook PreToolUse (Bash): bloqueia comandos perigosos independentemente da ordem das flags.
// Saída 2 = bloqueia e devolve o motivo ao Claude. Ver docs/WORKFLOW.md e CLAUDE.md.
import { readFileSync } from 'node:fs';

const RULES = [
  {
    pattern:
      /\bgit\b[^|;&]*\bpush\b[^|;&]*(\s--force(?!-with-lease)\b|\s-f\b|\s--force-with-lease\b)/,
    reason: 'force push é proibido (docs/WORKFLOW.md).',
  },
  {
    pattern: /\bgit\b[^|;&]*\bpush\b[^|;&]*\b(main|master)\b/,
    reason: 'push direto na main é proibido: abra um PR (docs/WORKFLOW.md).',
  },
  {
    pattern: /\bgit\b[^|;&]*\b(commit|push|merge)\b[^|;&]*(\s--no-verify\b|\s-n\b)/,
    reason: '--no-verify é proibido: corrija o que o hook apontou.',
  },
  {
    pattern: /\bgit\b[^|;&]*\bbranch\b[^|;&]*\s-D\s+(main|master)\b/,
    reason: 'não apague a main.',
  },
  {
    pattern:
      /(^|[\s;&|(])(cat|less|more|head|tail|bat|grep|rg|sed|awk|source|\.|xxd|strings|base64)\s+(?:[^|;&]*?[\s'"=/])?\.env(?:\.(?!example)[\w.-]+)?(?![\w.-])/,
    reason: 'leitura de .env é proibida: use .env.example para saber os nomes das variáveis.',
  },
  {
    pattern: /['"`][^'"`]*\/?\.env(?:\.(?!example)[\w.-]+)?['"`]/,
    reason: 'acesso a .env por script é proibido: use .env.example.',
  },
  {
    pattern: /\brm\s+-[a-zA-Z]*r[a-zA-Z]*f?\s+(\/|~|\$HOME)(\s|$)/,
    reason: 'rm -rf na raiz ou no home é proibido.',
  },
  {
    pattern: /\bgit\s+config\s+[^|;&]*core\.hooksPath\s+(\/dev\/null|'' |"" )/,
    reason: 'não desative os git hooks.',
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
  process.stderr.write(`Comando bloqueado pelo projeto: ${hit.reason}\nComando: ${command}\n`);
  process.exit(2);
}
