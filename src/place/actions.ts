'use server';

import { runAuthenticatedAdminServerAction } from '@/auth/server';
import { getPlaceAutoComplete } from '@/platforms/google-places';

export const getPlaceAutoCompleteAction = async (input: string) =>
  runAuthenticatedAdminServerAction(() => getPlaceAutoComplete(input));
