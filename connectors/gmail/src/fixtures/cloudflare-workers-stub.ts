/** Substituto de `cloudflare:workers` nos testes em Node (o módulo só existe no runtime do Workers). */
export abstract class WorkerEntrypoint {
  readonly runtime = 'node-test';
}
