import { Redis } from '@upstash/redis';
import { HAS_REDIS_STORAGE } from '@/app/config';

const KEY_TEST = 'test';

export const redis = HAS_REDIS_STORAGE ? Redis.fromEnv() : undefined;

export const warmRedisConnection = () => {
  if (redis) { redis.get(KEY_TEST); }
};

export const testRedisConnection = () => redis
  ? redis.get(KEY_TEST)
  : Promise.reject(false);
