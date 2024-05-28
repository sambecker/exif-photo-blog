import { Fragment } from 'react';
import AdminTable from './AdminTable';
import Link from 'next/link';
import {
  StorageListResponse,
  fileNameForStorageUrl,
  getIdFromStorageUrl,
} from '@/services/storage';
import FormWithConfirm from '@/components/FormWithConfirm';
import { deleteBlobPhotoAction } from '@/photo/actions';
import DeleteButton from './DeleteButton';
import { clsx } from 'clsx/lite';
import { pathForAdminUploadUrl } from '@/site/paths';
import AddButton from './AddButton';
import { formatDate } from 'date-fns';
import ImageSmall from '@/components/image/ImageSmall';
import { FaRegCircleCheck } from 'react-icons/fa6';
import Spinner from '@/components/Spinner';

export default function AdminUploadsTable({
  title,
  urls,
  addedUploadUrls,
  isAdding,
}: {
  title?: string
  urls: StorageListResponse
  addedUploadUrls?: string[]
  isAdding?: boolean
}) {
  return (
    <AdminTable {...{ title }} >
      {urls.map(({ url, uploadedAt }) => {
        const addUploadPath = pathForAdminUploadUrl(url);
        const uploadFileName = fileNameForStorageUrl(url);
        const uploadId = getIdFromStorageUrl(url);
        return <Fragment key={url}>
          <Link href={addUploadPath} prefetch={false}>
            <ImageSmall
              alt={`Upload: ${uploadFileName}`}
              src={url}
              aspectRatio={3.0 / 2.0}
              className={clsx(
                'rounded-[3px] overflow-hidden',
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
            {uploadId}
          </Link>
          <div className={clsx(
            'flex flex-nowrap',
            'gap-2 sm:gap-3 items-center',
          )}>
            {addedUploadUrls?.includes(url) || isAdding
              ? <span className={clsx(
                'h-9 flex items-center justify-end w-full pr-3',
              )}>
                {addedUploadUrls?.includes(url)
                  ? <FaRegCircleCheck size={18} />
                  : <Spinner
                    size={19}
                    className="translate-y-[2px]"
                  />}
              </span>
              : <>
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
              </>}
          </div>
        </Fragment>;})}
    </AdminTable>
  );
}
