'use server';

import { warmRedisConnection } from '@/platforms/redis';

export const warmRedisAction = async () => warmRedisConnection();
