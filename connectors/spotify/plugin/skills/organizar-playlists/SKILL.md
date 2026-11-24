---
name: organizar-playlists
description: Organizes Spotify playlists — sort, split by artist/genre/decade, merge, remove duplicates or unavailable tracks, copy filtered likes into a new playlist and find abandoned playlists — with a preview and explicit confirmation before any change. Use when the user types /organizar-playlists or asks to organize, sort, split, merge or clean their playlists, in any language, e.g. "ordena minha playlist de treino por artista", "separa minhas curtidas por gênero" or "junta essas duas playlists sem repetir".
---

# Organize playlists

Work in the user's language. Every change goes through a preview and the user's explicit "yes".

## 1. Find the playlists

Call `list_my_playlists` (with `only_mine: true` when it is about editing). Spotify only lets apps read and edit
the items of playlists the user **owns or collaborates on**; for others, offer to copy them instead.

## 2. Pick the operation

| The user wants…                           | Tool and arguments                                                                        |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| Sort a playlist                           | `preview_organize_playlists` `action: "sort"`, `source: "playlist"`, `playlist_id`, `by`  |
| Split likes or a playlist into playlists  | `action: "split"`, `by: "genre"`/`"artist"`/`"decade"`, `name` (prefix), `min_group_size` |
| Merge playlists into a new one            | `action: "merge"`, `playlist_ids` (2–10), `name`, `dedupe`                                |
| Remove repeated songs                     | `preview_dedupe` with `source: "playlist"`                                                |
| Remove unavailable tracks                 | `preview_unavailable` with `source: "playlist"`                                           |
| A playlist from likes that match a filter | `preview_copy_liked_to_playlist` (filters, `sort_by`, `max_items`)                        |
| Clear out playlists nobody touches        | `preview_stale_playlists` with `months`                                                   |
| Rename, describe, public/private, cover   | `update_playlist_details`, `set_playlist_cover` (JPEG ≤ 256 KB)                           |

Sorting, dedupe and splits never delete the source; a rewrite (sort, dedupe) is backed up first. Playlists with
local files cannot be rewritten through the API: say so and suggest a copy instead.

## 3. Preview → confirm → apply

Call the preview (repeat while `status: "loading"`), show counts and the sample (or the list of playlists it will
create), ask for a "yes", then call `apply_plan` (repeat while `status: "partial"`). Report what changed and,
when there is one, the `backup_id`.

For abandoned playlists, explain that "deleting" a playlist on Spotify is unfollowing it: the backup lets them
follow it back with `preview_restore`.
