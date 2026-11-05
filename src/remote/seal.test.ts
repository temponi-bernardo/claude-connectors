import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { openSealed, parseSealKey, sealPayload, unsealPayload } from './seal.js';

const KEY = randomBytes(32);

describe('parseSealKey', () => {
  it('aceita 32 bytes em base64 ou base64url', () => {
    expect(parseSealKey(KEY.toString('base64')).equals(KEY)).toBe(true);
    expect(parseSealKey(KEY.toString('base64url')).equals(KEY)).toBe(true);
  });

  it('recusa chave ausente ou de tamanho errado, dizendo como gerar', () => {
    expect(() => parseSealKey(null)).toThrow(/SEAL_KEY/);
    expect(() => parseSealKey(randomBytes(16).toString('base64'))).toThrow(/32 bytes/);
  });
});

describe('sealPayload e unsealPayload', () => {
  it('abre o que selou, com IV diferente a cada selo', () => {
    const a = sealPayload({ typ: 'x', n: 1 }, KEY);
    const b = sealPayload({ typ: 'x', n: 1 }, KEY);
    expect(a).not.toBe(b);
    expect(unsealPayload(a, KEY)).toEqual({ typ: 'x', n: 1 });
  });

  it('devolve nulo para outra chave, texto adulterado ou lixo', () => {
    const sealed = sealPayload({ typ: 'x' }, KEY);
    expect(unsealPayload(sealed, randomBytes(32))).toBeNull();
    expect(unsealPayload(`${sealed.slice(0, -2)}AA`, KEY)).toBeNull();
    expect(unsealPayload('abc', KEY)).toBeNull();
    expect(unsealPayload(sealPayload('texto', KEY), KEY)).toBeNull();
  });
});

describe('openSealed', () => {
  const now = 1_000;

  it('abre só o tipo pedido e dentro da validade', () => {
    const sealed = sealPayload({ typ: 'code', exp: now + 1, v: 'ok' }, KEY);
    expect(openSealed(sealed, KEY, { typ: 'code', now })).toEqual({
      typ: 'code',
      exp: now + 1,
      v: 'ok',
    });
    expect(openSealed(sealed, KEY, { typ: 'access', now })).toBeNull();
    expect(openSealed(sealed, KEY, { typ: 'code', now: now + 1 })).toBeNull();
  });

  it('recusa selo sem validade numérica', () => {
    expect(openSealed(sealPayload({ typ: 'code' }, KEY), KEY, { typ: 'code', now })).toBeNull();
  });
});
