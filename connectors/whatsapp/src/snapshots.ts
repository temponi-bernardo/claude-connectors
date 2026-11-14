/**
 * Snapshots cifrados da ponte no R2. O conteúdo já chega cifrado pela ponte (formato `WAS1`, `bridge/API.md`):
 * aqui só se guarda o fluxo sem carregá-lo na memória, e se recusa gravar uma geração mais velha que a atual.
 */

/** Chave do snapshot atual no bucket. */
export const SNAPSHOT_KEY_NAME = 'whatsapp/snapshot.was1';

/** Objeto lido do bucket (subconjunto do `R2ObjectBody`). */
export interface SnapshotObject {
  readonly body: ReadableStream<Uint8Array>;
  readonly size: number;
  readonly customMetadata?: Readonly<Record<string, string>>;
}

/** Bucket de snapshots (subconjunto do binding R2). */
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

/** Fluxo de snapshot pronto para gravar: corpo, tamanho e geração. */
export interface SnapshotUpload {
  readonly body: ReadableStream<Uint8Array>;
  readonly length: number;
  readonly generation: number;
}

/** Converte um fluxo em fluxo de tamanho conhecido (o R2 exige; no Workers é o `FixedLengthStream`). */
export type FixedLength = (
  body: ReadableStream<Uint8Array>,
  length: number,
) => ReadableStream<Uint8Array>;

/** Resultado de uma tentativa de gravar snapshot. */
export type SnapshotOutcome = 'saved' | 'unchanged' | 'stale';

/** Lê a geração gravada nos metadados de um objeto; 0 se ausente ou inválida. */
export function storedGeneration(meta: Pick<SnapshotObject, 'customMetadata'> | null): number {
  const value = Number(meta?.customMetadata?.generation ?? 0);
  return Number.isSafeInteger(value) && value > 0 ? value : 0;
}

/** Lê tamanho e geração dos headers de uma resposta de snapshot; nulo se faltarem ou forem inválidos. */
export function readUploadHeaders(
  headers: Headers,
): { readonly length: number; readonly generation: number } | null {
  const length = Number(headers.get('content-length'));
  const generation = Number(headers.get('x-snapshot-generation'));
  const valid = [length, generation].every((n) => Number.isSafeInteger(n) && n > 0);
  return valid ? { length, generation } : null;
}

/** Grava o snapshot se a geração for mais nova que a do bucket; senão descarta o fluxo e diz `stale`. */
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

/** Grava a resposta de `GET /snapshot` da ponte: 204 (sem mudança) e 503 (ainda iniciando) são `unchanged`. */
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
    throw new Error(`Snapshot inválido da ponte (status ${res.status}).`);
  }
  return storeSnapshot(bucket, { body: res.body, ...meta }, fixedLength);
}

/** Tira o snapshot atual do caminho (guarda uma cópia com data) para recomeçar do zero. */
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

/** Compara dois textos em tempo constante (para tokens). */
export function sameSecret(given: string, expected: string): boolean {
  const a = new TextEncoder().encode(given);
  const b = new TextEncoder().encode(expected);
  let diff = a.length ^ b.length;
  for (let i = 0; i < b.length; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0 && b.length > 0;
}

/** Recebe o snapshot que a ponte envia sozinha no `SIGTERM` (melhor esforço): confere o token e grava. */
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
