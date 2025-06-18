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
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { isElementEntirelyInViewport } from '@/utility/dom';
import FieldSetWithStatus from '@/components/FieldSetWithStatus';
import EditButton from './EditButton';

export default function AdminUploadsTableRow({
  url,
  status,
  statusMessage,
  draftTitle = '',
  uploadedAt,
  size,
  tabIndex,
  shouldRedirectToAdminPhotosOnDelete,
  isAdding,
  isDeleting,
  isComplete,
  setIsDeleting,
  setUrlAddStatuses,
}: UrlAddStatus & {
  tabIndex: number
  shouldRedirectToAdminPhotosOnDelete: boolean
  isAdding?: boolean
  isDeleting?: boolean
  isComplete?: boolean
  setIsDeleting?: Dispatch<SetStateAction<boolean>>
  setUrlAddStatuses?: Dispatch<SetStateAction<UrlAddStatus[]>>
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
        'flex self-stretch w-full min-w-0',
        'gap-2 sm:gap-3',
        'p-2 sm:p-3',
      )}>
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col grow gap-3">
            <FieldSetWithStatus
              label="Title"
              value={draftTitle}
              onChange={titleUpdated => {
                setUrlAddStatuses?.(statuses => statuses.map(status => ({
                  ...status,
                  draftTitle: status.url === url
                    ? titleUpdated
                    : status.draftTitle,
                })));
              }}
              placeholder="Title (optional)"
              tabIndex={tabIndex}
              readOnly={isAdding || isDeleting || isComplete || Boolean(status)}
              hideLabel
            />
            <div className="flex items-center gap-2">
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
                    tooltip="Add directly"
                  />
                  <EditButton
                    path={pathForAdminUploadUrl(url)}
                    tooltip="Review photo details"
                    hideText
                  />
                  <DeleteBlobButton
                    urls={[url]}
                    shouldRedirectToAdminPhotos={
                      shouldRedirectToAdminPhotosOnDelete}
                    onDeleteStart={() => setIsDeleting?.(true)}
                    onDelete={() => {
                      setIsDeleting?.(false);
                      setUrlAddStatuses?.(statuses => statuses
                        .filter(({ url: urlToRemove }) => urlToRemove !== url));
                    }}
                    isLoading={isDeleting}
                    tooltip="Delete upload"
                  />
                </>}
            </div>
          </div>
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
                  ? <ResponsiveDate
                    date={uploadedAt}
                    titleLabel="UPLOADED AT"
                  />
                  : '—'}
                <div className="max-sm:hidden text-dim truncate">
                  {size
                    ? `${size} ${extension}`
                    : extension}
                </div>
              </>}
          </div>
        </div>
      </div>
    </div>
  );
}
