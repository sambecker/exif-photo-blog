import { Fragment } from 'react';
import AdminGrid from './AdminGrid';
import Link from 'next/link';
import ImageTiny from '@/components/ImageTiny';
import { fileNameForBlobUrl } from '@/services/blob';
import FormWithConfirm from '@/components/FormWithConfirm';
import { deleteBlobPhotoAction } from '@/photo/actions';
import DeleteButton from './DeleteButton';
import { cc } from '@/utility/css';
import { pathForAdminUploadUrl } from '@/site/paths';
import AddButton from './AddButton';

export default function BlobUrls({
  title,
  urls,
}: {
  title?: string
  urls: string[]
}) {
  return (
    <AdminGrid {...{ title }} >
      {urls.map(url => {
        const addUploadPath = pathForAdminUploadUrl(url);
        const uploadFileName = fileNameForBlobUrl(url);
        return <Fragment key={url}>
          <Link href={addUploadPath}>
            <ImageTiny
              alt={`Upload: ${uploadFileName}`}
              src={url}
              aspectRatio={3.0 / 2.0}
              className={cc(
                'rounded-sm overflow-hidden',
                'border border-gray-200 dark:border-gray-800',
              )}
            />
          </Link>
          <Link
            href={addUploadPath}
            className="break-all"
            title={url}
          >
            {uploadFileName}
          </Link>
          <div className={cc(
            'flex flex-nowrap',
            'gap-2 sm:gap-3 items-center',
          )}>
            <AddButton href={addUploadPath} />
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
    </AdminGrid>
  );
}
