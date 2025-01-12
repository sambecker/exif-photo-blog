import { getCookie, storeCookie } from './cookie';

// Timezone
// string:    timezone
// undefined: timezone must be resolved on the client
// null:      timezone not required
export type Timezone = string | null | undefined;

export const TIMEZONE_COOKIE_NAME = 'client-timezone';

export const storeTimezoneCookie = () =>
  storeCookie(
    TIMEZONE_COOKIE_NAME,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

export const getTimezoneCookie = () =>
  getCookie(TIMEZONE_COOKIE_NAME);
