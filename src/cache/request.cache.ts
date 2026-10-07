import { getRedis } from '../config/redis';

export async function readSummary<T>(key: string): Promise<T | null> {
  const redis = await getRedis();
  if (!redis) return null;
  try {
    const value = await redis.get(key);
    return value ? JSON.parse(value) as T : null;
  } catch { return null; }
}

export async function writeSummary(key: string, value: unknown) {
  const redis = await getRedis();
  if (!redis) return;
  try { await redis.set(key, JSON.stringify(value), 'EX', 60); } catch { /* PostgreSQL still serves reads. */ }
}

export async function invalidateSummaries(ownerId: string) {
  const redis = await getRedis();
  if (!redis) return;
  try { await redis.del('summary:admin', `summary:employee:${ownerId}`); } catch { /* TTL bounds stale data. */ }
}
