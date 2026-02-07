import { Redis } from '@upstash/redis';

const KEY_TEST = 'test';

export const redis = (
  process.env.KV_URL ||
  process.env.UPSTASH_REDIS_REST_URL
) ? Redis.fromEnv()
  : (
    process.env.EXIF_KV_REST_API_URL &&
    process.env.EXIF_KV_REST_API_TOKEN
  ) ? new Redis({
      url: process.env.EXIF_KV_REST_API_URL,
      token: process.env.EXIF_KV_REST_API_TOKEN,
    })
    : undefined;

export const warmRedisConnection = () => {
  if (redis) { redis.get(KEY_TEST); }
};

export const testRedisConnection = () => redis
  ? redis.get(KEY_TEST)
  : Promise.reject(false);
