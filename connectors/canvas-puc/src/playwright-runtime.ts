/**
 * Carrega o `playwright-core` só quando o login pelo navegador é necessário.
 * No pacote `.mcpb` e em desenvolvimento ele já está em node_modules. No plugin do Claude Code (que não roda
 * `npm install`), é instalado uma vez em `<dataDir>/runtime` e reaproveitado (ADR 0008).
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type * as Playwright from 'playwright-core';

/** Versão instalada sob demanda; deve ser igual à do package.json (conferido em teste). */
export const PLAYWRIGHT_VERSION = '1.64.1';

/** Módulo do playwright-core. */
export type PlaywrightModule = typeof Playwright;

/** Pasta onde o playwright-core é instalado sob demanda. */
export function runtimeDir(dataDir: string): string {
  return join(dataDir, 'runtime');
}

/** Argumentos do `npm install` que instala o playwright-core na pasta de runtime. */
export function npmInstallArgs(version: string): string[] {
  return [
    'install',
    `playwright-core@${version}`,
    '--omit=dev',
    '--no-audit',
    '--no-fund',
    '--silent',
  ];
}

/** Resolve o caminho de entrada de um pacote instalado em `dir`, ou `null` se não estiver lá. */
export function resolveFrom(dir: string, pkg: string): string | null {
  try {
    return createRequire(join(dir, 'package.json')).resolve(pkg);
  } catch {
    return null;
  }
}

/** Instala o playwright-core em `dir` com o npm do sistema. */
export function installPlaywright(dir: string): void {
  mkdirSync(dir, { recursive: true });
  const pkgJson = join(dir, 'package.json');
  if (!existsSync(pkgJson)) writeFileSync(pkgJson, '{ "private": true }\n');
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  execFileSync(npm, npmInstallArgs(PLAYWRIGHT_VERSION), {
    cwd: dir,
    stdio: 'ignore',
    shell: process.platform === 'win32',
  });
}

/** Devolve o playwright-core: do node_modules normal, da pasta de runtime, ou instalando nela. */
export async function loadPlaywright(dataDir: string): Promise<PlaywrightModule> {
  try {
    return await import('playwright-core');
  } catch {
    const dir = runtimeDir(dataDir);
    let entry = resolveFrom(dir, 'playwright-core');
    if (!entry) {
      installPlaywright(dir);
      entry = resolveFrom(dir, 'playwright-core');
    }
    if (!entry) throw new Error('Não consegui instalar o playwright-core (o npm está no PATH?).');
    return (await import(pathToFileURL(entry).href)) as PlaywrightModule;
  }
}
