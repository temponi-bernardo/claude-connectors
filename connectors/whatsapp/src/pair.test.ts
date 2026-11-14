import { randomBytes } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { sealPayload } from '../../../src/remote/seal.js';
import { fakeBridge, READY_STATUS } from './fixtures/fakes.js';
import {
  pairCookie,
  fetchPairStatus,
  handlePairCallback,
  handlePairPost,
  isPairPath,
  isTrustedPost,
  isValidPairLogin,
  issuePairCsrf,
  openPairSession,
  PAIR_ACTIONS,
  PAIR_CALLBACK_PATH,
  PAIR_NONCE_COOKIE,
  PAIR_SESSION_COOKIE,
  pairActionError,
  pairDeadline,
  pairPage,
  parseCookies,
  readPairSession,
  redirectWithCookies,
  routePairPost,
  routePairRequest,
  startPairLogin,
  type PairApp,
} from './pair.js';

const ISSUER = 'https://wa.exemplo.dev';
const OWNER = 'dono@exemplo.dev';

type Routes = Parameters<typeof fakeBridge>[0];

function githubFetch(email: string): typeof fetch {
  return vi.fn((input: string) => {
    if (input.includes('access_token'))
      return Promise.resolve(Response.json({ access_token: 't' }));
    return Promise.resolve(Response.json([{ email, verified: true }]));
  }) as typeof fetch;
}

function makeApp(routes: Routes = {}, email = OWNER): PairApp {
  return {
    settings: { issuer: ISSUER, key: randomBytes(32), redirectHosts: ['claude.ai'] },
    github: {
      clientId: 'c',
      clientSecret: 's',
      allowedEmails: [OWNER],
      fetchFn: githubFetch(email),
    },
    bridge: fakeBridge({ '/status': () => Response.json(READY_STATUS), ...routes }),
    now: () => 1_000_000,
    timeoutMs: 5_000,
  };
}

function sessionCookie(app: PairApp, email = OWNER): string {
  const session = sealPayload({ typ: 'pair_session', exp: 2_000_000, email }, app.settings.key);
  return `${PAIR_SESSION_COOKIE}=${session}`;
}

function post(
  app: PairApp,
  path: string,
  extra: { fields?: Record<string, string>; origin?: string } = {},
): Request {
  const { fields = {}, origin = ISSUER } = extra;
  return new Request(`${ISSUER}${path}`, {
    method: 'POST',
    body: new URLSearchParams({ csrf: issuePairCsrf(app, OWNER), ...fields }).toString(),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      cookie: sessionCookie(app),
      origin,
    },
  });
}

describe('cookies', () => {
  it('lê cookies com = no valor e ignora lixo', () => {
    expect(parseCookies('a=1; b=x=y; ruim; =z')).toEqual({ a: '1', b: 'x=y' });
    expect(parseCookies(null)).toEqual({});
  });

  it('monta Set-Cookie seguro e redireciona com vários cookies', () => {
    expect(pairCookie('n', 'v', 60)).toBe(
      'n=v; Path=/; Max-Age=60; HttpOnly; Secure; SameSite=Lax',
    );
    const res = redirectWithCookies('/pair', ['a=1', 'b=2']);
    expect(res.status).toBe(302);
    expect(res.headers.getSetCookie()).toEqual(['a=1', 'b=2']);
  });
});

function request(cookie: string): Request {
  return new Request(ISSUER, { headers: { cookie } });
}

function from(origin: string): Request {
  return new Request(ISSUER, { headers: { origin } });
}

describe('sessão e CSRF', () => {
  it('aceita a sessão do dono e recusa quem saiu da lista ou sem cookie', () => {
    const app = makeApp();
    expect(readPairSession(app, request(sessionCookie(app)))).toBe(OWNER);
    expect(readPairSession(app, request(sessionCookie(app, 'ex@exemplo.dev')))).toBeNull();
    expect(readPairSession(app, new Request(ISSUER))).toBeNull();
  });

  it('exige token do mesmo e-mail e a origem do servidor', () => {
    const app = makeApp();
    const csrf = issuePairCsrf(app, OWNER);
    expect(isTrustedPost(app, from(ISSUER), { csrf, email: OWNER })).toBe(true);
    expect(isTrustedPost(app, from('https://evil.dev'), { csrf, email: OWNER })).toBe(false);
    expect(isTrustedPost(app, from(ISSUER), { csrf, email: 'outro@x.y' })).toBe(false);
    expect(isTrustedPost(app, from(ISSUER), { csrf: 'x', email: OWNER })).toBe(false);
  });
});

describe('login do /pair', () => {
  it('manda ao GitHub com retorno do /pair e cookie de nonce', () => {
    const res = startPairLogin(makeApp());
    const target = new URL(res.headers.get('location') ?? '');
    expect(target.host).toBe('github.com');
    expect(target.searchParams.get('redirect_uri')).toBe(`${ISSUER}${PAIR_CALLBACK_PATH}`);
    expect(res.headers.getSetCookie()[0]).toContain(`${PAIR_NONCE_COOKIE}=`);
  });

  function callbackRequest(app: PairApp, nonce: string, cookieNonce = nonce): Request {
    const state = sealPayload({ typ: 'pair_login', exp: 2_000_000, nonce }, app.settings.key);
    const url = `${ISSUER}${PAIR_CALLBACK_PATH}?code=c&state=${encodeURIComponent(state)}`;
    return new Request(url, { headers: { cookie: `${PAIR_NONCE_COOKIE}=${cookieNonce}` } });
  }

  it('confere state e nonce do mesmo navegador', () => {
    const app = makeApp();
    expect(isValidPairLogin(app, callbackRequest(app, 'n1'))).toBe(true);
    expect(isValidPairLogin(app, callbackRequest(app, 'n1', 'n2'))).toBe(false);
    expect(isValidPairLogin(app, new Request(`${ISSUER}${PAIR_CALLBACK_PATH}`))).toBe(false);
  });

  it('abre a sessão para o dono e recusa outra conta ou login inválido', async () => {
    const app = makeApp();
    const ok = await handlePairCallback(app, callbackRequest(app, 'n1'));
    expect(ok.headers.get('location')).toBe('/pair');
    expect(ok.headers.getSetCookie()[0]).toContain(`${PAIR_SESSION_COOKIE}=`);
    const stranger = makeApp({}, 'x@y.z');
    expect((await handlePairCallback(stranger, callbackRequest(stranger, 'n'))).status).toBe(403);
    expect((await handlePairCallback(app, callbackRequest(app, 'a', 'b'))).status).toBe(400);
  });

  it('openPairSession apaga o nonce', () => {
    const cookies = openPairSession(makeApp(), OWNER).headers.getSetCookie();
    expect(cookies[1]).toBe(pairCookie(PAIR_NONCE_COOKIE, '', 0));
  });
});

describe('página e ações', () => {
  it('pairDeadline soma o teto e fetchPairStatus vira nulo se a ponte falhar', async () => {
    const app = makeApp({ '/status': () => new Response('', { status: 500 }) });
    expect(pairDeadline(app)).toBeGreaterThan(Date.now());
    expect(await fetchPairStatus(app)).toBeNull();
  });

  it('pairPage mostra o status com CSP que libera só imagens data:', async () => {
    const res = await pairPage(makeApp(), OWNER, { message: 'ok' });
    expect(res.headers.get('content-security-policy')).toContain('img-src data:');
    expect(await res.text()).toContain('Conectado');
  });

  it('gera código só com número válido', async () => {
    const app = makeApp({ '/pair/code': () => Response.json({ code: 'ABCD-EFGH' }) });
    const code = PAIR_ACTIONS['/pair/code'];
    if (!code) throw new Error('ação ausente');
    expect(await code(app, new URLSearchParams({ phone: '+55 31 99999-9999' }))).toEqual({
      code: 'ABCD-EFGH',
    });
    expect(await code(app, new URLSearchParams({ phone: '12' }))).toMatchObject({
      error: expect.stringContaining('inválido') as unknown,
    });
  });

  it('QR, desvincular e recomeçar (este pede APAGAR)', async () => {
    const app = makeApp({
      '/pair/qr': () => Response.json({ png_base64: 'iVBOR' }),
      '/logout': () => Response.json({ logged_out: true }),
      '/__reset': () => Response.json({ reset: true }),
    });
    const form = new URLSearchParams();
    expect(await PAIR_ACTIONS['/pair/qr']?.(app, form)).toEqual({ qrPng: 'iVBOR' });
    expect(await PAIR_ACTIONS['/pair/logout']?.(app, form)).toHaveProperty('message');
    expect(await PAIR_ACTIONS['/pair/reset']?.(app, form)).toHaveProperty('error');
    const confirm = new URLSearchParams({ confirm: 'APAGAR' });
    expect(await PAIR_ACTIONS['/pair/reset']?.(app, confirm)).toHaveProperty('message');
  });

  it('handlePairPost recusa sem CSRF, sai, executa ação e mostra erro da ponte', async () => {
    const app = makeApp({ '/pair/qr': () => Response.json({ error: 'x' }, { status: 409 }) });
    expect(
      (await handlePairPost(app, post(app, '/pair/qr', { origin: 'https://evil' }), OWNER)).status,
    ).toBe(403);
    const out = await handlePairPost(app, post(app, '/pair/signout'), OWNER);
    expect(out.headers.getSetCookie()[0]).toContain('Max-Age=0');
    expect((await handlePairPost(app, post(app, '/pair/nada'), OWNER)).status).toBe(404);
    const failed = await handlePairPost(app, post(app, '/pair/qr'), OWNER);
    expect(await failed.text()).toContain('role="alert"');
  });
});

describe('roteamento do /pair', () => {
  it('reconhece só os caminhos do /pair', () => {
    expect(['/pair', '/pair/code', PAIR_CALLBACK_PATH].every(isPairPath)).toBe(true);
    expect(isPairPath('/pairing')).toBe(false);
    expect(isPairPath('/mcp')).toBe(false);
  });

  it('sem sessão: GET vai ao login e POST volta ao /pair', async () => {
    const app = makeApp();
    const get = await routePairRequest(app, new Request(`${ISSUER}/pair/`));
    expect(get?.headers.get('location')).toContain('github.com');
    const postNoSession = await routePairPost(app, new Request(`${ISSUER}/pair/qr`), null);
    expect(postNoSession.headers.get('location')).toBe('/pair');
  });

  it('com sessão: mostra a página, aceita POST e recusa outros métodos', async () => {
    const app = makeApp({
      '/pair/qr': () => Response.json({ png_base64: 'iVBOR' }),
      '/status': () => Response.json({ ...READY_STATUS, needs_pairing: true }),
    });
    const page = await routePairRequest(
      app,
      new Request(`${ISSUER}/pair`, { headers: { cookie: sessionCookie(app) } }),
    );
    expect(page?.status).toBe(200);
    const qr = await routePairRequest(app, post(app, '/pair/qr'));
    expect(await qr?.text()).toContain('iVBOR');
    const put = await routePairRequest(app, new Request(`${ISSUER}/pair/x`, { method: 'PUT' }));
    expect(put?.status).toBe(404);
    expect(await routePairRequest(app, new Request(`${ISSUER}/mcp`))).toBeNull();
  });

  it('atende o retorno do GitHub', async () => {
    const res = await routePairRequest(makeApp(), new Request(`${ISSUER}${PAIR_CALLBACK_PATH}`));
    expect(res?.status).toBe(400);
  });
});

describe('pairActionError', () => {
  it('transforma qualquer falha em erro da página', () => {
    expect(pairActionError(new Error('caiu'))).toEqual({ error: 'caiu' });
    expect(pairActionError('texto')).toEqual({ error: 'texto' });
  });
});
