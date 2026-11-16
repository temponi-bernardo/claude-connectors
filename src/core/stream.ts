/**
 * Web Streams helpers (Node and Workers): cap a byte stream, encode it as base64 piece by piece and frame it,
 * so a large file crosses the server without ever being held whole in memory (ADR 0023).
 */
import { bytesToBase64, concatBytes } from './bytes.js';

/** Bytes ready to encode (a multiple of 3, so the base64 pieces join without padding) and the carried rest. */
export function splitBase64Ready(
  carry: Uint8Array,
  chunk: Uint8Array,
): { readonly ready: Uint8Array; readonly rest: Uint8Array } {
  const joined = carry.length ? concatBytes([carry, chunk]) : chunk;
  const cut = joined.length - (joined.length % 3);
  return { ready: joined.subarray(0, cut), rest: joined.slice(cut) };
}

/** Transform that turns bytes into the ASCII bytes of their base64, identical to encoding the whole buffer. */
export function base64EncodeStream(): TransformStream<Uint8Array, Uint8Array> {
  const encoder = new TextEncoder();
  let carry: Uint8Array = new Uint8Array(0);
  return new TransformStream({
    transform(chunk, controller) {
      const { ready, rest } = splitBase64Ready(carry, chunk);
      carry = rest;
      if (ready.length) controller.enqueue(encoder.encode(bytesToBase64(ready)));
    },
    flush(controller) {
      if (carry.length) controller.enqueue(encoder.encode(bytesToBase64(carry)));
    },
  });
}

/** Transform that passes bytes through and fails with `message` as soon as the total passes `maxBytes`. */
export function byteLimitStream(
  maxBytes: number,
  message: string,
): TransformStream<Uint8Array, Uint8Array> {
  let total = 0;
  return new TransformStream({
    transform(chunk, controller) {
      total += chunk.length;
      if (total > maxBytes) controller.error(new Error(message));
      else controller.enqueue(chunk);
    },
  });
}

/** Transform that writes `prefix` before the content and `suffix` after it (UTF-8). */
export function framedStream(
  prefix: string,
  suffix: string,
): TransformStream<Uint8Array, Uint8Array> {
  const encoder = new TextEncoder();
  return new TransformStream({
    start(controller) {
      controller.enqueue(encoder.encode(prefix));
    },
    flush(controller) {
      controller.enqueue(encoder.encode(suffix));
    },
  });
}

/** Reads a whole body (an empty one for `null`), failing with `message` once it passes `maxBytes`. */
export async function readLimitedBytes(
  body: ReadableStream<Uint8Array> | null,
  maxBytes: number,
  message: string,
): Promise<Uint8Array> {
  if (!body) return new Uint8Array(0);
  const limited = body.pipeThrough(byteLimitStream(maxBytes, message));
  return new Uint8Array(await new Response(limited).arrayBuffer());
}
