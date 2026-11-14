/**
 * WhatsApp connector entry on Cloudflare Workers (ADR 0015): remote MCP server with OAuth (owner login via
 * GitHub), the `/pair` page and the `WhatsAppBridge` Durable Object, owner of the bridge container. The periodic
 * sync only runs if `SYNC_CRON` is set and equal to the cron that fired (off by default).
 */
import { toEnvVars, type EnvVars } from '../../../src/core/env.js';
import { githubUpstreamLogin, type GithubLoginSettings } from '../../../src/remote/github-login.js';
import {
  createRemoteHandler,
  type RemoteApp,
  type RemoteConnector,
} from '../../../src/remote/handler.js';
import { readOAuthSettings, resolveIssuer } from '../../../src/remote/oauth.js';
import { withDeadline, type BridgeFetch } from './bridge-client.js';
import { readWhatsAppSettings, type WhatsAppSettings } from './config.js';
import { routePairRequest, type PairApp } from './pair.js';
import { createWhatsAppMcpServer } from './tools.js';
import { bridgeFetchFor, bridgeStub, type WhatsAppEnv } from './worker-env.js';

/** Clock in Unix seconds. */
export function unixNow(): number {
  return Math.floor(Date.now() / 1000);
}

/** Owner GitHub login settings from the connector settings. */
export function githubSettingsFrom(settings: WhatsAppSettings): GithubLoginSettings {
  return {
    clientId: settings.githubClientId,
    clientSecret: settings.githubClientSecret,
    allowedEmails: settings.allowedEmails,
    // Arrow: on Workers, the global fetch called as a method of another object throws "Illegal invocation".
    fetchFn: (input, init) => fetch(input, init),
  };
}

/** Builds the remote WhatsApp connector: GitHub login and an MCP server wired to the bridge. */
export function whatsappRemoteConnector(
  settings: WhatsAppSettings,
  bridge: BridgeFetch,
  issuer: string,
): RemoteConnector {
  return {
    login: githubUpstreamLogin(githubSettingsFrom(settings)),
    acceptsSecret: (email) => settings.allowedEmails.includes(email),
    createServer: () =>
      createWhatsAppMcpServer({
        bridge,
        settings,
        pairUrl: `${issuer}/pair`,
        now: () => Date.now(),
      }),
  };
}

/** Everything a request needs: the OAuth/MCP app and the `/pair` app. */
export interface WhatsAppApps {
  readonly remote: RemoteApp;
  readonly pair: PairApp;
}

/** Builds the Worker apps from the environment, the bridge and the request origin. */
export function createWhatsAppApps(
  vars: EnvVars,
  bridge: BridgeFetch,
  origin: string,
): WhatsAppApps {
  const settings = readWhatsAppSettings(vars);
  const issuer = resolveIssuer(vars, origin);
  const oauth = readOAuthSettings(vars, issuer);
  return {
    remote: {
      settings: oauth,
      connector: whatsappRemoteConnector(settings, bridge, issuer),
      now: unixNow,
    },
    pair: {
      settings: oauth,
      github: githubSettingsFrom(settings),
      bridge,
      now: unixNow,
      timeoutMs: settings.toolTimeoutMs,
    },
  };
}

/** Handles a request: `/pair` first, then OAuth and `/mcp`; invalid configuration becomes an explained 500. */
export async function handleWhatsAppFetch(request: Request, env: WhatsAppEnv): Promise<Response> {
  let apps: WhatsAppApps;
  try {
    apps = createWhatsAppApps(
      toEnvVars(env),
      bridgeFetchFor(bridgeStub(env)),
      new URL(request.url).origin,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(`Invalid Worker configuration: ${message}`, { status: 500 });
  }
  return (await routePairRequest(apps.pair, request)) ?? createRemoteHandler(apps.remote)(request);
}

/** Tells whether the cron that fired is the optional sync configured in `SYNC_CRON`. */
export function isSyncCronEnabled(vars: EnvVars, cron: string): boolean {
  const configured = readWhatsAppSettings(vars).syncCron;
  return configured !== null && configured === cron;
}

/** Optional periodic sync: wakes the bridge, waits for pending messages (up to 20 s), saves the snapshot and lets it sleep. */
export async function runScheduledSync(env: WhatsAppEnv, cron: string): Promise<string> {
  if (!isSyncCronEnabled(toEnvVars(env), cron)) return 'disabled';
  const bridge = bridgeFetchFor(bridgeStub(env));
  const deadline = Date.now() + 50_000;
  await withDeadline(
    bridge('/sync/wait?timeout_ms=20000', { method: 'POST' }),
    deadline,
    'sync timed out',
  );
  const res = await withDeadline(
    bridge('/__snapshot', { method: 'POST' }),
    deadline,
    'snapshot timed out',
  );
  const body = (await res.json()) as { outcome?: string };
  return body.outcome ?? 'unknown';
}

/** Worker handlers (`index.ts` exports them together with the Durable Object). */
export const WHATSAPP_WORKER_HANDLERS = {
  fetch: handleWhatsAppFetch,
  scheduled: (event: { readonly cron: string }, env: WhatsAppEnv): Promise<string> =>
    runScheduledSync(env, event.cron),
};
