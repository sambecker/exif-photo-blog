'use client';

import PhotoUpload from '@/photo/PhotoUpload';
import { clsx } from 'clsx/lite';
import SiteGrid from '@/components/SiteGrid';
import { AI_TEXT_GENERATION_ENABLED, PRO_MODE_ENABLED } from '@/site/config';
import AdminPhotosTable from '@/admin/AdminPhotosTable';
import AdminPhotosTableInfinite from '@/admin/AdminPhotosTableInfinite';
import PathLoaderButton from '@/components/primitives/PathLoaderButton';
import { PATH_ADMIN_OUTDATED } from '@/site/paths';
import { Photo } from '@/photo';
import { StorageListResponse } from '@/services/storage';
import { useState } from 'react';
import { LiaBroomSolid } from 'react-icons/lia';
import AdminUploadsTable from './AdminUploadsTable';
import { Timezone } from '@/utility/timezone';

export default function AdminPhotosClient({
  photos,
  photosCount,
  photosCountOutdated,
  onLastPhotoUpload,
  blobPhotoUrls,
  infiniteScrollInitial,
  infiniteScrollMultiple,
  timezone,
}: {
  photos: Photo[]
  photosCount: number
  photosCountOutdated: number
  onLastPhotoUpload: () => Promise<void>
  blobPhotoUrls: StorageListResponse
  infiniteScrollInitial: number
  infiniteScrollMultiple: number
  timezone: Timezone
}) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <SiteGrid
      contentMain={
        <div className="space-y-4">
          <div className="flex">
            <div className="grow min-w-0">
              <PhotoUpload
                shouldResize={!PRO_MODE_ENABLED}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
                onLastUpload={onLastPhotoUpload}
              />
            </div>
            {photosCountOutdated > 0 && <PathLoaderButton
              path={PATH_ADMIN_OUTDATED}
              icon={<LiaBroomSolid size={18} className="translate-y-[-1px]" />}
              title={`${photosCountOutdated} Outdated Photos`}
              className={clsx(
                isUploading && 'hidden md:inline-flex',
              )}
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
