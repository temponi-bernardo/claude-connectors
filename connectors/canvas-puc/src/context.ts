/**
 * Context handed to every tool of the Canvas connector.
 */
import type { CanvasClient } from './client.js';

/** Tool dependencies: the API client and the clock (injectable in tests). */
export interface CanvasContext {
  readonly client: CanvasClient;
  readonly now: () => Date;
}
