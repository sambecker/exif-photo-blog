'use client';

import { OUTDATED_THRESHOLD, Photo } from '@/photo';
import AdminPhotosTable from '@/admin/AdminPhotosTable';
import LoaderButton from '@/components/primitives/LoaderButton';
import IconGrSync from '@/site/IconGrSync';
import Banner from '@/components/Banner';
import AdminChildPage from '@/components/AdminChildPage';
import { PATH_ADMIN_PHOTOS } from '@/site/paths';
import { useState } from 'react';
import { syncPhotosAction } from '@/photo/actions';
import { useRouter } from 'next/navigation';

const UPDATE_BATCH_SIZE = 4;

export default function AdminOutdatedClient({
  photos,
  hasAiTextGeneration,
}: {
  photos: Photo[]
  hasAiTextGeneration: boolean
}) {
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
        icon={<IconGrSync className="translate-y-[1px]" />}
        hideTextOnMobile={false}
        className="primary"
        onClick={async () => {
          if (window.confirm(
            // eslint-disable-next-line max-len
            `Are you sure you want to sync the oldest ${UPDATE_BATCH_SIZE} photos? This action cannot be undone.`
          )) {
            const photosToSync = photos
              .slice(0, UPDATE_BATCH_SIZE)
              .map(photo => photo.id);
            setPhotoIdsSyncing(photosToSync);
            syncPhotosAction(photosToSync)
              .finally(() => {
                setPhotoIdsSyncing([]);
                router.refresh();
              });
          }
        }}
        isLoading={arePhotoIdsSyncing}
      >
        {arePhotoIdsSyncing
          ? 'Syncing'
          : <>
            <span className="hidden sm:inline-block">
              Sync {UPDATE_BATCH_SIZE} Oldest Photos
            </span>
            <span className="sm:hidden">
              Sync {UPDATE_BATCH_SIZE} Oldest
            </span>
          </>}
      </LoaderButton>}
    >
      <div className="space-y-6">
        <Banner>
          <div className="space-y-1.5">
            {photos.length}
            {' '}
            {photos.length === 1 ? 'photo' : 'photos'}
            {' ('}uploaded before
            {' '}
            {new Date(OUTDATED_THRESHOLD).toLocaleDateString()}{')'}
            {' '}
            may have: missing EXIF fields, inaccurate blur data,
            {' '}
            undesired privacy settings
            {hasAiTextGeneration && ', missing AI-generated text'}
          </div>
        </Banner>
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