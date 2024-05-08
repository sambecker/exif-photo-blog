import { cache } from 'react';
import { auth } from '@/auth';

export const authCachedSafe = cache(() => auth().catch(() => null));
