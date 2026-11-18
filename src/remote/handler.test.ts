import { randomBytes } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { describe, expect, it, vi } from 'vitest';
import {
  allowsCors,
  BROWSER_PAGE_PATHS,
  chosenGrants,
  REMOTE_ROUTES,
  createRemoteHandler,
  handleAuthorizePage,
  handleAuthorizeSubmit,
  handleMcp,
  handleRegister,
  handleToken,
  handleUpstreamCallback,
  htmlResponse,
  jsonResponse,
  loginPageFor,
  pageSecurityPolicy,
  readForm,
  readJsonBody,
  redirectToUpstream,
  redirectWithCode,
  renewSecretQuietly,
  routeRemoteRequest,
  serveMcpWithStreaming,
  streamToolQuietly,
  UPSTREAM_CALLBACK_PATH,
  withCors,
  type RemoteApp,
  type RemoteConnector,
  type SecretLogin,
  type SecretRenewal,
} from './handler.js';
import { pkceChallenge } from './oauth.js';
import { issueTokenSet } from './tokens.js';

const ISSUER = 'https://canvas.example.dev';
const CALLBACK = 'https://claude.ai/api/mcp/auth_callback';
const VERIFIER = 'test-verifier-with-entropy-0123456789';

const connector: RemoteConnector = {
  login: {
    kind: 'secret',
    text: {
      title: 'Connect',
      intro: 'Paste the token.',
      secretLabel: 'Token',
      helpUrl: 'https://example.dev/help',
      helpLabel: 'Help',
      submit: 'Connect',
    },
    verify: (secret) =>
      secret === 'good' ? Promise.resolve() : Promise.reject(new Error('Token rejected.')),
  },
  createServer: (secret) => {
    const server = new McpServer({ name: 'test', version: '1.0.0' });
    server.registerTool('whoami', { description: 'Tells the secret' }, () => ({
      content: [{ type: 'text', text: `secret=${secret}` }],
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
  const approved = await handle(form('/authorize', { pending, secret: 'good' }));
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

describe('createRemoteHandler — discovery', () => {
  it('publishes the OAuth and resource metadata', async () => {
    const handle = createRemoteHandler(makeApp());
    const as = await handle(new Request(`${ISSUER}/.well-known/oauth-authorization-server`));
    expect(((await as.json()) as { issuer: string }).issuer).toBe(ISSUER);
    const pr = await handle(new Request(`${ISSUER}/.well-known/oauth-protected-resource/mcp`));
    expect(((await pr.json()) as { resource: string }).resource).toBe(`${ISSUER}/mcp`);
    expect(pr.headers.get('access-control-allow-origin')).toBe('*');
  });

  it('answers the CORS preflight and the root, and gives 404 for the rest', async () => {
    const handle = createRemoteHandler(makeApp());
    const pre = await handle(new Request(`${ISSUER}/token`, { method: 'OPTIONS' }));
    expect(pre.status).toBe(204);
    expect((await handle(new Request(`${ISSUER}/`))).status).toBe(200);
    expect((await handle(new Request(`${ISSUER}/nothing`))).status).toBe(404);
  });
});

describe('createRemoteHandler — authorization', () => {
  it('shows the login page with the sealed request', async () => {
    const handle = createRemoteHandler(makeApp());
    const { res, html, pending } = await authorizePage(handle, await register(handle));
    expect(res.headers.get('content-type')).toContain('text/html');
    expect(html).toContain('claude.ai');
    expect(pending).not.toBe('');
  });

  it('rejects an invalid client without redirecting and a registration with a forbidden redirect', async () => {
    const handle = createRemoteHandler(makeApp());
    const { res } = await authorizePage(handle, 'fake-client');
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

  it('with a rejected secret, shows the page again with the error', async () => {
    const handle = createRemoteHandler(makeApp());
    const { pending } = await authorizePage(handle, await register(handle));
    const res = await handle(form('/authorize', { pending, secret: 'bad' }));
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('Token rejected.');
  });

  it('with an accepted secret, redirects with code and state; an expired request gives 400', async () => {
    const handle = createRemoteHandler(makeApp());
    const { pending } = await authorizePage(handle, await register(handle));
    const res = await handle(form('/authorize', { pending, secret: 'good' }));
    expect(res.status).toBe(302);
    const location = new URL(res.headers.get('location') ?? '');
    expect(`${location.origin}${location.pathname}`).toBe(CALLBACK);
    expect(location.searchParams.get('state')).toBe('st');
    expect(location.searchParams.get('code')).toBeTruthy();
    expect((await handle(form('/authorize', { pending: 'x', secret: 'good' }))).status).toBe(400);
  });

  it('/token returns an OAuth error for an invalid code', async () => {
    const handle = createRemoteHandler(makeApp());
    const res = await handle(form('/token', { grant_type: 'authorization_code', code: 'x' }));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: 'invalid_grant' });
  });
});

describe('createRemoteHandler — /mcp', () => {
  it('asks for authentication with the resource metadata address', async () => {
    const handle = createRemoteHandler(makeApp());
    const res = await handle(rpc(null, { jsonrpc: '2.0', id: 1, method: 'tools/list' }));
    expect(res.status).toBe(401);
    expect(res.headers.get('www-authenticate')).toContain(
      `resource_metadata="${ISSUER}/.well-known/oauth-protected-resource/mcp"`,
    );
  });

  it('with the access token, the tools receive the user secret', async () => {
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
        params: { name: 'whoami', arguments: {} },
      }),
    );
    expect(JSON.stringify(await call.json())).toContain('secret=good');
  });
});

/** Connector whose `streamTool` streams `big` and declines (or fails on) the rest. */
function streamingConnector(): RemoteConnector {
  return {
    ...connector,
    streamTool: (secret, call) => {
      if (call.name === 'boom') return Promise.reject(new Error('down'));
      if (call.name !== 'big') return Promise.resolve(null);
      const body = new Response(`bytes-for-${secret}`).body!;
      return Promise.resolve({ text: 'big file', mimeType: 'application/pdf', uri: 'u', body });
    },
  };
}

function toolCall(name: string): unknown {
  return { jsonrpc: '2.0', id: 9, method: 'tools/call', params: { name, arguments: {} } };
}

describe('chosenGrants', () => {
  const text = {
    title: 'T',
    intro: 'I',
    secretLabel: 'S',
    helpUrl: ISSUER,
    helpLabel: 'H',
    submit: 'Go',
  };
  const login: SecretLogin = {
    kind: 'secret',
    text: { ...text, grantOption: { name: 'write', label: 'Write' } },
    verify: () => Promise.resolve(),
  };

  it('returns the offered permission only when ticked, and never one that was not offered', () => {
    expect(chosenGrants(login, new URLSearchParams('grant=write'))).toEqual(['write']);
    expect(chosenGrants(login, new URLSearchParams(''))).toEqual([]);
    expect(chosenGrants(login, new URLSearchParams('grant=admin'))).toEqual([]);
    const noOption: SecretLogin = { ...login, text };
    expect(chosenGrants(noOption, new URLSearchParams('grant=write'))).toEqual([]);
  });
});

describe('serveMcpWithStreaming', () => {
  it('streams what the connector takes and serves the rest with the MCP server', async () => {
    const streamed = await serveMcpWithStreaming(
      streamingConnector(),
      { secret: 'good', grants: [] },
      rpc('t', toolCall('big')),
    );
    expect(JSON.stringify(await streamed.json())).toContain(btoa('bytes-for-good'));
    const other = await serveMcpWithStreaming(
      streamingConnector(),
      { secret: 'good', grants: [] },
      rpc('t', toolCall('whoami')),
    );
    expect(other.status).toBe(200);
  });
});

describe('streamToolQuietly', () => {
  it('streams the call the connector takes, with the user secret', async () => {
    const res = await streamToolQuietly(streamingConnector(), 'good', rpc('t', toolCall('big')));
    const json = (await res!.json()) as {
      id: number;
      result: { content: { resource?: { blob: string } }[] };
    };
    expect(json.id).toBe(9);
    expect(atob(json.result.content[1]?.resource?.blob ?? '')).toBe('bytes-for-good');
  });

  it('returns null when the connector declines, fails or does not stream', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    await expect(
      streamToolQuietly(streamingConnector(), 's', rpc('t', toolCall('x'))),
    ).resolves.toBeNull();
    await expect(
      streamToolQuietly(streamingConnector(), 's', rpc('t', toolCall('boom'))),
    ).resolves.toBeNull();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
    await expect(streamToolQuietly(connector, 's', rpc('t', toolCall('big')))).resolves.toBeNull();
    const list = rpc('t', { jsonrpc: '2.0', id: 1, method: 'tools/list' });
    await expect(streamToolQuietly(streamingConnector(), 's', list)).resolves.toBeNull();
  });

  it('is used by /mcp, which falls back to the MCP server for the other calls', async () => {
    const app = { ...makeApp(), connector: streamingConnector() };
    const handle = createRemoteHandler(app);
    const token = await accessToken(handle);
    const streamed = await handle(rpc(token, toolCall('big')));
    expect(JSON.stringify(await streamed.json())).toContain(btoa('bytes-for-good'));
    const normal = await handle(rpc(token, { jsonrpc: '2.0', id: 1, method: 'ping' }));
    expect(normal.status).toBe(200);
  });
});

/** `/authorize` query for a registered client, with extra or missing parameters. */
function authorizeQuery(clientId: string, changes: Record<string, string | null>): string {
  const query = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: CALLBACK,
    code_challenge: pkceChallenge(VERIFIER),
    code_challenge_method: 'S256',
  });
  for (const [name, value] of Object.entries(changes)) {
    if (value === null) query.delete(name);
    else query.set(name, value);
  }
  return `${ISSUER}/authorize?${query.toString()}`;
}

describe('Connectors Directory requirements (Canvas and every shared-handler connector)', () => {
  it('PKCE: rejects plain and a missing code_challenge without redirecting', async () => {
    const handle = createRemoteHandler(makeApp());
    const clientId = await register(handle);
    const variants = [
      { code_challenge_method: 'plain', code_challenge: VERIFIER },
      { code_challenge: null },
      { code_challenge_method: null },
    ];
    for (const changes of variants) {
      const res = await handle(new Request(authorizeQuery(clientId, changes)));
      expect(res.status).toBe(400);
      expect(res.headers.get('location')).toBeNull();
      expect(await res.text()).toContain('S256');
    }
  });

  it('discovery: 401 points to resource metadata whose resource is the server URL', async () => {
    const handle = createRemoteHandler(makeApp());
    const res = await handle(rpc(null, { jsonrpc: '2.0', id: 1, method: 'tools/list' }));
    expect(res.status).toBe(401);
    const header = res.headers.get('www-authenticate') ?? '';
    expect(header).toMatch(/^Bearer /);
    const metadataUrl = /resource_metadata="([^"]+)"/.exec(header)?.[1] ?? '';
    expect(metadataUrl.startsWith(`${ISSUER}/.well-known/oauth-protected-resource`)).toBe(true);
    const resource = (await (await handle(new Request(metadataUrl))).json()) as {
      resource: string;
      authorization_servers: string[];
    };
    expect(resource.resource).toBe(`${ISSUER}/mcp`);
    const root = await handle(new Request(`${ISSUER}/.well-known/oauth-protected-resource`));
    expect(await root.json()).toEqual(resource);
    const asUrl = `${resource.authorization_servers[0] ?? ''}/.well-known/oauth-authorization-server`;
    expect(await (await handle(new Request(asUrl))).json()).toMatchObject({
      issuer: ISSUER,
      code_challenge_methods_supported: ['S256'],
      token_endpoint_auth_methods_supported: ['none'],
    });
  });

  it('dynamic client registration accepts the claude.ai callback', async () => {
    const handle = createRemoteHandler(makeApp());
    const res = await handle(
      post('/register', JSON.stringify({ redirect_uris: [CALLBACK], client_name: 'Claude' }), {
        'content-type': 'application/json',
      }),
    );
    expect(res.status).toBe(201);
    expect(await res.json()).toMatchObject({
      redirect_uris: [CALLBACK],
      token_endpoint_auth_method: 'none',
    });
  });

  it('token endpoint takes form bodies and answers invalid_grant for dead refresh tokens', async () => {
    const app = makeApp();
    const handle = createRemoteHandler(app);
    expect(await accessToken(handle)).not.toBe('');
    const expired = issueTokenSet(
      { secret: 'good', grants: [] },
      app.settings,
      app.now() - 31 * 24 * 3600,
    );
    for (const refresh_token of ['garbage', expired.refresh_token]) {
      const res = await handle(form('/token', { grant_type: 'refresh_token', refresh_token }));
      expect(res.status).toBe(400);
      const body = (await res.json()) as { error: string; error_description: string };
      expect(body.error).toBe('invalid_grant');
      expect(body.error_description).not.toBe('');
    }
  });

  it('never accepts the access token in the query string', async () => {
    const handle = createRemoteHandler(makeApp());
    const token = await accessToken(handle);
    const res = await handle(
      new Request(`${ISSUER}/mcp?access_token=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json, text/event-stream',
        },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
      }),
    );
    expect(res.status).toBe(401);
  });

  it('OAuth errors carry a code and a description that says what to do', async () => {
    const handle = createRemoteHandler(makeApp());
    const bad = await handle(form('/token', { grant_type: 'password' }));
    expect(await bad.json()).toMatchObject({
      error: 'unsupported_grant_type',
      error_description: expect.stringContaining('authorization_code') as unknown,
    });
    const page = await handle(new Request(authorizeQuery('fake-client', {})));
    expect(await page.text()).toMatch(/register the connector/i);
  });
});

describe('router helpers', () => {
  const request = {
    clientId: 'c',
    redirectUri: 'https://claude.ai/cb?x=1',
    codeChallenge: 'd',
    state: null,
  };

  it('REMOTE_ROUTES maps each path to the function that serves it', () => {
    expect(REMOTE_ROUTES['POST /register']).toBe(handleRegister);
    expect(REMOTE_ROUTES['GET /authorize']).toBe(handleAuthorizePage);
    expect(REMOTE_ROUTES['POST /authorize']).toBe(handleAuthorizeSubmit);
    expect(REMOTE_ROUTES['POST /token']).toBe(handleToken);
    expect(REMOTE_ROUTES['POST /mcp']).toBe(handleMcp);
  });

  it('jsonResponse and htmlResponse set type and status and forbid caching', async () => {
    const json = jsonResponse({ a: 1 }, 201);
    expect(json.status).toBe(201);
    expect(json.headers.get('cache-control')).toBe('no-store');
    expect(await json.json()).toEqual({ a: 1 });
    const html = htmlResponse('<p>x</p>');
    expect(html.headers.get('content-type')).toContain('text/html');
    expect(html.headers.get('content-security-policy')).toContain("frame-ancestors 'none'");
  });

  it('readForm and readJsonBody read the body; invalid JSON becomes null', async () => {
    expect((await readForm(new Request(ISSUER, { method: 'POST', body: 'a=1' }))).get('a')).toBe(
      '1',
    );
    expect(await readJsonBody(new Request(ISSUER, { method: 'POST', body: '{"a":1}' }))).toEqual({
      a: 1,
    });
    expect(await readJsonBody(new Request(ISSUER, { method: 'POST', body: '{' }))).toBeNull();
  });

  it('redirectWithCode keeps the redirect query and omits a null state', () => {
    const location = new URL(redirectWithCode(request, 'k').headers.get('location') ?? '');
    expect(location.searchParams.get('x')).toBe('1');
    expect(location.searchParams.get('code')).toBe('k');
    expect(location.searchParams.has('state')).toBe(false);
  });

  it('loginPageFor shows the redirect host and the error', async () => {
    const html = await loginPageFor(makeApp(), request, 'ops').text();
    expect(html).toContain('claude.ai');
    expect(html).toContain('ops');
  });

  it('loginPageFor allows the redirect origin in form-action (Chrome blocks the 302 without it)', () => {
    const csp = loginPageFor(makeApp(), request, null).headers.get('content-security-policy');
    expect(csp).toContain("form-action 'self' https://claude.ai;");
  });

  it('pageSecurityPolicy only allows the server itself when there is no redirect', () => {
    expect(pageSecurityPolicy(null)).toContain("form-action 'self';");
    expect(pageSecurityPolicy('https://claude.ai')).toContain(
      "form-action 'self' https://claude.ai;",
    );
  });

  it('withCors and routeRemoteRequest allow any origin on the API routes', async () => {
    expect(withCors(new Response()).headers.get('access-control-allow-origin')).toBe('*');
    const res = await routeRemoteRequest(
      makeApp(),
      new Request(`${ISSUER}/token`, { method: 'POST' }),
    );
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
    const preflight = await routeRemoteRequest(
      makeApp(),
      new Request(`${ISSUER}/mcp`, { method: 'OPTIONS' }),
    );
    expect(preflight.headers.get('access-control-allow-origin')).toBe('*');
  });

  it('gives no CORS headers to the browser pages (login and provider return)', async () => {
    const page = await routeRemoteRequest(makeApp(), new Request(`${ISSUER}/authorize/`));
    expect(page.headers.get('access-control-allow-origin')).toBeNull();
    const preflight = await routeRemoteRequest(
      makeApp(),
      new Request(`${ISSUER}/authorize`, { method: 'OPTIONS' }),
    );
    expect(preflight.status).toBe(204);
    expect(preflight.headers.get('access-control-allow-origin')).toBeNull();
    expect(allowsCors(UPSTREAM_CALLBACK_PATH)).toBe(false);
    expect(BROWSER_PAGE_PATHS).toContain('/authorize');
  });
});

describe('handleToken — credential renewal', () => {
  function refreshApp(renewSecret: (secret: string) => Promise<SecretRenewal>) {
    const app = makeApp();
    const withRenew: RemoteApp = { ...app, connector: { ...connector, renewSecret } };
    const { refresh_token } = issueTokenSet(
      { secret: 'good', grants: [] },
      app.settings,
      app.now(),
    );
    return {
      app: withRenew,
      refresh: form('/token', { grant_type: 'refresh_token', refresh_token }),
    };
  }

  it('on refresh, asks the connector to renew the credential and returns the tokens', async () => {
    const renew = vi.fn(() => Promise.resolve<SecretRenewal>('kept'));
    const { app, refresh } = refreshApp(renew);
    const res = await handleToken(app, refresh);
    expect(res.status).toBe(200);
    expect(renew).toHaveBeenCalledWith('good');
    expect(((await res.json()) as { token_type: string }).token_type).toBe('Bearer');
  });

  it('if renewal fails, the refresh still works', async () => {
    const { app, refresh } = refreshApp(() => Promise.reject(new Error('Canvas down')));
    expect((await handleToken(app, refresh)).status).toBe(200);
  });

  it('answers invalid_grant when the service says the credential was revoked', async () => {
    const { app, refresh } = refreshApp(() => Promise.resolve('revoked'));
    const res = await handleToken(app, refresh);
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string; error_description: string };
    expect(body.error).toBe('invalid_grant');
    expect(body.error_description).toMatch(/connect/i);
  });

  it('the code exchange does not renew the credential', async () => {
    const renew = vi.fn(() => Promise.resolve<SecretRenewal>('kept'));
    const handle = createRemoteHandler({
      ...makeApp(),
      connector: { ...connector, renewSecret: renew },
    });
    await accessToken(handle);
    expect(renew).not.toHaveBeenCalled();
  });
});

describe('renewSecretQuietly', () => {
  it('ignores a connector without renewal and swallows its failure', async () => {
    await expect(renewSecretQuietly(connector, 'good')).resolves.toBe('kept');
    const failing = { ...connector, renewSecret: () => Promise.reject(new Error('x')) };
    await expect(renewSecretQuietly(failing, 'good')).resolves.toBe('kept');
    const revoked = { ...connector, renewSecret: () => Promise.resolve<SecretRenewal>('revoked') };
    await expect(renewSecretQuietly(revoked, 'good')).resolves.toBe('revoked');
  });

  it('logs the failure with the credential and emails redacted', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const fake = '999~FakeCanvasTokenForTestsOnly0000';
    const leaky = {
      ...connector,
      renewSecret: () => Promise.reject(new Error(`Bearer ${fake} refused for friend@example.dev`)),
    };
    await renewSecretQuietly(leaky, fake);
    const logged = JSON.stringify(warn.mock.calls);
    expect(logged).not.toContain(fake);
    expect(logged).not.toContain('friend@example.dev');
    warn.mockRestore();
  });
});

describe('HTML pages never show a credential', () => {
  it('redacts tokens from a login error and from a provider refusal', async () => {
    const fake = '999~FakeCanvasTokenForTestsOnly0000';
    const app = {
      ...makeApp(),
      connector: {
        ...connector,
        login: {
          ...connector.login,
          verify: () => Promise.reject(new Error(`Canvas refused ${fake}`)),
        },
      },
    } as RemoteApp;
    const handle = createRemoteHandler(app);
    const { pending } = await authorizePage(handle, await register(handle));
    const page = await handle(form('/authorize', { pending, secret: fake }));
    expect(await page.text()).not.toContain(fake);
    const upstream: RemoteApp = {
      ...makeApp(),
      connector: {
        ...upstreamConnector,
        login: {
          ...upstreamConnector.login,
          finish: () => Promise.reject(new Error(`access_token=${fake}`)),
        } as RemoteConnector['login'],
      },
    };
    const up = createRemoteHandler(upstream);
    const state = await upstreamState(up);
    const refused = await up(
      new Request(`${ISSUER}${UPSTREAM_CALLBACK_PATH}?code=x&state=${encodeURIComponent(state)}`),
    );
    expect(refused.status).toBe(403);
    expect(await refused.text()).not.toContain(fake);
  });
});

const upstreamConnector: RemoteConnector = {
  login: {
    kind: 'upstream',
    start: (state, callbackUrl) =>
      `https://idp.example/auth?state=${encodeURIComponent(state)}&cb=${encodeURIComponent(callbackUrl)}`,
    finish: (query) =>
      query.get('code') === 'ok'
        ? Promise.resolve('owner@example.dev')
        : Promise.reject(new Error('Account <b>rejected</b>.')),
  },
  createServer: connector.createServer,
  acceptsSecret: (secret) => secret === 'owner@example.dev',
};

function upstreamApp(): RemoteApp {
  return { ...makeApp(), connector: upstreamConnector };
}

async function upstreamState(handle: (r: Request) => Promise<Response>): Promise<string> {
  const res = await authorizePage(handle, await register(handle));
  expect(res.res.status).toBe(302);
  const target = new URL(res.res.headers.get('location') ?? '');
  expect(target.searchParams.get('cb')).toBe(`${ISSUER}${UPSTREAM_CALLBACK_PATH}`);
  return target.searchParams.get('state') ?? '';
}

describe('createRemoteHandler — delegated login (upstream)', () => {
  it('/authorize redirects to the provider with the sealed request and the server callback', async () => {
    const handle = createRemoteHandler(upstreamApp());
    expect(await upstreamState(handle)).not.toBe('');
  });

  it('an accepted callback returns the code to Claude and the token reaches the tools', async () => {
    const handle = createRemoteHandler(upstreamApp());
    const state = await upstreamState(handle);
    const back = await handle(
      new Request(`${ISSUER}${UPSTREAM_CALLBACK_PATH}?code=ok&state=${encodeURIComponent(state)}`),
    );
    expect(back.status).toBe(302);
    const location = new URL(back.headers.get('location') ?? '');
    expect(location.searchParams.get('state')).toBe('st');
    expect(location.searchParams.get('code')).toBeTruthy();
  });

  it('a rejected callback shows the escaped reason; an invalid state gives 400', async () => {
    const handle = createRemoteHandler(upstreamApp());
    const state = await upstreamState(handle);
    const denied = await handle(
      new Request(`${ISSUER}${UPSTREAM_CALLBACK_PATH}?code=no&state=${encodeURIComponent(state)}`),
    );
    expect(denied.status).toBe(403);
    expect(await denied.text()).toContain('&lt;b&gt;rejected');
    const bad = await handle(new Request(`${ISSUER}${UPSTREAM_CALLBACK_PATH}?code=ok&state=x`));
    expect(bad.status).toBe(400);
  });

  it('with delegated login the secret form does not exist; without it the callback does not exist', async () => {
    expect((await handleAuthorizeSubmit(upstreamApp(), form('/authorize', {}))).status).toBe(404);
    const req = new Request(`${ISSUER}${UPSTREAM_CALLBACK_PATH}`);
    expect((await handleUpstreamCallback(makeApp(), req)).status).toBe(404);
    const request = { clientId: 'c', redirectUri: CALLBACK, codeChallenge: 'd', state: null };
    expect(loginPageFor(upstreamApp(), request, null).status).toBe(404);
  });

  it('redirectToUpstream sends the browser to the provider address', () => {
    const app = upstreamApp();
    const request = { clientId: 'c', redirectUri: CALLBACK, codeChallenge: 'd', state: null };
    if (app.connector.login.kind !== 'upstream') throw new Error('expected upstream');
    const res = redirectToUpstream(app, app.connector.login, request);
    expect(res.headers.get('location')).toMatch(/^https:\/\/idp\.example\/auth\?state=/);
  });

  it('/mcp rejects with 403 a secret the connector no longer accepts', async () => {
    const app = upstreamApp();
    const revoked = issueTokenSet(
      { secret: 'former-owner@example.dev', grants: [] },
      app.settings,
      app.now(),
    ).access_token;
    const res = await handleMcp(app, rpc(revoked, { jsonrpc: '2.0', id: 1, method: 'tools/list' }));
    expect(res.status).toBe(403);
  });
});
