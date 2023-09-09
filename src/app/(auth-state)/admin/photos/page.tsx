import { Fragment, ReactNode } from 'react';
import PhotoUploadInput from '@/photo/PhotoUploadInput';
import Link from 'next/link';
import PhotoTiny from '@/photo/PhotoTiny';
import { cc } from '@/utility/css';
import ImageTiny from '@/components/ImageTiny';
import FormWithConfirm from '@/components/FormWithConfirm';
import SiteGrid from '@/components/SiteGrid';
import {
  deletePhotoAction,
  deleteBlobPhotoAction,
} from '@/photo/actions';
import { FaRegEdit } from 'react-icons/fa';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import {
  pathForBlobUrl,
  getBlobPhotoUrls,
  getBlobUploadUrls,
} from '@/services/blob';
import { getPhotos } from '@/services/postgres';
import { routeForPhoto } from '@/site/routes';

export const runtime = 'edge';

const DEBUG_PHOTO_BLOBS = false;

export default async function AdminPage() {
  const photos = await getPhotos('createdAt');

  const blobUploadUrls = await getBlobUploadUrls(); 
  const blobPhotoUrls = DEBUG_PHOTO_BLOBS
    ? await getBlobPhotoUrls()
    : [];

  return (
    <SiteGrid
      contentMain={
        <div className="mt-4 space-y-4">
          <div className="space-y-8">
            <PhotoUploadInput />
            {blobUploadUrls.length > 0 &&
              <BlobUrls
                blobUrls={blobUploadUrls}
                label={`Uploads Files (${blobUploadUrls.length})`}
              />}
            {blobPhotoUrls.length > 0 &&
              <BlobUrls
                blobUrls={blobPhotoUrls}
                label={`Photos Files (${blobPhotoUrls.length})`}
              />}
            <AdminGrid title={`Photos (${photos.length})`}>
              {photos.map(photo =>
                <Fragment key={photo.id}>
                  <PhotoTiny
                    className={cc(
                      'rounded-sm overflow-hidden',
                      'border border-gray-200 dark:border-gray-800',
                    )}
                    photo={photo}
                  />
                  <div className="flex flex-col md:flex-row">
                    <Link
                      key={photo.id}
                      href={routeForPhoto(photo)}
                      className="w-[50%] flex items-center gap-2"
                    >
                      {photo.title ||
                        <span className="text-gray-400 dark:text-gray-500">
                          Untitled
                        </span>}
                      {photo.priorityOrder !== null &&
                        <span className={cc(
                          'text-xs leading-none px-1.5 py-1 rounded-sm',
                          'dark:text-gray-300',
                          'bg-gray-100 dark:bg-gray-800',
                        )}>
                          {photo.priorityOrder}
                        </span>}
                    </Link>
                    <div className={cc(
                      'w-[50%] uppercase',
                      'text-gray-400 dark:text-gray-500',
                    )}>
                      {photo.takenAtNaive}
                    </div>
                  </div>
                  <EditButton href={`/admin/photos/${photo.idShort}/edit`} />
                  <FormWithConfirm
                    action={deletePhotoAction}
                    confirmText={
                      `Are you sure you want to delete "${photo.title}?"`}
                  >
                    <input type="hidden" name="id" value={photo.id} />
                    <input type="hidden" name="url" value={photo.url} />
                    <DeleteButton />
                  </FormWithConfirm>
                </Fragment>)}
            </AdminGrid>
          </div>
        </div>}
    />
  );
}

function AdminGrid ({
  title,
  children,
}: {
  title: string,
  children: ReactNode,
}) {
  return <div className="space-y-4">
    <div className="font-bold">
      {title}
    </div>
    <div className="min-w-[14rem] overflow-x-scroll">
      <div className={cc(
        'w-full',
        'grid grid-cols-[auto_1fr_auto_auto] ',
        'gap-3 items-center',
      )}>
        {children}
      </div>
    </div>
  </div>;
}

function EditButton ({
  href,
  label = 'Edit',
}: {
  href: string,
  label?: string,
}) {
  return (
    <Link
      title="Edit"
      href={href}
      className="button"
    >
      <FaRegEdit className="translate-y-[-0.5px]" />
      <span className="hidden sm:inline-block">
        {label}
      </span>
    </Link>
  );
}

function DeleteButton () {
  return <SubmitButtonWithStatus
    title="Delete"
    icon={<span className="inline-flex text-[18px]">×</span>}
  >
    Delete
  </SubmitButtonWithStatus>;
}

function BlobUrls ({
  blobUrls,
  label,
}: {
  blobUrls: string[],
  label: string,
}) {
  return <AdminGrid title={label}>
    {blobUrls.map(url => {
      const href = `/admin/uploads/${encodeURIComponent(url)}`;
      const fileName = url.split('/').pop();
      return <Fragment key={url}>
        <Link href={href}>
          <ImageTiny
            alt={`Photo: ${fileName}`}
            src={url}
            aspectRatio={3.0 / 2.0}
            className={cc(
              'rounded-sm overflow-hidden',
              'border border-gray-200 dark:border-gray-800',
            )}
          />
        </Link>
        <Link
          href={href}
          className="break-all"
          title={url}
        >
          {pathForBlobUrl(url)}
        </Link>
        <EditButton href={href} label="Setup" />
        <FormWithConfirm
          action={deleteBlobPhotoAction}
          confirmText="Are you sure you want to delete this upload?"
        >
          <input type="hidden" name="url" value={url} />
          <DeleteButton />
        </FormWithConfirm>
      </Fragment>;})}
  </AdminGrid>;
}
