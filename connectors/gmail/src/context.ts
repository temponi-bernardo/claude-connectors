/**
 * Dependências injetadas no conector Gmail (configuração, KV, rede e relógio), para os testes trocarem
 * a rede e o relógio sem mocks globais.
 */
import type { GmailSettings } from './config.js';

/** O subconjunto do Workers KV que o conector usa. */
export interface KvStore {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

/** `fetch` injetável. */
export type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;

/** Tudo de que as ferramentas e os fluxos de vínculo precisam. */
export interface GmailDeps {
  readonly settings: GmailSettings;
  readonly kv: KvStore;
  readonly fetch: Fetcher;
  /** Relógio em milissegundos Unix. */
  readonly now: () => number;
  /** Origem pública do Worker (`https://gmail-remote.<conta>.workers.dev`), para os links de vínculo. */
  readonly origin: string;
}

/** User-Agent enviado ao Google (lição do Canvas: chamadas sem User-Agent podem ser barradas). */
export const UPSTREAM_USER_AGENT = 'claude-connectors-gmail/0.1';
