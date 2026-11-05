import { describe, expect, it } from 'vitest';
import { escapeHtml, renderLoginPage, type LoginPageText } from './login-page.js';

const text: LoginPageText = {
  title: 'Conectar o Canvas',
  intro: 'Cole o token de acesso do Canvas.',
  secretLabel: 'Token de acesso',
  helpUrl: 'https://pucminas.instructure.com/profile/settings',
  helpLabel: 'Gerar token',
  submit: 'Conectar',
};

describe('escapeHtml', () => {
  it('neutraliza os caracteres especiais do HTML', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;',
    );
  });
});

describe('renderLoginPage', () => {
  it('monta o formulário com o pedido selado, o destino e o link de ajuda', () => {
    const html = renderLoginPage({
      text,
      pending: 'selo-123',
      clientHost: 'claude.ai',
      error: null,
    });
    expect(html).toContain('<form method="post" action="/authorize">');
    expect(html).toContain('name="pending" value="selo-123"');
    expect(html).toContain('type="password" name="secret"');
    expect(html).toContain('claude.ai');
    expect(html).toContain('href="https://pucminas.instructure.com/profile/settings"');
    expect(html).not.toContain('role="alert"');
  });

  it('mostra o erro escapado quando houver', () => {
    const html = renderLoginPage({
      text,
      pending: 'p',
      clientHost: 'claude.ai',
      error: '<b>falhou</b>',
    });
    expect(html).toContain('role="alert"');
    expect(html).toContain('&lt;b&gt;falhou&lt;/b&gt;');
  });
});
