import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  PACKAGE_FILES,
  TEMPLATE_FILES,
  applyPackageValues,
  initFile,
  initProject,
  parseInitArgs,
  parseKeyValueArgs,
  replacePlaceholders,
  requireArg,
  resetChangelog,
  rewriteFile,
} from './init.js';

const values = { name: 'meu-app', description: 'Faz coisas', owner: 'conta' };

describe('parseKeyValueArgs / requireArg / parseInitArgs', () => {
  it('lê pares --chave valor', () => {
    expect(parseKeyValueArgs(['--a', '1', '--b', '2'])).toEqual(
      new Map([
        ['a', '1'],
        ['b', '2'],
      ]),
    );
    expect(() => parseKeyValueArgs(['solto'])).toThrow('Argumento inesperado');
    expect(parseKeyValueArgs(['--a'])).toEqual(new Map([['a', '']]));
  });

  it('exige os argumentos obrigatórios', () => {
    expect(() => requireArg(new Map(), 'name')).toThrow('--name');
    expect(() => parseInitArgs(['--name', 'x', '--description', 'y'])).toThrow('--owner');
  });

  it('normaliza o nome como slug', () => {
    expect(parseInitArgs(['--name', 'Meu App!', '--description', 'd', '--owner', 'o'])).toEqual({
      name: 'meu-app',
      description: 'd',
      owner: 'o',
    });
  });
});

describe('replacePlaceholders', () => {
  it('substitui marcadores conhecidos e preserva desconhecidos', () => {
    const out = replacePlaceholders(
      '{{PROJECT_NAME}} por {{GITHUB_OWNER}} ({{YEAR}}) {{OUTRO}}',
      values,
    );
    expect(out).toContain('meu-app por conta');
    expect(out).toContain(String(new Date().getFullYear()));
    expect(out).toContain('{{OUTRO}}');
  });
});

describe('initFile / initProject', () => {
  it('reescreve só arquivos com marcadores e ignora ausentes', () => {
    const root = mkdtempSync(join(tmpdir(), 'init-'));
    try {
      mkdirSync(join(root, 'docs'));
      writeFileSync(join(root, 'README.md'), '# {{PROJECT_NAME}}\n{{PROJECT_DESCRIPTION}}');
      writeFileSync(join(root, 'CLAUDE.md'), 'sem marcador');
      expect(initProject(root, values)).toEqual(['README.md']);
      expect(readFileSync(join(root, 'README.md'), 'utf8')).toBe('# meu-app\nFaz coisas');
      expect(initFile(root, 'nao-existe.md', values)).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe('arquivos reais do template', () => {
  it('todo arquivo de TEMPLATE_FILES tem ao menos um marcador conhecido', () => {
    for (const file of TEMPLATE_FILES) {
      const text = readFileSync(join(process.cwd(), file), 'utf8');
      expect(replacePlaceholders(text, values), file).not.toBe(text);
    }
  });

  it('todo arquivo de PACKAGE_FILES muda de nome com applyPackageValues', () => {
    for (const file of PACKAGE_FILES) {
      const text = readFileSync(join(process.cwd(), file), 'utf8');
      expect(applyPackageValues(text, values), file).toContain('"name": "meu-app"');
    }
  });
});

describe('applyPackageValues', () => {
  it('renomeia o pacote e troca a descrição só onde ela existe', () => {
    const pkg = JSON.stringify({ name: 'template', description: 'velha', version: '0.1.0' });
    expect(JSON.parse(applyPackageValues(pkg, values))).toEqual({
      name: 'meu-app',
      description: 'Faz coisas',
      version: '0.1.0',
    });
  });

  it('renomeia também o pacote raiz do package-lock e termina com quebra de linha', () => {
    const lock = JSON.stringify({
      name: 't',
      packages: { '': { name: 't' }, 'node_modules/x': {} },
    });
    const out = applyPackageValues(lock, values);
    expect(out.endsWith('}\n')).toBe(true);
    expect(JSON.parse(out)).toEqual({
      name: 'meu-app',
      packages: { '': { name: 'meu-app' }, 'node_modules/x': {} },
    });
  });
});

describe('resetChangelog', () => {
  it('esvazia a seção "Não lançado" e preserva o resto', () => {
    const text =
      '# Changelog\n\nIntro.\n\n## [Não lançado]\n\n### Adicionado\n\n- coisa do template\n\n## [0.1.0]\n\n- antiga\n';
    expect(resetChangelog(text)).toBe(
      '# Changelog\n\nIntro.\n\n## [Não lançado]\n\n## [0.1.0]\n\n- antiga\n',
    );
  });

  it('funciona quando "Não lançado" é a última seção ou não existe', () => {
    expect(resetChangelog('# C\n\n## [Não lançado]\n\n- x\n')).toBe('# C\n\n## [Não lançado]\n');
    expect(resetChangelog('# C\n')).toBe('# C\n');
  });
});

describe('initProject (completo)', () => {
  it('aplica marcadores, renomeia o pacote e limpa o CHANGELOG', () => {
    const root = mkdtempSync(join(tmpdir(), 'init-full-'));
    try {
      writeFileSync(join(root, 'README.md'), '# {{PROJECT_NAME}}');
      writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'template' }));
      writeFileSync(join(root, 'CHANGELOG.md'), '# C\n\n## [Não lançado]\n\n- x\n');
      expect(initProject(root, values)).toEqual(['README.md', 'package.json', 'CHANGELOG.md']);
      expect(readFileSync(join(root, 'package.json'), 'utf8')).toContain('"meu-app"');
      expect(readFileSync(join(root, 'CHANGELOG.md'), 'utf8')).toBe('# C\n\n## [Não lançado]\n');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});

describe('rewriteFile', () => {
  it('grava só quando o conteúdo muda e ignora arquivo ausente', () => {
    const root = mkdtempSync(join(tmpdir(), 'rewrite-'));
    try {
      writeFileSync(join(root, 'a.txt'), 'abc');
      expect(rewriteFile(root, 'a.txt', (t) => t)).toBe(false);
      expect(rewriteFile(root, 'a.txt', (t) => t.toUpperCase())).toBe(true);
      expect(readFileSync(join(root, 'a.txt'), 'utf8')).toBe('ABC');
      expect(rewriteFile(root, 'nao-existe.txt', (t) => t)).toBe(false);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
