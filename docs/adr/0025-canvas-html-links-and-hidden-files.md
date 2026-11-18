# 0025 — Links of Canvas HTML and access to hidden files

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** ADR 0023, ADR 0024

## Context

Teachers embed files and videos in assignment descriptions and pages with the Rich Content Editor, and often hide
them from the Files area. Assignment 1408627 of course 294409 holds the review PDF (an `<a>` with
`data-api-endpoint=/api/v1/courses/294409/files/18832665` and a `?verifier=` link) and a recorded video (an
`<iframe>` of `/media_attachments_iframe/19034621`). Both files are `hidden_for_user`. `htmlToText()` (a chain of
regexes) dropped every link, iframe and image, and `list_files` cannot list hidden files. Students had no way to
reach the material inside the connector, although `GET /api/v1/files/:id` answers for both files.

## Decision

1. HTML is parsed with a real parser (`htmlparser2`, MIT, pure JS, runs on Workers and Node) in `src/core/html.ts`.
   `parseHtmlContent()` never runs anything: it tokenizes, skips `script`/`style`/`head`, keeps only http(s) URLs
   (no `javascript:`/`data:`) and a short list of attributes. `htmlToText()` uses it without link marks, so the
   Gmail connector and Word extraction keep their text.
2. Canvas content (assignment `description`, page `body`, forum prompt and posts, announcements) becomes text with
   `title [link N]` marks plus a `links` field: `{ n, type, title, url, file_id?, course_id?, page_url?,
assignment_id?, media_id?, provider?, followable }`. `type` is `file`, `video`, `image`, `page`, `assignment`,
   `discussion`, `quiz`, `module`, `canvas` or `external`; the editor's `data-api-endpoint` wins over the `href`.
   Existing fields keep their format; `raw_html: true` adds the original HTML for debugging.
3. Only the Canvas host and the video providers (YouTube, Vimeo, Panopto, Microsoft Stream, and SharePoint/Drive
   when embedded) are `followable`. Any other link is reported, never fetched: `download_file` refuses URLs of
   other hosts.
4. `download_file` and `read_file_text` accept `file_id`, a Canvas file `url`, or both, plus `course_id`, and try
   `GET /courses/:cid/files/:id`, then `GET /files/:id`, then `GET /files/:id?verifier=` (when the link has one).
   If all fail, the error lists each endpoint, its status and the reason (401 hidden/locked, 403 locked or
   restricted, 404 not found). A 401 whose body is `"status": "unauthorized"` denies only that resource and is no
   longer reported as an expired token.
5. Verifiers never reach errors or logs: labels show `verifier=[hidden]` and `redactVerifier()` cleans download
   errors. The `url` in `links` keeps it, because the model needs it to open the file.
6. `list_files` always adds a note that hidden files are not listed and where to find them; with
   `include_linked: true` it appends the linked files it misses (`linked_only: true`) and says how many. A new
   `list_linked_files` tool sweeps assignments, pages (`include[]=body`), forums, announcements and module items
   and returns each file or video once, with every place it appears.

## Alternatives considered

| Alternative                         | Why not                                                                      |
| ----------------------------------- | ---------------------------------------------------------------------------- |
| More regexes on the HTML            | Fragile with attributes, entities and nesting; the requirement is a parser   |
| `HTMLRewriter` (Workers)            | Not available on Node (Docker server, tests)                                 |
| `parse5` / a DOM                    | Heavier; a streaming tokenizer is enough to read links and text              |
| Follow every link the teacher posts | Opens the server to arbitrary hosts (SSRF); external links are only reported |
| Count hidden files in `list_files`  | Canvas gives students no count; folders listing also hides them              |

## Consequences

- Positive: files and videos embedded in prompts are visible and downloadable; failures say which endpoint and why.
- Negative / accepted costs: one more runtime dependency; texts gain `[link N]` marks; `list_linked_files` and
  `include_linked` make five listings per course.
- Docs that change: PROCESSES (P03, P09), FUNCTIONS, ARCHITECTURE, Canvas READMEs, plugin skills, CHANGELOG.
