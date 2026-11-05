import { describe, expect, it, vi } from 'vitest';
import {
  CANVAS_USER_AGENT,
  TOKEN_RENEWAL_SECONDS,
  canvasTokenApi,
  matchesVisibleToken,
  planTokenRenewal,
  renewCanvasToken,
  withCanvasUserAgent,
  canvasLoginText,
  canvasRemoteConnector,
  createTokenAuthProvider,
  readCanvasRemoteSettings,
  remoteUnauthorizedMessage,
  verifyCanvasToken,
  type CanvasRemoteSettings,
} from './remote.js';

const BASE = 'https://pucminas.instructure.com';

function settingsWith(...responses: Response[]) {
  const fetchFn = vi.fn<typeof fetch>(() =>
    Promise.resolve(responses.shift() ?? new Response('{}')),
  );
  return { baseUrl: BASE, allowWrite: true, fetchFn } satisfies CanvasRemoteSettings;
}

describe('readCanvasRemoteSettings', () => {
  it('usa o Canvas da PUC e a escrita desligada por padrão', () => {
    const settings = readCanvasRemoteSettings({});
    expect(settings.baseUrl).toBe(BASE);
    expect(settings.allowWrite).toBe(false);
  });

  it('lê endereço sem barra final e a escrita ligada', () => {
    const settings = readCanvasRemoteSettings({
      CANVAS_BASE_URL: 'https://outro.instructure.com/',
      CANVAS_ALLOW_WRITE: 'true',
    });
    expect(settings.baseUrl).toBe('https://outro.instructure.com');
    expect(settings.allowWrite).toBe(true);
  });

  it('chama o fetch global sem depender do objeto (o Workers recusa fetch com outro this)', async () => {
    const global = vi.fn<typeof fetch>(function (this: unknown) {
      if (this !== undefined && this !== globalThis) throw new TypeError('Illegal invocation');
      return Promise.resolve(new Response('ok'));
    });
    vi.stubGlobal('fetch', global);
    const settings = readCanvasRemoteSettings({});
    await expect(settings.fetchFn('https://x.dev')).resolves.toBeInstanceOf(Response);
    expect(global).toHaveBeenCalledWith('https://x.dev', {
      headers: { 'user-agent': CANVAS_USER_AGENT },
    });
    vi.unstubAllGlobals();
  });
});

describe('withCanvasUserAgent', () => {
  it('põe o User-Agent (o Canvas devolve 403 sem ele, e o fetch do Workers não manda)', () => {
    expect(withCanvasUserAgent(undefined)).toEqual({
      headers: { 'user-agent': CANVAS_USER_AGENT },
    });
  });

  it('mantém método, corpo e headers da chamada', () => {
    const init = withCanvasUserAgent({
      method: 'POST',
      body: '{}',
      headers: { Authorization: 'Bearer t' },
    });
    expect(init).toEqual({
      method: 'POST',
      body: '{}',
      headers: { authorization: 'Bearer t', 'user-agent': CANVAS_USER_AGENT },
    });
  });
});

describe('createTokenAuthProvider', () => {
  it('usa sempre o token e não renova nem abre login', async () => {
    const auth = createTokenAuthProvider('abc');
    expect(auth.current()).toEqual({ kind: 'token', token: 'abc' });
    expect(await auth.renew()).toBeNull();
    await expect(auth.connect()).rejects.toThrow(/configurações do Claude/);
    expect(() => {
      auth.disconnect();
    }).not.toThrow();
  });
});

describe('remoteUnauthorizedMessage', () => {
  it('manda gerar outro token e reconectar no Claude', () => {
    const message = remoteUnauthorizedMessage(null, BASE);
    expect(message).toContain(`${BASE}/profile/settings`);
    expect(message).toContain('reconecte');
  });
});

describe('canvasLoginText', () => {
  it('aponta a ajuda para a página de tokens do Canvas', () => {
    expect(canvasLoginText(BASE).helpUrl).toBe(`${BASE}/profile/settings`);
  });
});

describe('verifyCanvasToken', () => {
  it('aceita o token quando o Canvas devolve o usuário', async () => {
    const settings = settingsWith(new Response(JSON.stringify({ id: 1 })));
    await expect(verifyCanvasToken(settings, 'abc')).resolves.toBeUndefined();
    expect(settings.fetchFn).toHaveBeenCalledWith(`${BASE}/api/v1/users/self`, {
      headers: { Authorization: 'Bearer abc', Accept: 'application/json' },
    });
  });

  it('explica token vazio, recusado, erro do Canvas e falha de rede', async () => {
    await expect(verifyCanvasToken(settingsWith(), ' ')).rejects.toThrow('Cole o token');
    await expect(
      verifyCanvasToken(settingsWith(new Response('', { status: 401 })), 'x'),
    ).rejects.toThrow('recusou o token');
    await expect(
      verifyCanvasToken(settingsWith(new Response('', { status: 503 })), 'x'),
    ).rejects.toThrow('503');
    const offline = { ...settingsWith(), fetchFn: () => Promise.reject(new Error('rede')) };
    await expect(verifyCanvasToken(offline, 'x')).rejects.toThrow(
      'Não consegui falar com o Canvas',
    );
  });
});

describe('canvasRemoteConnector', () => {
  it('cria um servidor MCP por token e confere o token no Canvas', async () => {
    const settings = settingsWith(new Response('{}'));
    const connector = canvasRemoteConnector(settings);
    expect(connector.loginText.title).toContain('Canvas');
    await expect(connector.verifySecret('abc')).resolves.toBeUndefined();
    expect(connector.createServer('abc').isConnected()).toBe(false);
  });

  it('renova a validade do token pelo Canvas', async () => {
    const settings = settingsWith(new Response('[]'));
    await expect(canvasRemoteConnector(settings).renewSecret?.('abc')).resolves.toBeUndefined();
    expect(settings.fetchFn).toHaveBeenCalledOnce();
  });
});

const NOW = new Date('2026-11-05T12:00:00Z');
const TOKEN = '11748~segredoDoToken';
const DAY = 24 * 3600 * 1000;

function tokenInfo(expiresAt: string | null, visible = '11748~segr...') {
  return { id: 42, visible_token: visible, expires_at: expiresAt };
}

describe('matchesVisibleToken', () => {
  it('compara o começo visível do token, sem as reticências', () => {
    expect(matchesVisibleToken('11748~segr...', TOKEN)).toBe(true);
    expect(matchesVisibleToken('11748~outr...', TOKEN)).toBe(false);
    expect(matchesVisibleToken('...', TOKEN)).toBe(false);
  });
});

describe('planTokenRenewal', () => {
  const target = new Date(NOW.getTime() + TOKEN_RENEWAL_SECONDS * 1000).toISOString();

  it('estende para o limite do Canvas o token que vence antes dele', () => {
    const soon = new Date(NOW.getTime() + 10 * DAY).toISOString();
    expect(
      planTokenRenewal([tokenInfo(soon, '99999~xxxx...'), tokenInfo(soon)], TOKEN, NOW),
    ).toEqual({ id: 42, expiresAt: target });
  });

  it('não mexe em token sem validade, renovado há menos de um dia ou que não está na lista', () => {
    const fresh = new Date(NOW.getTime() + TOKEN_RENEWAL_SECONDS * 1000 - DAY / 2).toISOString();
    expect(planTokenRenewal([tokenInfo(null)], TOKEN, NOW)).toBeNull();
    expect(planTokenRenewal([tokenInfo(fresh)], TOKEN, NOW)).toBeNull();
    expect(planTokenRenewal([tokenInfo('2027-06-01T00:00:00Z')], TOKEN, NOW)).toBeNull();
    expect(planTokenRenewal([], TOKEN, NOW)).toBeNull();
  });
});

describe('canvasTokenApi', () => {
  it('chama o Canvas com o token e devolve o JSON', async () => {
    const settings = settingsWith(new Response('{"id":1}'));
    await expect(
      canvasTokenApi(settings, 'abc', { path: '/api/v1/x', method: 'PUT', body: { a: 1 } }),
    ).resolves.toEqual({ id: 1 });
    expect(settings.fetchFn).toHaveBeenCalledWith(`${BASE}/api/v1/x`, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer abc',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: '{"a":1}',
    });
  });

  it('rejeita quando o Canvas não responde 2xx', async () => {
    const settings = settingsWith(new Response('{}', { status: 400 }));
    await expect(canvasTokenApi(settings, 'abc', { path: '/api/v1/x' })).rejects.toThrow('400');
  });
});

describe('renewCanvasToken', () => {
  it('lista os tokens e estende o próprio quando está perto de vencer', async () => {
    const soon = new Date(NOW.getTime() + DAY).toISOString();
    const settings = settingsWith(
      new Response(JSON.stringify([tokenInfo(soon)])),
      new Response('{}'),
    );
    await renewCanvasToken(settings, TOKEN, NOW);
    expect(settings.fetchFn).toHaveBeenNthCalledWith(
      1,
      `${BASE}/api/v1/users/self/user_generated_tokens?per_page=100`,
      expect.objectContaining({ method: 'GET' }),
    );
    expect(settings.fetchFn).toHaveBeenNthCalledWith(
      2,
      `${BASE}/api/v1/users/self/tokens/42`,
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('não chama o PUT quando não há o que renovar', async () => {
    const settings = settingsWith(new Response(JSON.stringify([tokenInfo(null)])));
    await renewCanvasToken(settings, TOKEN, NOW);
    expect(settings.fetchFn).toHaveBeenCalledOnce();
  });
});
