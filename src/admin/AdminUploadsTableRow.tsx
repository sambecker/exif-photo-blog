import ImageMedium from '@/components/image/ImageMedium';
import { UrlAddStatus } from './AdminUploadsClient';
import {
  getExtensionFromStorageUrl,
  getIdFromStorageUrl,
} from '@/platforms/storage';
import clsx from 'clsx/lite';
import ResponsiveDate from '@/components/ResponsiveDate';
import Spinner from '@/components/Spinner';
import { FaRegCircleCheck } from 'react-icons/fa6';
import AddButton from './AddButton';
import { pathForAdminUploadUrl } from '@/app/paths';
import DeleteBlobButton from './DeleteUploadButton';
import { useEffect, useRef } from 'react';
import { isElementEntirelyInViewport } from '@/utility/dom';
import FieldSetWithStatus from '@/components/FieldSetWithStatus';

export default function AdminUploadsTableRow({
  url,
  status,
  statusMessage,
  draftTitle = '',
  uploadedAt,
  size,
  isAdding,
  isDeleting,
  isComplete,
  setIsDeleting,
  urlAddStatuses,
  setUrlAddStatuses,
}: UrlAddStatus & {
  isAdding?: boolean
  isDeleting?: boolean
  isComplete?: boolean
  setIsDeleting?: (isDeleting: boolean) => void
  urlAddStatuses: UrlAddStatus[]
  setUrlAddStatuses?: (urlAddStatuses: UrlAddStatus[]) => void
}) {
  const ref = useRef<HTMLDivElement>(null);

  const extension = getExtensionFromStorageUrl(url)?.toUpperCase();

  useEffect(() => {
    if (
      status === 'adding' &&
      !isElementEntirelyInViewport(ref.current)
    ) {
      window.scrollTo({
        top: (ref.current?.offsetTop ?? 0) - 16,
        behavior: 'smooth',
      });
    }
  }, [status]);

  return (
    <div
      ref={ref}
      className={clsx(
        'flex items-center grow',
        'transition-opacity',
        'rounded-md overflow-hidden',
        'border-medium bg-extra-dim',
        isAdding && !isComplete && status !== 'adding' && 'opacity-30',
      )}
    >
      <div className={clsx(
        'w-[50%] sm:w-auto shrink-0 bg-dim',
        'transition-transform',
      )}>
        <ImageMedium
          title={getIdFromStorageUrl(url)}
          src={url}
          alt={url}
          aspectRatio={3.0 / 2.0}
        />
      </div>
      <div className={clsx(
        'flex flex-col w-full self-start min-w-0',
        'gap-2 sm:gap-3',
        'p-2 sm:p-3',
      )}>
        <div className="flex flex-col gap-3">
          <div className={clsx(
            'flex gap-2 sm:gap-3',
            'ml-0.5',
          )}>
            {isAdding || isComplete
              ? status === 'added'
                ? 'Added'
                : status === 'adding'
                  ? statusMessage ?? 'Adding ...'
                  : 'Waiting'
              : <>
                {uploadedAt
                  ? <ResponsiveDate date={uploadedAt} length="medium" />
                  : '—'}
                <div className="max-sm:hidden text-dim truncate">
                  {size
                    ? `${size} ${extension}`
                    : extension}
                </div>
              </>}
          </div>
          <FieldSetWithStatus
            label="Title"
            className="[&_input]:min-h-9 [&_input]:px-2 [&_input]:py-0"
            value={draftTitle}
            onChange={titleUpdated => {
              setUrlAddStatuses?.(urlAddStatuses.map(status => ({
                ...status,
                draftTitle: status.url === url
                  ? titleUpdated
                  : status.draftTitle,
              })));
            }}
            placeholder="Title (optional)"
            tabIndex={urlAddStatuses
              .findIndex(status => status.url === url) + 1}
            hideLabel
          />
        </div>
        <span className="flex items-center gap-2">
          {isAdding || isComplete
            ? <>
              {status === 'added'
                ? <FaRegCircleCheck size={18} />
                : status === 'adding' &&
                  <Spinner
                    size={19}
                    className="translate-y-[2px]"
                  />}
            </>
            : <>
              <AddButton
                path={pathForAdminUploadUrl(url)}
                disabled={isDeleting}
                hideTextOnMobile={false}
              />
              <DeleteBlobButton
                urls={[url]}
                shouldRedirectToAdminPhotos={urlAddStatuses.length <= 1}
                onDeleteStart={() => setIsDeleting?.(true)}
                onDelete={() => {
                  setIsDeleting?.(false);
                  setUrlAddStatuses?.(urlAddStatuses
                    .filter(({ url: urlToRemove }) =>
                      urlToRemove !== url));
                }}
                isLoading={isDeleting}
              />
            </>}
        </span>
      </div>
    </div>
  );
}
