import { createClient } from '@vercel/kv';

export const kv =
  process.env.REDIS_REST_API_URL &&
  process.env.REDIS_REST_API_TOKEN
    ? createClient({
      url: process.env.REDIS_REST_API_URL,
      token: process.env.REDIS_REST_API_TOKEN,
    })
    : undefined;
