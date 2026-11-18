import { randomBytes } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { issueTokenSet } from '../../../src/remote/tokens.js';
import { readWhatsAppSettings } from './config.js';
import { memoryBucket, READY_STATUS } from './fixtures/fakes.js';
import type { WhatsAppEnv } from './worker-env.js';
import {
  createWhatsAppApps,
  githubSettingsFrom,
  handleWhatsAppFetch,
  isSyncCronEnabled,
  runScheduledSync,
  unixNow,
  WHATSAPP_WORKER_HANDLERS,
  whatsappRemoteConnector,
} from './worker.js';

const ORIGIN = 'https://whatsapp.account.workers.dev';
const VARS = {
  ALLOWED_EMAILS: 'owner@example.dev',
  GITHUB_CLIENT_ID: 'cid',
  GITHUB_CLIENT_SECRET: 'cs',
  SEAL_KEY: randomBytes(32).toString('base64'),
};

function envWith(
  handler: (request: Request) => Response,
  vars: Record<string, string> = {},
): {
  env: WhatsAppEnv;
  paths: string[];
} {
  const paths: string[] = [];
  const stub = {
    fetch: (request: Request) => {
      const url = new URL(request.url);
      paths.push(url.pathname + url.search);
      return Promise.resolve(handler(request));
    },
  };
  const env: WhatsAppEnv = {
    ...VARS,
    ...vars,
    WHATSAPP_BRIDGE: { idFromName: () => 'id', get: () => stub },
    SNAPSHOTS: memoryBucket(),
  };
  return { env, paths };
}

describe('helpers', () => {
  it('unixNow is in seconds and githubSettingsFrom forwards the owner list', () => {
    expect(unixNow()).toBeLessThan(Date.now());
    const github = githubSettingsFrom(readWhatsAppSettings(VARS));
    expect(github).toMatchObject({ clientId: 'cid', allowedEmails: ['owner@example.dev'] });
  });

  it('the GitHub fetch calls the global fetch without this', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'));
    const github = githubSettingsFrom(readWhatsAppSettings(VARS));
    await github.fetchFn('https://api.github.com/x');
    expect(spy).toHaveBeenCalledWith('https://api.github.com/x', undefined);
    spy.mockRestore();
  });
});

describe('whatsappRemoteConnector', () => {
  it('uses GitHub login and accepts only the owner', () => {
    const connector = whatsappRemoteConnector(
      readWhatsAppSettings(VARS),
      () => Promise.resolve(new Response()),
      ORIGIN,
    );
    expect(connector.login.kind).toBe('upstream');
    expect(connector.acceptsSecret?.('owner@example.dev')).toBe(true);
    expect(connector.acceptsSecret?.('x@y.z')).toBe(false);
    expect(connector.createServer('owner@example.dev', []).server).toBeDefined();
  });
});

describe('createWhatsAppApps and handleWhatsAppFetch', () => {
  it('uses the origin as issuer and binds /pair to the same key', () => {
    const apps = createWhatsAppApps(VARS, () => Promise.resolve(new Response()), ORIGIN);
    expect(apps.remote.settings.issuer).toBe(ORIGIN);
    expect(apps.pair.settings).toBe(apps.remote.settings);
  });

  it('invalid configuration becomes an explained 500', async () => {
    const { env } = envWith(() => new Response());
    const res = await handleWhatsAppFetch(new Request(`${ORIGIN}/`), {
      ...env,
      ALLOWED_EMAILS: '',
    });
    expect(res.status).toBe(500);
    expect(await res.text()).toContain('ALLOWED_EMAILS');
  });

  it('/pair without a session goes to GitHub and OAuth publishes the metadata', async () => {
    const { env } = envWith(() => new Response());
    const pair = await handleWhatsAppFetch(new Request(`${ORIGIN}/pair`), env);
    expect(pair.headers.get('location')).toContain('github.com/login/oauth/authorize');
    const meta = await handleWhatsAppFetch(
      new Request(`${ORIGIN}/.well-known/oauth-authorization-server`),
      env,
    );
    expect(((await meta.json()) as { issuer: string }).issuer).toBe(ORIGIN);
  });
});

describe('WhatsApp isolation (single tenant)', () => {
  function accessToken(env: WhatsAppEnv, email: string, issuer = ORIGIN): string {
    const settings = {
      issuer,
      key: Buffer.from(String(env.SEAL_KEY), 'base64'),
      redirectHosts: [],
    };
    return issueTokenSet({ secret: email, grants: [] }, settings, unixNow()).access_token;
  }

  function mcp(token: string | null): Request {
    return new Request(`${ORIGIN}/mcp`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json, text/event-stream',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
    });
  }

  it('answers 403 to a valid token whose email is not the owner, and never reaches the bridge', async () => {
    const { env, paths } = envWith(() => Response.json(READY_STATUS));
    const res = await handleWhatsAppFetch(mcp(accessToken(env, 'friend@example.dev')), env);
    expect(res.status).toBe(403);
    expect(paths).toEqual([]);
  });

  it('answers 401 without a token, with a random one and with a token of another connector', async () => {
    const { env, paths } = envWith(() => Response.json(READY_STATUS));
    const foreign = accessToken(env, 'owner@example.dev', 'https://canvas.example.dev');
    for (const token of [null, 'random-token', foreign]) {
      expect((await handleWhatsAppFetch(mcp(token), env)).status).toBe(401);
    }
    expect(paths).toEqual([]);
  });

  it('refuses to start with two owner emails', async () => {
    const { env } = envWith(() => new Response(), {
      ALLOWED_EMAILS: 'owner@example.dev,friend@example.dev',
    });
    const res = await handleWhatsAppFetch(mcp(null), env);
    expect(res.status).toBe(500);
    expect(await res.text()).toContain('single-tenant');
  });
});

describe('optional periodic sync', () => {
  it('runs only with SYNC_CRON equal to the cron that fired', async () => {
    expect(isSyncCronEnabled(VARS, '0 * * * *')).toBe(false);
    expect(isSyncCronEnabled({ ...VARS, SYNC_CRON: '0 */6 * * *' }, '0 */6 * * *')).toBe(true);
    const { env, paths } = envWith(() => Response.json({}));
    expect(await runScheduledSync(env, '0 * * * *')).toBe('disabled');
    expect(paths).toEqual([]);
  });

  it('waits for the sync, saves the snapshot and returns the outcome', async () => {
    const { env, paths } = envWith(
      (request) =>
        new URL(request.url).pathname === '/__snapshot'
          ? Response.json({ outcome: 'saved' })
          : Response.json(READY_STATUS),
      { SYNC_CRON: '0 */6 * * *' },
    );
    expect(await WHATSAPP_WORKER_HANDLERS.scheduled({ cron: '0 */6 * * *' }, env)).toBe('saved');
    expect(paths).toEqual(['/sync/wait?timeout_ms=20000', '/__snapshot']);
    const odd = envWith(() => Response.json({}), { SYNC_CRON: 'x' });
    expect(await runScheduledSync(odd.env, 'x')).toBe('unknown');
  });
});
