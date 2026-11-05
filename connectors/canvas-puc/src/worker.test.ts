import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { createWorkerApp, handleWorkerFetch, toEnvVars } from './worker.js';

const KEY = randomBytes(32).toString('base64');

describe('toEnvVars', () => {
  it('mantém só os valores de texto do ambiente do Worker', () => {
    expect(toEnvVars({ A: 'x', B: 1, C: { binding: true } })).toEqual({ A: 'x' });
  });
});

describe('createWorkerApp', () => {
  it('usa a origem da requisição como emissor quando PUBLIC_URL não vem', () => {
    const app = createWorkerApp({ SEAL_KEY: KEY }, 'https://canvas.contas.workers.dev');
    expect(app.settings.issuer).toBe('https://canvas.contas.workers.dev');
    expect(app.connector.loginText.helpUrl).toBe(
      'https://pucminas.instructure.com/profile/settings',
    );
    expect(app.now()).toBeGreaterThan(1_700_000_000);
  });

  it('prefere PUBLIC_URL, sem barra final', () => {
    const app = createWorkerApp({ SEAL_KEY: KEY, PUBLIC_URL: 'https://canvas.dev/' }, 'https://x');
    expect(app.settings.issuer).toBe('https://canvas.dev');
  });
});

describe('handleWorkerFetch', () => {
  it('atende a descoberta OAuth com a origem do Worker', async () => {
    const res = await handleWorkerFetch(
      new Request('https://w.workers.dev/.well-known/oauth-authorization-server'),
      { SEAL_KEY: KEY },
    );
    expect(((await res.json()) as { token_endpoint: string }).token_endpoint).toBe(
      'https://w.workers.dev/token',
    );
  });

  it('responde 500 explicando a configuração que falta', async () => {
    const res = await handleWorkerFetch(new Request('https://w.workers.dev/'), {});
    expect(res.status).toBe(500);
    expect(await res.text()).toContain('SEAL_KEY');
  });
});
