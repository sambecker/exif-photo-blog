import { auth } from '@/auth';
import { getPhoto, getPhotos } from '@/services/postgres';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';

const TAG_PHOTOS = 'photos';

const PHOTO_PATHS = [
  '/',
  '/grid',
  '/photos/[photoId]',
  '/photos/[photoId]/image',
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

export const getImageCacheHeadersForAuth = async () => {
  const session = await auth();
  const shouldCacheRequest = !session?.user;
  return {
    'Cache-Control': shouldCacheRequest
      ? 's-maxage=3600, stale-while-revalidate'
      : 's-maxage=1, stale-while-revalidate',
  };
};
