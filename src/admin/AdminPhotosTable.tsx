'use client';

import { Photo, deleteConfirmationTextForPhoto, titleForPhoto } from '@/photo';
import AdminTable from './AdminTable';
import { Fragment } from 'react';
import PhotoTiny from '@/photo/PhotoTiny';
import { clsx } from 'clsx/lite';
import { pathForAdminPhotoEdit, pathForPhoto } from '@/site/paths';
import Link from 'next/link';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import PhotoDate from '@/photo/PhotoDate';
import FormWithConfirm from '@/components/FormWithConfirm';
import EditButton from './EditButton';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import IconGrSync from '@/site/IconGrSync';
import DeleteButton from './DeleteButton';
import {
  deletePhotoFormAction,
  syncPhotoExifDataAction,
} from '@/photo/actions';
import { useAppState } from '@/state/AppState';
import { RevalidatePhoto } from '@/photo/InfinitePhotoScroll';

export default function AdminPhotosTable({
  photos,
  onLastPhotoVisible,
  revalidatePhoto,
}: {
  photos: Photo[],
  onLastPhotoVisible?: () => void
  revalidatePhoto?: RevalidatePhoto
}) {
  const { invalidateSwr } = useAppState();

  return (
    <AdminTable>
      {photos.map((photo, index) =>
        <Fragment key={photo.id}>
          <PhotoTiny
            photo={photo}
            onVisible={index === photos.length - 1
              ? onLastPhotoVisible
              : undefined}
          />
          <div className="flex flex-col lg:flex-row">
            <Link
              key={photo.id}
              href={pathForPhoto(photo)}
              className="lg:w-[50%] flex items-center gap-2"
              prefetch={false}
            >
              <span className={clsx(
                'inline-flex items-center gap-2',
                photo.hidden && 'text-dim',
              )}>
                <span>{titleForPhoto(photo)}</span>
                {photo.hidden &&
                  <AiOutlineEyeInvisible
                    className="translate-y-[0.25px]"
                    size={16}
                  />}
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
            <FormWithConfirm
              action={syncPhotoExifDataAction}
              confirmText={
                'Are you sure you want to overwrite EXIF data ' +
                `for "${titleForPhoto(photo)}" from source file? ` +
                'This action cannot be undone.'
              }
            >
              <input type="hidden" name="id" value={photo.id} />
              <SubmitButtonWithStatus
                icon={<IconGrSync
                  className="translate-x-[1px] translate-y-[0.5px]"
                />}
                onFormSubmitToastMessage={`
                  "${titleForPhoto(photo)}" EXIF data synced
                `}
                onFormSubmit={invalidateSwr}
              />
            </FormWithConfirm>
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
