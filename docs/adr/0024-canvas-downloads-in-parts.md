# 0024 — Canvas downloads in parts of 8 MB

- **Status:** Accepted
- **Date:** 2026-11-16
- **Related:** ADR 0023

## Context

ADR 0023 raised `download_file` to 70 MB and streamed it through the Worker. In real use a 12 MB file (≈16 MB of
base64) arrived, while 15 MB and 23 MB files failed: the server sent them, but Claude's client cut the connection
on tool results above roughly 16–20 MB. The Canvas link itself is not an alternative (the client cannot reach
`pucminas.instructure.com` without the token). The limit is on the size of one tool result, not on the file.

## Decision

1. `download_file` takes two optional arguments, `offset` (first byte) and `length` (default and maximum
   `MAX_CHUNK_BYTES`, 8 MB ≈ 10.7 MB of base64, well below the client's limit).
2. A file up to 8 MB comes whole, exactly as before (its own MIME type). A larger file comes one part per call, as
   raw bytes (`application/octet-stream`, URI `<link>#bytes=<first>-<last>`); the description gives the byte
   range, "part k of n" and the next `offset`, and the caller joins the parts in order.
3. The part is requested with an HTTP `Range` header. If the answer is not a 206 starting at the asked byte, the
   part is cut out of the full stream (`byteRangeStream()`), so it works whether or not the file host honours
   ranges, and a part never carries more than its planned bytes.
4. The 70 MB ceiling of ADR 0023 stays (the owner's request); files above it are still refused with the link.

## Alternatives considered

| Alternative                           | Why not                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------- |
| Keep one answer per file              | Fails above ~16 MB of result on the client side, whatever the server does |
| A temporary public link on the server | Needs storage (R2/KV), exposes course files and has to expire them        |
| Smaller parts (e.g. 4 MB)             | Twice the calls for no gain; 8 MB already leaves a wide margin            |
| Server-side hash of the whole file    | WebCrypto has no incremental digest; the caller can hash the joined file  |

## Consequences

- Positive: any Canvas file up to 70 MB reaches the conversation; memory stays flat; Range keeps each call cheap.
- Negative / accepted costs: large files take several calls and the caller must join bytes (a part alone is not
  a readable PDF); if the host ignores `Range`, each call downloads up to the end of its part.
- Docs that change: PROCESSES (P03, P09), FUNCTIONS, Canvas README, CHANGELOG.
