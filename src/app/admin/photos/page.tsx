import PhotoUpload from '@/photo/PhotoUpload';
import { clsx } from 'clsx/lite';
import SiteGrid from '@/components/SiteGrid';
import AdminUploadsTable from '@/admin/AdminUploadsTable';
import { AI_TEXT_GENERATION_ENABLED, PRO_MODE_ENABLED } from '@/site/config';
import { getStoragePhotoUrlsNoStore } from '@/services/storage/cache';
import { getPhotos } from '@/photo/db/query';
import { revalidatePath } from 'next/cache';
import AdminPhotosTable from '@/admin/AdminPhotosTable';
import AdminPhotosTableInfinite from
  '@/admin/AdminPhotosTableInfinite';
import { getPhotosMetaCached } from '@/photo/cache';
import { IoInformationCircleOutline } from 'react-icons/io5';
import PathLoaderButton from '@/components/primitives/PathLoaderButton';
import { PATH_ADMIN_OUTDATED } from '@/site/paths';
import { OUTDATED_THRESHOLD } from '@/photo';

const DEBUG_PHOTO_BLOBS = false;

const INFINITE_SCROLL_INITIAL_ADMIN_PHOTOS = 25;
const INFINITE_SCROLL_MULTIPLE_ADMIN_PHOTOS = 50;

export default async function AdminPhotosPage() {
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
      takenBefore: OUTDATED_THRESHOLD,
    })
      .then(({ count }) => count)
      .catch(() => 0),
    DEBUG_PHOTO_BLOBS
      ? getStoragePhotoUrlsNoStore()
      : [],
  ]);

  return (
    <SiteGrid
      contentMain={
        <div className="space-y-4">
          <div className="flex">
            <div className="grow">
              <PhotoUpload
                shouldResize={!PRO_MODE_ENABLED}
                onLastUpload={async () => {
                  'use server';
                  // Update upload count in admin nav
                  revalidatePath('/admin', 'layout');
                }}
              />
            </div>
            {photosCountOutdated > 0 && <PathLoaderButton
              path={PATH_ADMIN_OUTDATED}
              icon={<IoInformationCircleOutline
                size={18}
              />}
              title={`${photosCountOutdated} Outdated Photos`}
              hideTextOnMobile={false}
            >
              {photosCountOutdated}
            </PathLoaderButton>}
          </div>
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
            <AdminPhotosTable
              photos={photos}
              hasAiTextGeneration={AI_TEXT_GENERATION_ENABLED}
            />
            {photosCount > photos.length &&
              <AdminPhotosTableInfinite
                initialOffset={INFINITE_SCROLL_INITIAL_ADMIN_PHOTOS}
                itemsPerPage={INFINITE_SCROLL_MULTIPLE_ADMIN_PHOTOS}
                hasAiTextGeneration={AI_TEXT_GENERATION_ENABLED}
              />}
          </div>
        </div>}
    />
  );
}
