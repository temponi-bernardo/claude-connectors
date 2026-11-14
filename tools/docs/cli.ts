import { formatIssues, runCheck, runGenerate } from './run.js';

/** Documentation checker CLI: `check` (default) or `generate`. Exits with 1 on problems. */
export async function runDocsCli(args: readonly string[]): Promise<number> {
  const command = args[0] ?? 'check';
  const rootDir = process.cwd();
  if (command === 'generate') {
    const changed = await runGenerate(rootDir);
    console.log(
      changed ? 'docs:generate ✔ FUNCTIONS.md updated.' : 'docs:generate ✔ nothing to change.',
    );
    return 0;
  }
  if (command !== 'check') {
    console.error(`Unknown command: ${command}. Use "check" or "generate".`);
    return 2;
  }
  const issues = await runCheck(rootDir);
  console.log(formatIssues(issues));
  return issues.length === 0 ? 0 : 1;
}

process.exitCode = await runDocsCli(process.argv.slice(2));
