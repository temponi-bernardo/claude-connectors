/**
 * Contexto entregue a cada ferramenta do conector Canvas.
 */
import type { AuthProvider } from './auth.js';
import type { CanvasClient } from './client.js';

/** Dependências das ferramentas: cliente da API, autenticação e relógio (injetável nos testes). */
export interface CanvasContext {
  readonly client: CanvasClient;
  readonly auth: AuthProvider;
  readonly now: () => Date;
}
