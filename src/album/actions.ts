'use server';

import { runAuthenticatedAdminServerAction } from '@/auth/server';
import {
  deleteAlbum,
  getAlbumFromSlug,
  insertAlbum,
  updateAlbum,
} from './query';
import { revalidateAllKeysAndPaths } from '@/cache';
import { redirect } from 'next/navigation';
import { PATH_ROOT, pathForAlbum } from '@/app/path';
import { convertFormDataToAlbum } from './form';
import { Album } from '.';

export const updateAlbumAction = async (formData: FormData) =>
  runAuthenticatedAdminServerAction(async () => {
    const album = convertFormDataToAlbum(formData);
    await updateAlbum(album);
    revalidateAllKeysAndPaths();
  });

export const createAlbumAction = async (formData: FormData) =>
  runAuthenticatedAdminServerAction(async () => {
    const album = convertFormDataToAlbum(formData);
    const existing = await getAlbumFromSlug(album.slug);
    if (existing) {
      return { error: 'An album with this name already exists' };
    }
    await insertAlbum({
      title: album.title,
      slug: album.slug,
      subhead: album.subhead,
      description: album.description,
      location: album.location,
    });
    revalidateAllKeysAndPaths();
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
