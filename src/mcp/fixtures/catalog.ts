/**
 * Test helper: asks a remote handler's public catalog (`GET /tools`) and returns its contract entries, the same
 * way the post-deploy smoke test reads the published Worker.
 */
import { toolContractOf, toolsFromListResponse, type ToolContractEntry } from '../tool-contract.js';

/** Fetches `GET /tools` through `handle` and returns the listed tools as contract entries. */
export async function catalogContract(
  handle: (request: Request) => Promise<Response>,
  origin = 'https://connector.test',
): Promise<ToolContractEntry[]> {
  const res = await handle(new Request(`${origin}/tools`));
  if (!res.ok) throw new Error(`GET /tools answered ${String(res.status)}`);
  return toolContractOf(toolsFromListResponse(await res.json()));
}
