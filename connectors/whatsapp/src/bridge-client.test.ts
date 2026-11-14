import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  attemptBridge,
  BRIDGE_ERROR_MESSAGES,
  BRIDGE_RETRY_MS,
  BridgeError,
  bridgeErrorFrom,
  bridgeJson,
  bridgePath,
  bridgeTimeoutMessage,
  callBridge,
  jsonPost,
  shouldRetryBridge,
  withDeadline,
  type BridgeFetch,
} from './bridge-client.js';

afterEach(() => {
  vi.useRealTimers();
});

describe('bridgeErrorFrom', () => {
  it('traduz códigos conhecidos e guarda status e código', () => {
    const error = bridgeErrorFrom(404, { error: 'chat_not_found' });
    expect(error).toBeInstanceOf(BridgeError);
    expect(error.message).toBe(BRIDGE_ERROR_MESSAGES.chat_not_found);
    expect([error.status, error.code]).toEqual([404, 'chat_not_found']);
  });

  it('usa a mensagem da ponte ou o status quando o código é desconhecido', () => {
    expect(bridgeErrorFrom(400, { error: 'x', message: 'Explicação' }).message).toBe('Explicação');
    const fallback = bridgeErrorFrom(502, null);
    expect([fallback.message, fallback.code]).toEqual(['The bridge answered 502.', 'http_502']);
  });
});

describe('withDeadline', () => {
  it('devolve o valor dentro do prazo', async () => {
    await expect(withDeadline(Promise.resolve(1), Date.now() + 1000, 'tarde')).resolves.toBe(1);
  });

  it('rejeita ao passar do prazo e quando o prazo já passou', async () => {
    vi.useFakeTimers();
    const slow = withDeadline(new Promise(() => undefined), Date.now() + 50, 'tarde');
    vi.advanceTimersByTime(60);
    await expect(slow).rejects.toThrow('tarde');
    await expect(withDeadline(Promise.resolve(1), Date.now() - 1, 'já foi')).rejects.toThrow(
      'já foi',
    );
  });
});

function later(): number {
  return Date.now() + 5000;
}

describe('callBridge e bridgeJson', () => {
  it('lê o JSON de uma resposta 2xx', async () => {
    const bridge: BridgeFetch = vi.fn(() => Promise.resolve(Response.json({ ok: 1 })));
    await expect(bridgeJson(bridge, '/status', { deadline: later() })).resolves.toEqual({ ok: 1 });
    expect(bridge).toHaveBeenCalledWith('/status', undefined);
  });

  it('lança BridgeError com o código da ponte, mesmo sem corpo JSON', async () => {
    const coded: BridgeFetch = vi.fn(() =>
      Promise.resolve(Response.json({ error: 'not_ready' }, { status: 503 })),
    );
    await expect(callBridge(coded, '/chats', { deadline: later() })).rejects.toMatchObject({
      code: 'not_ready',
    });
    const empty: BridgeFetch = vi.fn(() => Promise.resolve(new Response('x', { status: 500 })));
    await expect(callBridge(empty, '/x', { deadline: later() })).rejects.toThrow('500');
  });

  it('esgota o tempo com mensagem que cita só a rota', async () => {
    const hang: BridgeFetch = vi.fn(() => new Promise<Response>(() => undefined));
    await expect(
      callBridge(hang, '/chats?query=segredo', { deadline: Date.now() + 10 }),
    ).rejects.toThrow(bridgeTimeoutMessage('/chats?query=segredo'));
    expect(bridgeTimeoutMessage('/chats?query=segredo')).not.toContain('segredo');
  });
});

describe('espera da ponte acordando', () => {
  it('shouldRetryBridge só repete not_ready com prazo sobrando', () => {
    const notReady = bridgeErrorFrom(503, { error: 'not_ready' });
    expect(shouldRetryBridge(notReady, 10_000, 0)).toBe(true);
    expect(shouldRetryBridge(notReady, BRIDGE_RETRY_MS, 0)).toBe(false);
    expect(shouldRetryBridge(bridgeErrorFrom(404, { error: 'not_found' }), 10_000, 0)).toBe(false);
  });

  it('callBridge tenta de novo enquanto a ponte inicia e devolve quando fica pronta', async () => {
    let calls = 0;
    const bridge: BridgeFetch = vi.fn(() => {
      calls += 1;
      return Promise.resolve(
        calls < 2
          ? Response.json({ error: 'not_ready' }, { status: 503 })
          : Response.json({ ok: true }),
      );
    });
    const res = await callBridge(bridge, '/status', { deadline: Date.now() + 5000 });
    expect(await res.json()).toEqual({ ok: true });
    expect(calls).toBe(2);
  });

  it('attemptBridge não repete', async () => {
    const bridge: BridgeFetch = vi.fn(() =>
      Promise.resolve(Response.json({ error: 'not_ready' }, { status: 503 })),
    );
    await expect(attemptBridge(bridge, '/x', { deadline: Date.now() + 5000 })).rejects.toThrow(
      BRIDGE_ERROR_MESSAGES.not_ready,
    );
    expect(bridge).toHaveBeenCalledOnce();
  });
});

describe('bridgePath e jsonPost', () => {
  it('monta a query só com valores definidos', () => {
    expect(bridgePath('/chats', { query: 'ana & bia', limit: 5, cursor: undefined, x: '' })).toBe(
      '/chats?query=ana+%26+bia&limit=5',
    );
    expect(bridgePath('/status', {})).toBe('/status');
  });

  it('monta um POST JSON', () => {
    expect(jsonPost({ a: 1 })).toEqual({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{"a":1}',
    });
  });
});
