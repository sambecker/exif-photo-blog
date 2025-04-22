import { deleteCookie, getCookie, storeCookie } from '@/utility/cookie';

export const KEY_CREDENTIALS_SIGN_IN_ERROR = 'CredentialsSignin';
export const KEY_CREDENTIALS_SIGN_IN_ERROR_URL =
  'https://errors.authjs.dev#credentialssignin';
export const KEY_CREDENTIALS_CALLBACK_ROUTE_ERROR_URL =
  'https://errors.authjs.dev#callbackrouteerror';
export const KEY_CREDENTIALS_SUCCESS = 'success';
export const KEY_CALLBACK_URL = 'callbackUrl';

const KEY_AUTH_EMAIL = 'authjs.email';

export const storeAuthEmailCookie = (email: string) =>
  storeCookie(KEY_AUTH_EMAIL, email);

export const clearAuthEmailCookie = () =>
  deleteCookie(KEY_AUTH_EMAIL);

export const hasAuthEmailCookie = () =>
  Boolean(getCookie(KEY_AUTH_EMAIL));

export const isCredentialsSignInError = (error: any) =>
  (error.message || `${error}`).includes(KEY_CREDENTIALS_SIGN_IN_ERROR);

export const generateAuthSecret = () => fetch(
  'https://generate-secret.vercel.app/32',
  { cache: 'no-cache' },
).then(res => res.text());
