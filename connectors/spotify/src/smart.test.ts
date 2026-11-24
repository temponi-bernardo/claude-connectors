import { describe, expect, it } from 'vitest';
import { parseAddedTrack, type AddedTrack } from './catalog.js';
import { entryJson, trackJson } from './fixtures/fake-spotify.js';
import {
  checkNoLocalFiles,
  createStep,
  dedupeDraft,
  filterLikedDraft,
  hasCriteria,
  likedBefore,
  likedRemoval,
  mergeDraft,
  planDraft,
  playlistBefore,
  splitDraft,
  splitGroups,
  trackSample,
  tracksToRemove,
  uniqueTrackUris,
  unavailableDraft,
} from './smart.js';
import type { SourceSnapshot } from './sources.js';

function track(id: string, artist: string, extra: Record<string, unknown> = {}): AddedTrack {
  const { added = '2024-01-01', ...rest } = extra;
  const json = trackJson(id, { artists: [{ id: `ar-${artist}`, name: artist }], ...rest });
  return parseAddedTrack(entryJson(json, String(added)))!;
}

function snap(tracks: AddedTrack[], name = 'Liked Songs'): SourceSnapshot {
  return {
    key: 'liked',
    name,
    snapshotId: '',
    startedAt: 0,
    total: tracks.length,
    nextOffset: null,
    tracks,
  };
}

const GENRES = { 'ar-Bicep': ['electronica'], 'ar-Chris Cornell': ['grunge'] };
const LIKED = [
  track('c1', 'Chris Cornell'),
  track('b1', 'Bicep'),
  track('x1', 'Someone'),
  track('x2', 'Other'),
];

describe('filter drafts', () => {
  it('keep mode: “only Chris Cornell + electronic” unlikes the rest, with a backup of what goes', () => {
    const draft = filterLikedDraft(snap(LIKED), {
      filter: { artists: ['Chris Cornell'], genres: ['electronic'] },
      mode: 'keep',
      genres: GENRES,
    });
    expect(draft.steps).toEqual([
      { kind: 'library_remove', uris: ['spotify:track:x1', 'spotify:track:x2'] },
    ]);
    expect(draft.before?.liked).toHaveLength(2);
    expect(draft.details).toMatchObject({ total: 4, to_remove: 2, to_keep: 2 });
  });

  it('remove mode unlikes the matching ones; an empty filter is refused', () => {
    const remove = tracksToRemove(LIKED, {
      filter: { artists: ['Someone'] },
      mode: 'remove',
      genres: {},
    });
    expect(remove.map((t) => t.id)).toEqual(['x1']);
    expect(() => filterLikedDraft(snap(LIKED), { filter: {}, mode: 'keep', genres: {} })).toThrow(
      'at least one criterion',
    );
    expect(hasCriteria({ artists: [] })).toBe(false);
    expect(hasCriteria({ yearFrom: 1990 })).toBe(true);
  });
});

describe('dedupe, unavailable, split and merge drafts', () => {
  const dupes = [
    track('a', 'X', { name: 'Song', added: '2020' }),
    track('b', 'X', { name: 'Song - Remastered 2011', added: '2021' }),
    track('c', 'Y'),
  ];

  it('dedupes Liked Songs by unliking extra versions', () => {
    const draft = dedupeDraft(snap(dupes), null);
    expect(draft.steps).toEqual([{ kind: 'library_remove', uris: ['spotify:track:b'] }]);
  });

  it('dedupes a playlist by rewriting it after a backup; nothing to do when clean', () => {
    const draft = dedupeDraft(snap(dupes, 'Mix'), 'pl');
    expect(draft.steps).toEqual([
      { kind: 'playlist_replace', playlistId: 'pl', uris: ['spotify:track:a', 'spotify:track:c'] },
    ]);
    expect(draft.before?.playlists?.[0]?.tracks).toHaveLength(3);
    expect(dedupeDraft(snap([track('z', 'Z')], 'Clean'), 'pl').steps).toEqual([]);
  });

  it('refuses to rewrite playlists with local files', () => {
    const local = { ...track('l', 'L'), isLocal: true };
    expect(() => {
      checkNoLocalFiles(snap([local], 'Mine'));
    }).toThrow('local file');
  });

  it('finds unavailable tracks in Liked Songs and playlists', () => {
    const tracks = [track('u', 'U', { is_playable: false }), track('p', 'P')];
    expect(unavailableDraft(snap(tracks), null).steps).toEqual([
      { kind: 'library_remove', uris: ['spotify:track:u'] },
    ]);
    expect(unavailableDraft(snap(tracks, 'Mix'), 'pl').steps).toEqual([
      { kind: 'playlist_remove', playlistId: 'pl', uris: ['spotify:track:u'] },
    ]);
  });

  it('splits by genre into playlists, merging small groups into Other', () => {
    const tracks = [
      track('b1', 'Bicep'),
      track('b2', 'Bicep'),
      track('c1', 'Chris Cornell'),
      track('n1', 'Nobody'),
    ];
    const groups = splitGroups(tracks, { key: 'genre', genres: GENRES, minSize: 2 });
    expect(groups.map((g) => g.name)).toEqual(['electronica', 'Other']);
    const draft = splitDraft(snap(tracks), {
      key: 'genre',
      genres: GENRES,
      prefix: 'Likes',
      minSize: 2,
    });
    expect(draft.steps.map((s) => (s.kind === 'playlist_create' ? s.name : ''))).toEqual([
      'Likes – electronica',
      'Likes – Other',
    ]);
  });

  it('merges sources into a new playlist, optionally without duplicates', () => {
    const a = snap([track('a', 'X', { name: 'Song' })], 'A');
    const b = snap([track('b', 'X', { name: 'Song (Deluxe Edition)' }), track('c', 'Y')], 'B');
    expect(mergeDraft([a, b], { name: 'All', dedupe: true }).details).toMatchObject({
      items: 2,
      dropped_duplicates: 1,
    });
    expect(mergeDraft([a, b], { name: 'All', dedupe: false }).details).toMatchObject({ items: 3 });
  });

  it('small builders', () => {
    expect(trackSample(Array.from({ length: 30 }, () => LIKED[0]!))).toHaveLength(20);
    expect(likedRemoval(LIKED.slice(0, 1))).toEqual({
      kind: 'library_remove',
      uris: ['spotify:track:c1'],
    });
    expect(likedBefore('l', LIKED.slice(0, 1)).liked).toHaveLength(1);
    expect(playlistBefore(snap(LIKED, 'P'), 'p', 'l').playlists?.[0]?.name).toBe('P');
    expect(uniqueTrackUris([LIKED[0]!, LIKED[0]!])).toHaveLength(1);
    expect(createStep('n'.repeat(120), 'd', [])).toMatchObject({
      kind: 'playlist_create',
      isPublic: false,
    });
    expect(planDraft('t', [], { before: null, details: {} }).title).toBe('t');
  });
});
