'use client';

import { clsx } from 'clsx/lite';
import AdminPhotosTable from '@/admin/AdminPhotosTable';
import AdminPhotosTableInfinite from '@/admin/AdminPhotosTableInfinite';
import PathLoaderButton from '@/components/primitives/PathLoaderButton';
import { PATH_ADMIN_PHOTOS_UPDATES } from '@/app/path';
import { Photo } from '@/photo';
import { StorageListResponse } from '@/platforms/storage';
import AdminUploadsTable from './AdminUploadsTable';
import { Timezone } from '@/utility/timezone';
import { useUploadState } from '@/admin/upload/UploadState';
import PhotoUploadWithStatus from '@/photo/PhotoUploadWithStatus';
import { pluralize } from '@/utility/string';
import IconBroom from '@/components/icons/IconBroom';
import ResponsiveText from '@/components/primitives/ResponsiveText';
import { useAppText } from '@/i18n/state/client';
import SyncColorButton from '@/photo/color/SyncColorButton';
import AdminPage from './AdminPage';

export default function AdminPhotosClient({
  photos,
  photosCount,
  photosCountNeedsSync,
  blobPhotoUrls,
  shouldResize,
  hasAiContentGeneration,
  infiniteScrollInitial,
  infiniteScrollMultiple,
  timezone,
  debugColorData,
}: {
  photos: Photo[]
  photosCount: number
  photosCountNeedsSync: number
  blobPhotoUrls: StorageListResponse
  shouldResize: boolean
  hasAiContentGeneration: boolean
  infiniteScrollInitial: number
  infiniteScrollMultiple: number
  timezone: Timezone
  debugColorData?: boolean
}) {
  const { uploadState: { isUploading } } = useUploadState();

  const appText = useAppText();

  return (
    <AdminPage
      title={pluralize(
        photosCount,
        appText.photo.photo,
        appText.photo.photoPlural,
      )}
      hideTitle={isUploading}
      accessory={<>
        {debugColorData && !isUploading &&
          <SyncColorButton />}
        {photosCountNeedsSync > 0 && !isUploading &&
          <PathLoaderButton
            path={PATH_ADMIN_PHOTOS_UPDATES}
            icon={<IconBroom
              size={18}
              className="translate-x-[-1px]"
            />}
            tooltip={(
              pluralize(
                photosCountNeedsSync,
                appText.photo.photo,
                appText.photo.photoPlural.toLocaleLowerCase(),
              ) +
              ' missing data or AI-generated text'
            )}
            className={clsx(
              'text-blue-600 dark:text-blue-400',
              'border border-blue-200 dark:border-blue-800/60',
              'active:bg-blue-50 dark:active:bg-blue-950/50',
              'disabled:bg-blue-50 dark:disabled:bg-blue-950/50',
            )}
            spinnerColor="text"
            spinnerClassName="text-blue-200 dark:text-blue-600/40"
            hideText="never"
          >
            <ResponsiveText shortText={photosCountNeedsSync}>
              {pluralize(
                photosCountNeedsSync,
                appText.admin.update,
                appText.admin.updatePlural,
              )}
            </ResponsiveText>
          </PathLoaderButton>}
        <PhotoUploadWithStatus
          inputId="admin-photos"
          shouldResize={shouldResize}
          className="flex-row-reverse min-w-0"
          expandStatus={isUploading}
        />
      </>}
    >
      <div className="space-y-2">
        {blobPhotoUrls.length > 0 &&
          <div className={clsx(
            'border-b pb-6',
            'border-gray-200 dark:border-gray-700',
            'space-y-4',
          )}>
            <div className="font-bold">
              Photo Blobs ({blobPhotoUrls.length})
            </div>
            <AdminUploadsTable urlAddStatuses={blobPhotoUrls} />
          </div>}
        {/* Use custom spacing to address gap/space-y compatibility quirks */}
        <div className="space-y-[6px] sm:space-y-[10px]">
          <AdminPhotosTable
            photos={photos}
            hasAiContentGeneration={hasAiContentGeneration}
            timezone={timezone}
            debugColorData={debugColorData}
          />
          {photosCount > photos.length &&
            <AdminPhotosTableInfinite
              initialOffset={infiniteScrollInitial}
              itemsPerPage={infiniteScrollMultiple}
              hasAiContentGeneration={hasAiContentGeneration}
              timezone={timezone}
              debugColorData={debugColorData}
            />}
        </div>
      </div>
    </AdminPage>
  );
}
