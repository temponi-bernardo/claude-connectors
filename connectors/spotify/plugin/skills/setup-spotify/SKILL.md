---
name: setup-spotify
description: Sets up the Spotify connector step by step — the user creates their own Spotify app, registers the exact Redirect URI, pastes the Client ID and Secret on the connector page, and Claude runs a read test. Use when the user types /setup-spotify or asks to set up, connect or reconnect Spotify in Claude, in any language, e.g. "configura o Spotify", "conecta meu Spotify" or "o Spotify parou de funcionar".
---

# Set up Spotify

Walk the user through these steps one at a time, in the user's language, waiting for their answer before moving
on. Setup changes nothing in their library: it only connects and runs a read test.

Every address goes as a clickable link. When running on the user's computer (Claude Code, for example), ask
whether they want you to open a page in the browser and, after a "yes", use `open`, `start` or `xdg-open`.

**Why their own app:** Spotify limits each developer app to 5 users in development mode and requires its owner to
have Premium. With their own app, each person stays inside their own quota and nobody depends on someone else's
app. Their credentials are stored encrypted and only used for their own requests.

## 1. Is the connector connected?

Call `connection_status` of the `spotify` connector.

- **It worked:** show the account, the masked Client ID and `reconnect_before` (Spotify authorizations last 6
  months). Go to step 4.
- **The tool does not exist, asks for authentication, or says "No Spotify account is connected":** go to step 2.
- **It says the authorization expired or the app credentials were rejected:** explain that Spotify ends
  authorizations after 6 months (or the Client Secret changed) and go to step 3 to reconnect.

## 2. Create the Spotify app (once)

1. Open [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) and sign in with the Spotify
   account they will use. The app owner needs **Spotify Premium** for development-mode apps.
2. Click **Create app**. Name and description: anything (e.g. "My Claude").
3. **Redirect URI**, exactly: `https://spotify-remote.bftemponi.workers.dev/spotify/callback` (the connector page
   also shows it; if their host runs another Worker, use the one shown there). No trailing slash.
4. Under "Which API/SDKs are you planning to use?", tick **Web API**, accept the terms and **Save**.
5. Open **Settings**: copy the **Client ID**; click **View client secret** and copy it. Tell them not to paste
   either one in the chat — only on the connector page.
6. If the Spotify account they will connect is **not** the one that created the app, add its email under
   **Settings → User Management** (up to 5 users).

## 3. Connect in Claude

1. Open Claude's connector settings (the **Spotify** plugin → **Connectors** tab → **spotify**, or Settings →
   Connectors) and click **Connect** (to reconnect: **Disconnect**, then **Connect**).
2. The connector page opens: paste the **Client ID** and the **Client Secret** and click **Continue to Spotify**.
3. On Spotify, check the account shown and click **Agree**.

Common problems:

- **"INVALID_CLIENT: Invalid redirect URI"** on Spotify: the Redirect URI in the app differs by a character; copy
  it again from the connector page.
- **"Wrong app credentials"**: Client ID or Secret were copied wrong (both are 32 letters and digits).
- **"Account not allowed in your app"**: add the account's email in User Management (step 2.6).

Ask them to tell you when they are done and call `connection_status` again.

## 4. Quick test

Call `list_liked_tracks` with `limit: 5` and show name and artist of the latest likes. Then mention what they can
ask, in one or two lines: clean up likes (`/limpar-curtidas`), organize playlists (`/organizar-playlists`),
backups (`/backup-spotify`) and a weekly playlist of recent likes (`/playlist-da-semana`). Playback control needs
Premium.
