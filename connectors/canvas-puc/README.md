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
Anyone with a valid Canvas token can use the server, but only reaches their own account
([isolation map](../../docs/security/isolation.md)).

**Sending and submitting is opt-in per person.** On the connect page, the box _"Also allow Claude to send
messages, reply to discussions and submit assignments on my behalf"_ starts unticked. Without it you get only the
read tools; to turn it on later, reconnect the connector and tick it. Connections made before this option existed
are read-only until reconnected.

**Cutting someone off.** The server keeps no list of users, so there is no per-user switch on it. To revoke one
person, delete their token in Canvas (Account → Settings → Approved integrations / Access tokens): every tool call
and every token refresh goes to Canvas, so access stops at once. Changing `SEAL_KEY` disconnects everyone.

## Plugin commands

- **`/setup-canvas`** — guided setup (token, connection and test).
- **`/weekly-summary`** — the week's due dates, overdue work, announcements and grades.
- **`/prepare-submission`** — instructions, rubric, checklist, plan and review; submits only after confirmation.
- **`/study-course`** — module summary, concepts, review questions and a plan up to the exam.
- **`/planejamento-faculdade`** — the "Plano do Semestre AAAA/S" artifact (pt-BR): where the risk is (points missing to
  pass, 60 by default or the syllabus goal), today and tomorrow, a day-by-day study plan, one card per course
  with a stacked points bar and a concrete path to the goal, a timeline of deadlines and exams, and questions
  for instructors. Checklists keep their ticks across plan updates, in the browser and, when signed in, in the
  artifact database (synced across devices). Canvas is required; the `gmail` and `whatsapp` plugins of this
  marketplace add instructor emails and course groups when connected (otherwise the plan says which sources are
  missing). Every connector is used read-only. At the end it offers three routines: "Faculdade: Plano do
  semestre (manhã)" at 06:59, "(noite)" at 19:29 and "Faculdade: Alerta de tarefas não enviadas" at 20:59
  (America/Sao_Paulo). The page comes from a fixed template; the skill only writes JSON and runs
  `scripts/plan.mjs` (validate, build, extract), generated from `src/plan/` by `npm run build` (ADR 0030).

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

3. Once, create the KV namespace for write opt-ins and put its id in `wrangler.toml` (`CANVAS_KV`):

   ```bash
   npx wrangler kv namespace create CANVAS_KV --config connectors/canvas-puc/wrangler.toml
   ```

4. Deploy (and repeat after every merge that touches the connector). The script then runs the smoke test
   (`npm run smoke -- canvas-puc`): it reads the published `GET /tools` and fails if the tools differ from
   `tool-contract.json`:

   ```bash
   npm run worker:deploy
   ```

5. The address is printed at the end of the deploy: `https://canvas-puc-remote.<your-account>.workers.dev`.

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

| Variable               | Default                            | Purpose                                                                                                                                                                            |
| ---------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_URL`           | — (on the Worker: its own address) | Public https address (required on Docker)                                                                                                                                          |
| `SEAL_KEY`             | —                                  | OAuth seal key; changing it disconnects everyone                                                                                                                                   |
| `PORT`                 | `8080`                             | HTTP port                                                                                                                                                                          |
| `OAUTH_REDIRECT_HOSTS` | `claude.ai,claude.com,localhost`   | Where OAuth may send the access back to                                                                                                                                            |
| `CANVAS_BASE_URL`      | `https://pucminas.instructure.com` | The server's fixed Canvas instance                                                                                                                                                 |
| `CANVAS_ALLOW_WRITE`   | off                                | `true` offers each user the write opt-in (`submit_text_assignment`, `submit_file_assignment`, `reply_to_discussion`, `send_message`, `reply_message`, `prepare_attachment_upload`) |

**Common problems:**

| Symptom                                     | Cause and fix                                                                                                |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| "O Canvas respondeu 403" on the page        | Request without `User-Agent`; the Worker sends `CANVAS_USER_AGENT` since PR #13. Deploy the current version. |
| **Connect** does nothing with a valid token | CSP blocking the 302 to claude.ai; fixed in PR #14 (`pageSecurityPolicy()`). Deploy again.                   |
| "Invalid Worker configuration: SEAL_KEY"    | Secret missing or still propagating right after `secret put`; wait a few seconds.                            |

## Tools

| Tool                        | Does                                                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `whoami`                    | Profile (connection test)                                                                                                                                     |
| `list_courses`              | Courses with current grade                                                                                                                                    |
| `upcoming_assignments`      | What's due from today (00:00 São Paulo time) through the next days, across all courses: every planner item, including peer reviews (`type: "peer_review"`)    |
| `list_assignments`          | A course's assignments with status (filters: upcoming, overdue...)                                                                                            |
| `get_assignment`            | Instructions (with `[link N]` marks), `links` to embedded files/videos/pages, rubric, deadlines and feedback; `raw_html` for debugging                        |
| `list_peer_reviews`         | Peer reviews to do (pending and completed): course, assignment, due date, reviewee (hidden when anonymous), the URL or files they sent and the review link    |
| `get_grades`                | Grade summary or grades per assignment                                                                                                                        |
| `list_announcements`        | Recent announcements, with their `links`                                                                                                                      |
| `list_modules`              | Modules and items                                                                                                                                             |
| `get_page`                  | Content of a page, with its `links`; `raw_html` for debugging                                                                                                 |
| `list_files`                | Files with download link, plus a note that hidden files are not listed; `include_linked` adds the files only linked from the content                          |
| `list_linked_files`         | Every file and video the course content points to (assignments, pages, forums, modules), once each                                                            |
| `read_file_text`            | Content of text/code files, including `.doc` and `.docx`, by `file_id` or Canvas file `url`                                                                   |
| `download_file`             | Brings a PDF, slides or image (up to 70 MB; above 8 MB, in parts), by `file_id` or Canvas file `url`, even if hidden from `list_files`                        |
| `list_discussions`          | Course discussion forums                                                                                                                                      |
| `get_discussion`            | Posts in a forum, with the `links` of the prompt and of each post                                                                                             |
| `get_calendar`              | Calendar events                                                                                                                                               |
| `search`                    | Search across assignments, pages, files and modules                                                                                                           |
| `find_recipients`           | Finds people to message (teachers, TAs, classmates) and their user ID                                                                                         |
| `list_conversations`        | Inbox conversations (inbox, unread, starred, sent, archived)                                                                                                  |
| `get_conversation`          | Reads a conversation with all messages, without marking it as read                                                                                            |
| `submit_text_assignment`    | Submits text/a link (only with writes enabled; Claude confirms first)                                                                                         |
| `submit_file_assignment`    | Submits a file (up to 5 MB, text or base64) to an `online_upload` assignment, checking `allowed_extensions` (only with writes enabled; Claude confirms first) |
| `reply_to_discussion`       | Replies to a forum (only with writes enabled; Claude confirms first)                                                                                          |
| `send_message`              | Sends a new inbox message to up to 20 people by user ID, with up to 5 attachments of 5 MB each (writing on; Claude confirms first)                            |
| `reply_message`             | Replies in an inbox conversation, with up to 5 attachments of 5 MB each (writing on; Claude confirms first)                                                   |
| `prepare_attachment_upload` | Returns a one-time `curl` that uploads a local file (up to 25 MB) to your private inbox attachments folder; its `id` goes in `file_ids` (writing on)          |

### Writing (send, reply, submit) and how to turn it on

The write tools are **always listed**. When writing is off they do nothing and answer why (ADR 0027):

- **Your connection is read-only** (you did not tick "Also allow Claude to send messages…" when connecting, or you
  connected before that box existed): the answer carries a link to `/write-access`. Open it and click **Allow
  writing** — no new Canvas token is needed; it applies within a minute. The same page turns writing off. The
  link expires in 15 minutes and only works for your connection. The server stores only a SHA-256 fingerprint of
  your token in Workers KV, never the token.
- **The server has `CANVAS_ALLOW_WRITE` off**: nobody can write; do it in Canvas itself.

Attachments of `send_message`/`reply_message` go inside the call (`file_name`, `content`, `encoding` `text` or
`base64`), are all checked before anything is uploaded, then go through Canvas's three-step upload to your
"conversation attachments" folder. If any upload fails, the message is not sent. Message text and file contents
are never logged.

For binaries such as a zip or a PDF on your computer, Claude does not type the file in. It calls
`prepare_attachment_upload`, runs the returned `curl` where the file is (the bytes go straight to Canvas), and
passes the printed `id` in `file_ids`. `file_ids` also takes any Canvas file you can access; files outside your
"conversation attachments" folder are copied there first (ADR 0028).

### Files embedded in assignments and pages

Teachers often hide files from the Files area and embed them in an assignment or page. `get_assignment`,
`get_page`, `get_discussion` and `list_announcements` return the text with `title [link N]` marks and a `links`
list (`type` `file`, `video`, `image`, `page`, `assignment`, `external`..., with `file_id`, `course_id` and
`followable`). Pass a file link's `url` (or its `file_id`) to `download_file`/`read_file_text`: they try the
course endpoint, the global one and the link's `verifier`, and when all fail they say which endpoint failed and why
(hidden, locked, no permission). Only links of the Canvas host and of video providers (YouTube, Vimeo, Panopto,
Stream/SharePoint, Drive) are followable; other links are only reported. Verifiers never go to logs or errors
([ADR 0025](../../docs/adr/0025-canvas-html-links-and-hidden-files.md)).

Internal flows: [PROCESSES.md](../../docs/PROCESSES.md). Architecture decision:
[ADR 0013](../../docs/adr/0013-remote-only-connector-via-marketplace.md).
