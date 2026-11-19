/**
 * Post-deploy smoke test (`npm run smoke -- <connector>`, run by every `*:deploy` script): reads the published
 * Worker's public tool catalog (`GET /tools`, the MCP `tools/list` answer) and compares it with the connector's
 * `tool-contract.json`. Any difference fails the deploy command.
 */
import {
  toolContractDiff,
  toolContractOf,
  toolsFromListResponse,
  type ToolContractEntry,
} from '../../src/mcp/tool-contract.js';

/** Contract file of each connector, relative to its folder. */
export const TOOL_CONTRACT_FILE = 'tool-contract.json';

/** Attempts and pause between them: a fresh deploy can take a few seconds to reach every location. */
export const SMOKE_ATTEMPTS = 4;
export const SMOKE_RETRY_MS = 5000;

/** Value of a `key = "value"` line of a `wrangler.toml`, or null. */
export function wranglerValue(toml: string, key: string): string | null {
  const match = new RegExp(`^\\s*${key}\\s*=\\s*"([^"]+)"`, 'm').exec(toml);
  return match?.[1] ?? null;
}

/** Where the Worker answers: `SMOKE_URL`, else `PUBLIC_URL` from the toml, else `<name>.<subdomain>.workers.dev`. */
export function workerBaseUrl(toml: string, subdomain: string, override?: string): string {
  const explicit = override ?? wranglerValue(toml, 'PUBLIC_URL');
  if (explicit) return explicit.replace(/\/+$/, '');
  const name = wranglerValue(toml, 'name');
  if (!name) throw new Error('wrangler.toml has no name: set SMOKE_URL to the Worker address.');
  return `https://${name}.${subdomain}.workers.dev`;
}

/** Cloudflare credentials the deploy already uses. */
export interface CloudflareAccount {
  readonly accountId: string;
  readonly apiToken: string;
}

/** Reads the account's `workers.dev` subdomain from the Cloudflare API. */
export async function fetchWorkersSubdomain(
  fetchFn: typeof fetch,
  account: CloudflareAccount,
): Promise<string> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${account.accountId}/workers/subdomain`;
  const res = await fetchFn(url, { headers: { authorization: `Bearer ${account.apiToken}` } });
  const body = (await res.json()) as { result?: { subdomain?: string } };
  const subdomain = body.result?.subdomain;
  if (!res.ok || !subdomain)
    throw new Error(`Cloudflare did not return the workers.dev subdomain (${String(res.status)}).`);
  return subdomain;
}

/** Reads the published catalog `GET <base>/tools` as contract entries. */
export async function fetchPublishedTools(
  fetchFn: typeof fetch,
  baseUrl: string,
): Promise<ToolContractEntry[]> {
  const res = await fetchFn(`${baseUrl}/tools`, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`GET ${baseUrl}/tools answered ${String(res.status)}.`);
  return toolContractOf(toolsFromListResponse(await res.json()));
}

/** What one smoke check needs: `fetch`, a pause function, the Worker address and the expected tools. */
export interface SmokeCheck {
  readonly fetchFn: typeof fetch;
  readonly sleep: (ms: number) => Promise<void>;
  readonly baseUrl: string;
  readonly expected: readonly ToolContractEntry[];
}

/** One attempt: the differences with the contract, or the error as a single problem. */
export async function smokeAttempt(check: SmokeCheck): Promise<string[]> {
  try {
    return toolContractDiff(
      check.expected,
      await fetchPublishedTools(check.fetchFn, check.baseUrl),
    );
  } catch (error) {
    return [error instanceof Error ? error.message : String(error)];
  }
}

/** Compares the published tools with the contract, retrying while they differ; empty when they match. */
export async function runSmokeCheck(check: SmokeCheck): Promise<string[]> {
  let problems = await smokeAttempt(check);
  for (let attempt = 1; attempt < SMOKE_ATTEMPTS && problems.length > 0; attempt++) {
    await check.sleep(SMOKE_RETRY_MS);
    problems = await smokeAttempt(check);
  }
  return problems;
}
