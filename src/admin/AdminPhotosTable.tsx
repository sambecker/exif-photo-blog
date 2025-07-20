'use client';

import { Photo, titleForPhoto } from '@/photo';
import AdminTable from './AdminTable';
import { Fragment } from 'react';
import PhotoSmall from '@/photo/PhotoSmall';
import { clsx } from 'clsx/lite';
import { pathForAdminPhotoEdit, pathForPhoto } from '@/app/path';
import Link from 'next/link';
import PhotoDate from '@/photo/PhotoDate';
import EditButton from './EditButton';
import { useAppState } from '@/app/AppState';
import { RevalidatePhoto } from '@/photo/InfinitePhotoScroll';
import PhotoSyncButton from './PhotoSyncButton';
import DeletePhotoButton from './DeletePhotoButton';
import { Timezone } from '@/utility/timezone';
import Tooltip from '@/components/Tooltip';
import { photoNeedsToBeSynced, getPhotoSyncStatusText } from '@/photo/sync';
import PhotoVisibilityIcon from '@/photo/visibility/PhotoVisibilityIcon';
import { doesPhotoHaveDefaultVisibility } from '@/photo/visibility';

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
            'flex flex-col lg:flex-row min-w-0 gap-x-3',
            opacityForPhotoId(photo.id),
          )}>
            <span
              key={photo.id}
              className="lg:min-w-[50%] flex items-center gap-1.5"
            >
              <span className={clsx(
                'truncate',
                photo.hidden && 'text-dim',
              )}>
                <Link
                  href={pathForPhoto({ photo })}
                  prefetch={false}
                >
                  {titleForPhoto(photo, false)}
                </Link>
              </span>
              {!doesPhotoHaveDefaultVisibility(photo) &&
                <span className={clsx(
                  'inline-flex items-center',
                  photo.hidden && 'text-dim',
                )}>
                  <PhotoVisibilityIcon photo={photo} />
                </span>}
              {photoNeedsToBeSynced(photo) &&
                <span>
                  <Tooltip
                    content={getPhotoSyncStatusText(photo)}
                    classNameTrigger={clsx(
                      'text-blue-600 dark:text-blue-400',
                      'translate-y-[0.5px]',
                    )}
                    supportMobile
                  />
                </span>}
              {photo.priorityOrder !== null &&
                <span className={clsx(
                  'px-[5px] py-[3px] sm:ml-[3px]',
                  'text-xs leading-none',
                  'bg-medium text-main rounded-sm',
                )}>
                  {photo.priorityOrder}
                </span>}
            </span>
            <div className={clsx(
              'flex min-w-0 gap-1.5 w-full',
              'lg:w-[50%] uppercase',
              'text-dim',
            )}>
              <PhotoDate
                {...{ photo, dateType, timezone }}
                className="truncate"
              />
            </div>
          </div>
          <div className={clsx(
            'flex flex-nowrap',
            'gap-2 items-center',
          )}>
            {canEdit &&
              <EditButton path={pathForAdminPhotoEdit(photo)} />}
            <PhotoSyncButton
              photo={photo}
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
