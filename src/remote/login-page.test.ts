import { describe, expect, it } from 'vitest';
import { escapeHtml, renderLoginPage, type LoginPageText } from './login-page.js';

const text: LoginPageText = {
  title: 'Connect Canvas',
  intro: 'Paste your Canvas access token.',
  secretLabel: 'Access token',
  helpUrl: 'https://pucminas.instructure.com/profile/settings',
  helpLabel: 'Generate a token',
  submit: 'Connect',
};

describe('escapeHtml', () => {
  it('neutralizes the HTML special characters', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;',
    );
  });
});

describe('renderLoginPage', () => {
  it('builds the form with the sealed request, the destination and the help link', () => {
    const html = renderLoginPage({
      text,
      pending: 'seal-123',
      clientHost: 'claude.ai',
      error: null,
    });
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('<form method="post" action="/authorize">');
    expect(html).toContain('name="pending" value="seal-123"');
    expect(html).toContain('type="password" name="secret"');
    expect(html).toContain('Access will be granted to <strong>claude.ai</strong>.');
    expect(html).toContain('href="https://pucminas.instructure.com/profile/settings"');
    expect(html).not.toContain('role="alert"');
  });

  it('shows the escaped error when there is one', () => {
    const html = renderLoginPage({
      text,
      pending: 'p',
      clientHost: 'claude.ai',
      error: '<b>failed</b>',
    });
    expect(html).toContain('role="alert"');
    expect(html).toContain('&lt;b&gt;failed&lt;/b&gt;');
  });
});
