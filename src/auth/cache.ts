import { cache } from 'react';
import { auth } from '@/auth/server';

export const authCachedSafe = cache(() => auth().catch(() => null));
