'use server';

import { revalidateAboutKey } from '@/cache';
import { upsertAbout } from './query';
import { runAuthenticatedAdminServerAction } from '@/auth/server';
import { redirect } from 'next/navigation';
import { PATH_ABOUT } from '@/app/path';
import { convertFormDataToAbout } from './form';

export const updateAboutAction = async (formData: FormData) =>
  runAuthenticatedAdminServerAction(async () => {
    const about = convertFormDataToAbout(formData);
    await upsertAbout(about);
    revalidateAboutKey();
    redirect(PATH_ABOUT);
  });
