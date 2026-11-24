import { describe, expect, it } from 'vitest';
import {
  BudgetExhaustedError,
  forbiddenMessage,
  notFoundMessage,
  rateLimitMessage,
  spendCall,
  spotifyErrorDetail,
  spotifyHttpError,
} from './spotify-errors.js';

describe('Spotify errors', () => {
  it('spendCall takes from the budget and stops at zero', () => {
    const budget = { remaining: 1 };
    spendCall(budget);
    expect(budget.remaining).toBe(0);
    expect(() => {
      spendCall(budget);
    }).toThrow(BudgetExhaustedError);
  });

  it('reads Spotify’s error detail in both shapes', () => {
    expect(spotifyErrorDetail({ error: { message: 'm', reason: 'PREMIUM_REQUIRED' } })).toEqual({
      message: 'm',
      reason: 'PREMIUM_REQUIRED',
    });
    expect(spotifyErrorDetail({ error: 'plain' })).toEqual({ message: 'plain', reason: '' });
    expect(spotifyErrorDetail(null)).toEqual({ message: '', reason: '' });
  });

  it('explains 403 for playback (Premium) and elsewhere (ownership, allowlist, scope)', () => {
    expect(forbiddenMessage('/me/player/play', '')).toContain('Premium');
    const other = forbiddenMessage('/playlists/x/items', ': nope');
    expect(other).toContain('own or collaborate');
    expect(other).toContain('User Management');
  });

  it('explains 404 for playback (no device) and elsewhere', () => {
    expect(notFoundMessage('/me/player/pause', '')).toContain('No active Spotify device');
    expect(notFoundMessage('/artists/x', '')).toContain('Check the id');
  });

  it('explains 429 quota and rate limits', () => {
    expect(rateLimitMessage('QUOTA_EXCEEDED', 1)).toContain('quota');
    expect(rateLimitMessage('', 30)).toContain('30 seconds');
  });

  it('builds the error per status with the parsed detail', () => {
    const body = { error: { message: 'Invalid id' } };
    expect(spotifyHttpError(400, '/x', { body, retryAfter: 1 }).message).toBe(
      'Spotify rejected the request (400: Invalid id).',
    );
    expect(spotifyHttpError(401, '/x', { body: null, retryAfter: 1 }).message).toContain(
      'reconnect',
    );
    expect(spotifyHttpError(403, '/x', { body: null, retryAfter: 1 }).status).toBe(403);
    expect(spotifyHttpError(404, '/x', { body: null, retryAfter: 1 }).message).toContain('404');
    expect(spotifyHttpError(429, '/x', { body: null, retryAfter: 9 }).message).toContain(
      '9 seconds',
    );
    expect(spotifyHttpError(503, '/x', { body: null, retryAfter: 1 }).message).toContain(
      'unavailable',
    );
  });
});
