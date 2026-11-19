/**
 * Smoke CLI: `npm run smoke -- <connector>` after `wrangler deploy`. Exits 1 when the published Worker's tools
 * differ from `connectors/<connector>/tool-contract.json`, which fails the `*:deploy` script.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readToolContract } from '../../src/mcp/tool-contract.js';
import {
  fetchWorkersSubdomain,
  runSmokeCheck,
  TOOL_CONTRACT_FILE,
  workerBaseUrl,
  type SmokeCheck,
} from './smoke.js';

/** Waits `ms` milliseconds. */
function sleepMs(ms: number): Promise<void> {
  return new Promise((done) => setTimeout(done, ms));
}

/** Reads the connector's toml and contract and resolves the published Worker address. */
async function readSmokeCheck(name: string): Promise<SmokeCheck> {
  const dir = join('connectors', name);
  const toml = readFileSync(join(dir, 'wrangler.toml'), 'utf8');
  const contract: unknown = JSON.parse(readFileSync(join(dir, TOOL_CONTRACT_FILE), 'utf8'));
  const override = process.env.SMOKE_URL;
  const account = {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? '',
    apiToken: process.env.CLOUDFLARE_API_TOKEN ?? '',
  };
  const subdomain = override ? '' : await fetchWorkersSubdomain(fetch, account);
  const baseUrl = workerBaseUrl(toml, subdomain, override);
  return { fetchFn: fetch, sleep: sleepMs, baseUrl, expected: readToolContract(contract) };
}

/** Runs the smoke test of the connector given on the command line and sets the exit code. */
async function runSmokeCli(): Promise<void> {
  const name = process.argv[2] ?? '';
  const check = await readSmokeCheck(name);
  const problems = await runSmokeCheck(check);
  const where = `${check.baseUrl}/tools`;
  if (problems.length === 0) {
    console.log(
      `✔ smoke ${name}: ${String(check.expected.length)} tools at ${where} match ${TOOL_CONTRACT_FILE}`,
    );
    return;
  }
  console.error(
    `✘ smoke ${name} (${where}) differs from ${TOOL_CONTRACT_FILE}:\n- ${problems.join('\n- ')}`,
  );
  console.error(`Roll back: npx wrangler rollback --config connectors/${name}/wrangler.toml`);
  process.exitCode = 1;
}

void runSmokeCli();
