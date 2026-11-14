import { randomBytes } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
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

const ORIGIN = 'https://whatsapp.conta.workers.dev';
const VARS = {
  ALLOWED_EMAILS: 'dono@exemplo.dev',
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

describe('auxiliares', () => {
  it('unixNow está em segundos e githubSettingsFrom repassa a lista do dono', () => {
    expect(unixNow()).toBeLessThan(Date.now());
    const github = githubSettingsFrom(readWhatsAppSettings(VARS));
    expect(github).toMatchObject({ clientId: 'cid', allowedEmails: ['dono@exemplo.dev'] });
  });

  it('o fetch do GitHub chama o fetch global sem this', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('ok'));
    const github = githubSettingsFrom(readWhatsAppSettings(VARS));
    await github.fetchFn('https://api.github.com/x');
    expect(spy).toHaveBeenCalledWith('https://api.github.com/x', undefined);
    spy.mockRestore();
  });
});

describe('whatsappRemoteConnector', () => {
  it('usa login pelo GitHub e só aceita o dono', () => {
    const connector = whatsappRemoteConnector(
      readWhatsAppSettings(VARS),
      () => Promise.resolve(new Response()),
      ORIGIN,
    );
    expect(connector.login.kind).toBe('upstream');
    expect(connector.acceptsSecret?.('dono@exemplo.dev')).toBe(true);
    expect(connector.acceptsSecret?.('x@y.z')).toBe(false);
    expect(connector.createServer('dono@exemplo.dev').server).toBeDefined();
  });
});

describe('createWhatsAppApps e handleWhatsAppFetch', () => {
  it('usa a origem como emissor e liga o /pair à mesma chave', () => {
    const apps = createWhatsAppApps(VARS, () => Promise.resolve(new Response()), ORIGIN);
    expect(apps.remote.settings.issuer).toBe(ORIGIN);
    expect(apps.pair.settings).toBe(apps.remote.settings);
  });

  it('configuração inválida vira 500 explicado', async () => {
    const { env } = envWith(() => new Response());
    const res = await handleWhatsAppFetch(new Request(`${ORIGIN}/`), {
      ...env,
      ALLOWED_EMAILS: '',
    });
    expect(res.status).toBe(500);
    expect(await res.text()).toContain('ALLOWED_EMAILS');
  });

  it('o /pair sem sessão vai ao GitHub e o OAuth publica os metadados', async () => {
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

describe('sync periódico opcional', () => {
  it('só roda com SYNC_CRON igual ao cron que disparou', async () => {
    expect(isSyncCronEnabled(VARS, '0 * * * *')).toBe(false);
    expect(isSyncCronEnabled({ ...VARS, SYNC_CRON: '0 */6 * * *' }, '0 */6 * * *')).toBe(true);
    const { env, paths } = envWith(() => Response.json({}));
    expect(await runScheduledSync(env, '0 * * * *')).toBe('disabled');
    expect(paths).toEqual([]);
  });

  it('espera o sync, guarda o snapshot e devolve o resultado', async () => {
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
