/**
 * Encrypted bridge snapshots in R2. The content arrives already encrypted by the bridge (`WAS1` format,
 * `bridge/API.md`): here the stream is only stored without loading it into memory, and an older generation than the
 * current one is never written.
 */

/** Key of the current snapshot in the bucket. */
export const SNAPSHOT_KEY_NAME = 'whatsapp/snapshot.was1';

/** Object read from the bucket (subset of `R2ObjectBody`). */
export interface SnapshotObject {
  readonly body: ReadableStream<Uint8Array>;
  readonly size: number;
  readonly customMetadata?: Readonly<Record<string, string>>;
}

/** Snapshot bucket (subset of the R2 binding). */
export interface SnapshotBucket {
  get(key: string): Promise<SnapshotObject | null>;
  head(key: string): Promise<Omit<SnapshotObject, 'body'> | null>;
  put(
    key: string,
    value: ReadableStream<Uint8Array>,
    options: { readonly customMetadata: Record<string, string> },
  ): Promise<unknown>;
  delete(key: string): Promise<void>;
}

/** Snapshot stream ready to write: body, length and generation. */
export interface SnapshotUpload {
  readonly body: ReadableStream<Uint8Array>;
  readonly length: number;
  readonly generation: number;
}

/** Turns a stream into a stream of known length (R2 requires it; on Workers it is `FixedLengthStream`). */
export type FixedLength = (
  body: ReadableStream<Uint8Array>,
  length: number,
) => ReadableStream<Uint8Array>;

/** Result of an attempt to write a snapshot. */
export type SnapshotOutcome = 'saved' | 'unchanged' | 'stale';

/**
 * Copies `source` into `writable` chunk by chunk and closes the destination. Does not use `pipeTo`: on Workers,
 * piping the container response body into a `FixedLengthStream` fails ("Inter-TransformStream
 * ReadableStream.pipeTo() is not implemented") and the snapshot never reached R2. An error on one side aborts the
 * other; never rejects (whoever reads the destination gets the error).
 */
export async function pumpInto(
  source: ReadableStream<Uint8Array>,
  writable: WritableStream<Uint8Array>,
): Promise<void> {
  const reader = source.getReader();
  const writer = writable.getWriter();
  try {
    for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
      await writer.write(chunk.value);
    }
    await writer.close();
  } catch (error) {
    await Promise.allSettled([writer.abort(error), reader.cancel(error)]);
  }
}

/** Reads the generation stored in an object's metadata; 0 if missing or invalid. */
export function storedGeneration(meta: Pick<SnapshotObject, 'customMetadata'> | null): number {
  const value = Number(meta?.customMetadata?.generation ?? 0);
  return Number.isSafeInteger(value) && value > 0 ? value : 0;
}

/** Reads length and generation from a snapshot response's headers; null if missing or invalid. */
export function readUploadHeaders(
  headers: Headers,
): { readonly length: number; readonly generation: number } | null {
  const length = Number(headers.get('content-length'));
  const generation = Number(headers.get('x-snapshot-generation'));
  const valid = [length, generation].every((n) => Number.isSafeInteger(n) && n > 0);
  return valid ? { length, generation } : null;
}

/** Writes the snapshot if its generation is newer than the bucket's; otherwise discards the stream and says `stale`. */
export async function storeSnapshot(
  bucket: SnapshotBucket,
  upload: SnapshotUpload,
  fixedLength: FixedLength,
): Promise<SnapshotOutcome> {
  const current = storedGeneration(await bucket.head(SNAPSHOT_KEY_NAME));
  if (upload.generation <= current) {
    await upload.body.cancel();
    return 'stale';
  }
  await bucket.put(SNAPSHOT_KEY_NAME, fixedLength(upload.body, upload.length), {
    customMetadata: { generation: String(upload.generation) },
  });
  return 'saved';
}

/** Writes the bridge's `GET /snapshot` response: 204 (no change) and 503 (still starting) are `unchanged`. */
export async function storeSnapshotResponse(
  bucket: SnapshotBucket,
  res: Response,
  fixedLength: FixedLength,
): Promise<SnapshotOutcome> {
  if (res.status === 204 || !res.body) return 'unchanged';
  if (res.status === 503) {
    await res.body.cancel();
    return 'unchanged';
  }
  const meta = readUploadHeaders(res.headers);
  if (!res.ok || !meta) {
    await res.body.cancel();
    throw new Error(`Invalid snapshot from the bridge (status ${res.status}).`);
  }
  return storeSnapshot(bucket, { body: res.body, ...meta }, fixedLength);
}

/** Moves the current snapshot out of the way (keeps a dated copy) to start over. */
export async function archiveSnapshot(
  bucket: SnapshotBucket,
  now: Date,
  fixedLength: FixedLength,
): Promise<boolean> {
  const current = await bucket.get(SNAPSHOT_KEY_NAME);
  if (!current) return false;
  const archived = `whatsapp/archive/snapshot-${now.toISOString().replace(/[:.]/g, '-')}.was1`;
  await bucket.put(archived, fixedLength(current.body, current.size), {
    customMetadata: { ...current.customMetadata },
  });
  await bucket.delete(SNAPSHOT_KEY_NAME);
  return true;
}

/** Compares two strings in constant time (for tokens). */
export function sameSecret(given: string, expected: string): boolean {
  const a = new TextEncoder().encode(given);
  const b = new TextEncoder().encode(expected);
  let diff = a.length ^ b.length;
  for (let i = 0; i < b.length; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0 && b.length > 0;
}

/** Receives the snapshot the bridge sends on its own on `SIGTERM` (best effort): checks the token and writes it. */
export async function acceptSnapshotPush(
  bucket: SnapshotBucket,
  request: Request,
  options: { readonly token: string; readonly fixedLength: FixedLength },
): Promise<Response> {
  const auth = request.headers.get('authorization') ?? '';
  if (request.method !== 'PUT' || !sameSecret(auth, `Bearer ${options.token}`)) {
    return new Response('forbidden', { status: 403 });
  }
  const meta = readUploadHeaders(request.headers);
  if (!meta || !request.body) return new Response('bad request', { status: 400 });
  const outcome = await storeSnapshot(bucket, { body: request.body, ...meta }, options.fixedLength);
  return Response.json({ outcome });
}
