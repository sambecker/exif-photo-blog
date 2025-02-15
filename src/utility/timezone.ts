import { getCookie, storeCookie } from './cookie';

// Timezone
// string:    timezone
// undefined: timezone must be resolved on the client
// null:      timezone not required
export type Timezone = string | undefined | null;

export const TIMEZONE_COOKIE_NAME = 'timezone-client';

export const storeTimezoneCookie = () =>
  storeCookie(
    TIMEZONE_COOKIE_NAME,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

export const getTimezoneCookie = () =>
  getCookie(TIMEZONE_COOKIE_NAME);
