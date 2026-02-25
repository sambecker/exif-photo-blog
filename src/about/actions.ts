'use server';

import { revalidateAllKeysAndPaths } from '@/cache';
import { updateAbout } from './query';
import { runAuthenticatedAdminServerAction } from '@/auth/server';
import { redirect } from 'next/navigation';
import { PATH_ABOUT } from '@/app/path';
import { convertFormDataToAbout } from './form';

export const updateAboutAction = async (formData: FormData) =>
  runAuthenticatedAdminServerAction(async () => {
    const about = convertFormDataToAbout(formData);
    await updateAbout(about);
    revalidateAllKeysAndPaths();
    redirect(PATH_ABOUT);
  });