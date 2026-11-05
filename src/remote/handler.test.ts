import { randomBytes } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { describe, expect, it, vi } from 'vitest';
import {
  REMOTE_ROUTES,
  createRemoteHandler,
  handleAuthorizePage,
  handleAuthorizeSubmit,
  handleMcp,
  handleRegister,
  handleToken,
  htmlResponse,
  jsonResponse,
  loginPageFor,
  pageSecurityPolicy,
  readForm,
  readJsonBody,
  redirectWithCode,
  renewSecretQuietly,
  routeRemoteRequest,
  withCors,
  type RemoteApp,
  type RemoteConnector,
} from './handler.js';
import { pkceChallenge } from './oauth.js';
import { issueTokenSet } from './tokens.js';

const ISSUER = 'https://canvas.exemplo.dev';
const CALLBACK = 'https://claude.ai/api/mcp/auth_callback';
const VERIFIER = 'verificador-de-teste-com-entropia-0123456789';

const connector: RemoteConnector = {
  loginText: {
    title: 'Conectar',
    intro: 'Cole o token.',
    secretLabel: 'Token',
    helpUrl: 'https://exemplo.dev/ajuda',
    helpLabel: 'Ajuda',
    submit: 'Conectar',
  },
  verifySecret: (secret) =>
    secret === 'bom' ? Promise.resolve() : Promise.reject(new Error('Token recusado.')),
  createServer: (secret) => {
    const server = new McpServer({ name: 'teste', version: '1.0.0' });
    server.registerTool('quem', { description: 'Diz o segredo' }, () => ({
      content: [{ type: 'text', text: `segredo=${secret}` }],
    }));
    return server;
  },
};

function makeApp(): RemoteApp {
  return {
    settings: { issuer: ISSUER, key: randomBytes(32), redirectHosts: ['claude.ai'] },
    connector,
    now: () => 1_000_000,
  };
}

function post(path: string, body: string, headers: Record<string, string>): Request {
  return new Request(`${ISSUER}${path}`, { method: 'POST', body, headers });
}

function form(path: string, fields: Record<string, string>): Request {
  return post(path, new URLSearchParams(fields).toString(), {
    'content-type': 'application/x-www-form-urlencoded',
  });
}

function rpc(token: string | null, body: unknown): Request {
  return post('/mcp', JSON.stringify(body), {
    'content-type': 'application/json',
    accept: 'application/json, text/event-stream',
    ...(token ? { authorization: `Bearer ${token}` } : {}),
  });
}

async function register(handle: (r: Request) => Promise<Response>): Promise<string> {
  const res = await handle(
    post('/register', JSON.stringify({ redirect_uris: [CALLBACK] }), {
      'content-type': 'application/json',
    }),
  );
  expect(res.status).toBe(201);
  return ((await res.json()) as { client_id: string }).client_id;
}

async function authorizePage(handle: (r: Request) => Promise<Response>, clientId: string) {
  const query = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: CALLBACK,
    code_challenge: pkceChallenge(VERIFIER),
    code_challenge_method: 'S256',
    state: 'st',
  });
  const res = await handle(new Request(`${ISSUER}/authorize?${query.toString()}`));
  const html = await res.text();
  return { res, html, pending: /name="pending" value="([^"]+)"/.exec(html)?.[1] ?? '' };
}

async function accessToken(handle: (r: Request) => Promise<Response>): Promise<string> {
  const clientId = await register(handle);
  const { pending } = await authorizePage(handle, clientId);
  const approved = await handle(form('/authorize', { pending, secret: 'bom' }));
  const code = new URL(approved.headers.get('location') ?? '').searchParams.get('code') ?? '';
  const tokenRes = await handle(
    form('/token', {
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      redirect_uri: CALLBACK,
      code_verifier: VERIFIER,
    }),
  );
  return ((await tokenRes.json()) as { access_token: string }).access_token;
}

describe('createRemoteHandler — descoberta', () => {
  it('publica os metadados OAuth e do recurso', async () => {
    const handle = createRemoteHandler(makeApp());
    const as = await handle(new Request(`${ISSUER}/.well-known/oauth-authorization-server`));
    expect(((await as.json()) as { issuer: string }).issuer).toBe(ISSUER);
    const pr = await handle(new Request(`${ISSUER}/.well-known/oauth-protected-resource/mcp`));
    expect(((await pr.json()) as { resource: string }).resource).toBe(`${ISSUER}/mcp`);
    expect(pr.headers.get('access-control-allow-origin')).toBe('*');
  });

  it('responde ao preflight CORS, à raiz e dá 404 no resto', async () => {
    const handle = createRemoteHandler(makeApp());
    const pre = await handle(new Request(`${ISSUER}/token`, { method: 'OPTIONS' }));
    expect(pre.status).toBe(204);
    expect((await handle(new Request(`${ISSUER}/`))).status).toBe(200);
    expect((await handle(new Request(`${ISSUER}/nada`))).status).toBe(404);
  });
});

describe('createRemoteHandler — autorização', () => {
  it('mostra a página de login com o pedido selado', async () => {
    const handle = createRemoteHandler(makeApp());
    const { res, html, pending } = await authorizePage(handle, await register(handle));
    expect(res.headers.get('content-type')).toContain('text/html');
    expect(html).toContain('claude.ai');
    expect(pending).not.toBe('');
  });

  it('recusa cliente inválido sem redirecionar e registro com retorno proibido', async () => {
    const handle = createRemoteHandler(makeApp());
    const { res } = await authorizePage(handle, 'cliente-falso');
    expect(res.status).toBe(400);
    const bad = await handle(
      post('/register', JSON.stringify({ redirect_uris: ['https://evil.com'] }), {
        'content-type': 'application/json',
      }),
    );
    expect(bad.status).toBe(400);
    const notJson = await handle(post('/register', '{', { 'content-type': 'application/json' }));
    expect(notJson.status).toBe(400);
  });

  it('com segredo recusado, mostra a página de novo com o erro', async () => {
    const handle = createRemoteHandler(makeApp());
    const { pending } = await authorizePage(handle, await register(handle));
    const res = await handle(form('/authorize', { pending, secret: 'ruim' }));
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('Token recusado.');
  });

  it('com segredo aceito, redireciona com código e state; pedido vencido dá 400', async () => {
    const handle = createRemoteHandler(makeApp());
    const { pending } = await authorizePage(handle, await register(handle));
    const res = await handle(form('/authorize', { pending, secret: 'bom' }));
    expect(res.status).toBe(302);
    const location = new URL(res.headers.get('location') ?? '');
    expect(`${location.origin}${location.pathname}`).toBe(CALLBACK);
    expect(location.searchParams.get('state')).toBe('st');
    expect(location.searchParams.get('code')).toBeTruthy();
    expect((await handle(form('/authorize', { pending: 'x', secret: 'bom' }))).status).toBe(400);
  });

  it('o /token devolve erro OAuth para código inválido', async () => {
    const handle = createRemoteHandler(makeApp());
    const res = await handle(form('/token', { grant_type: 'authorization_code', code: 'x' }));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: 'invalid_grant' });
  });
});

describe('createRemoteHandler — /mcp', () => {
  it('pede autenticação com o endereço dos metadados do recurso', async () => {
    const handle = createRemoteHandler(makeApp());
    const res = await handle(rpc(null, { jsonrpc: '2.0', id: 1, method: 'tools/list' }));
    expect(res.status).toBe(401);
    expect(res.headers.get('www-authenticate')).toContain(
      `resource_metadata="${ISSUER}/.well-known/oauth-protected-resource/mcp"`,
    );
  });

  it('com o access token, as ferramentas recebem o segredo do usuário', async () => {
    const handle = createRemoteHandler(makeApp());
    const token = await accessToken(handle);
    const init = await handle(
      rpc(token, {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2025-06-18',
          capabilities: {},
          clientInfo: { name: 't', version: '1' },
        },
      }),
    );
    expect(init.status).toBe(200);
    const call = await handle(
      rpc(token, {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: { name: 'quem', arguments: {} },
      }),
    );
    expect(JSON.stringify(await call.json())).toContain('segredo=bom');
  });
});

describe('auxiliares do roteador', () => {
  const request = {
    clientId: 'c',
    redirectUri: 'https://claude.ai/cb?x=1',
    codeChallenge: 'd',
    state: null,
  };

  it('REMOTE_ROUTES liga cada caminho à função que o atende', () => {
    expect(REMOTE_ROUTES['POST /register']).toBe(handleRegister);
    expect(REMOTE_ROUTES['GET /authorize']).toBe(handleAuthorizePage);
    expect(REMOTE_ROUTES['POST /authorize']).toBe(handleAuthorizeSubmit);
    expect(REMOTE_ROUTES['POST /token']).toBe(handleToken);
    expect(REMOTE_ROUTES['POST /mcp']).toBe(handleMcp);
  });

  it('jsonResponse e htmlResponse definem tipo, status e proíbem cache', async () => {
    const json = jsonResponse({ a: 1 }, 201);
    expect(json.status).toBe(201);
    expect(json.headers.get('cache-control')).toBe('no-store');
    expect(await json.json()).toEqual({ a: 1 });
    const html = htmlResponse('<p>x</p>');
    expect(html.headers.get('content-type')).toContain('text/html');
    expect(html.headers.get('content-security-policy')).toContain("frame-ancestors 'none'");
  });

  it('readForm e readJsonBody leem o corpo; JSON inválido vira nulo', async () => {
    expect((await readForm(new Request(ISSUER, { method: 'POST', body: 'a=1' }))).get('a')).toBe(
      '1',
    );
    expect(await readJsonBody(new Request(ISSUER, { method: 'POST', body: '{"a":1}' }))).toEqual({
      a: 1,
    });
    expect(await readJsonBody(new Request(ISSUER, { method: 'POST', body: '{' }))).toBeNull();
  });

  it('redirectWithCode mantém a query do retorno e omite state nulo', () => {
    const location = new URL(redirectWithCode(request, 'k').headers.get('location') ?? '');
    expect(location.searchParams.get('x')).toBe('1');
    expect(location.searchParams.get('code')).toBe('k');
    expect(location.searchParams.has('state')).toBe(false);
  });

  it('loginPageFor mostra o host do retorno e o erro', async () => {
    const html = await loginPageFor(makeApp(), request, 'ops').text();
    expect(html).toContain('claude.ai');
    expect(html).toContain('ops');
  });

  it('loginPageFor libera no form-action a origem do retorno (o Chrome bloqueia o 302 sem isso)', () => {
    const csp = loginPageFor(makeApp(), request, null).headers.get('content-security-policy');
    expect(csp).toContain("form-action 'self' https://claude.ai;");
  });

  it('pageSecurityPolicy só libera o próprio servidor quando não há retorno', () => {
    expect(pageSecurityPolicy(null)).toContain("form-action 'self';");
    expect(pageSecurityPolicy('https://claude.ai')).toContain(
      "form-action 'self' https://claude.ai;",
    );
  });

  it('withCors e routeRemoteRequest liberam qualquer origem', async () => {
    expect(withCors(new Response()).headers.get('access-control-allow-origin')).toBe('*');
    const res = await routeRemoteRequest(makeApp(), new Request(`${ISSUER}/authorize/`));
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
  });
});

describe('handleToken — renovação da credencial', () => {
  function refreshApp(renewSecret: (secret: string) => Promise<void>) {
    const app = makeApp();
    const withRenew: RemoteApp = { ...app, connector: { ...connector, renewSecret } };
    const { refresh_token } = issueTokenSet('bom', app.settings, app.now());
    return {
      app: withRenew,
      refresh: form('/token', { grant_type: 'refresh_token', refresh_token }),
    };
  }

  it('no refresh, pede ao conector para renovar a credencial e devolve os tokens', async () => {
    const renew = vi.fn(() => Promise.resolve());
    const { app, refresh } = refreshApp(renew);
    const res = await handleToken(app, refresh);
    expect(res.status).toBe(200);
    expect(renew).toHaveBeenCalledWith('bom');
    expect(((await res.json()) as { token_type: string }).token_type).toBe('Bearer');
  });

  it('se a renovação falha, o refresh continua valendo', async () => {
    const { app, refresh } = refreshApp(() => Promise.reject(new Error('Canvas fora')));
    expect((await handleToken(app, refresh)).status).toBe(200);
  });

  it('a troca do código não renova a credencial', async () => {
    const renew = vi.fn(() => Promise.resolve());
    const handle = createRemoteHandler({
      ...makeApp(),
      connector: { ...connector, renewSecret: renew },
    });
    await accessToken(handle);
    expect(renew).not.toHaveBeenCalled();
  });
});

describe('renewSecretQuietly', () => {
  it('ignora conector sem renovação e engole a falha dela', async () => {
    await expect(renewSecretQuietly(connector, 'bom')).resolves.toBeUndefined();
    const failing = { ...connector, renewSecret: () => Promise.reject(new Error('x')) };
    await expect(renewSecretQuietly(failing, 'bom')).resolves.toBeUndefined();
  });
});
