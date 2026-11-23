import { describe, expect, it } from 'vitest';
import { drainQueue, mapWithLimit } from './async.js';

/** A task that records how many tasks run at once and resolves on the next tick. */
function tracker() {
  const state = { running: 0, peak: 0 };
  async function task(n: number): Promise<number> {
    state.running += 1;
    state.peak = Math.max(state.peak, state.running);
    await new Promise((resolve) => setTimeout(resolve, 1));
    state.running -= 1;
    return n * 10;
  }
  return { state, task };
}

describe('mapWithLimit', () => {
  it('keeps the order of the results and never runs more than the limit at once', async () => {
    const { state, task } = tracker();
    await expect(mapWithLimit([1, 2, 3, 4, 5, 6, 7], 3, task)).resolves.toEqual([
      10, 20, 30, 40, 50, 60, 70,
    ]);
    expect(state.peak).toBe(3);
  });

  it('handles an empty list and a limit below one', async () => {
    const { state, task } = tracker();
    await expect(mapWithLimit([], 3, task)).resolves.toEqual([]);
    await expect(mapWithLimit([1, 2], 0, task)).resolves.toEqual([10, 20]);
    expect(state.peak).toBe(1);
  });

  it('rejects with the first failure', async () => {
    function fail(n: number): Promise<number> {
      return n === 2 ? Promise.reject(new Error('boom')) : Promise.resolve(n);
    }
    await expect(mapWithLimit([1, 2, 3], 2, fail)).rejects.toThrow('boom');
  });
});

describe('drainQueue', () => {
  it('takes items from the shared queue until it is empty', async () => {
    const queue = { items: [1, 2, 3], results: [] as number[], next: 1 };
    await drainQueue(queue, (n) => Promise.resolve(n + 1));
    expect(queue.results).toEqual([undefined, 3, 4]);
    expect(queue.next).toBe(3);
  });
});
