import { headers } from 'next/headers';

/**
 * In-memory rate limiting for the auth surface.
 *
 * A fixed-window counter keyed on action name + client IP. In-memory means
 * per-serverless-instance, so the real ceiling under load is a small multiple
 * of the stated limit — fine for the purpose, which is stopping credential
 * stuffing and reset-email floods from a single source, not surviving a
 * distributed attack. Swap the Map for Upstash/Redis if that day comes.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

async function clientIp(): Promise<string> {
  const h = await headers();
  // Vercel sets x-forwarded-for; first hop is the client.
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}

/**
 * Returns true when the caller is over the limit.
 *
 *   if (await rateLimited('login', 10, 60_000)) return { error: RATE_LIMIT_MESSAGE };
 */
export async function rateLimited(
  action: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  const key = `${action}:${await clientIp()}`;
  const now = Date.now();

  // Cheap cleanup so an attacker rotating IPs cannot grow the map forever.
  if (buckets.size > MAX_BUCKETS) {
    for (const [k, bucket] of buckets) {
      if (bucket.resetAt < now) buckets.delete(k);
    }
    if (buckets.size > MAX_BUCKETS) buckets.clear();
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

export const RATE_LIMIT_MESSAGE =
  'Too many attempts. Wait a minute and try again.';
