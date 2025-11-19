'use server';

import { runAuthenticatedAdminServerAction } from '@/auth/server';
import { revalidateAllKeysAndPaths } from '.';

export const revalidateAllKeysAndPathsAction = async () =>
  runAuthenticatedAdminServerAction(revalidateAllKeysAndPaths);
