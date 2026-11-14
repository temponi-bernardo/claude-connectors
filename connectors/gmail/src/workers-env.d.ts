/**
 * Tipos mínimos do runtime do Cloudflare Workers usados pelas declarações de
 * `@cloudflare/workers-oauth-provider`. Declarados aqui (e não com `@cloudflare/workers-types`) porque os
 * tipos completos do Workers colidem com `@types/node` no `tsconfig` único do repositório (ADR 0014).
 */
declare module 'cloudflare:workers' {
  export abstract class WorkerEntrypoint<Env = unknown, Props = unknown> {
    protected ctx: ExecutionContext<Props>;
    protected env: Env;
    constructor(ctx: ExecutionContext<Props>, env: Env);
    fetch?(request: Request): Response | Promise<Response>;
  }
}

interface ExecutionContext<Props = unknown> {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
  readonly props: Props;
}

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
