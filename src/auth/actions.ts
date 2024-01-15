'use server';

import { CREDENTIALS_SIGN_IN_ERROR, signIn, signOut } from '@/auth';

export const signInAction = async (
  _prevState: string | undefined,
  formData: FormData,
) => {
  try {
    await signIn('credentials', Object.fromEntries(formData));
  } catch (error) {
    if ((`${error}`).includes(CREDENTIALS_SIGN_IN_ERROR)) {
      return CREDENTIALS_SIGN_IN_ERROR;
    } else {
      console.log('Next Auth Error', error);
    }
    throw error;
  }
};

export const signOutAction = async () => {
  await signOut();
};
