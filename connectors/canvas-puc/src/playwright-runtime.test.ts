import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  PLAYWRIGHT_VERSION,
  npmInstallArgs,
  resolveFrom,
  runtimeDir,
} from './playwright-runtime.js';

const dirs: string[] = [];
function tempDir(): string {
  // realpath: no macOS o tmpdir é um link (/var → /private/var) e o require.resolve devolve o caminho real.
  const dir = realpathSync(mkdtempSync(join(tmpdir(), 'pw-runtime-')));
  dirs.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('PLAYWRIGHT_VERSION', () => {
  it('é a mesma versão instalada no repositório', () => {
    const pkg = JSON.parse(
      readFileSync(join('node_modules', 'playwright-core', 'package.json'), 'utf8'),
    ) as { version: string };
    expect(PLAYWRIGHT_VERSION).toBe(pkg.version);
  });
});

describe('runtimeDir e npmInstallArgs', () => {
  it('instala numa subpasta runtime com a versão fixa', () => {
    expect(runtimeDir('/d')).toBe(join('/d', 'runtime'));
    expect(npmInstallArgs('1.2.3')).toEqual([
      'install',
      'playwright-core@1.2.3',
      '--omit=dev',
      '--no-audit',
      '--no-fund',
      '--silent',
    ]);
  });
});

describe('resolveFrom', () => {
  it('acha um pacote instalado na pasta e devolve null quando não há', () => {
    const dir = tempDir();
    expect(resolveFrom(dir, 'pacote-falso')).toBeNull();
    mkdirSync(join(dir, 'node_modules', 'pacote-falso'), { recursive: true });
    writeFileSync(
      join(dir, 'node_modules', 'pacote-falso', 'package.json'),
      '{"name":"pacote-falso","main":"index.js"}',
    );
    writeFileSync(join(dir, 'node_modules', 'pacote-falso', 'index.js'), 'module.exports = 1;');
    expect(resolveFrom(dir, 'pacote-falso')).toBe(
      join(dir, 'node_modules', 'pacote-falso', 'index.js'),
    );
  });
});
