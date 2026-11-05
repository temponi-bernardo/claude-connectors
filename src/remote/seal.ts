/**
 * Selo autenticado (AES-256-GCM) para os blobs do OAuth sem estado: `client_id`, código e tokens.
 * Quem tem a chave do servidor abre e confere; ninguém mais lê nem altera o conteúdo.
 */
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

/** Tamanho da chave em bytes (AES-256). */
export const SEAL_KEY_BYTES = 32;

/** Bytes do vetor de inicialização e da tag de autenticação do GCM. */
const IV_BYTES = 12;
const TAG_BYTES = 16;

/** Conteúdo selado: um objeto com tipo (`typ`) e validade em segundos Unix (`exp`). */
export type SealedClaims = Readonly<Record<string, unknown>> & {
  readonly typ: string;
  readonly exp: number;
};

/** O que `openSealed` exige: o tipo esperado e o instante atual (segundos Unix). */
export interface SealExpectation {
  readonly typ: string;
  readonly now: number;
}

/** Decodifica a chave do servidor (base64 ou base64url) e exige 32 bytes. */
export function parseSealKey(raw: string | null): Buffer {
  if (!raw) {
    throw new Error(
      'Defina SEAL_KEY com 32 bytes aleatórios em base64: `node -e "console.log(crypto.randomBytes(32).toString(\'base64\'))"`.',
    );
  }
  const key = Buffer.from(raw, 'base64');
  if (key.length !== SEAL_KEY_BYTES) throw new Error('SEAL_KEY precisa ter 32 bytes em base64.');
  return key;
}

/** Sela um valor JSON: `iv + tag + cifra` em base64url. */
export function sealPayload(payload: unknown, key: Buffer): string {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const body = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString('base64url');
}

/** Abre um selo; devolve nulo se a chave não confere, o texto foi alterado ou não é um objeto. */
export function unsealPayload(sealed: string, key: Buffer): Record<string, unknown> | null {
  try {
    const raw = Buffer.from(sealed, 'base64url');
    const decipher = createDecipheriv('aes-256-gcm', key, raw.subarray(0, IV_BYTES));
    decipher.setAuthTag(raw.subarray(IV_BYTES, IV_BYTES + TAG_BYTES));
    const text = Buffer.concat([
      decipher.update(raw.subarray(IV_BYTES + TAG_BYTES)),
      decipher.final(),
    ]);
    const value: unknown = JSON.parse(text.toString('utf8'));
    return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Abre um selo do tipo esperado que ainda não venceu; senão, nulo. */
export function openSealed(
  sealed: string,
  key: Buffer,
  expected: SealExpectation,
): SealedClaims | null {
  const claims = unsealPayload(sealed, key);
  if (claims?.typ !== expected.typ || typeof claims.exp !== 'number') return null;
  return claims.exp > expected.now ? (claims as SealedClaims) : null;
}
