/**
 * Tipos mínimos do runtime do Cloudflare Workers usados pelo conector WhatsApp. O projeto não carrega
 * `@cloudflare/workers-types` (conflita com os tipos globais do Node usados nos testes); estes cobrem só o que o
 * `Container` de `@cloudflare/containers` e o nosso Durable Object usam.
 */
declare module 'cloudflare:workers' {
  /** Armazenamento transacional do Durable Object (subconjunto). */
  export interface DurableObjectStorageLike {
    get<T>(key: string): Promise<T | undefined>;
    put(key: string, value: unknown): Promise<void>;
  }

  /** Estado do Durable Object (subconjunto). */
  export interface DurableObjectStateLike {
    readonly storage: DurableObjectStorageLike;
    waitUntil(promise: Promise<unknown>): void;
    readonly container?: { readonly running: boolean };
  }

  /** Classe base de Durable Object. */
  export abstract class DurableObject<Env = unknown> {
    protected readonly ctx: DurableObjectStateLike;
    protected readonly env: Env;
    constructor(ctx: DurableObjectStateLike, env: Env);
  }

  /** Classe base de entrypoint de Worker. */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  export abstract class WorkerEntrypoint<Env = unknown, Props = unknown> {
    protected readonly env: Env;
    protected readonly props: Props;
  }
}

declare namespace Cloudflare {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Env {}
}

/** Fluxo de tamanho conhecido do Workers (exigido pelo R2 para gravar um fluxo). */
declare class FixedLengthStream extends TransformStream<Uint8Array, Uint8Array> {
  constructor(expectedLength: number);
}
