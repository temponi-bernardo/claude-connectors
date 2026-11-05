/**
 * Login no Canvas por uma janela do Chrome/Edge instalado (playwright-core, sem baixar navegador).
 * Usa um perfil próprio em `<dataDir>/browser-profile`: o login da Microsoft fica guardado nele, então a
 * renovação silenciosa (navegador oculto) costuma funcionar sem o usuário ver nada.
 */
import { join } from 'node:path';
import { chromium, type BrowserContext, type Page } from 'playwright-core';
import type { LoginMode } from './auth.js';
import type { CanvasSession } from './session.js';

/** Tempo máximo de espera por modo: renovação silenciosa é rápida; com janela, o usuário digita a senha. */
export const LOGIN_TIMEOUT_MS: Readonly<Record<LoginMode, number>> = {
  silent: 25_000,
  window: 5 * 60_000,
};

/** Navegadores tentados, em ordem (canais do playwright). */
export const BROWSER_CHANNELS = ['chrome', 'msedge'] as const;

/** Opções do login. */
export interface BrowserLoginOptions {
  readonly baseUrl: string;
  readonly dataDir: string;
  readonly loginButtonText: string;
}

/** Decide se a URL é a tela de escolha de login do Canvas (onde o botão da instituição é clicado). */
export function isLoginChooserUrl(url: string): boolean {
  return /login\.instructure\.com\/discovery|\/login(\/|$|\?)/.test(url);
}

/** Abre o perfil do conector no primeiro navegador disponível (oculto ou com janela). */
export async function launchLoginBrowser(
  dataDir: string,
  headless: boolean,
): Promise<BrowserContext> {
  let lastError: unknown;
  for (const channel of BROWSER_CHANNELS) {
    try {
      return await chromium.launchPersistentContext(join(dataDir, 'browser-profile'), {
        channel,
        headless,
        viewport: null,
        args: headless ? [] : ['--window-size=520,760'],
      });
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`Não consegui abrir o Chrome nem o Edge: ${String(lastError)}`);
}

/** Confere, de dentro de uma aba no domínio do Canvas, se a API responde com a sessão do navegador. */
export async function pageHasCanvasSession(page: Page, baseUrl: string): Promise<boolean> {
  if (!page.url().startsWith(baseUrl)) return false;
  return page
    .evaluate(
      async (base) => (await fetch(`${base}/api/v1/users/self`, { credentials: 'include' })).ok,
      baseUrl,
    )
    .catch(() => false);
}

/** Clica no botão da instituição nas abas que estão na tela de escolha de login. */
export async function clickInstitutionButton(pages: readonly Page[], text: string): Promise<void> {
  for (const page of pages.filter((p) => isLoginChooserUrl(p.url()))) {
    const button = page.getByText(text, { exact: false }).first();
    if (await button.isVisible().catch(() => false)) await button.click().catch(() => undefined);
  }
}

/** Espera até alguma aba ter sessão no Canvas; clica no botão da instituição pelo caminho. */
export async function waitForCanvasLogin(
  context: BrowserContext,
  opts: BrowserLoginOptions,
  mode: LoginMode,
): Promise<void> {
  const deadline = Date.now() + LOGIN_TIMEOUT_MS[mode];
  while (Date.now() < deadline) {
    const pages = context.pages().filter((p) => !p.isClosed());
    if (pages.length === 0) throw new Error('A janela de login foi fechada antes de terminar.');
    for (const page of pages) if (await pageHasCanvasSession(page, opts.baseUrl)) return;
    await clickInstitutionButton(pages, opts.loginButtonText);
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  const where = context
    .pages()
    .map((p) => p.url().split('?')[0])
    .join(', ');
  throw new Error(`Login não concluído a tempo (${mode}; parou em: ${where}).`);
}

/** Faz o login no modo pedido e devolve a sessão com os cookies do domínio do Canvas. */
export async function browserLogin(
  opts: BrowserLoginOptions,
  mode: LoginMode,
): Promise<CanvasSession> {
  const context = await launchLoginBrowser(opts.dataDir, mode === 'silent');
  try {
    const first = context.pages()[0] ?? (await context.newPage());
    await first.goto(opts.baseUrl, { waitUntil: 'domcontentloaded' }).catch(() => undefined);
    await waitForCanvasLogin(context, opts, mode);
    const cookies = (await context.cookies(opts.baseUrl)).map(({ name, value }) => ({
      name,
      value,
    }));
    return { baseUrl: opts.baseUrl, savedAt: new Date().toISOString(), cookies };
  } finally {
    await context.close().catch(() => undefined);
  }
}
