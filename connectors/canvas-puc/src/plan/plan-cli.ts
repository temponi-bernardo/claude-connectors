/**
 * Entry of the `/planejamento` script, bundled to `plugin/skills/planejamento/scripts/plan.mjs` by `npm run build`:
 * wires the real file system into the tested commands of plan-cli-core.ts.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runPlanCommand } from './plan-cli-core.js';

/** Runs the script with the process arguments and exits with its code. */
export function runPlanCli(): void {
  const result = runPlanCommand(process.argv.slice(2), {
    readText: (path) => readFileSync(path, 'utf8'),
    writeText: (path, text) => {
      writeFileSync(path, text, 'utf8');
    },
    templatePath: fileURLToPath(new URL('../assets/plan-template.html', import.meta.url)),
  });
  (result.code === 0 ? process.stdout : process.stderr).write(`${result.output}\n`);
  process.exitCode = result.code;
}

runPlanCli();
