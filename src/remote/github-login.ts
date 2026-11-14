/**
 * Login do dono pelo GitHub (OAuth App): o servidor remoto manda o navegador ao GitHub, troca o código por um
 * token de uso único, lê os e-mails verificados e só aceita quem está na lista (`ALLOWED_EMAILS`). O token do
 * GitHub não é guardado; o "segredo" que segue selado nos tokens do conector é o e-mail aceito.
 */
import type { UpstreamLogin } from './handler.js';

/** Configuração do login pelo GitHub. */
export interface GithubLoginSettings {
  readonly clientId: string;
  readonly clientSecret: string;
  /** E-mails aceitos, já em minúsculas. */
  readonly allowedEmails: readonly string[];
  readonly fetchFn: typeof fetch;
}

/** Um item de `GET /user/emails` da API do GitHub (só os campos usados). */
export interface GithubEmail {
  readonly email: string;
  readonly verified: boolean;
}

/** User-Agent das chamadas ao GitHub: a API recusa requisições sem ele (e o fetch do Workers não manda um). */
export const GITHUB_USER_AGENT =
  'claude-connectors (+https://github.com/temponi-bernardo/claude-connectors)';

/** Endereço da tela de autorização do GitHub, pedindo só a leitura dos e-mails. */
export function githubAuthorizeUrl(
  settings: GithubLoginSettings,
  state: string,
  callbackUrl: string,
): string {
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', settings.clientId);
  url.searchParams.set('redirect_uri', callbackUrl);
  url.searchParams.set('scope', 'user:email');
  url.searchParams.set('state', state);
  url.searchParams.set('allow_signup', 'false');
  return url.toString();
}

/** Lê uma lista de e-mails separada por vírgula, em minúsculas e sem vazios. */
export function parseEmailList(raw: string | null): string[] {
  return (raw ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.includes('@'));
}

/** Escolhe o primeiro e-mail verificado que está na lista; nulo se nenhum serve. */
export function pickAllowedEmail(
  emails: readonly GithubEmail[],
  allowed: readonly string[],
): string | null {
  const match = emails.find((item) => item.verified && allowed.includes(item.email.toLowerCase()));
  return match ? match.email.toLowerCase() : null;
}

/** Troca o código do GitHub por um token de acesso; rejeita com mensagem ao usuário se falhar. */
export async function exchangeGithubCode(
  settings: GithubLoginSettings,
  code: string,
  callbackUrl: string,
): Promise<string> {
  const res = await settings.fetchFn('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'user-agent': GITHUB_USER_AGENT,
    },
    body: JSON.stringify({
      client_id: settings.clientId,
      client_secret: settings.clientSecret,
      code,
      redirect_uri: callbackUrl,
    }),
  });
  const body = (await res.json().catch(() => null)) as { access_token?: unknown } | null;
  if (!res.ok || typeof body?.access_token !== 'string') {
    throw new Error('O GitHub não confirmou o login. Tente entrar de novo.');
  }
  return body.access_token;
}

/** Lê os e-mails da conta do GitHub com o token de acesso. */
export async function fetchGithubEmails(
  settings: GithubLoginSettings,
  token: string,
): Promise<GithubEmail[]> {
  const res = await settings.fetchFn('https://api.github.com/user/emails', {
    headers: {
      authorization: `Bearer ${token}`,
      accept: 'application/vnd.github+json',
      'user-agent': GITHUB_USER_AGENT,
    },
  });
  if (!res.ok) throw new Error(`O GitHub respondeu ${res.status} ao ler os e-mails da conta.`);
  const body: unknown = await res.json();
  return Array.isArray(body) ? (body as GithubEmail[]) : [];
}

/** Conclui o login: confere o retorno do GitHub e devolve o e-mail aceito, ou rejeita explicando. */
export async function finishGithubLogin(
  settings: GithubLoginSettings,
  query: URLSearchParams,
  callbackUrl: string,
): Promise<string> {
  const code = query.get('code');
  if (!code) throw new Error('Login no GitHub cancelado ou recusado.');
  const token = await exchangeGithubCode(settings, code, callbackUrl);
  const email = pickAllowedEmail(await fetchGithubEmails(settings, token), settings.allowedEmails);
  if (!email) {
    throw new Error(
      'Esta conta do GitHub não tem um e-mail verificado em ALLOWED_EMAILS. Só o dono do servidor pode entrar.',
    );
  }
  return email;
}

/** Login do conector remoto pelo GitHub, no formato que o servidor remoto espera. */
export function githubUpstreamLogin(settings: GithubLoginSettings): UpstreamLogin {
  return {
    kind: 'upstream',
    start: (state, callbackUrl) => githubAuthorizeUrl(settings, state, callbackUrl),
    finish: (query, callbackUrl) => finishGithubLogin(settings, query, callbackUrl),
  };
}
