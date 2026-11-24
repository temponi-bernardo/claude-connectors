# Spotify connector — use-case brainstorm

Ideas collected before closing the scope of F5.1 ([ADR 0034](adr/0034-spotify-with-each-users-own-app.md)).
"Built" means a tool or skill exists; "Later" means feasible but left out; "Not possible" means the 2026 API does
not support it ([SPOTIFY-API.md](SPOTIFY-API.md)).

## Library organization

| Idea                                                                             | Status       | How                                                                      |
| -------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------ |
| Keep only some artists/genres in Liked Songs ("only Chris Cornell + electronic") | Built        | `preview_filter_liked` mode keep → `apply_plan`; `/limpar-curtidas`      |
| Unlike by era or by when it was liked ("likes from before 2018")                 | Built        | `year_from`/`year_to`, `added_before`                                    |
| Remove the same song liked in several versions (remaster, deluxe, single)        | Built        | `preview_dedupe`                                                         |
| Find tracks removed from the catalog or region-locked                            | Built        | `preview_unavailable`                                                    |
| Bulk like/unlike or follow/unfollow from a list                                  | Built        | `preview_library_change`                                                 |
| Clean up own playlists nobody touched in N months                                | Built        | `preview_stale_playlists`                                                |
| Back up and restore before/after experiments                                     | Built        | automatic backups, `create_backup`, `preview_restore`; `/backup-spotify` |
| Filter by popularity ("remove the mainstream")                                   | Not possible | `popularity` removed                                                     |

## Playlists

| Idea                                                                | Status       | How                                                                  |
| ------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| Sort a playlist by artist, year, decade, genre, album or date added | Built        | `preview_organize_playlists` sort                                    |
| Split likes into genre/decade/artist playlists                      | Built        | `preview_organize_playlists` split                                   |
| Merge playlists without repeats                                     | Built        | `preview_organize_playlists` merge                                   |
| Playlist from a description ("90s Seattle grunge for running")      | Built        | `create_playlist_from_queries` (Claude writes the searches)          |
| Cover image from a picture the user gives                           | Built        | `set_playlist_cover`                                                 |
| Sort by energy/BPM/key for a DJ set                                 | Not possible | audio features removed                                               |
| Copy someone else's playlist and edit it                            | Later        | items of others' playlists are not readable anymore; only via search |

## Discovery and routines

| Idea                                                  | Status         | How                                                                                                    |
| ----------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------ |
| "Playlist of the week" from recent likes              | Built          | `preview_copy_liked_to_playlist` + `added_after`; `/playlist-da-semana`; can be a scheduled task       |
| What am I into lately (top artists/tracks per period) | Built          | `top_items`                                                                                            |
| New releases of my top or followed artists            | Built (manual) | `get_artist` with `include_releases`, looping over `top_items`/`list_followed_artists`                 |
| "Similar artists" / recommendations                   | Not possible   | related artists and recommendations removed                                                            |
| Monthly listening recap                               | Later          | `recently_played` keeps little history; a scheduled task could store it (needs a design for retention) |

## Electronic music producer

| Idea                                                                  | Status       | How                                                                       |
| --------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------- |
| Reference playlist per project (tracks to A/B against)                | Built        | `create_playlist`, `add_playlist_items`, `reorder_playlist_items`         |
| Crate digging: likes by sub-genre (house, techno, DnB) into playlists | Built        | split by genre with genre terms; best effort while `genres` is deprecated |
| Track releases of labels                                              | Later        | search supports `label:` queries in albums; needs a skill                 |
| Key/BPM-aware ordering                                                | Not possible | audio features removed                                                    |

## Playback

Premium only: state, devices, play/pause, skip, seek, volume, shuffle, repeat, queue and transfer are built for
parity with the official connector; "play my new weekly playlist on the speaker" combines them.
