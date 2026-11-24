/**
 * Web API paths built from ids, with each id URL-encoded (ids come from the model and must never change the
 * path). Pure.
 */

/** Path builders of the endpoints that take an id. */
export const paths = {
  playlist: (id: string): string => `/playlists/${encodeURIComponent(id)}`,
  playlistItems: (id: string): string => `/playlists/${encodeURIComponent(id)}/items`,
  playlistImages: (id: string): string => `/playlists/${encodeURIComponent(id)}/images`,
  artist: (id: string): string => `/artists/${encodeURIComponent(id)}`,
} as const;
