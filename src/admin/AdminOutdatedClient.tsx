'use client';

import { Photo } from '@/photo';
import AdminPhotosTable from '@/admin/AdminPhotosTable';
import LoaderButton from '@/components/primitives/LoaderButton';
import IconGrSync from '@/app/IconGrSync';
import Note from '@/components/Note';
import AdminChildPage from '@/components/AdminChildPage';
import { PATH_ADMIN_PHOTOS } from '@/app/paths';
import { useState } from 'react';
import { syncPhotosAction } from '@/photo/actions';
import { useRouter } from 'next/navigation';
import ResponsiveText from '@/components/primitives/ResponsiveText';

const UPDATE_BATCH_SIZE_MAX = 4;

export default function AdminOutdatedClient({
  photos,
  hasAiTextGeneration,
}: {
  photos: Photo[]
  hasAiTextGeneration: boolean
}) {
  const updateBatchSize = Math.min(UPDATE_BATCH_SIZE_MAX, photos.length);

  const [photoIdsSyncing, setPhotoIdsSyncing] = useState<string[]>([]);

  const arePhotoIdsSyncing = photoIdsSyncing.length > 0;

  const router = useRouter();

  return (
    <AdminChildPage
      backLabel="Photos"
      backPath={PATH_ADMIN_PHOTOS}
      breadcrumb={<>
        <span className="hidden sm:inline-block">
          Outdated ({photos.length})
        </span>
        <span className="sm:hidden">
          Outdated
        </span>
      </>}
      accessory={<LoaderButton
        primary
        icon={<IconGrSync className="translate-y-[1px]" />}
        hideTextOnMobile={false}
        onClick={async () => {
          if (window.confirm(
            // eslint-disable-next-line max-len
            `Are you sure you want to sync the oldest ${updateBatchSize} photos? This action cannot be undone.`,
          )) {
            const photosToSync = photos
              .slice(0, updateBatchSize)
              .map(photo => photo.id);
            const isFinalBatch = photosToSync.length >= photos.length;
            setPhotoIdsSyncing(photosToSync);
            syncPhotosAction(photosToSync)
              .finally(() => {
                if (isFinalBatch) {
                  router.push(PATH_ADMIN_PHOTOS);
                } else {
                  setPhotoIdsSyncing([]);
                  router.refresh();
                }
              });
          }
        }}
        isLoading={arePhotoIdsSyncing}
        disabled={!updateBatchSize}
      >
        {arePhotoIdsSyncing
          ? 'Syncing'
          : <ResponsiveText shortText={`Sync Next ${updateBatchSize}`}>
            Sync Next {updateBatchSize} Photos
          </ResponsiveText>}
      </LoaderButton>}
    >
      <div className="space-y-6">
        <Note>
          <div className="space-y-1.5">
            <div className="font-bold">
              {photos.length} outdated
              {' '}
              {photos.length === 1 ? 'photo' : 'photos'} found
            </div>
            They may have missing EXIF fields, inaccurate blur data,
            {' '}
            undesired privacy settings, or text that can be AI-generated
          </div>
        </Note>
        <div className="space-y-4">
          <AdminPhotosTable
            photos={photos}
            photoIdsSyncing={photoIdsSyncing}
            hasAiTextGeneration={hasAiTextGeneration}
            canEdit={false}
            canDelete={false}
            showUpdatedAt
          />
        </div>
      </div>
    </AdminChildPage>
  );
}
