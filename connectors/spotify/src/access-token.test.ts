import { beforeEach, describe, expect, it } from 'vitest';
import { loadAccount } from './account-store.js';
import {
  clearSpotifyTokenCache,
  forgetSpotifyAccessToken,
  getSpotifyAccessToken,
  isTerminalTokenError,
  notConnectedError,
  reconnectError,
  renewSpotifyAccessToken,
  requireAccount,
  saveRotatedRefreshToken,
} from './access-token.js';
import {
  fakeSpotify,
  testOwnerDeps,
  TEST_ACCOUNT,
  type SpotifyCallRecord,
} from './fixtures/fake-spotify.js';
import { BudgetExhaustedError } from './spotify-errors.js';
import { vaultOf } from './vault.js';

beforeEach(() => {
  clearSpotifyTokenCache();
});

describe('Spotify access tokens', () => {
  it('refreshes once and then serves from memory until expiry', async () => {
    const calls: SpotifyCallRecord[] = [];
    const deps = await testOwnerDeps(fakeSpotify([], calls));
    expect(await getSpotifyAccessToken(deps)).toBe('at-refresh-owner');
    expect(await getSpotifyAccessToken(deps)).toBe('at-refresh-owner');
    expect(calls).toHaveLength(1);
    forgetSpotifyAccessToken(deps.owner);
    await getSpotifyAccessToken(deps);
    expect(calls).toHaveLength(2);
  });

  it('refreshes again after expiry and counts against the budget', async () => {
    const calls: SpotifyCallRecord[] = [];
    const deps = await testOwnerDeps(fakeSpotify([], calls), { budget: 1 });
    await getSpotifyAccessToken(deps);
    expect(deps.budget.remaining).toBe(0);
    const later = { ...deps, now: () => deps.now() + 3_600_000 };
    await expect(getSpotifyAccessToken(later)).rejects.toBeInstanceOf(BudgetExhaustedError);
  });

  it('saves a rotated refresh token', async () => {
    const rotate = fakeSpotify([
      [
        'POST',
        /\/api\/token/,
        () => Response.json({ access_token: 'x', refresh_token: 'rotated', expires_in: 3600 }),
      ],
    ]);
    const deps = await testOwnerDeps(rotate);
    await renewSpotifyAccessToken(deps);
    expect((await loadAccount(vaultOf(deps), deps.owner))?.refreshToken).toBe('rotated');
  });

  it('turns an expired refresh token (6 months) into a reconnect message', async () => {
    const expired = fakeSpotify([
      ['POST', /\/api\/token/, () => Response.json({ error: 'invalid_grant' }, { status: 400 })],
    ]);
    const deps = await testOwnerDeps(expired);
    await expect(getSpotifyAccessToken(deps)).rejects.toThrow('last 6 months');
  });

  it('keeps transient token failures as they are', async () => {
    const down = fakeSpotify([
      ['POST', /\/api\/token/, () => new Response('down', { status: 503 })],
    ]);
    const deps = await testOwnerDeps(down);
    await expect(getSpotifyAccessToken(deps)).rejects.toMatchObject({ code: 'http_503' });
  });

  it('requires a connected account', async () => {
    const deps = await testOwnerDeps(fakeSpotify([]), { account: null });
    await expect(requireAccount(deps)).rejects.toThrow('No Spotify account is connected');
    expect((await testOwnerDeps(fakeSpotify([]))).owner).toBeTruthy();
    expect(TEST_ACCOUNT.refreshToken).toBe('refresh-owner');
  });

  it('classifies terminal token errors and words the messages', () => {
    expect(isTerminalTokenError('invalid_grant')).toBe(true);
    expect(isTerminalTokenError('invalid_client')).toBe(true);
    expect(isTerminalTokenError('http_500')).toBe(false);
    expect(reconnectError('invalid_client').message).toContain('Client Secret was rotated');
    expect(notConnectedError().message).toContain('Disconnect, then Connect');
  });
});

describe('saveRotatedRefreshToken', () => {
  it('writes the new refresh token onto the latest account, and nothing without one', async () => {
    const deps = await testOwnerDeps(fakeSpotify([]));
    await saveRotatedRefreshToken(deps, 'r2');
    expect((await loadAccount(vaultOf(deps), deps.owner))?.refreshToken).toBe('r2');
    const empty = await testOwnerDeps(fakeSpotify([]), { owner: 'spotify_none', account: null });
    await saveRotatedRefreshToken(empty, 'r3');
    expect(await loadAccount(vaultOf(empty), empty.owner)).toBeNull();
  });
});
