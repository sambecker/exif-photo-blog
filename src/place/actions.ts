'use server';

import { runAuthenticatedAdminServerAction } from '@/auth/server';
import {
  getPlaceAutocomplete,
  getPlaceDetails,
} from '@/platforms/google-places';

export const getPlaceAutoCompleteAction =
  async (...args: Parameters<typeof getPlaceAutocomplete>) =>
    runAuthenticatedAdminServerAction(() => getPlaceAutocomplete(...args));

export const getPlaceDetailsAction =
  async (...args: Parameters<typeof getPlaceDetails>) =>
    runAuthenticatedAdminServerAction(() => getPlaceDetails(...args));
