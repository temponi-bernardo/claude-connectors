/**
 * Validação do `id_token` do Google (OpenID Connect): assinatura RS256 pelas chaves públicas do Google,
 * emissor, audiência, validade, `nonce` e e-mail verificado. Só depois disso o e-mail é confiável.
 */
import type { webcrypto } from 'node:crypto';
import { UPSTREAM_USER_AGENT, type GmailDeps } from './context.js';

/** Chaves públicas (JWKS) que assinam os `id_token` do Google. */
export const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';

/** Emissores aceitos nos `id_token` do Google. */
export const GOOGLE_ISSUERS: readonly string[] = [
  'https://accounts.google.com',
  'accounts.google.com',
];

/** Folga de relógio aceita na validade do token, em segundos. */
export const CLOCK_SKEW_SECONDS = 60;

/** Partes de um JWT já decodificadas. */
export interface DecodedJwt {
  readonly header: Record<string, unknown>;
  readonly payload: Record<string, unknown>;
  readonly signingInput: string;
  readonly signature: Uint8Array<ArrayBuffer>;
}

/** Identidade confirmada pelo `id_token`: id estável (`sub`) e e-mail verificado. */
export interface GoogleIdentity {
  readonly sub: string;
  readonly email: string;
}

/** O que o `id_token` precisa conferir. */
export interface IdTokenExpectation {
  readonly clientId: string;
  readonly nonce: string;
  /** Instante atual em segundos Unix. */
  readonly now: number;
}

/** Decodifica um pedaço base64url de JSON em objeto; lança erro se não for objeto. */
export function decodeJwtJson(part: string): Record<string, unknown> {
  const value: unknown = JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));
  if (typeof value !== 'object' || value === null) throw new Error('JWT malformado.');
  return value as Record<string, unknown>;
}

/** Separa e decodifica um JWT (`header.payload.assinatura`); lança erro se estiver malformado. */
export function decodeJwt(token: string): DecodedJwt {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('id_token do Google malformado.');
  const [header = '', payload = '', signature = ''] = parts;
  return {
    header: decodeJwtJson(header),
    payload: decodeJwtJson(payload),
    signingInput: `${header}.${payload}`,
    signature: new Uint8Array(Buffer.from(signature, 'base64url')),
  };
}

/** Nomes das verificações do `id_token` que falharam (vazio quando todas passam). */
export function idTokenProblems(
  payload: Readonly<Record<string, unknown>>,
  expected: IdTokenExpectation,
): string[] {
  const exp = typeof payload.exp === 'number' ? payload.exp : 0;
  const checks: [string, boolean][] = [
    ['emissor', GOOGLE_ISSUERS.includes(String(payload.iss))],
    ['audiência', payload.aud === expected.clientId],
    ['validade', exp + CLOCK_SKEW_SECONDS > expected.now],
    ['nonce', payload.nonce === expected.nonce],
    ['e-mail verificado', payload.email_verified === true && typeof payload.email === 'string'],
    ['sub', typeof payload.sub === 'string' && payload.sub.length > 0],
  ];
  return checks.filter(([, ok]) => !ok).map(([name]) => name);
}

/** Confere emissor, audiência, validade, `nonce`, `sub` e e-mail verificado; devolve a identidade. */
export function checkIdTokenClaims(
  payload: Readonly<Record<string, unknown>>,
  expected: IdTokenExpectation,
): GoogleIdentity {
  const problems = idTokenProblems(payload, expected);
  if (problems.length > 0) throw new Error(`id_token do Google inválido (${problems.join(', ')}).`);
  return { sub: String(payload.sub), email: String(payload.email).toLowerCase() };
}

/** Busca a chave pública do Google com o `kid` dado; lança erro se não existir. */
export async function fetchGoogleKey(deps: GmailDeps, kid: string): Promise<webcrypto.JsonWebKey> {
  const response = await deps.fetch(GOOGLE_JWKS_URL, {
    headers: { 'user-agent': UPSTREAM_USER_AGENT },
  });
  if (!response.ok)
    throw new Error(`Não consegui buscar as chaves do Google (HTTP ${response.status}).`);
  const { keys } = (await response.json()) as {
    keys?: (webcrypto.JsonWebKey & { kid?: string })[];
  };
  const key = keys?.find((candidate) => candidate.kid === kid);
  if (!key) throw new Error('Chave do id_token não encontrada no Google.');
  return key;
}

/** Confere a assinatura RS256 do JWT com a chave pública dada. */
export async function verifyRs256(jwt: DecodedJwt, jwk: webcrypto.JsonWebKey): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  return crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    jwt.signature,
    new TextEncoder().encode(jwt.signingInput),
  );
}

/** Valida o `id_token` do Google (assinatura e claims) e devolve a identidade verificada. */
export async function verifyGoogleIdToken(
  deps: GmailDeps,
  idToken: string,
  nonce: string,
): Promise<GoogleIdentity> {
  const jwt = decodeJwt(idToken);
  if (jwt.header.alg !== 'RS256') throw new Error('id_token do Google com algoritmo inesperado.');
  const jwk = await fetchGoogleKey(deps, String(jwt.header.kid));
  if (!(await verifyRs256(jwt, jwk))) throw new Error('Assinatura do id_token do Google inválida.');
  const now = Math.floor(deps.now() / 1000);
  return checkIdTokenClaims(jwt.payload, { clientId: deps.settings.googleClientId, nonce, now });
}
