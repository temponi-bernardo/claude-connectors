# Canvas PUC Minas (`canvas-puc`)

MCP connector that gives Claude access to PUC Minas's Canvas LMS: due dates, assignments with instructions and
rubric, grades, announcements, modules, pages, files, discussions and calendar.

## Install

After installing the plugin, type **`/setup-canvas`** in the chat: Claude opens the Canvas token page, guides
the connection and runs a test. The manual steps are:

The connector runs only in the cloud. Nothing is installed on your computer ([ADR 0013](../../docs/adr/0013-remote-only-connector-via-marketplace.md)).

1. In Claude (claude.ai, Cowork or Claude Code), **Add marketplace** → `temponi-bernardo/claude-connectors`.
2. Install the **canvas-puc** plugin. It points to `https://canvas-puc-remote.bftemponi.workers.dev/mcp`.
3. The first time, Claude opens the **"Connect Canvas to Claude"** page. In Canvas, go to **Account →
   Settings → New Access Token**, copy the token, paste it on the page and click **Connect**.
4. Done: the connector works on the web, in Cowork, in the mobile app and in Claude Code.

In Claude Code, steps 1 and 2 fit in a single command:

```text
/plugin install canvas-puc --marketplace temponi-bernardo/claude-connectors
```

The PUC token is valid for at most 30 days, but the connector extends it on its own every time access is
renewed (ADR 0011). Only if you go more than 30 days without using the connector (or revoke the token) do the
tools warn you: generate a new token and reconnect the connector in Claude's settings.

Security: the Canvas token is never stored on the server; it only travels encrypted inside the OAuth tokens.
Anyone with a valid Canvas token can use the server, but only reaches their own account.

## Plugin commands

- **`/setup-canvas`** — guided setup (token, connection and test).
- **`/weekly-summary`** — the week's due dates, overdue work, announcements and grades.
- **`/prepare-submission`** — instructions, rubric, checklist, plan and review; submits only after confirmation.
- **`/study-course`** — module summary, concepts, review questions and a plan up to the exam.

You can also ask in natural language ("what's due this week?"): Claude picks the right skill.

## Remote server (maintainer)

The plugin uses the HTTP server with OAuth ([ADR 0009](../../docs/adr/0009-remote-http-oauth-connector.md)),
deployed on Cloudflare Workers ([ADR 0010](../../docs/adr/0010-remote-connector-on-cloudflare-workers.md)).
You can also add it directly as a custom connector on claude.ai, with the same `/mcp` URL.

**1. Deploy to Cloudflare Workers (free plan, [ADR 0010](../../docs/adr/0010-remote-connector-on-cloudflare-workers.md)):**

1. Authenticate `wrangler`: on your computer, `npx wrangler login`; in the Claude Code cloud, an API token from
   the **"Edit Cloudflare Workers"** template in the `CLOUDFLARE_API_TOKEN` variable of the environment settings.
2. Once, store the seal key as a Worker secret:

   ```bash
   node -e "console.log(crypto.randomBytes(32).toString('base64'))" | npx wrangler secret put SEAL_KEY --config connectors/canvas-puc/wrangler.toml
   ```

3. Deploy (and repeat after every merge that touches the connector):

   ```bash
   npm run worker:deploy
   ```

4. The address is printed at the end of the deploy: `https://canvas-puc-remote.<your-account>.workers.dev`.

`wrangler.toml` already enables writes (`CANVAS_ALLOW_WRITE=true`). The Worker never sleeps: it answers right away.
To test locally first: `npm run worker:dev` (needs `SEAL_KEY`, e.g. `--var SEAL_KEY:<key>`).

**2. Update the plugin:** if the Worker address changes, change the `url` in `plugin/.mcp.json` and run `npm run build`
(it rejects any server that is not `http` with `https://`).

**Other hosts (Docker):**

```bash
docker build -t canvas-puc-remote connectors/canvas-puc
```

```bash
docker run -p 8080:8080 -e PUBLIC_URL=https://your-domain -e SEAL_KEY=<32 bytes in base64> -e CANVAS_ALLOW_WRITE=true canvas-puc-remote
```

| Variable               | Default                            | Purpose                                                                                                      |
| ---------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `PUBLIC_URL`           | — (on the Worker: its own address) | Public https address (required on Docker)                                                                    |
| `SEAL_KEY`             | —                                  | OAuth seal key; changing it disconnects everyone                                                             |
| `PORT`                 | `8080`                             | HTTP port                                                                                                    |
| `OAUTH_REDIRECT_HOSTS` | `claude.ai,claude.com,localhost`   | Where OAuth may send the access back to                                                                      |
| `CANVAS_BASE_URL`      | `https://pucminas.instructure.com` | The server's fixed Canvas instance                                                                           |
| `CANVAS_ALLOW_WRITE`   | off                                | `true` registers `submit_text_assignment`, `reply_to_discussion`, `send_message` and `reply_to_conversation` |

**Common problems:**

| Symptom                                     | Cause and fix                                                                                                |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| "O Canvas respondeu 403" on the page        | Request without `User-Agent`; the Worker sends `CANVAS_USER_AGENT` since PR #13. Deploy the current version. |
| **Connect** does nothing with a valid token | CSP blocking the 302 to claude.ai; fixed in PR #14 (`pageSecurityPolicy()`). Deploy again.                   |
| "Invalid Worker configuration: SEAL_KEY"    | Secret missing or still propagating right after `secret put`; wait a few seconds.                            |

## Tools

| Tool                     | Does                                                                                                      |
| ------------------------ | --------------------------------------------------------------------------------------------------------- |
| `whoami`                 | Profile (connection test)                                                                                 |
| `list_courses`           | Courses with current grade                                                                                |
| `upcoming_assignments`   | What's due in the next few days, across all courses                                                       |
| `list_assignments`       | A course's assignments with status (filters: upcoming, overdue...)                                        |
| `get_assignment`         | Instructions, rubric, deadlines and feedback                                                              |
| `get_grades`             | Grade summary or grades per assignment                                                                    |
| `list_announcements`     | Recent announcements                                                                                      |
| `list_modules`           | Modules and items                                                                                         |
| `get_page`               | Content of a page                                                                                         |
| `list_files`             | Files with download link                                                                                  |
| `read_file_text`         | Content of text/code files, including `.doc` and `.docx`                                                  |
| `download_file`          | Brings a PDF, slides or image (up to 70 MB) into the conversation                                         |
| `list_discussions`       | Course discussion forums                                                                                  |
| `get_discussion`         | Posts in a forum                                                                                          |
| `get_calendar`           | Calendar events                                                                                           |
| `search`                 | Search across assignments, pages, files and modules                                                       |
| `find_recipients`        | Finds people to message (teachers, TAs, classmates) and their user ID                                     |
| `list_conversations`     | Inbox conversations (inbox, unread, starred, sent, archived)                                              |
| `get_conversation`       | Reads a conversation with all messages, without marking it as read                                        |
| `submit_text_assignment` | Submits text/a link (only with writes enabled; Claude confirms first)                                     |
| `reply_to_discussion`    | Replies to a forum (only with writes enabled; Claude confirms first)                                      |
| `send_message`           | Sends a new inbox message to up to 20 people by user ID (only with writes enabled; Claude confirms first) |
| `reply_to_conversation`  | Replies in an inbox conversation (only with writes enabled; Claude confirms first)                        |

Internal flows: [PROCESSES.md](../../docs/PROCESSES.md). Architecture decision:
[ADR 0013](../../docs/adr/0013-remote-only-connector-via-marketplace.md).
