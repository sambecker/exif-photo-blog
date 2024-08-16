'use client';

import ImageSmall from '@/components/image/ImageSmall';
import Spinner from '@/components/Spinner';
import { getIdFromStorageUrl } from '@/services/storage';
import { clsx } from 'clsx/lite';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { pathForAdminUploadUrl } from '@/site/paths';
import AddButton from './AddButton';
import { UrlAddStatus } from './AdminUploadsClient';
import ResponsiveDate from '@/components/ResponsiveDate';
import DeleteBlobButton from './DeleteBlobButton';

export default function AdminUploadsTable({
  isAdding,
  urlAddStatuses,
  setUrlAddStatuses,
}: {
  isAdding?: boolean
  urlAddStatuses: UrlAddStatus[]
  setUrlAddStatuses?: (urlAddStatuses: UrlAddStatus[]) => void
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
                  'translate-x-[-2px] scale-[1.125] shadow-lg',
                isAdding && !isComplete && status !== 'adding' &&
                  'scale-90',
              )}>
                <ImageSmall
                  src={url}
                  alt={url}
                  aspectRatio={3.0 / 2.0}
                  className={clsx(
                    'rounded-[3px] overflow-hidden',
                    'border-subtle',
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
                  <DeleteBlobButton
                    url={url}
                    shouldRedirectToAdminPhotos={urlAddStatuses.length <= 1}
                    onDelete={() => setUrlAddStatuses?.(urlAddStatuses.filter(
                      ({ url: urlToRemove }) => urlToRemove !== url,
                    ))}
                  />
                </>}
            </span>
          </div>
        </div>)}
    </div>
  );
}