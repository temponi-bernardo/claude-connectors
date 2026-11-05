import { describe, expect, it } from 'vitest';
import { BROWSER_CHANNELS, LOGIN_TIMEOUT_MS, isLoginChooserUrl } from './browser-login.js';

describe('isLoginChooserUrl', () => {
  it('reconhece a tela de escolha de login do Canvas', () => {
    expect(isLoginChooserUrl('https://iad.login.instructure.com/discovery/abc')).toBe(true);
    expect(isLoginChooserUrl('https://pucminas.instructure.com/login')).toBe(true);
    expect(isLoginChooserUrl('https://pucminas.instructure.com/login/saml?x=1')).toBe(true);
  });

  it('ignora o painel e páginas da Microsoft', () => {
    expect(isLoginChooserUrl('https://pucminas.instructure.com/')).toBe(false);
    expect(isLoginChooserUrl('https://login.microsoftonline.com/common/oauth2')).toBe(false);
    expect(isLoginChooserUrl('https://pucminas.instructure.com/courses/loginho')).toBe(false);
  });
});

describe('constantes do login', () => {
  it('dá mais tempo com janela e tenta Chrome antes do Edge', () => {
    expect(LOGIN_TIMEOUT_MS.window).toBeGreaterThan(LOGIN_TIMEOUT_MS.silent);
    expect(BROWSER_CHANNELS[0]).toBe('chrome');
  });
});
