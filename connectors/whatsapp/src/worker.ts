/**
 * Entrada do conector WhatsApp no Cloudflare Workers (ADR 0012): servidor MCP remoto com OAuth (login do dono pelo
 * GitHub), página `/pair` e o Durable Object `WhatsAppBridge`, dono do container da ponte. O sync periódico só
 * roda se `SYNC_CRON` estiver definido e igual ao cron que disparou (desligado por padrão).
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

/** Relógio em segundos Unix. */
export function unixNow(): number {
  return Math.floor(Date.now() / 1000);
}

/** Configuração do login do dono pelo GitHub a partir da configuração do conector. */
export function githubSettingsFrom(settings: WhatsAppSettings): GithubLoginSettings {
  return {
    clientId: settings.githubClientId,
    clientSecret: settings.githubClientSecret,
    allowedEmails: settings.allowedEmails,
    // Arrow: no Workers, o fetch global chamado como método de outro objeto dá "Illegal invocation".
    fetchFn: (input, init) => fetch(input, init),
  };
}

/** Monta o conector remoto do WhatsApp: login pelo GitHub e servidor MCP ligado à ponte. */
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

/** Tudo o que uma requisição precisa: app OAuth/MCP e app do `/pair`. */
export interface WhatsAppApps {
  readonly remote: RemoteApp;
  readonly pair: PairApp;
}

/** Monta os apps do Worker a partir do ambiente, da ponte e da origem da requisição. */
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

/** Atende uma requisição: `/pair` primeiro, depois OAuth e `/mcp`; configuração inválida vira 500 explicado. */
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
    return new Response(`Configuração do Worker inválida: ${message}`, { status: 500 });
  }
  return (await routePairRequest(apps.pair, request)) ?? createRemoteHandler(apps.remote)(request);
}

/** Diz se o cron que disparou é o sync opcional configurado em `SYNC_CRON`. */
export function isSyncCronEnabled(vars: EnvVars, cron: string): boolean {
  const configured = readWhatsAppSettings(vars).syncCron;
  return configured !== null && configured === cron;
}

/** Sync periódico opcional: acorda a ponte, espera as pendências (até 20 s), guarda o snapshot e deixa dormir. */
export async function runScheduledSync(env: WhatsAppEnv, cron: string): Promise<string> {
  if (!isSyncCronEnabled(toEnvVars(env), cron)) return 'disabled';
  const bridge = bridgeFetchFor(bridgeStub(env));
  const deadline = Date.now() + 50_000;
  await withDeadline(
    bridge('/sync/wait?timeout_ms=20000', { method: 'POST' }),
    deadline,
    'sync esgotou o tempo',
  );
  const res = await withDeadline(
    bridge('/__snapshot', { method: 'POST' }),
    deadline,
    'snapshot esgotou o tempo',
  );
  const body = (await res.json()) as { outcome?: string };
  return body.outcome ?? 'unknown';
}

/** Handlers do Worker (o `index.ts` os exporta junto com o Durable Object). */
export const WHATSAPP_WORKER_HANDLERS = {
  fetch: handleWhatsAppFetch,
  scheduled: (event: { readonly cron: string }, env: WhatsAppEnv): Promise<string> =>
    runScheduledSync(env, event.cron),
};
