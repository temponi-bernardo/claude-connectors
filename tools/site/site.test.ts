import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Public GitHub Pages site (ADR 0012): pages in docs/, built by Jekyll with docs/_layouts/site.html.
const DOCS = join(import.meta.dirname, '..', '..', 'docs');
const CONNECTORS = join(DOCS, '..', 'connectors');
const SITE_URL = 'https://temponi-bernardo.github.io/claude-connectors/';
const PAGES = ['index.html', 'privacy.html', 'terms.html'];
// Old Portuguese addresses kept as redirect stubs so existing links keep working.
const REDIRECTS: Record<string, string> = {
  'privacidade.html': '/privacy.html',
  'termos.html': '/terms.html',
};
function read(file: string): string {
  return readFileSync(join(DOCS, file), 'utf8');
}
function frontMatter(file: string): string {
  return /^---\n([\s\S]*?)\n---\n/.exec(read(file))?.[1] ?? '';
}
function pluginManifest(connector: string): { homepage?: string; privacyPolicyUrl?: string } {
  const file = join(CONNECTORS, connector, 'plugin', '.claude-plugin', 'plugin.json');
  return JSON.parse(readFileSync(file, 'utf8')) as { homepage?: string; privacyPolicyUrl?: string };
}
const layout = read('_layouts/site.html');
const redirectLayout = read('_layouts/redirect.html');

describe('GitHub Pages site', () => {
  it('publishes only the site pages: the internal documentation is left out', () => {
    const config = read('_config.yml');
    expect(config).toMatch(/- '\*\.md'/);
    expect(config).toMatch(/- adr\b/);
    expect(config).toMatch(/- STATE\.md/);
    const html = readdirSync(DOCS).filter((name) => name.endsWith('.html'));
    expect(html.sort()).toEqual([...PAGES, ...Object.keys(REDIRECTS)].sort());
  });

  it('declares English as the site language', () => {
    expect(read('_config.yml')).toMatch(/^lang: en$/m);
    expect(layout).toContain('<html lang="en">');
    expect(redirectLayout).toContain('<html lang="en">');
  });

  it.each(PAGES)('%s uses the layout and has a title and description', (page) => {
    const front = frontMatter(page);
    expect(front).toMatch(/^layout: site$/m);
    expect(front).toMatch(/^title: \S/m);
    expect(front).toMatch(/^description: \S/m);
  });

  it.each([...PAGES, ...Object.keys(REDIRECTS)])(
    '%s has no script, inline style or email address',
    (page) => {
      const html = read(page);
      expect(html).not.toMatch(/<script|style=|<style|on[a-z]+=/i);
      expect(html).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
    },
  );

  it('internal links point to pages that exist', () => {
    const sources = [layout, ...PAGES.map(read)].join('\n');
    const targets = [...sources.matchAll(/\{\{ '\/([^']*)' \| relative_url \}\}/g)].map(
      (m) => m[1]!,
    );
    expect(targets.length).toBeGreaterThan(0);
    for (const target of targets)
      expect(existsSync(join(DOCS, target || 'index.html')), target).toBe(true);
  });

  it('the layout blocks scripts and links privacy and terms on every page', () => {
    expect(layout).toMatch(/Content-Security-Policy/);
    expect(layout).toMatch(/default-src 'none'/);
    expect(layout).not.toMatch(/script-src/);
    expect(layout).toContain("'/privacy.html' | relative_url");
    expect(layout).toContain("'/terms.html' | relative_url");
  });

  it.each(Object.entries(REDIRECTS))('%s redirects to %s, which exists', (page, target) => {
    const front = frontMatter(page);
    expect(front).toMatch(/^layout: redirect$/m);
    expect(front).toMatch(/^title: \S/m);
    expect(front).toContain(`target: ${target}`);
    expect(existsSync(join(DOCS, target))).toBe(true);
  });

  it('the redirect layout refreshes to the target, points canonical to it and blocks scripts', () => {
    expect(redirectLayout).toContain(
      '<meta http-equiv="refresh" content="0; url={{ page.target | relative_url }}" />',
    );
    expect(redirectLayout).toContain(
      '<link rel="canonical" href="{{ page.target | absolute_url }}" />',
    );
    expect(redirectLayout).toContain('<a href="{{ page.target | relative_url }}">');
    expect(redirectLayout).toMatch(/<meta name="robots" content="noindex" \/>/);
    expect(redirectLayout).toMatch(/default-src 'none'/);
    expect(redirectLayout).not.toMatch(/<script|script-src/);
  });

  it('the privacy policy covers data, sharing and deletion', () => {
    const html = read('privacy.html');
    for (const heading of [
      'What data is accessed',
      'Who the data is shared with',
      'How to delete',
      '<h2>Gmail</h2>',
      '<h2>WhatsApp</h2>',
    ]) {
      expect(html).toContain(heading);
    }
  });

  it('the Canvas plugin points to the site', () => {
    expect(pluginManifest('canvas-puc').homepage).toBe(SITE_URL);
  });

  it.each(['canvas-puc', 'gmail', 'whatsapp'])(
    'the %s plugin points its privacy policy to the English page',
    (connector) => {
      expect(pluginManifest(connector).privacyPolicyUrl).toBe(`${SITE_URL}privacy.html`);
    },
  );

  it('the pages no longer describe the local connector', () => {
    for (const page of ['index.html', 'privacy.html']) {
      const html = read(page);
      expect(html).not.toContain('desconectar_canvas');
      expect(html).not.toContain('~/.canvas-puc');
    }
  });
});
