'use client';

import { Photo } from '@/photo';
import AdminPhotosTable from '@/admin/AdminPhotosTable';
import Note from '@/components/Note';
import AdminChildPage from '@/components/AdminChildPage';
import { PATH_ADMIN_PHOTOS } from '@/app/path';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  const [photoIdsSyncing, setPhotoIdsSyncing] = useState<string[]>([]);
  const [error, setError] = useState<Error>();
  const [progress, setProgress] = useState(0);

  const arePhotoIdsSyncing = photoIdsSyncing.length > 0;

  const router = useRouter();

  const statusText = useMemo(() => getPhotosUpdateStatusText(photos), [photos]);

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
        Updates ({photos.length})
      </ResponsiveText>}
      accessory={<ProgressButton
        primary
        icon={<IconBroom size={18} />}
        hideText="never"
        progress={progress}
        tooltip={photos.length === 1
          ? 'Update 1 photo'
          : `Update all ${photos.length} photos`}
        onClick={async () => {
          if (window.confirm([
            'Are you sure you want to sync',
            photos.length === 1
              ? '1 photo?'
              : `all ${photos.length} photos?`,
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
              Photo updates: {statusText}
            </div>
            Sync to capture new EXIF fields, improve blur data,
            {' '}
            use AI to generate missing text (if configured)
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
