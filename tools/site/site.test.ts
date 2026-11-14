import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Site público do GitHub Pages (ADR 0012): páginas em docs/, montadas pelo Jekyll com docs/_layouts/site.html.
const DOCS = join(import.meta.dirname, '..', '..', 'docs');
const PAGES = ['index.html', 'privacidade.html', 'termos.html'];
function read(file: string): string {
  return readFileSync(join(DOCS, file), 'utf8');
}
const layout = read('_layouts/site.html');

describe('site do GitHub Pages', () => {
  it('publica só as páginas do site: a documentação interna fica de fora', () => {
    const config = read('_config.yml');
    expect(config).toMatch(/- '\*\.md'/);
    expect(config).toMatch(/- adr\b/);
    expect(config).toMatch(/- STATE\.md/);
    const html = readdirSync(DOCS).filter((name) => name.endsWith('.html'));
    expect(html.sort()).toEqual([...PAGES].sort());
  });

  it.each(PAGES)('%s usa o layout e tem título e descrição', (page) => {
    const front = /^---\n([\s\S]*?)\n---\n/.exec(read(page))?.[1] ?? '';
    expect(front).toMatch(/^layout: site$/m);
    expect(front).toMatch(/^title: \S/m);
    expect(front).toMatch(/^description: \S/m);
  });

  it.each(PAGES)('%s não tem script, estilo inline nem e-mail', (page) => {
    const html = read(page);
    expect(html).not.toMatch(/<script|style=|<style|on[a-z]+=/i);
    expect(html).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
  });

  it('links internos apontam para páginas que existem', () => {
    const sources = [layout, ...PAGES.map(read)].join('\n');
    const targets = [...sources.matchAll(/\{\{ '\/([^']*)' \| relative_url \}\}/g)].map(
      (m) => m[1]!,
    );
    expect(targets.length).toBeGreaterThan(0);
    for (const target of targets)
      expect(existsSync(join(DOCS, target || 'index.html')), target).toBe(true);
  });

  it('o layout bloqueia scripts e liga privacidade e termos em toda página', () => {
    expect(layout).toMatch(/Content-Security-Policy/);
    expect(layout).toMatch(/default-src 'none'/);
    expect(layout).not.toMatch(/script-src/);
    expect(layout).toContain("'/privacidade.html' | relative_url");
    expect(layout).toContain("'/termos.html' | relative_url");
  });

  it('a página de privacidade cobre dados, compartilhamento e exclusão', () => {
    const html = read('privacidade.html');
    for (const heading of [
      'Que dados são acessados',
      'Com quem os dados são compartilhados',
      'Como apagar',
    ]) {
      expect(html).toContain(heading);
    }
  });

  it('o plugin do Canvas aponta para o site', () => {
    const plugin = JSON.parse(
      readFileSync(
        join(DOCS, '..', 'connectors', 'canvas-puc', '.claude-plugin', 'plugin.json'),
        'utf8',
      ),
    ) as { homepage?: string };
    expect(plugin.homepage).toBe('https://temponi-bernardo.github.io/claude-connectors/');
  });

  it('as páginas não descrevem mais o conector local', () => {
    for (const page of ['index.html', 'privacidade.html']) {
      const html = readFileSync(join(DOCS, page), 'utf8');
      expect(html).not.toContain('desconectar_canvas');
      expect(html).not.toContain('~/.canvas-puc');
    }
  });
});
