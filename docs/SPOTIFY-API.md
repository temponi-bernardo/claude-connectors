# Spotify Web API — what the connector relies on (checked 2026-11-24)

Checked only against developer.spotify.com (reference pages, changelogs, blog, policy). The newest Web API
changelog found is July 2026. ✅ confirmed · ⚠️ not confirmed (the code is defensive) · ❌ gone for
development-mode apps. The 2026 restrictions apply to **development mode**; extended-quota apps keep the old
endpoints, which is why the reference still lists them as "Deprecated".

## Platform rules

| Rule                                                                                                                 | Status                                                                 | Source                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Development mode: **up to 5 users** per app, users must be in the app's User Management list                         | ✅                                                                     | [quota modes](https://developer.spotify.com/documentation/web-api/concepts/quota-modes)                                                                                                         |
| The app owner needs **Spotify Premium** for a development-mode app to work                                           | ✅                                                                     | quota modes; [blog 2026-02-06](https://developer.spotify.com/blog/2026-02-06-update-on-developer-access-and-platform-security)                                                                  |
| New Client IDs got the rules on 2026-02-11, existing apps on 2026-03-09; up to 25 apps per developer since July 2026 | ✅                                                                     | blog 2026-02-06; [July 2026 changes](https://developer.spotify.com/documentation/web-api/references/changes/july-2026)                                                                          |
| Extended quota only for organizations with ≥ 250k MAU (since 2025-05-15)                                             | ✅                                                                     | [blog 2025-04-15](https://developer.spotify.com/blog/2025-04-15-updating-the-criteria-for-web-api-extended-access)                                                                              |
| Refresh tokens expire **6 months** after authorization; refreshing does not extend it; then `invalid_grant`          | ✅                                                                     | [refreshing tokens](https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens); [blog 2026-06-18](https://developer.spotify.com/blog/2026-06-18-refresh-token-expiration) |
| Redirect URIs: HTTPS (loopback IP only for local), no `localhost`                                                    | ✅                                                                     | [redirect URI](https://developer.spotify.com/documentation/web-api/concepts/redirect_uri)                                                                                                       |
| 429 with `Retry-After` (seconds), rolling 30-second window; `QUOTA_EXCEEDED` is a separate per-developer quota       | ✅ (⚠️ whether quota 429s carry `Retry-After`)                         | [rate limits](https://developer.spotify.com/documentation/web-api/concepts/rate-limits)                                                                                                         |
| PKCE combined with a client secret                                                                                   | ⚠️ — the connector uses the documented code flow with HTTP Basic       | [code flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)                                                                                                            |
| Token revocation endpoint                                                                                            | ⚠️ none found — `disconnect` points users to their account's apps page | —                                                                                                                                                                                               |
| Spotify content must not be used to train or be ingested into AI models                                              | ✅                                                                     | [developer policy](https://developer.spotify.com/policy)                                                                                                                                        |

## Endpoints used

| Use                    | Endpoint                                                                                                                                                      | Limit                           | Status                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------- |
| Authorize / tokens     | `GET accounts.spotify.com/authorize`, `POST accounts.spotify.com/api/token`                                                                                   | —                               | ✅                                                                                                  |
| Profile (owner id)     | `GET /me` (`account_id` added May 2026, recommended for linking; `email`, `country`, `product` removed)                                                       | —                               | ✅                                                                                                  |
| Search                 | `GET /search` (track, artist, album, playlist, show, episode, audiobook)                                                                                      | `limit` ≤ **10**, offset ≤ 1000 | ✅                                                                                                  |
| Artist                 | `GET /artists/{id}` (`popularity`, `followers` removed; `genres` deprecated, may be empty)                                                                    | one per request                 | ✅ (⚠️ genres still filled)                                                                         |
| Artist releases        | `GET /artists/{id}/albums`                                                                                                                                    | 10 used                         | ⚠️ not re-checked; failures are ignored                                                             |
| Liked Songs            | `GET /me/tracks` (`market=from_token` fills `is_playable`)                                                                                                    | 50                              | ✅                                                                                                  |
| Saved albums           | `GET /me/albums`                                                                                                                                              | 50                              | ⚠️ listing not re-checked (save/remove moved to `/me/library`)                                      |
| Save / remove / follow | `PUT` / `DELETE /me/library?uris=` (track, album, episode, show, audiobook, playlist, user)                                                                   | **40**                          | ✅                                                                                                  |
| Contains               | `GET /me/library/contains?uris=` (also artists)                                                                                                               | 40                              | ✅                                                                                                  |
| Follow artists         | `/me/library` with `spotify:artist:`                                                                                                                          | 40                              | ⚠️ not listed for PUT/DELETE; fallback `PUT`/`DELETE /me/following?type=artist` (deprecated) on 400 |
| Followed artists       | `GET /me/following?type=artist` (cursor `after`)                                                                                                              | 50                              | ✅                                                                                                  |
| My playlists           | `GET /me/playlists`                                                                                                                                           | 50                              | ✅                                                                                                  |
| Playlist               | `GET /playlists/{id}` (object field `tracks` → `items`; others' playlists: metadata only)                                                                     | —                               | ✅                                                                                                  |
| Playlist items         | `GET /playlists/{id}/items` (entry field `item`; own or collaborative only, else 403)                                                                         | 50                              | ✅                                                                                                  |
| Add items              | `POST /playlists/{id}/items` `{uris, position}`                                                                                                               | 100                             | ✅                                                                                                  |
| Remove items           | `DELETE /playlists/{id}/items` `{items: [{uri}], snapshot_id}`                                                                                                | 100                             | ✅                                                                                                  |
| Replace / reorder      | `PUT /playlists/{id}/items` `{uris}` or `{range_start, insert_before, range_length}`                                                                          | 100                             | ✅                                                                                                  |
| Create playlist        | `POST /me/playlists` (`/users/{id}/playlists` removed)                                                                                                        | —                               | ✅                                                                                                  |
| Change details         | `PUT /playlists/{id}` (name, description, public, collaborative)                                                                                              | —                               | ✅                                                                                                  |
| Cover                  | `PUT /playlists/{id}/images` (base64 JPEG ≤ 256 KB, scope `ugc-image-upload`)                                                                                 | —                               | ✅                                                                                                  |
| Top items              | `GET /me/top/{artists,tracks}` (`short_term`, `medium_term`, `long_term`)                                                                                     | 50                              | ✅                                                                                                  |
| Recently played        | `GET /me/player/recently-played`                                                                                                                              | 50                              | ✅                                                                                                  |
| Playback (Premium)     | `GET/PUT /me/player`, `/devices`, `/currently-playing`, `/play`, `/pause`, `/next`, `/previous`, `/seek`, `/repeat`, `/volume`, `/shuffle`, `GET/POST /queue` | —                               | ✅                                                                                                  |

## Gone — not used

❌ for development-mode apps: batch `GET /artists`, `/tracks`, `/albums`, `/shows`, `/episodes`, `/audiobooks`;
`/me/tracks`-style save/remove/contains; artist top tracks; new releases; browse categories and their playlists;
featured playlists; `/users/{id}` and `/users/{id}/playlists`; recommendations; related artists; audio features
and audio analysis; preview URLs; `popularity` on tracks, albums and artists; `available_markets`.
Sources: [February 2026 changes](https://developer.spotify.com/documentation/web-api/references/changes/february-2026),
[migration guide](https://developer.spotify.com/documentation/web-api/tutorials/february-2026-migration-guide),
[blog 2024-11-27](https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api),
[March 2026 changes](https://developer.spotify.com/documentation/web-api/references/changes/march-2026) (`external_ids` restored).

## Scopes requested

`user-library-read`, `user-library-modify`, `playlist-read-private`, `playlist-read-collaborative`,
`playlist-modify-public`, `playlist-modify-private`, `ugc-image-upload`, `user-follow-read`, `user-follow-modify`,
`user-top-read`, `user-read-recently-played`, `user-read-playback-state`, `user-modify-playback-state`,
`user-read-currently-playing` (`SPOTIFY_SCOPES`). No email, birthdate or account settings.

## What this means for the tools

- Filters by **popularity** are not offered (the field is gone). Genre filters are best effort.
- "Unavailable" = `is_playable: false` with `market=from_token`.
- Playlist **dedupe and sort rewrite** the playlist (replace), because removing by URI removes every copy.
- AI playlist generation does not exist in the API: `create_playlist_from_queries` lets Claude turn a description
  into searches.
