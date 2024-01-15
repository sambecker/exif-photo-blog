'use server';

import {
  KEY_CALLBACK_URL,
  KEY_CREDENTIALS_SIGN_IN_ERROR,
  signIn,
  signOut,
} from '@/auth';
import { PATH_ADMIN_PHOTOS } from '@/site/paths';
import { redirect } from 'next/navigation';

export const signInAction = async (
  _prevState: string | undefined,
  formData: FormData,
) => {
  try {
    await signIn('credentials', Object.fromEntries(formData));
  } catch (error) {
    if (`${error}`.includes(KEY_CREDENTIALS_SIGN_IN_ERROR)) {
      // Rethrow credentials error to display on the sign in page.
      return KEY_CREDENTIALS_SIGN_IN_ERROR;
    } else if (!`${error}`.includes('NEXT_REDIRECT')) {
      // Rethrow non-redirect errors
      throw error;
    }
  }
  redirect(formData.get(KEY_CALLBACK_URL) as string || PATH_ADMIN_PHOTOS);
};

export const signOutAction = async () => {
  await signOut();
};
