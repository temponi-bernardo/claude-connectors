import { describe, expect, it } from 'vitest';
import {
  CREATE_HINTS,
  DESTRUCTIVE_HINTS,
  ORGANIZE_HINTS,
  READ_ONLY_HINTS,
  SEND_HINTS,
  toolAnnotations,
  type RequiredToolAnnotations,
} from './annotations.js';

describe('toolAnnotations', () => {
  it('joins the title with the hint preset', () => {
    expect(toolAnnotations('List courses', READ_ONLY_HINTS)).toEqual({
      title: 'List courses',
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    });
  });

  it('keeps every preset either read-only or explicit about being destructive', () => {
    const presets = [READ_ONLY_HINTS, SEND_HINTS, DESTRUCTIVE_HINTS, ORGANIZE_HINTS, CREATE_HINTS];
    for (const hints of presets) {
      const annotations: RequiredToolAnnotations = toolAnnotations('T', hints);
      expect(annotations.readOnlyHint || typeof annotations.destructiveHint === 'boolean').toBe(
        true,
      );
    }
    expect(SEND_HINTS).toMatchObject({ destructiveHint: true, idempotentHint: false });
    expect(DESTRUCTIVE_HINTS).toMatchObject({ destructiveHint: true, idempotentHint: true });
  });
});
