'use client';

import ImageSmall from '@/components/image/ImageSmall';
import Spinner from '@/components/Spinner';
import { getIdFromStorageUrl } from '@/services/storage';
import { clsx } from 'clsx/lite';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { pathForAdminUploadUrl } from '@/site/paths';
import AddButton from './AddButton';
import FormWithConfirm from '@/components/FormWithConfirm';
import { deleteBlobPhotoAction } from '@/photo/actions';
import DeleteButton from './DeleteButton';
import { UrlAddStatus } from './AdminUploadsClient';
import ResponsiveDate from '@/components/ResponsiveDate';

export default function AdminUploadsTable({
  isAdding,
  urlAddStatuses,
}: {
  isAdding?: boolean
  urlAddStatuses: UrlAddStatus[]
}) {
  const isComplete = urlAddStatuses.every(({ status }) => status === 'added');

  return (
    <div className="space-y-4">
      {urlAddStatuses.map(({ url, status, statusMessage, uploadedAt }) =>
        <div key={url}>
          <div className={clsx(
            'flex items-center gap-2 w-full min-h-8',
          )}>
            <div
              className={clsx(
                'flex items-center grow gap-2',
                'transition-opacity',
                isAdding && !isComplete && status !== 'adding' && 'opacity-30',
              )}
            >
              <div className={clsx(
                'shrink-0 transition-transform',
                isAdding && !isComplete && status === 'adding' &&
                  'translate-x-[-2px] scale-[1.15]',
                isAdding && !isComplete && status !== 'adding'
                  ? 'scale-90'
                  : 'scale-100',
              )}>
                <ImageSmall
                  src={url}
                  alt={url}
                  aspectRatio={3.0 / 2.0}
                  className={clsx(
                    'rounded-[3px] overflow-hidden',
                    'border-subtle',
                    isAdding && !isComplete && status === 'adding' &&
                      'animate-hover-drift shadow-lg',
                  )}
                />
              </div>
              <span className="grow min-w-0">
                <div className="overflow-hidden text-ellipsis">
                  {getIdFromStorageUrl(url)}
                </div>
                <div className="text-dim overflow-hidden text-ellipsis">
                  {isAdding || isComplete
                    ? status === 'added'
                      ? 'Added'
                      : status === 'adding'
                        ? statusMessage ?? 'Adding ...'
                        : 'Waiting'
                    : uploadedAt
                      ? <ResponsiveDate date={uploadedAt} />
                      : '—'}
                </div>
              </span>
            </div>
            <span className="flex items-center gap-2">
              {isAdding || isComplete
                ? <>
                  {status === 'added'
                    ? <FaRegCircleCheck size={18} />
                    : status === 'adding'
                      ? <Spinner
                        size={19}
                        className="translate-y-[2px]"
                      />
                      : <span className="pr-1.5 text-dim">
                        —
                      </span>}
                </>
                : <>
                  <AddButton path={pathForAdminUploadUrl(url)} />
                  <FormWithConfirm
                    action={deleteBlobPhotoAction}
                    confirmText="Are you sure you want to delete this upload?"
                  >
                    <input
                      type="hidden"
                      name="redirectToPhotos"
                      value={urlAddStatuses.length < 2 ? 'true' : 'false'}
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
            </span>
          </div>
        </div>)}
    </div>
  );
}