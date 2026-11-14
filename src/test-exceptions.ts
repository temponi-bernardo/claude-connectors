/**
 * The SINGLE list of functions without an automated test (docs/TESTING.md, "Exceptions" section).
 * Each entry needs a reason and a described manual test. `docs:check` fails if a function has no
 * test and is not listed here, and if an entry here does not exist in the code.
 */

export interface TestException {
  /** Exact function name. */
  readonly name: string;
  /** Why there is no automated test. */
  readonly reason: string;
  /** How to test it manually. */
  readonly manualTest: string;
}

export const TEST_EXCEPTIONS: readonly TestException[] = [
  {
    name: 'runDocsCli',
    reason: 'Docs CLI entry point: it only dispatches to runCheck/runGenerate (tested).',
    manualTest: 'Run `npm run docs:check` and `npm run docs:generate` and check the output.',
  },
  {
    name: 'startCanvasRemoteServer',
    reason:
      'Entry point: reads the environment and wires tested pieces (handler, HTTP server, connector).',
    manualTest:
      'Run `node server/remote.js` with PUBLIC_URL=http://localhost:8080 and SEAL_KEY, open `/.well-known/oauth-authorization-server` and connect with the MCP Inspector.',
  },
  {
    name: 'buildConnector',
    reason:
      'Reads the real .mcp.json and runs esbuild in the connector folder; the decisions live in build.ts (tested).',
    manualTest:
      'Run `npm run build` and check that `server/remote.js` was regenerated and that a .mcp.json with "command" makes the build fail.',
  },
  {
    name: 'runBuildCli',
    reason: 'Build CLI entry point: it only lists the connectors and calls buildConnector.',
    manualTest: 'Run `npm run build` and check for one "✔ <connector>" line per connector.',
  },
  {
    name: 'workersFixedLength',
    reason:
      'Uses FixedLengthStream, which only exists in the Cloudflare Workers runtime; the tests inject a fake converter (snapshots.test.ts).',
    manualTest:
      'With the Worker deployed, use a tool and check in R2 that the `whatsapp/snapshot.was1` object has the snapshot size.',
  },
];
