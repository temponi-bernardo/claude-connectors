/**
 * Tipos mínimos do runtime do Cloudflare Workers, um só arquivo para todos os conectores. O projeto não carrega
 * `@cloudflare/workers-types` (conflita com os tipos globais do Node usados nos testes); estes cobrem o que usam
 * o `Container` de `@cloudflare/containers` e o Durable Object do WhatsApp, e as declarações de
 * `@cloudflare/workers-oauth-provider` usadas pelo Gmail (ADR 0014).
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
  export abstract class WorkerEntrypoint<Env = unknown, Props = unknown> {
    protected readonly ctx: ExecutionContext<Props>;
    protected readonly env: Env;
    protected readonly props: Props;
    constructor(ctx: ExecutionContext<Props>, env: Env);
    fetch?(request: Request): Response | Promise<Response>;
  }
}

/** Contexto de execução de uma requisição do Worker (`props` vem do OAuth). */
interface ExecutionContext<Props = unknown> {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
  readonly props: Props;
}

/** Handler exportado de um Worker (só `fetch`). */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- mesma aridade do tipo oficial
interface ExportedHandler<Env = unknown, Queue = unknown, Cf = unknown, Props = unknown> {
  fetch?: (
    request: Request,
    env: Env,
    ctx: ExecutionContext<Props>,
  ) => Response | Promise<Response>;
}

declare namespace Cloudflare {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Env {}
}

/** Fluxo de tamanho conhecido do Workers (exigido pelo R2 para gravar um fluxo). */
declare class FixedLengthStream extends TransformStream<Uint8Array, Uint8Array> {
  constructor(expectedLength: number);
}
