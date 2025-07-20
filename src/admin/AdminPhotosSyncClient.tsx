'use client';

import { Photo } from '@/photo';
import AdminPhotosTable from '@/admin/AdminPhotosTable';
import IconGrSync from '@/components/icons/IconGrSync';
import Note from '@/components/Note';
import AdminChildPage from '@/components/AdminChildPage';
import { PATH_ADMIN_PHOTOS } from '@/app/path';
import { useMemo, useRef, useState } from 'react';
import { syncPhotosAction } from '@/photo/actions';
import { useRouter } from 'next/navigation';
import ResponsiveText from '@/components/primitives/ResponsiveText';
import { LiaBroomSolid } from 'react-icons/lia';
import ProgressButton from '@/components/primitives/ProgressButton';
import ErrorNote from '@/components/ErrorNote';
import { getPhotosSyncStatusText } from '@/photo/sync';

const SYNC_BATCH_SIZE_MAX = 3;

export default function AdminPhotosSyncClient({
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

  const statusText = useMemo(() => getPhotosSyncStatusText(photos), [photos]);

  return (
    <AdminChildPage
      backLabel="Photos"
      backPath={PATH_ADMIN_PHOTOS}
      breadcrumb={<ResponsiveText shortText="Updates">
        Updates ({photos.length})
      </ResponsiveText>}
      accessory={<ProgressButton
        primary
        icon={<IconGrSync className="translate-y-[1px]" />}
        hideText="never"
        progress={progress}
        tooltip={photos.length === 1
          ? 'Sync data for 1 photo'
          : `Sync data for all ${photos.length} photos`}
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
              await syncPhotosAction(photoIds)
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
            if (!errorRef.current) {
              router.push(PATH_ADMIN_PHOTOS);
            } else {
              setProgress(0);
              setPhotoIdsSyncing([]);
              router.refresh();
            }
          }
        }}
        isLoading={arePhotoIdsSyncing}
        disabled={photoIdsSyncing.length > 0}
      >
        {arePhotoIdsSyncing
          ? 'Syncing ...'
          : 'Sync All'}
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
          />
        </div>
      </div>
    </AdminChildPage>
  );
}
