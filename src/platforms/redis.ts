import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const testRedisConnection = () => redis.get('test');
