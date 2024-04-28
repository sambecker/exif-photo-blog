import PhotoUpload from '@/photo/PhotoUpload';
import { clsx } from 'clsx/lite';
import SiteGrid from '@/components/SiteGrid';
import { pathForAdminPhotos } from '@/site/paths';
import { getPhotosCountIncludingHiddenCached } from '@/photo/cache';
import {
  PaginationParams,
  getPaginationFromSearchParams,
} from '@/site/pagination';
import StorageUrls from '@/admin/StorageUrls';
import { PRO_MODE_ENABLED } from '@/site/config';
import { getStoragePhotoUrlsNoStore } from '@/services/storage/cache';
import MoreComponentsFromSearchParams from
  '@/components/MoreComponentsFromSearchParams';
import { getPhotos } from '@/services/vercel-postgres';
import { revalidatePath } from 'next/cache';
import AdminPhotoTable from '@/admin/AdminPhotoTable';

const DEBUG_PHOTO_BLOBS = false;

export default async function AdminPhotosPage({
  searchParams,
}: PaginationParams) {
  const { offset, limit } = getPaginationFromSearchParams(searchParams);

  const [
    photos,
    count,
    blobPhotoUrls,
  ] = await Promise.all([
    getPhotos({ includeHidden: true, sortBy: 'createdAt', limit }),
    getPhotosCountIncludingHiddenCached(),
    DEBUG_PHOTO_BLOBS ? getStoragePhotoUrlsNoStore() : [],
  ]);

  const showMorePhotos = count > photos.length;

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
              <StorageUrls
                title={`Photo Blobs (${blobPhotoUrls.length})`}
                urls={blobPhotoUrls}
              />
            </div>}
          <div className="space-y-4">
            <AdminPhotoTable photos={photos} />
            {showMorePhotos &&
              <MoreComponentsFromSearchParams
                label="More photos"
                path={pathForAdminPhotos(offset + 1)}
              />}
          </div>
        </div>}
    />
  );
}
