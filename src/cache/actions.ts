'use server';

import { runAuthenticatedAdminServerAction } from '@/auth/server';
import { revalidateGlobalCache } from '.';

export const revalidateGlobalCacheAction = async () =>
  runAuthenticatedAdminServerAction(revalidateGlobalCache);
