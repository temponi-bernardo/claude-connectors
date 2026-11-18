import { describe, expect, it, vi } from 'vitest';
import {
  CANVAS_USER_AGENT,
  DEFAULT_CANVAS_URL,
  TOKEN_RENEWAL_SECONDS,
  canvasTokenApi,
  fetchCanvasSelf,
  isCanvasTokenAlive,
  matchesVisibleToken,
  planTokenRenewal,
  renewCanvasSecret,
  renewCanvasToken,
  withCanvasUserAgent,
  CANVAS_WRITE_GRANT,
  CANVAS_WRITE_OPTION_LABEL,
  canWriteFor,
  canvasLoginText,
  canvasClientFor,
  canvasRemoteConnector,
  readCanvasRemoteSettings,
  streamCanvasTool,
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
  it('uses the PUC Canvas and writing off by default', () => {
    const settings = readCanvasRemoteSettings({});
    expect(settings.baseUrl).toBe(BASE);
    expect(DEFAULT_CANVAS_URL).toBe(BASE);
    expect(settings.allowWrite).toBe(false);
  });

  it('reads the address without a trailing slash and writing on', () => {
    const settings = readCanvasRemoteSettings({
      CANVAS_BASE_URL: 'https://other.instructure.com/',
      CANVAS_ALLOW_WRITE: 'true',
    });
    expect(settings.baseUrl).toBe('https://other.instructure.com');
    expect(settings.allowWrite).toBe(true);
  });

  it('calls the global fetch without depending on the object (Workers refuses fetch with another this)', async () => {
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
  it('sets the User-Agent (Canvas answers 403 without it, and the Workers fetch does not send one)', () => {
    expect(withCanvasUserAgent(undefined)).toEqual({
      headers: { 'user-agent': CANVAS_USER_AGENT },
    });
  });

  it('keeps the method, body and headers of the call', () => {
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

describe('canvasLoginText', () => {
  it('points the help link to the Canvas tokens page', () => {
    expect(canvasLoginText(BASE, false).helpUrl).toBe(`${BASE}/profile/settings`);
  });

  it('offers the unticked write opt-in only when the server allows writing', () => {
    expect(canvasLoginText(BASE, false).grantOption).toBeUndefined();
    expect(canvasLoginText(BASE, true).grantOption).toEqual({
      name: CANVAS_WRITE_GRANT,
      label: CANVAS_WRITE_OPTION_LABEL,
    });
  });
});

describe('canWriteFor', () => {
  it('allows writing only with the server flag AND the user opt-in', () => {
    const on = settingsWith();
    const off = { ...on, allowWrite: false };
    expect(canWriteFor(on, [CANVAS_WRITE_GRANT])).toBe(true);
    expect(canWriteFor(on, [])).toBe(false);
    expect(canWriteFor(off, [CANVAS_WRITE_GRANT])).toBe(false);
  });
});

describe('verifyCanvasToken', () => {
  it('accepts the token when Canvas returns the user', async () => {
    const settings = settingsWith(new Response(JSON.stringify({ id: 1 })));
    await expect(verifyCanvasToken(settings, 'abc')).resolves.toBeUndefined();
    expect(settings.fetchFn).toHaveBeenCalledWith(`${BASE}/api/v1/users/self`, {
      headers: { Authorization: 'Bearer abc', Accept: 'application/json' },
    });
  });

  it('explains an empty token, a refused token, a Canvas error and a network failure', async () => {
    await expect(verifyCanvasToken(settingsWith(), ' ')).rejects.toThrow('Paste the Canvas');
    await expect(
      verifyCanvasToken(settingsWith(new Response('', { status: 401 })), 'x'),
    ).rejects.toThrow('refused the token');
    await expect(
      verifyCanvasToken(settingsWith(new Response('', { status: 503 })), 'x'),
    ).rejects.toThrow('503');
    const offline = { ...settingsWith(), fetchFn: () => Promise.reject(new Error('network')) };
    await expect(verifyCanvasToken(offline, 'x')).rejects.toThrow('Could not reach Canvas');
  });
});

describe('canvasRemoteConnector', () => {
  it('creates one MCP server per token and checks the token on Canvas', async () => {
    const settings = settingsWith(new Response('{}'));
    const connector = canvasRemoteConnector(settings);
    expect(connector.login.kind === 'secret' && connector.login.text.title).toContain('Canvas');
    await expect(
      connector.login.kind === 'secret' && connector.login.verify('abc'),
    ).resolves.toBeUndefined();
    expect(connector.createServer('abc', []).isConnected()).toBe(false);
  });

  it("renews the token's expiry through Canvas", async () => {
    const settings = settingsWith(new Response('{}'), new Response('[]'));
    await expect(canvasRemoteConnector(settings).renewSecret?.('abc')).resolves.toBe('kept');
    expect(settings.fetchFn).toHaveBeenCalledTimes(2);
  });
});

describe('canvasClientFor', () => {
  it('calls the server Canvas with the user token', async () => {
    const settings = settingsWith(new Response('{"id":1}'));
    await expect(canvasClientFor(settings, 'tok').get('/users/self')).resolves.toEqual({ id: 1 });
    const [url, init] = settings.fetchFn.mock.calls[0]!;
    expect((url as URL).href).toBe(`${BASE}/api/v1/users/self`);
    expect(new Headers(init?.headers).get('authorization')).toBe('Bearer tok');
  });
});

describe('streamCanvasTool', () => {
  const file = {
    display_name: 'a.pdf',
    url: `${BASE}/files/1/download`,
    'content-type': 'application/pdf',
    size: 3,
  };

  it('streams download_file and leaves every other tool to the MCP server', async () => {
    const settings = settingsWith(new Response(JSON.stringify(file)), new Response('pdf'));
    const client = canvasClientFor(settings, 'tok');
    const call = { id: 1, name: 'download_file', args: { file_id: 1 } };
    const content = await streamCanvasTool(client, call);
    expect((settings.fetchFn.mock.calls[0]![0] as URL).href).toBe(`${BASE}/api/v1/files/1`);
    await expect(new Response(content!.body).text()).resolves.toBe('pdf');
    await expect(streamCanvasTool(client, { ...call, name: 'list_files' })).resolves.toBeNull();
    await expect(streamCanvasTool(client, { ...call, args: {} })).rejects.toThrow();
    await expect(
      streamCanvasTool(client, { ...call, args: { file_id: 1, length: 9 * 1024 * 1024 } }),
    ).rejects.toThrow();
  });

  it('passes offset and length to the part it streams', async () => {
    const big = { ...file, size: 10 };
    const settings = settingsWith(new Response(JSON.stringify(big)), new Response('0123456789'));
    const call = { id: 1, name: 'download_file', args: { file_id: 1, offset: 4, length: 3 } };
    const content = await streamCanvasTool(canvasClientFor(settings, 'tok'), call);
    expect(new Headers(settings.fetchFn.mock.calls[1]![1]?.headers).get('range')).toBe('bytes=4-6');
    await expect(new Response(content!.body).text()).resolves.toBe('456');
  });

  it('streams a hidden file from a Canvas link, through the course endpoint', async () => {
    const settings = settingsWith(new Response(JSON.stringify(file)), new Response('pdf'));
    const args = { url: `${BASE}/courses/7/files/1?verifier=v&wrap=1` };
    const content = await streamCanvasTool(canvasClientFor(settings, 'tok'), {
      id: 1,
      name: 'download_file',
      args,
    });
    expect((settings.fetchFn.mock.calls[0]![0] as URL).href).toBe(
      `${BASE}/api/v1/courses/7/files/1`,
    );
    await expect(new Response(content!.body).text()).resolves.toBe('pdf');
  });

  it('is the connector streamTool', async () => {
    const settings = settingsWith(new Response(JSON.stringify(file)), new Response('pdf'));
    const call = { id: 1, name: 'download_file', args: { file_id: '1' } };
    const content = await canvasRemoteConnector(settings).streamTool?.('tok', call);
    expect(content?.mimeType).toBe('application/pdf');
  });
});

const NOW = new Date('2026-11-05T12:00:00Z');
const TOKEN = '11748~secretTokenValue';
const DAY = 24 * 3600 * 1000;

function tokenInfo(expiresAt: string | null, visible = '11748~secr...') {
  return { id: 42, visible_token: visible, expires_at: expiresAt };
}

describe('matchesVisibleToken', () => {
  it('compares the visible start of the token, without the ellipsis', () => {
    expect(matchesVisibleToken('11748~secr...', TOKEN)).toBe(true);
    expect(matchesVisibleToken('11748~othe...', TOKEN)).toBe(false);
    expect(matchesVisibleToken('...', TOKEN)).toBe(false);
  });
});

describe('planTokenRenewal', () => {
  const target = new Date(NOW.getTime() + TOKEN_RENEWAL_SECONDS * 1000).toISOString();

  it('extends a token that expires before the Canvas limit up to that limit', () => {
    const soon = new Date(NOW.getTime() + 10 * DAY).toISOString();
    expect(
      planTokenRenewal([tokenInfo(soon, '99999~xxxx...'), tokenInfo(soon)], TOKEN, NOW),
    ).toEqual({ id: 42, expiresAt: target });
  });

  it('leaves alone a token without expiry, renewed less than a day ago or not in the list', () => {
    const fresh = new Date(NOW.getTime() + TOKEN_RENEWAL_SECONDS * 1000 - DAY / 2).toISOString();
    expect(planTokenRenewal([tokenInfo(null)], TOKEN, NOW)).toBeNull();
    expect(planTokenRenewal([tokenInfo(fresh)], TOKEN, NOW)).toBeNull();
    expect(planTokenRenewal([tokenInfo('2027-06-01T00:00:00Z')], TOKEN, NOW)).toBeNull();
    expect(planTokenRenewal([], TOKEN, NOW)).toBeNull();
  });
});

describe('canvasTokenApi', () => {
  it('calls Canvas with the token and returns the JSON', async () => {
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

  it('rejects when Canvas does not answer 2xx', async () => {
    const settings = settingsWith(new Response('{}', { status: 400 }));
    await expect(canvasTokenApi(settings, 'abc', { path: '/api/v1/x' })).rejects.toThrow('400');
  });
});

describe('renewCanvasToken', () => {
  it('lists the tokens and extends its own when it is close to expiring', async () => {
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

  it('does not call the PUT when there is nothing to renew', async () => {
    const settings = settingsWith(new Response(JSON.stringify([tokenInfo(null)])));
    await renewCanvasToken(settings, TOKEN, NOW);
    expect(settings.fetchFn).toHaveBeenCalledOnce();
  });
});

describe('fetchCanvasSelf', () => {
  it('asks /users/self with the token', async () => {
    const settings = settingsWith(new Response('{"id":1}'));
    expect((await fetchCanvasSelf(settings, TOKEN)).status).toBe(200);
    expect(settings.fetchFn).toHaveBeenCalledWith(`${BASE}/api/v1/users/self`, {
      headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json' },
    });
  });
});

describe('isCanvasTokenAlive', () => {
  it('is false only when Canvas answers 401 (revoked or expired token)', async () => {
    expect(await isCanvasTokenAlive(settingsWith(new Response('', { status: 401 })), TOKEN)).toBe(
      false,
    );
    expect(await isCanvasTokenAlive(settingsWith(new Response('{}')), TOKEN)).toBe(true);
    expect(await isCanvasTokenAlive(settingsWith(new Response('', { status: 503 })), TOKEN)).toBe(
      true,
    );
  });

  it('counts a network failure as alive (the refresh must not fail because Canvas is down)', async () => {
    const settings = {
      baseUrl: BASE,
      allowWrite: false,
      fetchFn: vi.fn<typeof fetch>(() => Promise.reject(new TypeError('offline'))),
    };
    expect(await isCanvasTokenAlive(settings, TOKEN)).toBe(true);
  });
});

describe('renewCanvasSecret', () => {
  it('answers revoked without renewing when Canvas refuses the token', async () => {
    const settings = settingsWith(new Response('', { status: 401 }));
    expect(await renewCanvasSecret(settings, TOKEN, NOW)).toBe('revoked');
    expect(settings.fetchFn).toHaveBeenCalledOnce();
  });

  it('renews a live token and answers kept', async () => {
    const settings = settingsWith(
      new Response('{}'),
      new Response(JSON.stringify([tokenInfo(null)])),
    );
    expect(await renewCanvasSecret(settings, TOKEN, NOW)).toBe('kept');
    expect(settings.fetchFn).toHaveBeenCalledTimes(2);
  });
});
