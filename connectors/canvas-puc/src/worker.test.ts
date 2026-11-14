import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { createWorkerApp, handleWorkerFetch } from './worker.js';

const KEY = randomBytes(32).toString('base64');

describe('createWorkerApp', () => {
  it('uses the request origin as the issuer when PUBLIC_URL is missing', () => {
    const app = createWorkerApp({ SEAL_KEY: KEY }, 'https://canvas.accounts.workers.dev');
    expect(app.settings.issuer).toBe('https://canvas.accounts.workers.dev');
    expect(app.connector.login.kind === 'secret' && app.connector.login.text.helpUrl).toBe(
      'https://pucminas.instructure.com/profile/settings',
    );
    expect(app.now()).toBeGreaterThan(1_700_000_000);
  });

  it('prefers PUBLIC_URL, without a trailing slash', () => {
    const app = createWorkerApp({ SEAL_KEY: KEY, PUBLIC_URL: 'https://canvas.dev/' }, 'https://x');
    expect(app.settings.issuer).toBe('https://canvas.dev');
  });
});

describe('handleWorkerFetch', () => {
  it('serves OAuth discovery with the Worker origin', async () => {
    const res = await handleWorkerFetch(
      new Request('https://w.workers.dev/.well-known/oauth-authorization-server'),
      { SEAL_KEY: KEY },
    );
    expect(((await res.json()) as { token_endpoint: string }).token_endpoint).toBe(
      'https://w.workers.dev/token',
    );
  });

  it('answers 500 explaining the missing configuration', async () => {
    const res = await handleWorkerFetch(new Request('https://w.workers.dev/'), {});
    expect(res.status).toBe(500);
    expect(await res.text()).toContain('SEAL_KEY');
  });
});
