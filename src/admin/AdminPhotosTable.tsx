'use client';

import { Photo, titleForPhoto } from '@/photo';
import AdminTable from './AdminTable';
import { Fragment } from 'react';
import PhotoSmall from '@/photo/PhotoSmall';
import { clsx } from 'clsx/lite';
import { pathForAdminPhotoEdit, pathForPhoto } from '@/app/paths';
import Link from 'next/link';
import PhotoDate from '@/photo/PhotoDate';
import EditButton from './EditButton';
import { useAppState } from '@/state/AppState';
import { RevalidatePhoto } from '@/photo/InfinitePhotoScroll';
import PhotoSyncButton from './PhotoSyncButton';
import DeletePhotoButton from './DeletePhotoButton';
import { Timezone } from '@/utility/timezone';
import IconHidden from '@/components/icons/IconHidden';
import Tooltip from '@/components/Tooltip';
import { photoNeedsToBeSynced, getPhotoSyncStatusText } from '@/photo/sync';

export default function AdminPhotosTable({
  photos,
  onLastPhotoVisible,
  revalidatePhoto,
  photoIdsSyncing = [],
  hasAiTextGeneration,
  dateType = 'createdAt',
  canEdit = true,
  canDelete = true,
  timezone,
  shouldScrollIntoViewOnExternalSync,
}: {
  photos: Photo[],
  onLastPhotoVisible?: () => void
  revalidatePhoto?: RevalidatePhoto
  photoIdsSyncing?: string[]
  hasAiTextGeneration: boolean
  dateType?: 'createdAt' | 'updatedAt'
  canEdit?: boolean
  canDelete?: boolean
  timezone?: Timezone
  shouldScrollIntoViewOnExternalSync?: boolean
}) {
  const { invalidateSwr } = useAppState();

  const opacityForPhotoId = (photoId: string) =>
    photoIdsSyncing.length > 0 && !photoIdsSyncing.includes(photoId)
      ? 'opacity-40'
      : undefined;

  return (
    <AdminTable>
      {photos.map((photo, index) =>
        <Fragment key={photo.id}>
          <PhotoSmall
            photo={photo}
            onVisible={index === photos.length - 1
              ? onLastPhotoVisible
              : undefined}
            className={opacityForPhotoId(photo.id)}
          />
          <div className={clsx(
            'flex flex-col lg:flex-row',
            opacityForPhotoId(photo.id),
          )}>
            <Link
              key={photo.id}
              href={pathForPhoto({ photo })}
              className="lg:w-[50%] flex items-center gap-2"
              prefetch={false}
            >
              <span className={clsx(
                photo.hidden && 'text-dim',
              )}>
                {titleForPhoto(photo, false)}
                {photo.hidden && <span className="whitespace-nowrap">
                  {' '}
                  <IconHidden
                    className="inline translate-y-[-0.5px]"
                    size={16}
                  />
                </span>}
              </span>
              {photo.priorityOrder !== null &&
                <span className={clsx(
                  'text-xs leading-none px-1.5 py-1 rounded-xs',
                  'dark:text-gray-300',
                  'bg-gray-100 dark:bg-gray-800',
                )}>
                  {photo.priorityOrder}
                </span>}
            </Link>
            <div className={clsx(
              'lg:w-[50%] uppercase',
              'text-dim',
            )}>
              {<>
                <PhotoDate {...{ photo, dateType, timezone }} />
                {photoNeedsToBeSynced(photo) &&
                  <Tooltip
                    content={getPhotoSyncStatusText(photo)}
                    classNameTrigger={clsx(
                      'translate-y-1 ml-1.5',
                      'text-blue-600 dark:text-blue-400',
                    )}
                    supportMobile
                  />}
              </>}
            </div>
          </div>
          <div className={clsx(
            'flex flex-nowrap',
            'gap-2 items-center',
          )}>
            {canEdit &&
              <EditButton path={pathForAdminPhotoEdit(photo)} />}
            <PhotoSyncButton
              photoId={photo.id}
              photoTitle={titleForPhoto(photo)}
              onSyncComplete={invalidateSwr}
              isSyncingExternal={photoIdsSyncing.includes(photo.id)}
              hasAiTextGeneration={hasAiTextGeneration}
              disabled={photoIdsSyncing.length > 0}
              className={opacityForPhotoId(photo.id)}
              shouldConfirm
              shouldToast
              shouldScrollIntoViewOnExternalSync={
                shouldScrollIntoViewOnExternalSync}
            />
            {canDelete &&
              <DeletePhotoButton
                photo={photo}
                onDelete={() => revalidatePhoto?.(photo.id, true)}
              />}
          </div>
        </Fragment>)}
    </AdminTable>
  );
}
