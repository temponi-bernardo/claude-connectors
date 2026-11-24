# spotify plugin

Claude plugin for Spotify: sign in with Spotify when the host listed you, or use your own Spotify app. It connects Claude to the remote MCP server at
`https://spotify-remote.bftemponi.workers.dev/mcp` (see `.mcp.json`) and adds usage skills in `skills/`. Nothing
runs on your computer. The service page, privacy policy and terms are on the
[project site](https://claude-connectors-site.bftemponi.workers.dev/).

## Install

```
/plugin install spotify --marketplace temponi-bernardo/claude-connectors
```

## Skills

- `/setup-spotify` — create your Spotify app, connect with its Client ID and Secret, and test.
- `/limpar-curtidas` — clean up Liked Songs (keep/remove by artist, genre, year or date; duplicates; unavailable).
- `/organizar-playlists` — sort, split, merge, dedupe and tidy playlists.
- `/backup-spotify` — back up, export and restore Liked Songs and playlists.
- `/playlist-da-semana` — a new playlist with your recent likes.
