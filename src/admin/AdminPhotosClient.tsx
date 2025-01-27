'use client';

import PhotoUpload from '@/photo/PhotoUpload';
import { clsx } from 'clsx/lite';
import SiteGrid from '@/components/SiteGrid';
import {
  PRESERVE_ORIGINAL_UPLOADS,
} from '@/site/config';
import AdminPhotosTable from '@/admin/AdminPhotosTable';
import AdminPhotosTableInfinite from '@/admin/AdminPhotosTableInfinite';
import PathLoaderButton from '@/components/primitives/PathLoaderButton';
import { PATH_ADMIN_OUTDATED } from '@/site/paths';
import { Photo } from '@/photo';
import { StorageListResponse } from '@/services/storage';
import { LiaBroomSolid } from 'react-icons/lia';
import AdminUploadsTable from './AdminUploadsTable';
import { Timezone } from '@/utility/timezone';
import { HiSparkles } from 'react-icons/hi';
import ProgressButton from '@/components/primitives/ProgressButton';
import { syncPhotosAction, getAllPhotoIdsAction } from '@/photo/actions';
import { toastSuccess } from '@/toast';
import { useState, useEffect } from 'react';
import { useAppState } from '@/state/AppState';
import { useRouter } from 'next/navigation';

export default function AdminPhotosClient({
  photos,
  photosCount,
  photosCountOutdated,
  onLastPhotoUpload,
  blobPhotoUrls,
  infiniteScrollInitial,
  infiniteScrollMultiple,
  timezone,
  hasAiTextGeneration,
}: {
  photos: Photo[]
  photosCount: number
  photosCountOutdated: number
  onLastPhotoUpload: () => Promise<void>
  blobPhotoUrls: StorageListResponse
  infiniteScrollInitial: number
  infiniteScrollMultiple: number
  timezone: Timezone
  hasAiTextGeneration: boolean
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isRegeneratingAI, setIsRegeneratingAI] = useState(false);
  const [regenerationProgress, setRegenerationProgress] = useState<number>();
  const [showAiButton, setShowAiButton] = useState(false);
  const { registerAdminUpdate } = useAppState();
  const router = useRouter();

  useEffect(() => {
    setShowAiButton(hasAiTextGeneration);
  }, [hasAiTextGeneration]);

  const handleRegenerateAI = async () => {
    if (!confirm(`Are you sure you want to regenerate AI fields for all ${photosCount} photos? This may take a while.`)) {
      return;
    }

    setIsRegeneratingAI(true);
    setRegenerationProgress(0);

    try {
      // Process photos in batches of 4 to avoid overwhelming the server
      const BATCH_SIZE = 4;
      let processedCount = 0;

      // Fetch all photo IDs using server action
      const allPhotoIds = await getAllPhotoIdsAction();
      const photoBatches = [];
      for (let i = 0; i < allPhotoIds.length; i += BATCH_SIZE) {
        photoBatches.push(allPhotoIds.slice(i, i + BATCH_SIZE));
      }

      for (let i = 0; i < photoBatches.length; i++) {
        const batch = photoBatches[i];
        await syncPhotosAction(batch, true);
        
        processedCount += batch.length;
        // Update progress
        const progress = Math.min(processedCount / photosCount, 1);
        setRegenerationProgress(progress);
      }

      toastSuccess(`AI fields regenerated for all ${photosCount} photos`);
      // Register update and refresh the page
      registerAdminUpdate?.();
      router.refresh();
    } catch (error) {
      console.error('Error regenerating AI fields:', error);
      toastSuccess('Error regenerating AI fields. Please try again.');
    } finally {
      setIsRegeneratingAI(false);
      setRegenerationProgress(undefined);
    }
  };

  return (
    <SiteGrid
      contentMain={
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="grow min-w-0">
              <PhotoUpload
                shouldResize={!PRESERVE_ORIGINAL_UPLOADS}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
                onLastUpload={onLastPhotoUpload}
              />
            </div>
            {showAiButton && (
              <ProgressButton
                icon={<HiSparkles size={16} />}
                isLoading={isRegeneratingAI}
                progress={regenerationProgress}
                onClick={handleRegenerateAI}
                hideTextOnMobile={false}
              >
                {isRegeneratingAI 
                  ? `Regenerating ${Math.round((regenerationProgress || 0) * 100)}%`
                  : 'Regen AI Fields'}
              </ProgressButton>
            )}
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
              hasAiTextGeneration={hasAiTextGeneration}
              timezone={timezone}
            />
            {photosCount > photos.length &&
              <AdminPhotosTableInfinite
                initialOffset={infiniteScrollInitial}
                itemsPerPage={infiniteScrollMultiple}
                hasAiTextGeneration={hasAiTextGeneration}
                timezone={timezone}
              />}
          </div>
        </div>}
    />
  );
}
