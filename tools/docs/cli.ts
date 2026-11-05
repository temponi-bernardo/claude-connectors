import { formatIssues, runCheck, runGenerate } from './run.js';

/** CLI do verificador de documentação: `check` (padrão) ou `generate`. Sai com 1 se houver problemas. */
export async function runDocsCli(args: readonly string[]): Promise<number> {
  const command = args[0] ?? 'check';
  const rootDir = process.cwd();
  if (command === 'generate') {
    const changed = await runGenerate(rootDir);
    console.log(
      changed ? 'docs:generate ✔ FUNCTIONS.md atualizado.' : 'docs:generate ✔ nada a mudar.',
    );
    return 0;
  }
  if (command !== 'check') {
    console.error(`Comando desconhecido: ${command}. Use "check" ou "generate".`);
    return 2;
  }
  const issues = await runCheck(rootDir);
  console.log(formatIssues(issues));
  return issues.length === 0 ? 0 : 1;
}

process.exitCode = await runDocsCli(process.argv.slice(2));
