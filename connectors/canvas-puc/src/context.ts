/**
 * Contexto entregue a cada ferramenta do conector Canvas.
 */
import type { CanvasClient } from './client.js';

/** Dependências das ferramentas: cliente da API e relógio (injetável nos testes). */
export interface CanvasContext {
  readonly client: CanvasClient;
  readonly now: () => Date;
}
