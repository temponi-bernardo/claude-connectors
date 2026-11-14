/**
 * Minimal Cloudflare Workers runtime types, one file for every connector. The project does not load
 * `@cloudflare/workers-types` (it clashes with the global Node types used by the tests); these cover what
 * `@cloudflare/containers`' `Container` and the WhatsApp Durable Object use, plus the
 * `@cloudflare/workers-oauth-provider` declarations used by Gmail (ADR 0014).
 */
declare module 'cloudflare:workers' {
  /** Transactional Durable Object storage (subset). */
  export interface DurableObjectStorageLike {
    get<T>(key: string): Promise<T | undefined>;
    put(key: string, value: unknown): Promise<void>;
  }

  /** Durable Object state (subset). */
  export interface DurableObjectStateLike {
    readonly storage: DurableObjectStorageLike;
    waitUntil(promise: Promise<unknown>): void;
    readonly container?: { readonly running: boolean };
  }

  /** Durable Object base class. */
  export abstract class DurableObject<Env = unknown> {
    protected readonly ctx: DurableObjectStateLike;
    protected readonly env: Env;
    constructor(ctx: DurableObjectStateLike, env: Env);
  }

  /** Worker entrypoint base class. */
  export abstract class WorkerEntrypoint<Env = unknown, Props = unknown> {
    protected readonly ctx: ExecutionContext<Props>;
    protected readonly env: Env;
    protected readonly props: Props;
    constructor(ctx: ExecutionContext<Props>, env: Env);
    fetch?(request: Request): Response | Promise<Response>;
  }
}

/** Execution context of a Worker request (`props` comes from OAuth). */
interface ExecutionContext<Props = unknown> {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
  readonly props: Props;
}

/** Handler exported by a Worker (`fetch` only). */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- same arity as the official type
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

/** Workers stream of known length (required by R2 to write a stream). */
declare class FixedLengthStream extends TransformStream<Uint8Array, Uint8Array> {
  constructor(expectedLength: number);
}
