import { Fragment } from 'react';
import PhotoUpload from '@/photo/PhotoUpload';
import Link from 'next/link';
import PhotoTiny from '@/photo/PhotoTiny';
import { clsx } from 'clsx/lite';
import FormWithConfirm from '@/components/FormWithConfirm';
import SiteGrid from '@/components/SiteGrid';
import {
  deletePhotoFormAction,
  syncPhotoExifDataAction,
} from '@/photo/actions';
import {
  pathForAdminPhotos,
  pathForPhoto,
  pathForAdminPhotoEdit,
} from '@/site/paths';
import { deleteConfirmationTextForPhoto, titleForPhoto } from '@/photo';
import MorePhotos from '@/photo/MorePhotos';
import {
  getPhotosCached,
  getPhotosCountIncludingHiddenCached,
} from '@/photo/cache';
import { AiOutlineEyeInvisible } from 'react-icons/ai';
import {
  PaginationParams,
  getPaginationForSearchParams,
} from '@/site/pagination';
import AdminGrid from '@/admin/AdminGrid';
import DeleteButton from '@/admin/DeleteButton';
import EditButton from '@/admin/EditButton';
import StorageUrls from '@/admin/StorageUrls';
import { PRO_MODE_ENABLED } from '@/site/config';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import IconGrSync from '@/site/IconGrSync';
import { getStoragePhotoUrlsNoStore } from '@/services/storage/cache';
import PhotoDate from '@/photo/PhotoDate';
import { revalidatePath } from 'next/cache';

const DEBUG_PHOTO_BLOBS = false;

export default async function AdminPhotosPage({
  searchParams,
}: PaginationParams) {
  const { offset, limit } = getPaginationForSearchParams(searchParams);

  const [
    photos,
    count,
    blobPhotoUrls,
  ] = await Promise.all([
    getPhotosCached({ includeHidden: true, sortBy: 'createdAt', limit }),
    getPhotosCountIncludingHiddenCached(),
    DEBUG_PHOTO_BLOBS ? getStoragePhotoUrlsNoStore() : [],
  ]);

  const showMorePhotos = count > photos.length;

  return (
    <SiteGrid
      contentMain={
        <div className="space-y-8">
          <PhotoUpload
            shouldResize={!PRO_MODE_ENABLED}
            onLastUpload={async () => {
              'use server';
              // Update upload count in admin nav
              revalidatePath('/admin', 'layout');
            }}
          />
          {blobPhotoUrls.length > 0 &&
            <div className={clsx(
              'border-b pb-6',
              'border-gray-200 dark:border-gray-700',
            )}>
              <StorageUrls
                title={`Photo Blobs (${blobPhotoUrls.length})`}
                urls={blobPhotoUrls}
              />
            </div>}
          <div className="space-y-4">
            <AdminGrid>
              {photos.map(photo =>
                <Fragment key={photo.id}>
                  <PhotoTiny photo={photo} />
                  <div className="flex flex-col lg:flex-row">
                    <Link
                      key={photo.id}
                      href={pathForPhoto(photo)}
                      className="lg:w-[50%] flex items-center gap-2"
                    >
                      <span className={clsx(
                        'inline-flex items-center gap-2',
                        photo.hidden && 'text-dim',
                      )}>
                        <span>{photo.title || 'Untitled'}</span>
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
                    <EditButton href={pathForAdminPhotoEdit(photo)} />
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
                        icon={<IconGrSync className="translate-y-[-0.5px]" />}
                        onFormSubmitToastMessage={`
                          "${titleForPhoto(photo)}" EXIF data synced
                        `}
                      />
                    </FormWithConfirm>
                    <FormWithConfirm
                      action={deletePhotoFormAction}
                      confirmText={deleteConfirmationTextForPhoto(photo)}
                    >
                      <input type="hidden" name="id" value={photo.id} />
                      <input type="hidden" name="url" value={photo.url} />
                      <DeleteButton />
                    </FormWithConfirm>
                  </div>
                </Fragment>)}
            </AdminGrid>
            {showMorePhotos &&
              <MorePhotos path={pathForAdminPhotos(offset + 1)} />}
          </div>
        </div>}
    />
  );
}
