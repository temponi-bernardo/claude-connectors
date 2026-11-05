import { initProject, parseInitArgs } from './init.js';

/** CLI: `npm run init -- --name <nome> --description <descrição> --owner <conta-github>`. */
export function runInitCli(args: readonly string[]): number {
  try {
    const values = parseInitArgs(args);
    const changed = initProject(process.cwd(), values);
    console.log(
      `init ✔ ${changed.length} arquivo(s) atualizado(s):\n${changed.map((f) => `  - ${f}`).join('\n')}`,
    );
    return 0;
  } catch (error) {
    console.error(`init ✖ ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }
}

process.exitCode = runInitCli(process.argv.slice(2));
