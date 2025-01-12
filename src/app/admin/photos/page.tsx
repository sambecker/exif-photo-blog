import { getStoragePhotoUrlsNoStore } from '@/services/storage/cache';
import { getPhotos } from '@/photo/db/query';
import { getPhotosMetaCached } from '@/photo/cache';
import { OUTDATED_THRESHOLD } from '@/photo';
import AdminPhotosClient from '@/admin/AdminPhotosClient';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { TIMEZONE_COOKIE_NAME } from '@/utility/timezone';

export const maxDuration = 60;

const DEBUG_PHOTO_BLOBS = false;

const INFINITE_SCROLL_INITIAL_ADMIN_PHOTOS = 25;
const INFINITE_SCROLL_MULTIPLE_ADMIN_PHOTOS = 50;

export default async function AdminPhotosPage() {
  const timezone = (await cookies()).get(TIMEZONE_COOKIE_NAME)?.value;

  const [
    photos,
    photosCount,
    photosCountOutdated,
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
    getPhotosMetaCached({
      hidden: 'include',
      updatedBefore: OUTDATED_THRESHOLD,
    })
      .then(({ count }) => count)
      .catch(() => 0),
    DEBUG_PHOTO_BLOBS
      ? getStoragePhotoUrlsNoStore()
      : [],
  ]);

  return (
    <AdminPhotosClient {...{
      photos,
      photosCount,
      photosCountOutdated,
      onLastPhotoUpload: async () => {
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
