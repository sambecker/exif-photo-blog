'use server';

import { runAuthenticatedAdminServerAction } from '@/auth/server';
import {
  getPlaceAutoComplete,
  getPlaceDetails,
} from '@/platforms/google-places';

export const getPlaceAutoCompleteAction =
  async (...args: Parameters<typeof getPlaceAutoComplete>) =>
    runAuthenticatedAdminServerAction(() => getPlaceAutoComplete(...args));

export const getPlaceDetailsAction =
  async (...args: Parameters<typeof getPlaceDetails>) =>
    runAuthenticatedAdminServerAction(() => getPlaceDetails(...args));
