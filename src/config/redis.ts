import Redis from 'ioredis';

function resolveRedisUrl(): string {
  if (process.env.REDIS_URL) {
    const url = process.env.REDIS_URL;
    return url.includes('upstash.io') && url.startsWith('redis://')
      ? url.replace(/^redis:\/\//, 'rediss://')
      : url;
  }
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const host = process.env.UPSTASH_REDIS_REST_URL.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    return `rediss://default:${process.env.UPSTASH_REDIS_REST_TOKEN}@${host}:6379`;
  }
  return 'redis://localhost:6379';
}

const redis = new Redis(resolveRedisUrl(), {
  lazyConnect: true,
  enableOfflineQueue: false,
  retryStrategy: () => null,
  connectTimeout: 5000,
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
