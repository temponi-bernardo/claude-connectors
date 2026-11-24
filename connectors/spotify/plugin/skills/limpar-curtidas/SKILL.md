---
name: limpar-curtidas
description: Cleans up Spotify Liked Songs safely — keep only what the user wants (by artist, genre, release year or date liked), remove duplicates and versions of the same song, and drop tracks no longer available — always with a preview, an automatic backup and explicit confirmation before anything changes. Use when the user types /limpar-curtidas or asks to clean, filter or tidy their liked songs, in any language, e.g. "mantenha nas curtidas só Chris Cornell e eletrônica", "descurte o que não for rock dos anos 90" or "tira as músicas repetidas das curtidas".
---

# Clean up Liked Songs

Work in the user's language. Nothing is unliked until the user approves a preview.

## 1. Understand the rule

Turn the request into a filter for `preview_filter_liked`:

- **"Keep only X"** → `mode: "keep"` with the criteria of what stays.
- **"Remove X"** → `mode: "remove"` with the criteria of what goes.
- `artists` (exact names) and `genres` (terms such as `electronic`, `house`, `grunge`, `rock`) combine with **OR**;
  `year_from`/`year_to` (release year) and `added_after`/`added_before` (date liked) narrow the result.
- Example — "keep only Chris Cornell + electronic": `mode: "keep"`, `artists: ["Chris Cornell"]`,
  `genres: ["electronic", "electronica", "house", "techno", "edm"]`.

If the request is ambiguous (e.g. does "electronic" include "synth-pop"?), propose the genre terms and ask once.
Genres come from Spotify's artist data, which Spotify has deprecated: some artists have none. Say so if the preview
shows matches missing.

## 2. Preview

Call the preview. If it answers `status: "loading"`, call it again with the same arguments until it returns a
`plan_id` (big libraries take several calls; say "still reading your library").

Show: how many will be **unliked** and how many **stay**, and the samples of both. Ask for an explicit "yes".

## 3. Apply

Only after the "yes", call `apply_plan` with the `plan_id`. While it answers `status: "partial"`, call it again.
At the end, report how many were removed and the `backup_id` of the automatic backup, and remind the user that
`preview_restore` with that id brings them back (with today's date as the liked date).

## Other cleanups

- **Duplicates** (same song in another version/album): `preview_dedupe` (Liked Songs by default).
- **Unavailable tracks** (removed or region-locked): `preview_unavailable`.

Same flow: preview → user's "yes" → `apply_plan`.
