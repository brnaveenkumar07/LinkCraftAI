const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string) {
  const limit = Number(process.env.AI_RATE_LIMIT_PER_MINUTE ?? 8);
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + 60_000 });
    return { ok: true };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true };
}
