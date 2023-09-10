import { getPhoto, getPhotos } from '@/services/postgres';
import type { Session } from 'next-auth/types';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';

const TAG_PHOTOS = 'photos';

const PHOTO_PATHS = [
  '/',
  '/grid',
  '/p/[photoId]',
  '/p/[photoId]/image',
  '/admin/photos',
  '/admin/photos/[photoId]',
  '/admin/photos/[photoId]/edit',
];

const tagForPhoto = (photoId: string) => `photo-${photoId}`;

export const revalidatePhotosTag = (
  includePhotoPaths?: boolean
) => {
  revalidateTag(TAG_PHOTOS);
  if (includePhotoPaths) { revalidateAllPhotoPaths(); }
};

export const revalidateAllPhotoPaths = () =>
  PHOTO_PATHS.forEach(path => revalidatePath(path));

export const getPhotosCached: typeof getPhotos = (...args) =>
  unstable_cache(
    () => getPhotos(...args),
    [TAG_PHOTOS], {
      tags: [TAG_PHOTOS],
    }
  )();

export const getPhotoCached: typeof getPhoto = (...args) =>
  unstable_cache(
    () => getPhoto(...args),
    [TAG_PHOTOS, tagForPhoto(...args)], {
      tags: [TAG_PHOTOS, tagForPhoto(...args)],
    }
  )();

export const getImageCacheHeadersForAuth = async (session?: Session) => {
  return {
    'Cache-Control': !session?.user
      ? 's-maxage=3600, stale-while-revalidate'
      : 's-maxage=1, stale-while-revalidate',
  };
};
