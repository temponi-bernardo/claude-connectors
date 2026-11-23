/**
 * Async helpers with no effects of their own: bounded concurrency over a list.
 */

/** Work shared by the workers of `mapWithLimit`: the items, their results and the next index to take. */
export interface WorkQueue<T, R> {
  readonly items: readonly T[];
  readonly results: R[];
  next: number;
}

/** One worker: takes the next item from the queue until none is left, storing each result at its index. */
export async function drainQueue<T, R>(
  queue: WorkQueue<T, R>,
  fn: (item: T) => Promise<R>,
): Promise<void> {
  while (queue.next < queue.items.length) {
    const index = queue.next;
    queue.next += 1;
    queue.results[index] = await fn(queue.items[index] as T);
  }
}

/** Like `Promise.all(items.map(fn))`, with at most `limit` calls running at once; results keep the input order. */
export async function mapWithLimit<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const queue: WorkQueue<T, R> = { items, results: new Array<R>(items.length), next: 0 };
  const workers = Math.max(1, Math.min(limit, items.length));
  await Promise.all(Array.from({ length: workers }, () => drainQueue(queue, fn)));
  return queue.results;
}
