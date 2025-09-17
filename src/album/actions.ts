'use server';

import { runAuthenticatedAdminServerAction } from '@/auth/server';
import { deleteAlbum, updateAlbum } from './query';
import { revalidateAllKeysAndPaths } from '@/photo/cache';
import { redirect } from 'next/navigation';
import { PATH_ADMIN_ALBUMS } from '@/app/path';
import { convertFormDataToAlbum } from './form';

export const updateAlbumAction = async (formData: FormData) =>
  runAuthenticatedAdminServerAction(async () => {
    const album = convertFormDataToAlbum(formData);
    await updateAlbum(album);
    revalidateAllKeysAndPaths();
    redirect(PATH_ADMIN_ALBUMS);
  });

export const deleteAlbumAction = async (formData: FormData) =>
  runAuthenticatedAdminServerAction(async () => {
    const albumId = formData.get('album') as string;
    await deleteAlbum(albumId);
    revalidateAllKeysAndPaths();
  });
