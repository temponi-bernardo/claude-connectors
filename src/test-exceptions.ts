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
    name: 'sleepMs',
    reason:
      'Smoke CLI helper that only wraps setTimeout; the retry logic that uses it is tested with a fake sleep.',
    manualTest:
      'Run `npm run smoke -- canvas-puc` right after a deploy and watch it retry while it propagates.',
  },
  {
    name: 'readSmokeCheck',
    reason:
      'Smoke CLI glue: reads files and environment variables and calls the tested smoke.ts functions.',
    manualTest:
      'Run `npm run smoke -- canvas-puc` and `SMOKE_URL=https://x npm run smoke -- gmail`; both resolve the address shown.',
  },
  {
    name: 'runSmokeCli',
    reason:
      'Smoke CLI entry point: reads the files and the environment and calls the tested smoke.ts functions against the live Worker.',
    manualTest:
      'After a deploy run `npm run smoke -- canvas-puc`: it prints "✔ smoke canvas-puc"; edit tool-contract.json and it exits 1 listing the difference.',
  },
  {
    name: 'runPlanCli',
    reason:
      'Entry point of the /planejamento script: wires the real file system into runPlanCommand (tested with an in-memory PlanIo).',
    manualTest:
      'Run `node connectors/canvas-puc/plugin/skills/planejamento/scripts/plan.mjs build connectors/canvas-puc/src/fixtures/plan-sample.json --out /tmp/p.html` and then `extract /tmp/p.html --out /tmp/p.json`.',
  },
  {
    name: 'buildPlanSkill',
    reason:
      'Build CLI glue: runs esbuild and writes the plan script and template; the pieces are tested in plan-skill.test.ts, which also checks the versioned files are current.',
    manualTest:
      'Run `npm run build` and check that `git status` shows no change under connectors/canvas-puc/plugin/skills/planejamento/.',
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
