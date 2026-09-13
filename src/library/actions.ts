'use server';

import { revalidateLibraryKey } from '@/cache';
import { upsertLibrary } from './query';
import { runAuthenticatedAdminServerAction } from '@/auth/server';
import { redirect } from 'next/navigation';
import { PATH_LIBRARY, PATH_ADMIN_LIBRARY_EDIT } from '@/app/path';
import { convertFormDataToLibrary } from './form';
import { revalidatePath } from 'next/cache';

export const updateLibraryAction = async (formData: FormData) =>
  runAuthenticatedAdminServerAction(async () => {
    const library = convertFormDataToLibrary(formData);
    await upsertLibrary(library);
    revalidateLibraryKey();
    revalidatePath(PATH_LIBRARY);
    revalidatePath(PATH_ADMIN_LIBRARY_EDIT);
    redirect(PATH_LIBRARY);
  });
