import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  lazyConnect: true,
  enableOfflineQueue: false,
  retryStrategy: () => null,
  connectTimeout: 1000,
  maxRetriesPerRequest: 0,
});
redis.on('error', () => undefined);

export async function getRedis(): Promise<Redis | null> {
  if (redis.status === 'ready') return redis;
  if (redis.status !== 'wait') return null;
  try {
    await redis.connect();
    return redis;
  } catch {
    return null;
  }
}
