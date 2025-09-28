'use server';

import { runAuthenticatedAdminServerAction } from '@/auth/server';
import { addPhotoAlbumIds, deleteAlbum, updateAlbum } from './query';
import { revalidateAllKeysAndPaths } from '@/photo/cache';
import { redirect } from 'next/navigation';
import { PATH_ADMIN_ALBUMS, PATH_ROOT, pathForAlbum } from '@/app/path';
import { convertFormDataToAlbum } from './form';
import { Album } from '.';
import { createAlbumsAndGetIds } from './server';

export const updateAlbumAction = async (formData: FormData) =>
  runAuthenticatedAdminServerAction(async () => {
    const album = convertFormDataToAlbum(formData);
    await updateAlbum(album);
    revalidateAllKeysAndPaths();
    redirect(PATH_ADMIN_ALBUMS);
  });

export const deleteAlbumFormAction = async (formData: FormData) =>
  runAuthenticatedAdminServerAction(async () => {
    const albumId = formData.get('album') as string;
    await deleteAlbum(albumId);
    revalidateAllKeysAndPaths();
  });

export const deleteAlbumAction = async (
  album: Album,
  currentPath?: string,
) =>
  runAuthenticatedAdminServerAction(async () => {
    await deleteAlbum(album.id);
    revalidateAllKeysAndPaths();
    if (currentPath === pathForAlbum(album)) {
      redirect(PATH_ROOT);
    }
  });

export const addPhotosToAlbumsAction = async (
  photoIds: string[],
  albumTitles: string[],
) =>
  runAuthenticatedAdminServerAction(async () => {
    const albumIds = await createAlbumsAndGetIds(albumTitles);
    await addPhotoAlbumIds(photoIds, albumIds);
    revalidateAllKeysAndPaths();
  });
