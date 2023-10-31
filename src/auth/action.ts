'use server';

import { signIn } from '@/auth';

export const signInAction = async (formData: FormData) => {
  try {
    signIn('credentials', Object.fromEntries(formData));
  } catch (error) {
    console.log('Cannot sign in user', error);
    throw(error);
  }
};
