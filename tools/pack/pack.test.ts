import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  RUNTIME_EXTERNALS,
  bundleOptions,
  listConnectors,
  readManifestIdentity,
  runtimePackageJson,
} from './pack.js';

const dirs: string[] = [];
function tempRoot(): string {
  const dir = mkdtempSync(join(tmpdir(), 'pack-'));
  dirs.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('listConnectors', () => {
  it('lista só pastas com manifest.json, em ordem', () => {
    const root = tempRoot();
    for (const name of ['zeta', 'alfa', 'sem-manifesto'])
      mkdirSync(join(root, 'connectors', name), { recursive: true });
    writeFileSync(join(root, 'connectors', 'zeta', 'manifest.json'), '{}');
    writeFileSync(join(root, 'connectors', 'alfa', 'manifest.json'), '{}');
    writeFileSync(join(root, 'connectors', 'arquivo.txt'), '');
    expect(listConnectors(root)).toEqual(['alfa', 'zeta']);
  });

  it('devolve vazio sem a pasta connectors', () => {
    expect(listConnectors(tempRoot())).toEqual([]);
  });
});

describe('readManifestIdentity', () => {
  it('lê nome e versão ou falha se faltarem', () => {
    const root = tempRoot();
    writeFileSync(join(root, 'ok.json'), '{"name":"x","version":"1.0.0"}');
    writeFileSync(join(root, 'ruim.json'), '{"name":"x"}');
    expect(readManifestIdentity(join(root, 'ok.json'))).toEqual({ name: 'x', version: '1.0.0' });
    expect(() => readManifestIdentity(join(root, 'ruim.json'))).toThrow('sem "name" ou "version"');
  });
});

describe('runtimePackageJson', () => {
  it('fixa as versões instaladas das dependências externas', () => {
    const versions = Object.fromEntries(RUNTIME_EXTERNALS.map((d) => [d, '1.2.3']));
    const pkg = runtimePackageJson({ name: 'c', version: '0.1.0' }, versions);
    expect(pkg).toMatchObject({ name: 'c', version: '0.1.0', private: true, type: 'module' });
    expect(Object.values(pkg.dependencies)).toEqual(RUNTIME_EXTERNALS.map(() => '1.2.3'));
  });

  it('falha se uma dependência externa não estiver instalada', () => {
    expect(() => runtimePackageJson({ name: 'c', version: '1' }, {})).toThrow('não está instalada');
  });
});

describe('bundleOptions', () => {
  it('gera ESM para Node com as externas de fora e shim de require', () => {
    const opts = bundleOptions('in.ts', 'out.js');
    expect(opts).toMatchObject({
      entryPoints: ['in.ts'],
      outfile: 'out.js',
      bundle: true,
      platform: 'node',
      format: 'esm',
    });
    expect(opts.external).toEqual([...RUNTIME_EXTERNALS]);
    expect(opts.banner?.js).toContain('createRequire');
  });
});
