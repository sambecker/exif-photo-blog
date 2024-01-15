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
    console.log('signInAction error: string', `${error}`);
    console.log('signInAction error: object', error);
    if (`${error}`.includes(KEY_CREDENTIALS_SIGN_IN_ERROR)) {
      console.log('signInAction: 01');
      // Rethrow credentials error to display on the sign in page.
      return KEY_CREDENTIALS_SIGN_IN_ERROR;
    } else if (!`${error}`.includes('NEXT_REDIRECT')) {
      console.log('signInAction: 02');
      // Rethrow non-redirect errors
      throw error;
    }
  }
  console.log('signInAction: 03');
  redirect(formData.get(KEY_CALLBACK_URL) as string || PATH_ADMIN_PHOTOS);
};

export const signOutAction = async () => {
  await signOut();
};
