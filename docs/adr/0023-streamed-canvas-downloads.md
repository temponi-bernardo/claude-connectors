# 0023 — Streamed Canvas downloads up to 70 MB

- **Status:** Accepted
- **Date:** 2026-11-16
- **Related:** ADR 0009, ADR 0010

## Context

`download_file` refused files above 10 MB. The limit was not a Canvas limit: the remote server held the file
several times in memory — the bytes, a binary string, the base64, the serialized JSON-RPC response and its UTF-8
body. Measured in Node, that pipeline peaks at about 8× the file size (10 MB → ~150 MB RSS, 70 MB → ~570 MB). The
Worker has 128 MB, so simply raising the constant would crash it on large files. The owner asked for 70 MB.

## Decision

1. `MAX_DOWNLOAD_BYTES` is 70 MB (`MAX_DOWNLOAD_MB`), and every message and description derives from it.
2. In remote mode `download_file` is **streamed**: the remote handler gives the connector's optional `streamTool`
   the chance to answer a single `tools/call` before the MCP SDK. Canvas takes only `download_file`; the Canvas
   body flows through `byteLimitStream()` → `base64EncodeStream()` → `framedStream()` into a JSON-RPC response
   identical to the SDK's, so memory stays constant (measured: a 70 MB file adds ~13 MB RSS).
3. The cap is enforced on the bytes actually read, not only on the size Canvas declares (`size`,
   `content-length`). The non-streamed path (fallback and `read_file_text` for Word) reads with
   `readLimitedBytes()` under the same cap.
4. Anything the stream does not take — other tools, refusals, errors before streaming starts — falls through to
   the MCP server, which answers as before.

## Alternatives considered

| Alternative                                | Why not                                                                             |
| ------------------------------------------ | ----------------------------------------------------------------------------------- |
| Only raise the constant                    | Peaks at ~8× the file in memory; a 70 MB file exceeds the Worker's 128 MB           |
| SSE mode of the SDK                        | Still serializes the whole message with `JSON.stringify` before writing it          |
| Return only a link for large files         | Claude cannot open the authenticated Canvas link; the user asked for the content    |
| Extract text server-side (PDF/PPTX parser) | Large bundle and CPU per request (ADR 0014); a separate feature, not a limit change |

## Consequences

- Positive: files up to 70 MB cross the Worker with flat memory; no file is buffered whole in the streamed path;
  the cap holds even if Canvas misreports the size.
- Negative / accepted costs: the streamed path bypasses the SDK for one tool, so its response shape is kept by
  tests (`streamedResultFrame()`); an overflow detected mid-stream ends the response early and Claude sees a
  failed call; base64 encoding of 70 MB costs CPU (fine on Workers Paid). Claude's own limits on tool results and
  documents (e.g. the API's request size) still apply, so the largest files may be refused on the client side —
  the tool keeps returning the link in its description line.
- Docs that change: PROCESSES (P03, P09), FUNCTIONS, Canvas README, CHANGELOG.
