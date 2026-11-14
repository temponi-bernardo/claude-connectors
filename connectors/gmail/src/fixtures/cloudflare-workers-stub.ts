/** Stand-in for `cloudflare:workers` in Node tests (the module only exists in the Workers runtime). */
export abstract class WorkerEntrypoint {
  readonly runtime = 'node-test';
}
