import { cache } from 'react';
import { auth } from '@/auth';

export const authCached = cache(auth);
