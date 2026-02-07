'use client';

import { Photo } from '@/photo';
import AdminPhotosTable from '@/admin/AdminPhotosTable';
import Note from '@/components/Note';
import AdminChildPage from '@/components/AdminChildPage';
import { PATH_ADMIN_PHOTOS } from '@/app/path';
import { useEffect, useRef, useState } from 'react';
import { syncPhotosAction } from '@/photo/actions';
import { useRouter } from 'next/navigation';
import ResponsiveText from '@/components/primitives/ResponsiveText';
import { LiaBroomSolid } from 'react-icons/lia';
import ProgressButton from '@/components/primitives/ProgressButton';
import ErrorNote from '@/components/ErrorNote';
import {
  getPhotosUpdateStatusText,
  isPhotoOnlyMissingColorData,
} from '@/photo/update';
import IconBroom from '@/components/icons/IconBroom';

const SYNC_BATCH_SIZE_MAX = 3;

export default function AdminPhotosUpdateClient({
  photos,
  hasAiTextGeneration,
}: {
  photos: Photo[]
  hasAiTextGeneration: boolean
}) {
  // Use refs for non-reactive while loop state
  const photoIdsToSync = useRef(photos.map(photo => photo.id));
  const errorRef = useRef<Error>(undefined);

  // Use state for updating progress button and error UI
  const [updateCount, setUpdateCount] = useState(photos.length);
  const [statusText, setStatusText] =
    useState(getPhotosUpdateStatusText(photos));
  const [photoIdsSyncing, setPhotoIdsSyncing] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error>();

  const arePhotoIdsSyncing = photoIdsSyncing.length > 0;

  const router = useRouter();

  useEffect(() => {
    if (photos.length === 0 && !error && !errorRef.current) {
      router.push(PATH_ADMIN_PHOTOS);
    }
  }, [photos.length, router, error]);

  return (
    <AdminChildPage
      backLabel="Photos"
      backPath={PATH_ADMIN_PHOTOS}
      breadcrumb={<ResponsiveText shortText="Updates">
        Updates ({updateCount})
      </ResponsiveText>}
      accessory={<ProgressButton
        primary
        icon={<IconBroom size={18} />}
        hideText="never"
        progress={progress}
        tooltip={updateCount === 1
          ? 'Update 1 photo'
          : `Update all ${updateCount} photos`}
        onClick={async () => {
          if (window.confirm([
            'Are you sure you want to sync',
            updateCount === 1
              ? '1 photo?'
              : `all ${updateCount} photos?`,
            'Browser must remain open while syncing.',
            'This action cannot be undone.',
          ].join(' '))) {
            errorRef.current = undefined;
            setError(undefined);
            while (photoIdsToSync.current.length > 0) {
              const photoIds = photoIdsToSync.current
                .slice(0, SYNC_BATCH_SIZE_MAX);
              setPhotoIdsSyncing(photoIds);
              await syncPhotosAction(photoIds.map(id => ({
                photoId: id,
                onlySyncColorData: isPhotoOnlyMissingColorData(
                  photos.find(photo => photo.id === id),
                ),
              })))
                .then(() => {
                  photoIdsToSync.current = photoIdsToSync.current.filter(
                    id => !photoIds.includes(id),
                  );
                  const photosRemaining = photos
                    .filter(({ id }) => photoIdsToSync.current.includes(id));
                  setStatusText(getPhotosUpdateStatusText(photosRemaining));
                  setUpdateCount(photosRemaining.length);
                  setProgress(
                    (photos.length - photoIdsToSync.current.length) /
                    photos.length,
                  );
                  router.refresh();
                })
                .catch(e => {
                  errorRef.current = e;
                  setError(e);
                });
              if (errorRef.current) { break; }
            }
            setProgress(0);
            setPhotoIdsSyncing([]);
            router.refresh();
          }
        }}
        isLoading={arePhotoIdsSyncing}
        disabled={photoIdsSyncing.length > 0}
      >
        {arePhotoIdsSyncing
          ? 'Updating ...'
          : 'Update All'}
      </ProgressButton>}
    >
      <div className="space-y-6">
        {error && <ErrorNote>
          <span className="font-bold">
            Issue syncing:
          </span>
          {' '}
          {error.message}
        </ErrorNote>}
        <Note
          color="blue"
          icon={<LiaBroomSolid size={18}/>}
        >
          <div className="space-y-1.5">
            <div className="font-bold">
              {arePhotoIdsSyncing
                ? <>Updating photos: {statusText}</>
                : <>Photo updates: {statusText}</>}
            </div>
            {arePhotoIdsSyncing
              ? <>Leave browser open until updates complete</>
              : <>
                Sync to capture new EXIF fields, optimize image data,
                {' '}
                use AI to generate missing text (if configured)
              </>}
          </div>
        </Note>
        <div className="space-y-4">
          <AdminPhotosTable
            photos={photos}
            photoIdsSyncing={photoIdsSyncing}
            hasAiTextGeneration={hasAiTextGeneration}
            canEdit={false}
            canDelete={false}
            dateType="updatedAt"
            shouldScrollIntoViewOnExternalSync
            updateMode
          />
        </div>
      </div>
    </AdminChildPage>
  );
}
