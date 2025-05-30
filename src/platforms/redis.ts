import { Redis } from '@upstash/redis';
import { HAS_REDIS_STORAGE } from '@/app/config';

// Temporarily disable Redis due to compatibility issues
// TODO: Fix Redis client compatibility with Next.js environment
const redis: Redis | undefined = undefined;

if (false && HAS_REDIS_STORAGE) {
  console.log('[Redis Init] Redis temporarily disabled due to compatibility issues');
}

export { redis };

export const testRedisConnection = () => redis
  ? redis.get('test')
  : Promise.reject(false);
