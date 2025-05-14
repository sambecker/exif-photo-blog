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

export default function AdminUploadsTableRow({
  url,
  status,
  statusMessage,
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
        'flex flex-col w-full self-start',
        'gap-2 sm:gap-4',
        'p-2.5 pl-3',
        'sm:p-4 sm:pl-6',
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
                ? `${size} ${getExtensionFromStorageUrl(url)?.toUpperCase()}`
                : getExtensionFromStorageUrl(url)?.toUpperCase()}
          </div>
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
