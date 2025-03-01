'use client';

import { clsx } from 'clsx/lite';
import SiteGrid from '@/components/SiteGrid';
import {
  AI_TEXT_GENERATION_ENABLED,
} from '@/app/config';
import AdminPhotosTable from '@/admin/AdminPhotosTable';
import AdminPhotosTableInfinite from '@/admin/AdminPhotosTableInfinite';
import PathLoaderButton from '@/components/primitives/PathLoaderButton';
import { PATH_ADMIN_OUTDATED } from '@/app/paths';
import { Photo } from '@/photo';
import { StorageListResponse } from '@/platforms/storage';
import { LiaBroomSolid } from 'react-icons/lia';
import AdminUploadsTable from './AdminUploadsTable';
import { Timezone } from '@/utility/timezone';
import { useAppState } from '@/state/AppState';
import PhotoUploadWithStatus from '@/photo/PhotoUploadWithStatus';

export default function AdminPhotosClient({
  photos,
  photosCount,
  photosCountOutdated,
  blobPhotoUrls,
  shouldResize,
  onLastUpload,
  infiniteScrollInitial,
  infiniteScrollMultiple,
  timezone,
}: {
  photos: Photo[]
  photosCount: number
  photosCountOutdated: number
  blobPhotoUrls: StorageListResponse
  shouldResize: boolean
  onLastUpload: () => Promise<void>
  infiniteScrollInitial: number
  infiniteScrollMultiple: number
  timezone: Timezone
}) {
  const { uploadState: { isUploading } } = useAppState();

  return (
    <SiteGrid
      contentMain={
        <div>
          <div className="flex gap-4 space-y-4">
            <div className="grow min-w-0">
              <PhotoUploadWithStatus
                inputId="admin-photos"
                shouldResize={shouldResize}
                onLastUpload={onLastUpload}
              />
            </div>
            {photosCountOutdated > 0 &&
              <PathLoaderButton
                path={PATH_ADMIN_OUTDATED}
                icon={<LiaBroomSolid
                  size={18}
                  className="translate-y-[-1px]"
                />}
                title={`${photosCountOutdated} Outdated Photos`}
                className={clsx(
                  'text-blue-600 dark:text-blue-400',
                  'border border-blue-200 dark:border-blue-800/60',
                  'active:bg-blue-50 dark:active:bg-blue-950/50',
                  'disabled:bg-blue-50 dark:disabled:bg-blue-950/50',
                  isUploading && 'hidden md:inline-flex',
                )}
                spinnerColor="text"
                spinnerClassName="text-blue-200 dark:text-blue-600/40"
                hideTextOnMobile={false}
              >
                {photosCountOutdated}
              </PathLoaderButton>}
          </div>
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
              hasAiTextGeneration={AI_TEXT_GENERATION_ENABLED}
              timezone={timezone}
            />
            {photosCount > photos.length &&
              <AdminPhotosTableInfinite
                initialOffset={infiniteScrollInitial}
                itemsPerPage={infiniteScrollMultiple}
                hasAiTextGeneration={AI_TEXT_GENERATION_ENABLED}
                timezone={timezone}
              />}
          </div>
        </div>}
    />
  );
}
