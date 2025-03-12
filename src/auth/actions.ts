'use server';

import {
  KEY_CALLBACK_URL,
  KEY_CREDENTIALS_CALLBACK_ROUTE_ERROR_URL,
  KEY_CREDENTIALS_SIGN_IN_ERROR,
  KEY_CREDENTIALS_SIGN_IN_ERROR_URL,
  KEY_CREDENTIALS_SUCCESS,
  auth,
  generateAuthSecret,
  signIn,
  signOut,
} from '@/auth';
import type { Session } from 'next-auth';
import { redirect } from 'next/navigation';

export const signInAction = async (
  _prevState: string | undefined,
  formData: FormData,
) => {
  try {
    await signIn('credentials', Object.fromEntries(formData));
  } catch (error) {
    if (
      `${error}`.includes(KEY_CREDENTIALS_SIGN_IN_ERROR) || 
      `${error}`.includes(KEY_CREDENTIALS_SIGN_IN_ERROR_URL) ||
      // New error thrown in next-auth 5.0.0-beta.19 for incorrect credentials
      `${error}`.includes(KEY_CREDENTIALS_CALLBACK_ROUTE_ERROR_URL)
    ) {
      // Return credentials error to display on sign-in page.
      return KEY_CREDENTIALS_SIGN_IN_ERROR;
    } else if (!`${error}`.includes('NEXT_REDIRECT')) {
      console.log('Unknown sign in error:', {
        errorText: `${error}`,
        error,
      });
      // Rethrow non-redirect errors
      throw error;
    }
  }
  if (formData.get(KEY_CALLBACK_URL)) {
    redirect(formData.get(KEY_CALLBACK_URL) as string);
  }
  return KEY_CREDENTIALS_SUCCESS;
};

export const signOutAction = async () =>
  signOut({ redirect: false });

export const getAuthAction = async () => auth();

export const logClientAuthUpdate = async (data: Session | null | undefined) =>
  console.log('Client auth update', data);

export const generateAuthSecretAction = async () => generateAuthSecret();
