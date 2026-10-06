type Bucket = { count: number; resetAt: number };

/**
 * Fixed-window, in-memory rate limiter.
 *
 * Best effort only: on serverless each instance has its own memory, so this
 * slows casual abuse but is not a hard guarantee. Swap for a shared store
 * (e.g. Upstash Redis) if spam becomes a real problem.
 */
export function createRateLimiter({
  limit,
  windowMs,
}: {
  limit: number;
  windowMs: number;
}) {
  const buckets = new Map<string, Bucket>();

  return function isAllowed(key: string, now = Date.now()): boolean {
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      // Opportunistic cleanup keeps the map from growing without bound.
      if (buckets.size > 10_000) {
        for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
      }
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }

    bucket.count += 1;
    return bucket.count <= limit;
  };
}
