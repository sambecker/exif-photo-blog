import PhotoUpload from '@/photo/PhotoUpload';
import { clsx } from 'clsx/lite';
import SiteGrid from '@/components/SiteGrid';
import { getPhotosCountIncludingHiddenCached } from '@/photo/cache';
import AdminUploadsTable from '@/admin/AdminUploadsTable';
import { PRO_MODE_ENABLED } from '@/site/config';
import { getStoragePhotoUrlsNoStore } from '@/services/storage/cache';
import { getPhotos } from '@/photo/db';
import { revalidatePath } from 'next/cache';
import AdminPhotosTable from '@/admin/AdminPhotosTable';
import AdminPhotosTableInfinite from
  '@/admin/AdminPhotosTableInfinite';

const DEBUG_PHOTO_BLOBS = false;

const INFINITE_SCROLL_INITIAL_ADMIN_PHOTOS = 25;
const INFINITE_SCROLL_MULTIPLE_ADMIN_PHOTOS = 50;

export default async function AdminPhotosPage() {
  const [
    photos,
    photosCount,
    blobPhotoUrls,
  ] = await Promise.all([
    getPhotos({
      includeHidden: true,
      sortBy: 'createdAt',
      limit: INFINITE_SCROLL_INITIAL_ADMIN_PHOTOS,
    }).catch(() => []),
    getPhotosCountIncludingHiddenCached().catch(() => 0),
    DEBUG_PHOTO_BLOBS
      ? getStoragePhotoUrlsNoStore()
      : [],
  ]);

  return (
    <SiteGrid
      contentMain={
        <div className="space-y-4">
          <PhotoUpload
            shouldResize={!PRO_MODE_ENABLED}
            onLastUpload={async () => {
              'use server';
              // Update upload count in admin nav
              revalidatePath('/admin', 'layout');
            }}
          />
          {blobPhotoUrls.length > 0 &&
            <div className={clsx(
              'border-b pb-6',
              'border-gray-200 dark:border-gray-700',
            )}>
              <AdminUploadsTable
                title={`Photo Blobs (${blobPhotoUrls.length})`}
                urls={blobPhotoUrls}
              />
            </div>}
          <div className="space-y-4">
            <AdminPhotosTable photos={photos} />
            {photosCount > photos.length &&
              <AdminPhotosTableInfinite
                initialOffset={INFINITE_SCROLL_INITIAL_ADMIN_PHOTOS}
                itemsPerPage={INFINITE_SCROLL_MULTIPLE_ADMIN_PHOTOS}
              />}
          </div>
        </div>}
    />
  );
}
