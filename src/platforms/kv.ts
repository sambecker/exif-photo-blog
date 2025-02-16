import { kv } from '@vercel/kv';

export const testKvConnection = () => kv.get('test');
