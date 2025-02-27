import { deleteCookie, getCookie, storeCookie } from '@/utility/cookie';

const KEY_AUTH_EMAIL = 'authjs.email';

export const storeAuthEmailCookie = (email: string) =>
  storeCookie(KEY_AUTH_EMAIL, email);

export const clearAuthEmailCookie = () =>
  deleteCookie(KEY_AUTH_EMAIL);

export const hasAuthEmailCookie = () =>
  Boolean(getCookie(KEY_AUTH_EMAIL));
