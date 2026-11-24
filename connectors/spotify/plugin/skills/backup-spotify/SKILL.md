---
name: backup-spotify
description: Backs up and restores the Spotify library — saves Liked Songs or a playlist as JSON in the connector, lists and exports backups (e.g. to a file the user keeps), and restores one with a preview. Use when the user types /backup-spotify or asks to back up, export, save or restore their likes or playlists, in any language, e.g. "faz um backup das minhas curtidas", "exporta minha playlist em JSON" or "desfaz a limpeza de ontem".
---

# Spotify backups

Work in the user's language.

## Back up

- Liked Songs: `create_backup` (no arguments). One of their playlists: `create_backup` with `source: "playlist"`
  and `playlist_id`. While it answers `status: "loading"`, call it again with the same arguments.
- The connector keeps the newest 10 backups, including the automatic ones made before every batch removal.

## Export

Call `list_backups`, then `export_backup` page by page (`section`: `liked`, `playlists` or `library`; follow
`next_offset`). When running on the user's computer, offer to write the pages into one JSON file; otherwise
present the JSON or a summary. Backups only hold URIs, names, artists and dates — never credentials.

## Restore

1. `list_backups` and confirm which one (label and date).
2. `preview_restore` with its `backup_id`; show what comes back: likes re-liked (with today's date as the liked
   date — Spotify does not allow setting it), library items re-followed, playlists recreated as **new**
   playlists named "… (restored)". Nothing is deleted.
3. After an explicit "yes", `apply_plan` (repeat while `status: "partial"`).

## Delete

`delete_backup` only after the user confirms which one. To erase everything the connector keeps (credentials,
snapshots, plans and backups), use `disconnect` — export first if they want to keep backups.
