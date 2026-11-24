import { describe, expect, it } from 'vitest';
import {
  addedTrackOutput,
  catalogExtras,
  catalogItemOutput,
  parseAddedTrack,
  parseArtistRefs,
  parsePlaylist,
  parseTrack,
  playlistOutput,
  playlistTotal,
  releaseYear,
  textField,
  trackAlbum,
  trackOutput,
} from './catalog.js';
import { entryJson, playlistJson, trackJson } from './fixtures/fake-spotify.js';

describe('catalog parsing', () => {
  it('parses a track with artists, album, year, playability and ISRC', () => {
    const track = parseTrack(trackJson('t1', { is_playable: false }));
    expect(track).toMatchObject({
      uri: 'spotify:track:t1',
      album: 'Album t1',
      releaseDate: '1994-03-08',
      isPlayable: false,
      isrc: 'ISRCt1',
      isLocal: false,
    });
    expect(track?.artists).toEqual([{ id: 'ar-t1', name: 'Artist t1' }]);
  });

  it('parses episodes with the show name and returns null without a URI', () => {
    const episode = parseTrack({
      uri: 'spotify:episode:e',
      type: 'episode',
      name: 'Ep',
      show: { name: 'Pod' },
      release_date: '2020-01-01',
    });
    expect(episode).toMatchObject({
      album: 'Pod',
      releaseDate: '2020-01-01',
      isPlayable: null,
      isrc: null,
    });
    expect(parseTrack({ name: 'gone' })).toBeNull();
    expect(trackAlbum({})).toEqual({ album: '', date: '' });
  });

  it('parses saved and playlist entries (item or deprecated track) and local files', () => {
    expect(parseAddedTrack(entryJson(trackJson('a'), '2025-01-01'))?.addedAt).toBe('2025-01-01');
    expect(parseAddedTrack({ added_at: 'x', track: trackJson('b') })?.uri).toBe('spotify:track:b');
    expect(
      parseAddedTrack({ added_at: 'x', is_local: true, item: { uri: 'spotify:local:a:b:c:1' } })
        ?.isLocal,
    ).toBe(true);
    expect(parseAddedTrack({ added_at: 'x', item: null })).toBeNull();
    expect(parseAddedTrack(5)).toBeNull();
  });

  it('parses playlists with items.total or the deprecated tracks.total', () => {
    expect(parsePlaylist(playlistJson('p', { items: { total: 7 } }))?.total).toBe(7);
    expect(playlistTotal({ tracks: { total: 3 } })).toBe(3);
    expect(playlistTotal({})).toBe(0);
    expect(parsePlaylist({ name: 'no id' })).toBeNull();
    expect(parsePlaylist({ id: 'x' })).toMatchObject({
      uri: 'spotify:playlist:x',
      isPublic: null,
      ownerId: '',
    });
  });

  it('formats compact outputs', () => {
    const track = parseAddedTrack(entryJson(trackJson('a', { is_playable: false }), 'd'));
    if (!track) throw new Error('fixture');
    expect(trackOutput(track)).toEqual({
      uri: 'spotify:track:a',
      name: 'Song a',
      artists: 'Artist a',
      album: 'Album a',
      year: 1994,
      playable: false,
    });
    expect(addedTrackOutput(track).added_at).toBe('d');
    const playlist = parsePlaylist(playlistJson('p', { description: 'hi' }));
    if (!playlist) throw new Error('fixture');
    expect(playlistOutput(playlist, 'owner-user')).toMatchObject({ mine: true, description: 'hi' });
    expect(playlistOutput(playlist, 'someone')).toMatchObject({ mine: false });
  });

  it('formats any search result', () => {
    expect(catalogItemOutput(trackJson('a'))).toMatchObject({ uri: 'spotify:track:a', year: 1994 });
    expect(
      catalogItemOutput({ uri: 'spotify:artist:x', type: 'artist', name: 'X', genres: ['grunge'] }),
    ).toEqual({ uri: 'spotify:artist:x', name: 'X', genres: ['grunge'] });
    expect(
      catalogItemOutput({
        uri: 'spotify:album:y',
        type: 'album',
        name: 'Y',
        artists: [{ id: '1', name: 'Z' }],
        release_date: '1991',
      }),
    ).toMatchObject({ by: 'Z', released: '1991' });
    expect(catalogItemOutput(null)).toBeNull();
    expect(catalogExtras({ owner: { id: 'u' }, publisher: 'P' })).toEqual({
      owner: 'u',
      publisher: 'P',
    });
  });

  it('small helpers', () => {
    expect(releaseYear('1999-12')).toBe(1999);
    expect(releaseYear('')).toBeNull();
    expect(textField({ a: 1 }, 'a', 'f')).toBe('f');
    expect(parseArtistRefs('x')).toEqual([]);
    expect(parseArtistRefs([null, { id: 'i', name: 'n' }])).toEqual([{ id: 'i', name: 'n' }]);
  });
});
