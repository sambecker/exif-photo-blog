import { Fragment } from 'react';
import AdminTable from './AdminTable';
import Link from 'next/link';
import ImageTiny from '@/components/ImageTiny';
import { StorageListResponse, fileNameForStorageUrl } from '@/services/storage';
import FormWithConfirm from '@/components/FormWithConfirm';
import { deleteBlobPhotoAction } from '@/photo/actions';
import DeleteButton from './DeleteButton';
import { clsx } from 'clsx/lite';
import { pathForAdminUploadUrl } from '@/site/paths';
import AddButton from './AddButton';
import { formatDate } from 'date-fns';

export default function AdminUploadsTable({
  title,
  urls,
}: {
  title?: string
  urls: StorageListResponse
}) {
  return (
    <AdminTable {...{ title }} >
      {urls.map(({ url, uploadedAt }) => {
        const addUploadPath = pathForAdminUploadUrl(url);
        const uploadFileName = fileNameForStorageUrl(url);
        return <Fragment key={url}>
          <Link href={addUploadPath} prefetch={false}>
            <ImageTiny
              alt={`Upload: ${uploadFileName}`}
              src={url}
              aspectRatio={3.0 / 2.0}
              className={clsx(
                'rounded-sm overflow-hidden',
                'border border-gray-200 dark:border-gray-800',
              )}
            />
          </Link>
          <Link
            href={addUploadPath}
            className="break-all"
            title={uploadedAt
              ? `${url} @ ${formatDate(uploadedAt, 'yyyy-MM-dd HH:mm:ss')}`
              : url}
            prefetch={false}
          >
            {uploadFileName}
          </Link>
          <div className={clsx(
            'flex flex-nowrap',
            'gap-2 sm:gap-3 items-center',
          )}>
            <AddButton path={addUploadPath} />
            <FormWithConfirm
              action={deleteBlobPhotoAction}
              confirmText="Are you sure you want to delete this upload?"
            >
              <input
                type="hidden"
                name="redirectToPhotos"
                value={urls.length < 2 ? 'true' : 'false'}
                readOnly
              />
              <input
                type="hidden"
                name="url"
                value={url}
                readOnly
              />
              <DeleteButton />
            </FormWithConfirm>
          </div>
        </Fragment>;})}
    </AdminTable>
  );
}
