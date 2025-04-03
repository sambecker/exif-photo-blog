'use client';

import Spinner from '@/components/Spinner';
import {
  getIdFromStorageUrl,
  getExtensionFromStorageUrl,
} from '@/platforms/storage';
import { clsx } from 'clsx/lite';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { pathForAdminUploadUrl } from '@/app/paths';
import AddButton from './AddButton';
import { UrlAddStatus } from './AdminUploadsClient';
import ResponsiveDate from '@/components/ResponsiveDate';
import DeleteBlobButton from './DeleteUploadButton';
import ImageMedium from '@/components/image/ImageMedium';

export default function AdminUploadsTable({
  isAdding,
  urlAddStatuses,
  setUrlAddStatuses,
  isDeleting,
}: {
  isAdding?: boolean
  urlAddStatuses: UrlAddStatus[]
  setUrlAddStatuses?: (urlAddStatuses: UrlAddStatus[]) => void
  isDeleting?: boolean
}) {
  const isComplete = urlAddStatuses.every(({ status }) => status === 'added');

  return (
    <div className="space-y-4">
      {urlAddStatuses.map(({ url, status, statusMessage, uploadedAt, size }) =>
        <div
          key={url}
          className={clsx(
            'flex items-center grow',
            'transition-opacity',
            'rounded-lg overflow-hidden',
            'border-main bg-extra-dim',
            isAdding && !isComplete && status !== 'adding' && 'opacity-30',
          )}
        >
          <div className={clsx(
            'shrink-0 transition-transform',
            isAdding && !isComplete && status === 'adding' &&
              'translate-x-[-2px] scale-[1.125] shadow-lg',
            isAdding && !isComplete && status !== 'adding' &&
              'scale-90',
            'w-[55%] sm:w-auto',
          )}>
            <ImageMedium
              title={getIdFromStorageUrl(url)}
              src={url}
              alt={url}
              aspectRatio={3.0 / 2.0}
            />
          </div>
          <div className={clsx(
            'flex flex-col gap-2 w-full self-start',
            'p-2.5 sm:p-4',
          )}>
            <div className="flex flex-col gap-0.5 h-full">
              <div className="truncate font-medium">
                {uploadedAt
                  ? <ResponsiveDate date={uploadedAt} />
                  : '—'}
              </div>
              <div className="text-dim overflow-hidden text-ellipsis">
                {isAdding || isComplete
                  ? status === 'added'
                    ? 'Added'
                    : status === 'adding'
                      ? statusMessage ?? 'Adding ...'
                      : 'Waiting'
                  : size
                    // eslint-disable-next-line max-len
                    ? `${size} ${getExtensionFromStorageUrl(url)?.toUpperCase()}`
                    : getExtensionFromStorageUrl(url)?.toUpperCase()}
              </div>
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
                  <AddButton
                    path={pathForAdminUploadUrl(url)}
                    disabled={isDeleting}
                  />
                  <DeleteBlobButton
                    urls={[url]}
                    shouldRedirectToAdminPhotos={urlAddStatuses.length <= 1}
                    onDelete={() =>
                      setUrlAddStatuses?.(urlAddStatuses
                        .filter(({ url: urlToRemove }) =>
                          urlToRemove !== url))}
                    isLoading={isDeleting}
                  />
                </>}
            </span>
          </div>
        </div>)}
    </div>
  );
}
