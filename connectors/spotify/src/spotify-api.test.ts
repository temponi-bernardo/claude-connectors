import { beforeEach, describe, expect, it } from 'vitest';
import { clearSpotifyTokenCache } from './access-token.js';
import { fakeSpotify, testOwnerDeps, type SpotifyCallRecord } from './fixtures/fake-spotify.js';
import {
  decideRetry,
  rateLimitDecision,
  readSpotifyBody,
  retryableDecision,
  retryAfterSeconds,
  sendSpotifyAttempt,
  spotifyCall,
  spotifyRequestInit,
} from './spotify-api.js';
import { BudgetExhaustedError, SpotifyApiError } from './spotify-errors.js';

beforeEach(() => {
  clearSpotifyTokenCache();
});

/** Responses served in order for one path. */
function sequence(responses: (() => Response)[]): (call: SpotifyCallRecord) => Response {
  let i = 0;
  return () => (responses[Math.min(i++, responses.length - 1)] as () => Response)();
}

describe('retry decisions', () => {
  it('decides done, renew, wait and fail', () => {
    expect(decideRetry(new Response('{}'), 1)).toEqual({ kind: 'done' });
    expect(decideRetry(new Response('', { status: 401 }), 1)).toEqual({ kind: 'renew' });
    expect(decideRetry(new Response('', { status: 401 }), 2)).toEqual({ kind: 'fail' });
    expect(
      decideRetry(new Response('', { status: 429, headers: { 'retry-after': '2' } }), 1),
    ).toEqual({ kind: 'wait', ms: 2000 });
    expect(decideRetry(new Response('', { status: 502 }), 1)).toEqual({ kind: 'wait', ms: 500 });
    expect(decideRetry(new Response('', { status: 502 }), 3)).toEqual({ kind: 'fail' });
    expect(decideRetry(new Response('', { status: 404 }), 1)).toEqual({ kind: 'fail' });
    expect(decideRetry(new Response('', { status: 502 }), 1, 'POST')).toEqual({ kind: 'fail' });
    expect(decideRetry(new Response('', { status: 429 }), 1, 'POST')).toEqual({
      kind: 'wait',
      ms: 1000,
    });
  });

  it('fails on a Retry-After longer than the wait cap', () => {
    expect(rateLimitDecision(60)).toEqual({ kind: 'fail' });
    expect(retryableDecision(new Response('', { status: 400 }))).toEqual({ kind: 'fail' });
  });

  it('reads Retry-After seconds with a fallback of 1', () => {
    expect(retryAfterSeconds(new Response('', { headers: { 'retry-after': '3' } }))).toBe(3);
    expect(retryAfterSeconds(new Response(''))).toBe(1);
    expect(retryAfterSeconds(new Response('', { headers: { 'retry-after': 'soon' } }))).toBe(1);
  });
});

describe('spotifyCall', () => {
  it('sends the bearer token and JSON body, and parses JSON or empty bodies', async () => {
    const calls: SpotifyCallRecord[] = [];
    const deps = await testOwnerDeps(
      fakeSpotify([['PUT', /^\/v1\/me\/x$/, () => new Response(null, { status: 204 })]], calls),
    );
    expect(
      await spotifyCall(deps, { method: 'PUT', path: '/me/x', body: { a: 1 }, query: { q: 'v' } }),
    ).toBeNull();
    const api = calls.find((c) => c.url.pathname === '/v1/me/x');
    expect(api?.headers.get('authorization')).toBe('Bearer at-refresh-owner');
    expect(api?.headers.get('content-type')).toBe('application/json');
    expect(api?.url.searchParams.get('q')).toBe('v');
    expect(api?.body).toBe('{"a":1}');
  });

  it('waits for Retry-After on 429 and then succeeds', async () => {
    const route = sequence([
      () => new Response('', { status: 429, headers: { 'retry-after': '2' } }),
      () => Response.json({ ok: true }),
    ]);
    const deps = await testOwnerDeps(fakeSpotify([['GET', /\/v1\/me$/, route]]));
    expect(await spotifyCall(deps, { path: '/me' })).toEqual({ ok: true });
    expect(deps.slept).toEqual([2000]);
  });

  it('gives up on a long Retry-After with the wait in the message', async () => {
    const deps = await testOwnerDeps(
      fakeSpotify([
        [
          'GET',
          /\/v1\/me$/,
          () => new Response('', { status: 429, headers: { 'retry-after': '120' } }),
        ],
      ]),
    );
    await expect(spotifyCall(deps, { path: '/me' })).rejects.toThrow('120 seconds');
    expect(deps.slept).toEqual([]);
  });

  it('renews the token once after a 401', async () => {
    const calls: SpotifyCallRecord[] = [];
    const route = sequence([
      () => new Response('', { status: 401 }),
      () => Response.json({ ok: 1 }),
    ]);
    const deps = await testOwnerDeps(fakeSpotify([['GET', /\/v1\/me$/, route]], calls));
    expect(await spotifyCall(deps, { path: '/me' })).toEqual({ ok: 1 });
    expect(calls.filter((c) => c.url.pathname === '/api/token')).toHaveLength(2);
  });

  it('retries a 5xx and then reports Spotify as unavailable', async () => {
    const deps = await testOwnerDeps(
      fakeSpotify([['GET', /\/v1\/me$/, () => new Response('', { status: 503 })]]),
    );
    const error = await spotifyCall(deps, { path: '/me' }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(SpotifyApiError);
    expect(deps.slept).toEqual([500, 500]);
  });

  it('stops when the budget runs out', async () => {
    const deps = await testOwnerDeps(fakeSpotify([['GET', /\/v1\/me$/, () => Response.json({})]]), {
      budget: 1,
    });
    await expect(sendSpotifyAttempt(deps, { path: '/me' })).rejects.toBeInstanceOf(
      BudgetExhaustedError,
    );
  });

  it('builds a JPEG body for covers', () => {
    const init = spotifyRequestInit({ method: 'PUT', path: '/p', jpeg: '/9j/AAA' }, 't');
    expect(new Headers(init.headers).get('content-type')).toBe('image/jpeg');
    expect(init.body).toBe('/9j/AAA');
    expect(spotifyRequestInit({ path: '/g' }, 't').body).toBeUndefined();
  });

  it('readSpotifyBody returns null for empty or non-JSON bodies', async () => {
    expect(await readSpotifyBody(new Response(''))).toBeNull();
    expect(await readSpotifyBody(new Response('not json'))).toBeNull();
    expect(await readSpotifyBody(Response.json([1]))).toEqual([1]);
  });
});
