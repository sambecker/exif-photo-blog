import { getStoragePhotoUrlsNoStore } from '@/platforms/storage/cache';
import { getPhotos, getPhotosInNeedOfUpdateCount } from '@/photo/db/query';
import { getPhotosMetaCached } from '@/photo/cache';
import AdminPhotosClient from '@/admin/AdminPhotosClient';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { TIMEZONE_COOKIE_NAME } from '@/utility/timezone';
import {
  AI_CONTENT_GENERATION_ENABLED,
  PRESERVE_ORIGINAL_UPLOADS,
} from '@/app/config';

export const maxDuration = 60;

const DEBUG_PHOTO_BLOBS = false;

const INFINITE_SCROLL_INITIAL_ADMIN_PHOTOS = 25;
const INFINITE_SCROLL_MULTIPLE_ADMIN_PHOTOS = 50;

export default async function AdminPhotosPage() {
  const timezone = (await cookies()).get(TIMEZONE_COOKIE_NAME)?.value;

  const [
    photos,
    photosCount,
    photosCountNeedsSync,
    blobPhotoUrls,
  ] = await Promise.all([
    getPhotos({
      hidden: 'include',
      sortBy: 'createdAt',
      limit: INFINITE_SCROLL_INITIAL_ADMIN_PHOTOS,
    }).catch(() => []),
    getPhotosMetaCached({ hidden: 'include'})
      .then(({ count }) => count)
      .catch(() => 0),
    getPhotosInNeedOfUpdateCount()
      .catch(() => 0),
    DEBUG_PHOTO_BLOBS
      ? getStoragePhotoUrlsNoStore()
      : [],
  ]);

  return (
    <AdminPhotosClient {...{
      photos,
      photosCount,
      photosCountNeedsSync,
      shouldResize: !PRESERVE_ORIGINAL_UPLOADS,
      hasAiTextGeneration: AI_CONTENT_GENERATION_ENABLED,
      onLastUpload: async () => {
        'use server';
        // Update upload count in admin nav
        revalidatePath('/admin', 'layout');
      },
      blobPhotoUrls,
      infiniteScrollInitial: INFINITE_SCROLL_INITIAL_ADMIN_PHOTOS,
      infiniteScrollMultiple: INFINITE_SCROLL_MULTIPLE_ADMIN_PHOTOS,
      timezone,
    }} />
  );
}
