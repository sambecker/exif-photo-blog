import ImageMedium from '@/components/image/ImageMedium';
import { UrlAddStatus } from './AdminUploadsClient';
import clsx from 'clsx/lite';
import ResponsiveDate from '@/components/ResponsiveDate';
import Spinner from '@/components/Spinner';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { pathForAdminUploadUrl } from '@/app/path';
import DeleteUploadButton from './DeleteUploadButton';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { isElementEntirelyInViewport } from '@/utility/dom';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import EditButton from './EditButton';
import AddUploadButton from './AddUploadButton';
import { getFileNamePartsFromStorageUrl } from '@/platforms/storage';

export default function AdminUploadsTableRow({
  url,
  status,
  statusMessage,
  draftTitle = '',
  uploadedAt,
  size,
  tabIndex,
  shouldRedirectAfterAction,
  isAdding,
  isDeleting,
  isComplete,
  setIsDeleting,
  setUrlAddStatuses,
}: UrlAddStatus & {
  tabIndex: number
  shouldRedirectAfterAction: boolean
  isAdding?: boolean
  isDeleting?: boolean
  isComplete?: boolean
  setIsDeleting?: Dispatch<SetStateAction<boolean>>
  setUrlAddStatuses?: Dispatch<SetStateAction<UrlAddStatus[]>>
}) {
  const ref = useRef<HTMLDivElement>(null);

  const {
    fileExtension,
    fileId,
  } = getFileNamePartsFromStorageUrl(url);

  const extension = fileExtension?.toUpperCase();

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

  const isRowLoading = isAdding || isDeleting || isComplete || Boolean(status);

  const updateStatus = (updatedStatus: Partial<UrlAddStatus>) => {
    setUrlAddStatuses?.(statuses => statuses.map(status => status.url === url
      ? {
        ...status,
        ...updatedStatus,
      }
      : status));
  };

  const removeRow = () => setUrlAddStatuses?.(statuses => statuses
    .filter(({ url: urlToRemove }) => urlToRemove !== url));

  return (
    <div
      ref={ref}
      className={clsx(
        'flex items-center grow',
        'transition-opacity',
        'rounded-lg overflow-hidden',
        'border-medium bg-extra-dim',
        isAdding && !isComplete && status !== 'adding' && 'opacity-30',
      )}
    >
      <div className={clsx(
        'self-stretch',
        'w-[40%] sm:w-auto shrink-0',
        'transition-transform',
      )}>
        <ImageMedium
          title={fileId}
          src={url}
          alt={url}
          aspectRatio={3.0 / 2.0}
          className={clsx(
            'bg-dim',
            'max-sm:m-2 max-sm:mr-0',
            'max-sm:outline-medium max-sm:shadow-sm',
            'max-sm:rounded-sm overflow-hidden',
          )}
        />
      </div>
      <div className={clsx(
        'flex self-stretch w-full min-w-0',
        'gap-2 sm:gap-3',
        'p-2 sm:p-3',
      )}>
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col grow gap-2">
            <FieldsetWithStatus
              id={`title-${url}`}
              label="Title"
              value={draftTitle}
              onChange={titleUpdated =>
                updateStatus({ draftTitle: titleUpdated })}
              placeholder="Title (optional)"
              tabIndex={tabIndex}
              readOnly={isRowLoading}
              capitalize
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
                  <AddUploadButton
                    url={url}
                    title={draftTitle}
                    onAddStart={() => updateStatus({
                      status: 'adding',
                      statusMessage: 'Adding ...',
                    })}
                    onAddFinish={removeRow}
                    shouldRedirectToAdminPhotos={shouldRedirectAfterAction}
                    disabled={isRowLoading}
                    tooltipSide="bottom"
                  />
                  <EditButton
                    path={pathForAdminUploadUrl(url, draftTitle)}
                    disabled={isRowLoading}
                    tooltip="Review EXIF details before adding"
                    hideText="always"
                    tooltipSide="bottom"
                  />
                  <DeleteUploadButton
                    urls={[url]}
                    shouldRedirectToAdminPhotos={shouldRedirectAfterAction}
                    onDeleteStart={() => setIsDeleting?.(true)}
                    onDelete={() => {
                      setIsDeleting?.(false);
                      removeRow();
                    }}
                    disabled={isRowLoading}
                    tooltip="Delete upload"
                    tooltipSide="bottom"
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
