import { Redis } from '@upstash/redis';
import { HAS_REDIS_STORAGE } from '@/app/config';

const redis = HAS_REDIS_STORAGE ? Redis.fromEnv() : undefined;

export const testRedisConnection = () => redis
  ? redis.get('test')
  : Promise.reject(false);
