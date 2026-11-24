import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearSpotifyTokenCache } from './access-token.js';
import {
  authorizePath,
  Browser,
  CLIENT_SECRET,
  mcpCall,
  multiUserSpotify,
  register,
  signIn,
  submitCredentials,
  toolText,
  workerEnv,
} from './fixtures/worker-harness.js';
import { countingLimiter } from '../../../src/remote/fixtures/limiter.js';
import {
  createSpotifyDeps,
  createSpotifyProvider,
  createSpotifyServer,
  handleSpotifyMcp,
  handleSpotifyWorkerFetch,
  spotifyOwnerDeps,
  handleSpotifyDefault,
  spotifySleep,
  SPOTIFY_REFRESH_TOKEN_TTL_SECONDS,
  SPOTIFY_SERVER_INFO,
} from './worker.js';

beforeEach(() => {
  clearSpotifyTokenCache();
  vi.stubGlobal('fetch', multiUserSpotify());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('routes and discovery', () => {
  it('answers ok, the public tool catalog and 404 elsewhere', async () => {
    const browser = new Browser(workerEnv());
    expect(await (await browser.fetch('/')).text()).toBe('ok');
    const catalog = (await (await browser.fetch('/tools')).json()) as {
      result: { tools: { name: string }[] };
    };
    expect(catalog.result.tools.map((t) => t.name)).toContain('preview_filter_liked');
    expect((await browser.fetch('/nothing')).status).toBe(404);
  });

  it('publishes the protected resource metadata and refuses /mcp without a token', async () => {
    const browser = new Browser(workerEnv());
    expect((await browser.fetch('/.well-known/oauth-protected-resource/mcp')).status).toBe(200);
    expect((await browser.fetch('/mcp', { method: 'POST' })).status).toBe(401);
  });

  it('refuses registering a client whose callback is not Claude’s', async () => {
    const browser = new Browser(workerEnv());
    const response = await browser.fetch('/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ redirect_uris: ['https://evil.example/cb'] }),
    });
    expect(response.status).toBe(400);
  });

  it('explains a missing secret with a 500', async () => {
    const env = workerEnv();
    const response = await handleSpotifyDefault(new Request('https://spotify.test/authorize'), {
      ...env,
      TOKEN_ENC_KEY: undefined,
      OAUTH_PROVIDER: {} as never,
    });
    expect(response.status).toBe(500);
    expect(await response.text()).toContain('TOKEN_ENC_KEY');
  });
});

describe('connecting with your own Spotify app', () => {
  it('shows the exact Redirect URI and the credential fields', async () => {
    const browser = new Browser(workerEnv());
    const page = await (await browser.fetch(authorizePath(await register(browser)))).text();
    expect(page).toContain('https://spotify.test/spotify/callback');
    expect(page).toContain('name="client_secret" type="password"');
    expect(page).toContain('developer.spotify.com/dashboard');
  });

  it('re-shows the page on invalid credentials, then accepts valid ones', async () => {
    const browser = new Browser(workerEnv());
    const page = await (await browser.fetch(authorizePath(await register(browser)))).text();
    const wrong = await submitCredentials(browser, page, { clientId: 'nope' });
    expect(wrong.status).toBe(400);
    const retry = await wrong.text();
    expect(retry).toContain('Client ID must be');
    const same = await submitCredentials(browser, page, { clientSecret: 'c'.repeat(32) });
    expect(await same.text()).toContain('cannot be the same');
    const ok = await submitCredentials(browser, retry);
    const spotify = new URL(ok.headers.get('location') ?? '');
    expect(spotify.origin).toBe('https://accounts.spotify.com');
    expect(spotify.searchParams.get('client_id')).toBe('c'.repeat(32));
    expect(spotify.toString()).not.toContain(CLIENT_SECRET);
  });

  it('cancel goes back to Claude with access_denied', async () => {
    const browser = new Browser(workerEnv());
    const page = await (await browser.fetch(authorizePath(await register(browser)))).text();
    const back = await submitCredentials(browser, page, { decision: 'deny' });
    expect(back.headers.get('location')).toContain('error=access_denied');
  });

  it('signs in, stores the account sealed and answers the tools', async () => {
    const env = workerEnv();
    const browser = new Browser(env);
    const token = await signIn(browser, 'ana');
    const list = await mcpCall(browser, token, { jsonrpc: '2.0', id: 1, method: 'tools/list' });
    const tools = (
      (await list.json()) as {
        result: { tools: { name: string; annotations: Record<string, unknown> }[] };
      }
    ).result.tools;
    expect(tools.find((t) => t.name === 'apply_plan')?.annotations).toMatchObject({
      destructiveHint: true,
    });
    expect(tools.find((t) => t.name === 'list_liked_tracks')?.annotations).toMatchObject({
      readOnlyHint: true,
    });
    const status = JSON.parse(await toolText(browser, token, ['connection_status', {}])) as Record<
      string,
      unknown
    >;
    expect(status).toMatchObject({
      spotify_user: 'ana',
      display_name: 'ANA',
      app_client_id: 'cccc…',
    });
    const raw = [
      ...(
        env.SPOTIFY_KV as unknown as { entries: Map<string, { value: string }> }
      ).entries.values(),
    ]
      .map((e) => e.value)
      .join();
    expect(raw).not.toContain(CLIENT_SECRET);
    expect(raw).not.toContain('rt-ana');
  });

  it('a refusal on Spotify returns access_denied to Claude', async () => {
    const browser = new Browser(workerEnv());
    const page = await (await browser.fetch(authorizePath(await register(browser)))).text();
    const toSpotify = await submitCredentials(browser, page);
    const state = new URL(toSpotify.headers.get('location') ?? '').searchParams.get('state') ?? '';
    const back = await browser.fetch(
      `/spotify/callback?state=${encodeURIComponent(state)}&error=access_denied`,
    );
    expect(back.headers.get('location')).toContain('error=access_denied');
  });

  it('explains an account missing from the app’s User Management (403 on /me)', async () => {
    vi.stubGlobal(
      'fetch',
      multiUserSpotify((path) => (path === '/v1/me' ? new Response('', { status: 403 }) : null)),
    );
    const browser = new Browser(workerEnv());
    const page = await (await browser.fetch(authorizePath(await register(browser)))).text();
    const toSpotify = await submitCredentials(browser, page);
    const state = new URL(toSpotify.headers.get('location') ?? '').searchParams.get('state') ?? '';
    const back = await browser.fetch(
      `/spotify/callback?state=${encodeURIComponent(state)}&code=code-x`,
    );
    expect(back.status).toBe(403);
    expect(await back.text()).toContain('User Management');
  });

  it('a forged or replayed callback state is refused', async () => {
    const browser = new Browser(workerEnv());
    const back = await browser.fetch('/spotify/callback?state=forged&code=code-x');
    expect(back.status).toBe(400);
  });
});

describe('limits and pieces', () => {
  it('limits /mcp per session and public routes per IP', async () => {
    const env = workerEnv({ RATE_LIMITER: countingLimiter(0) });
    const browser = new Browser(env);
    const token = await signIn(browser, 'ana');
    expect(
      (await mcpCall(browser, token, { jsonrpc: '2.0', id: 1, method: 'tools/list' })).status,
    ).toBe(429);
    const limited = new Browser(workerEnv({ RATE_LIMITER_PUBLIC: countingLimiter(0) }));
    expect((await limited.fetch('/')).status).toBe(429);
  });

  it('deps, provider, version and sleep', async () => {
    const deps = createSpotifyDeps(workerEnv(), 'https://o.test');
    expect(deps.settings.callBudget).toBe(40);
    expect(deps.origin).toBe('https://o.test');
    expect(createSpotifyProvider('https://o.test')).toBeTruthy();
    expect(SPOTIFY_SERVER_INFO.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(SPOTIFY_REFRESH_TOKEN_TTL_SECONDS).toBe(180 * 24 * 3600);
    await spotifySleep(1);
  });
});

describe('entry handlers', () => {
  it('createSpotifyServer, handleSpotifyMcp and handleSpotifyWorkerFetch serve directly', async () => {
    expect(createSpotifyServer({} as never)).toBeTruthy();
    const env = workerEnv();
    const ctx = {
      waitUntil: () => undefined,
      passThroughOnException: () => undefined,
      props: { owner: 'spotify_x', sid: 's' },
    } as unknown as ExecutionContext;
    function mcpRequest(): Request {
      return new Request('https://spotify.test/mcp', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json, text/event-stream',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: { name: 'connection_status', arguments: {} },
        }),
      });
    }
    expect(await (await handleSpotifyMcp(mcpRequest(), env, ctx)).text()).toContain(
      'No Spotify account is connected',
    );
    const broken = await handleSpotifyMcp(mcpRequest(), { ...env, TOKEN_ENC_KEY: 'short' }, ctx);
    expect(broken.status).toBe(500);
    expect(
      (await handleSpotifyWorkerFetch(new Request('https://spotify.test/'), env, ctx)).status,
    ).toBe(200);
  });
});

describe('spotifyOwnerDeps', () => {
  it('binds the owner, a fresh budget and the OAuth helpers', () => {
    const env = { ...workerEnv(), OAUTH_PROVIDER: {} as never };
    const deps = spotifyOwnerDeps(env, new Request('https://spotify.test/mcp'), {
      owner: 'spotify_a',
      sid: 's',
    });
    expect(deps).toMatchObject({
      owner: 'spotify_a',
      budget: { remaining: 40 },
      origin: 'https://spotify.test',
    });
    expect(deps.oauth).toBeDefined();
    expect(
      spotifyOwnerDeps(workerEnv(), new Request('https://spotify.test/mcp'), {
        owner: 'b',
        sid: 's',
      }).oauth,
    ).toBeUndefined();
  });
});
