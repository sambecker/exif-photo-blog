'use client';

import { Photo, deleteConfirmationTextForPhoto, titleForPhoto } from '@/photo';
import AdminTable from './AdminTable';
import { Fragment } from 'react';
import PhotoSmall from '@/photo/PhotoSmall';
import { clsx } from 'clsx/lite';
import { pathForAdminPhotoEdit, pathForPhoto } from '@/site/paths';
import Link from 'next/link';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import PhotoDate from '@/photo/PhotoDate';
import FormWithConfirm from '@/components/FormWithConfirm';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import {
  deletePhotoFormAction,
  syncPhotoAction,
} from '@/photo/actions';
import { useAppState } from '@/state/AppState';
import { RevalidatePhoto } from '@/photo/InfinitePhotoScroll';
import PhotoSyncButton from './PhotoSyncButton';

export default function AdminPhotosTable({
  photos,
  onLastPhotoVisible,
  revalidatePhoto,
  hasAiTextGeneration,
}: {
  photos: Photo[],
  onLastPhotoVisible?: () => void
  revalidatePhoto?: RevalidatePhoto
  hasAiTextGeneration?: boolean
}) {
  const { invalidateSwr } = useAppState();

  return (
    <AdminTable>
      {photos.map((photo, index) =>
        <Fragment key={photo.id}>
          <PhotoSmall
            photo={photo}
            onVisible={index === photos.length - 1
              ? onLastPhotoVisible
              : undefined}
          />
          <div className="flex flex-col lg:flex-row">
            <Link
              key={photo.id}
              href={pathForPhoto({ photo })}
              className="lg:w-[50%] flex items-center gap-2"
              prefetch={false}
            >
              <span className={clsx(
                photo.hidden && 'text-dim',
              )}>
                {titleForPhoto(photo)}
                {photo.hidden && <span className="whitespace-nowrap">
                  {' '}
                  <AiOutlineEyeInvisible
                    className="inline translate-y-[-0.5px]"
                    size={16}
                  />
                </span>}
              </span>
              {photo.priorityOrder !== null &&
                <span className={clsx(
                  'text-xs leading-none px-1.5 py-1 rounded-sm',
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
              <PhotoDate {...{ photo }} />
            </div>
          </div>
          <div className={clsx(
            'flex flex-nowrap',
            'gap-2 sm:gap-3 items-center',
          )}>
            <EditButton path={pathForAdminPhotoEdit(photo)} />
            <PhotoSyncButton
              action={syncPhotoAction}
              photoTitle={titleForPhoto(photo)}
              formData={{ photoId: photo.id }}
              onFormSubmit={invalidateSwr}
              hasAiTextGeneration={hasAiTextGeneration}
              shouldConfirm
              shouldToast
            />
            <FormWithConfirm
              action={deletePhotoFormAction}
              confirmText={deleteConfirmationTextForPhoto(photo)}
              onSubmit={() => revalidatePhoto?.(photo.id, true)}
            >
              <input type="hidden" name="id" value={photo.id} />
              <input type="hidden" name="url" value={photo.url} />
              <DeleteButton clearLocalState />
            </FormWithConfirm>
          </div>
        </Fragment>)}
    </AdminTable>
  );
}
