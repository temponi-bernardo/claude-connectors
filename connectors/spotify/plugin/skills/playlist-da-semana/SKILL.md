---
name: playlist-da-semana
description: Builds a "playlist of the week" (or month) from the songs the user liked recently, optionally filtered by genre or artist and sorted, as a new private playlist after a preview. Use when the user types /playlist-da-semana or asks for a playlist with their recent likes, in any language, e.g. "cria a playlist da semana com minhas curtidas", "playlist com o que curti esse mês" or "junta as eletrônicas que curti essa semana numa playlist".
---

# Playlist of the week

Work in the user's language.

1. Work out the period: "this week" = the last 7 days, "this month" = the last 30 days, or the dates the user
   gives. Use today's date to compute `added_after` (`YYYY-MM-DD`).
2. Name: by default `Week <ISO week number> · <year>` (or `Month · <year>`), unless the user names it.
3. Call `preview_copy_liked_to_playlist` with `name`, `added_after` and any filter they asked for (`genres`,
   `artists`, `year_from`/`year_to`); `sort_by` (`added`, `artist`, `genre`...) if they want an order. While it
   answers `status: "loading"`, call it again with the same arguments.
4. Show how many songs and the sample; if there are none, say so and suggest a longer period.
5. After an explicit "yes", `apply_plan`. Share the new playlist's id (`created_playlists`) and offer to set a
   description or a cover (`update_playlist_details`, `set_playlist_cover`).

To make it a routine, the user can schedule this request weekly in Claude (scheduled tasks), e.g. every Monday
morning.
