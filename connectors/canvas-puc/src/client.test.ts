import { describe, expect, it, vi } from 'vitest';
import type { AuthProvider, CanvasAuth } from './auth.js';
import {
  collectPages,
  createCanvasClient,
  fetchPlainText,
  requestWithRenewal,
  sendCanvasRequest,
  unauthorizedError,
  unauthorizedMessage,
  type ClientDeps,
} from './client.js';

describe('unauthorizedError', () => {
  it('usa a mensagem padrão ou a injetada', () => {
    const base: ClientDeps = { baseUrl: 'b', auth: {} as AuthProvider, fetchFn: fetch };
    expect(unauthorizedError(base, null).message).toContain('não está conectado');
    expect(unauthorizedError({ ...base, describeUnauthorized: () => 'outra' }, null).message).toBe(
      'outra',
    );
  });
});

const token: CanvasAuth = { kind: 'token', token: 't' };
const fresh: CanvasAuth = { kind: 'token', token: 'novo' };

function provider(current: CanvasAuth | null, renewed: CanvasAuth | null = null): AuthProvider {
  return {
    current: () => current,
    renew: vi.fn(() => Promise.resolve(renewed)),
    connect: vi.fn(),
    disconnect: vi.fn(),
  };
}

function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), { status: 200, ...init });
}

/** fetch falso que devolve as respostas em ordem e guarda as chamadas. */
function fakeFetch(...responses: Response[]) {
  return vi.fn<(url: URL | string, init?: RequestInit) => Promise<Response>>(() =>
    Promise.resolve(responses.shift() ?? json(null)),
  );
}

function deps(
  fetchFn: ReturnType<typeof fakeFetch>,
  auth: AuthProvider = provider(token),
): ClientDeps {
  return { baseUrl: 'https://x.test', auth, fetchFn: fetchFn as unknown as typeof fetch };
}

describe('unauthorizedMessage', () => {
  it('orienta conforme a credencial', () => {
    expect(unauthorizedMessage(null, 'b')).toContain('não está conectado');
    expect(
      unauthorizedMessage(
        { kind: 'session', session: { baseUrl: 'b', savedAt: '', cookies: [] } },
        'b',
      ),
    ).toContain('sessão');
    expect(unauthorizedMessage(token, 'https://x.test')).toContain(
      'https://x.test/profile/settings',
    );
  });
});

describe('sendCanvasRequest', () => {
  it('monta URL da API, headers e corpo JSON', async () => {
    const f = fakeFetch(json({}));
    await sendCanvasRequest(
      deps(f),
      { method: 'POST', path: '/a', params: { x: 1 }, body: { b: 2 } },
      token,
    );
    const [url, init] = f.mock.calls[0]!;
    expect(String(url)).toBe('https://x.test/api/v1/a?x=1');
    expect(init).toMatchObject({
      method: 'POST',
      body: '{"b":2}',
      headers: { Authorization: 'Bearer t', 'Content-Type': 'application/json' },
    });
  });

  it('não manda corpo em GET', async () => {
    const f = fakeFetch(json({}));
    await sendCanvasRequest(deps(f), { method: 'GET', path: '/a' }, token);
    expect(f.mock.calls[0]![1]).not.toHaveProperty('body');
  });
});

describe('requestWithRenewal', () => {
  it('devolve a resposta quando dá certo de primeira', async () => {
    const auth = provider(token);
    const res = await requestWithRenewal(deps(fakeFetch(json({ ok: 1 })), auth), {
      method: 'GET',
      path: '/a',
    });
    expect(await res.json()).toEqual({ ok: 1 });
    expect(auth.renew).not.toHaveBeenCalled();
  });

  it('renova e repete em 401', async () => {
    const f = fakeFetch(json({}, { status: 401 }), json({ ok: 2 }));
    const res = await requestWithRenewal(deps(f, provider(token, fresh)), {
      method: 'GET',
      path: '/a',
    });
    expect(await res.json()).toEqual({ ok: 2 });
    expect(f.mock.calls[1]![1]).toMatchObject({ headers: { Authorization: 'Bearer novo' } });
  });

  it('renova quando não há credencial e falha se a renovação não trouxer nenhuma', async () => {
    await expect(
      requestWithRenewal(deps(fakeFetch(), provider(null)), { method: 'GET', path: '/a' }),
    ).rejects.toThrow('não está conectado');
  });

  it('falha com a mensagem de 401 se repetir 401', async () => {
    const f = fakeFetch(json({}, { status: 401 }), json({}, { status: 401 }));
    await expect(
      requestWithRenewal(deps(f, provider(token, fresh)), { method: 'GET', path: '/a' }),
    ).rejects.toThrow('token');
  });

  it('usa a mensagem de 401 injetada quando houver', async () => {
    const f = fakeFetch(json({}, { status: 401 }));
    const custom: ClientDeps = {
      ...deps(f, provider(token)),
      describeUnauthorized: () => 'reconecte',
    };
    await expect(requestWithRenewal(custom, { method: 'GET', path: '/a' })).rejects.toThrow(
      'reconecte',
    );
  });

  it('inclui status e corpo em outros erros', async () => {
    const f = fakeFetch(new Response('proibido', { status: 403 }));
    await expect(requestWithRenewal(deps(f), { method: 'GET', path: '/a' })).rejects.toThrow(
      'Canvas 403 em GET /a: proibido',
    );
  });
});

describe('collectPages', () => {
  it('segue o header Link e respeita o máximo', async () => {
    const f = fakeFetch(
      json([1, 2], { headers: { link: '<https://x.test/api/v1/a?page=2>; rel="next"' } }),
      json([3, 4], { headers: { link: '<https://x.test/api/v1/a?page=3>; rel="next"' } }),
    );
    await expect(collectPages(deps(f), { method: 'GET', path: '/a' }, 3)).resolves.toEqual([
      1, 2, 3,
    ]);
    expect(String(f.mock.calls[1]![0])).toBe('https://x.test/api/v1/a?page=2');
  });

  it('aceita resposta que não é lista', async () => {
    await expect(
      collectPages(deps(fakeFetch(json({ a: 1 }))), { method: 'GET', path: '/a' }, 10),
    ).resolves.toEqual([{ a: 1 }]);
  });
});

describe('fetchPlainText', () => {
  it('devolve o texto ou falha com o status', async () => {
    const f = fakeFetch(new Response('conteúdo'), new Response('', { status: 404 }));
    await expect(fetchPlainText(f as unknown as typeof fetch, 'https://f.test/a')).resolves.toBe(
      'conteúdo',
    );
    await expect(fetchPlainText(f as unknown as typeof fetch, 'https://f.test/a')).rejects.toThrow(
      '404',
    );
  });
});

describe('createCanvasClient', () => {
  it('expõe get, getAll com per_page, post e fetchText', async () => {
    const f = fakeFetch(json({ g: 1 }), json([1]), json({ p: 1 }), new Response('txt'));
    const client = createCanvasClient(deps(f));
    await expect(client.get('/g')).resolves.toEqual({ g: 1 });
    await expect(client.getAll('/l')).resolves.toEqual([1]);
    expect(String(f.mock.calls[1]![0])).toContain('per_page=100');
    await expect(client.post('/p', { a: 1 })).resolves.toEqual({ p: 1 });
    await expect(client.fetchText('https://f.test/x')).resolves.toBe('txt');
    expect(client.baseUrl).toBe('https://x.test');
  });
});
