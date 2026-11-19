import { describe, expect, it, vi } from 'vitest';
import {
  fetchPublishedTools,
  fetchWorkersSubdomain,
  runSmokeCheck,
  smokeAttempt,
  SMOKE_ATTEMPTS,
  SMOKE_RETRY_MS,
  TOOL_CONTRACT_FILE,
  workerBaseUrl,
  wranglerValue,
} from './smoke.js';

const TOML =
  'name = "canvas-puc-remote"\nmain = "src/worker.ts"\n\n[vars]\nCANVAS_ALLOW_WRITE = "true"\n';
const EXPECTED = [
  { name: 'send_message', readOnly: false },
  { name: 'whoami', readOnly: true },
];

function listing(tools: { name: string; readOnly: boolean }[]): Response {
  const listed = tools.map((t) => ({ name: t.name, annotations: { readOnlyHint: t.readOnly } }));
  return Response.json({ jsonrpc: '2.0', id: 1, result: { tools: listed } });
}

function check(...responses: (Response | Error)[]) {
  const fetchFn = vi.fn<typeof fetch>(() => {
    const next = responses.shift() ?? new Response('', { status: 500 });
    return next instanceof Error ? Promise.reject(next) : Promise.resolve(next);
  });
  const sleep = vi.fn(() => Promise.resolve());
  return { fetchFn, sleep, baseUrl: 'https://w.test', expected: EXPECTED };
}

describe('wranglerValue', () => {
  it('reads a quoted value and null when missing', () => {
    expect(wranglerValue(TOML, 'name')).toBe('canvas-puc-remote');
    expect(wranglerValue(TOML, 'PUBLIC_URL')).toBeNull();
  });
});

describe('workerBaseUrl', () => {
  it('prefers SMOKE_URL, then PUBLIC_URL, then name.subdomain.workers.dev', () => {
    expect(workerBaseUrl(TOML, 'acct')).toBe('https://canvas-puc-remote.acct.workers.dev');
    expect(workerBaseUrl(`${TOML}PUBLIC_URL = "https://c.dev/"\n`, 'acct')).toBe('https://c.dev');
    expect(workerBaseUrl(TOML, '', 'https://o.dev/')).toBe('https://o.dev');
    expect(() => workerBaseUrl('main = "x"', 'acct')).toThrow('SMOKE_URL');
  });
});

describe('fetchWorkersSubdomain', () => {
  it('reads the subdomain with the API token and fails clearly otherwise', async () => {
    const ok = vi.fn<typeof fetch>(() =>
      Promise.resolve(Response.json({ result: { subdomain: 'acct' } })),
    );
    await expect(fetchWorkersSubdomain(ok, { accountId: 'a1', apiToken: 'tk' })).resolves.toBe(
      'acct',
    );
    const [url, init] = ok.mock.calls[0]!;
    expect(url).toBe('https://api.cloudflare.com/client/v4/accounts/a1/workers/subdomain');
    expect(new Headers(init?.headers).get('authorization')).toBe('Bearer tk');
    const bad = vi.fn<typeof fetch>(() => Promise.resolve(Response.json({}, { status: 403 })));
    await expect(fetchWorkersSubdomain(bad, { accountId: 'a', apiToken: 't' })).rejects.toThrow(
      '403',
    );
  });
});

describe('fetchPublishedTools', () => {
  it('reads GET /tools as contract entries and fails on a non-2xx', async () => {
    const c = check(listing(EXPECTED), new Response('', { status: 404 }));
    await expect(fetchPublishedTools(c.fetchFn, c.baseUrl)).resolves.toEqual(EXPECTED);
    expect(c.fetchFn.mock.calls[0]![0]).toBe('https://w.test/tools');
    await expect(fetchPublishedTools(c.fetchFn, c.baseUrl)).rejects.toThrow('answered 404');
  });
});

describe('smokeAttempt', () => {
  it('returns the differences, or the error as one problem', async () => {
    await expect(smokeAttempt(check(listing([EXPECTED[1]!])))).resolves.toEqual([
      'missing tool: send_message',
    ]);
    await expect(smokeAttempt(check(new Error('offline')))).resolves.toEqual(['offline']);
  });
});

describe('runSmokeCheck', () => {
  it('passes at once when the published tools match', async () => {
    const c = check(listing(EXPECTED));
    await expect(runSmokeCheck(c)).resolves.toEqual([]);
    expect(c.sleep).not.toHaveBeenCalled();
  });

  it('retries while the deploy propagates and passes when it converges', async () => {
    const c = check(new Error('not yet'), listing(EXPECTED));
    await expect(runSmokeCheck(c)).resolves.toEqual([]);
    expect(c.sleep).toHaveBeenCalledWith(SMOKE_RETRY_MS);
  });

  it('fails after every attempt when the deployed tools diverge (e.g. send_message missing)', async () => {
    const stale = Array.from({ length: SMOKE_ATTEMPTS }, () => listing([EXPECTED[1]!]));
    const c = check(...stale);
    await expect(runSmokeCheck(c)).resolves.toEqual(['missing tool: send_message']);
    expect(c.fetchFn).toHaveBeenCalledTimes(SMOKE_ATTEMPTS);
  });
});

describe('TOOL_CONTRACT_FILE', () => {
  it('is the contract file name of every connector', () => {
    expect(TOOL_CONTRACT_FILE).toBe('tool-contract.json');
  });
});
