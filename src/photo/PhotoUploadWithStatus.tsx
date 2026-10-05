'use client';

import ImageInput from '../components/ImageInput';
import { clsx } from 'clsx/lite';
import { useUploadState } from '@/admin/upload/UploadState';
import { RefObject, useEffect } from 'react';
import { useAppText } from '@/i18n/state/client';
import LoaderButton from '@/components/primitives/LoaderButton';
import { IoCloseSharp } from 'react-icons/io5';
import PhotoUploadStatus from './PhotoUploadStatus';

export default function PhotoUploadWithStatus({
  inputRef,
  inputId,
  shouldResize,
  showStatusText = true,
  showButton = true,
  primary = true,
  expandStatus = false,
  showProgressBarBackground = true,
  className,
}: {
  inputRef?: RefObject<HTMLInputElement | null>
  inputId: string
  shouldResize: boolean
  showStatusText?: boolean
  showButton?: boolean
  primary?: boolean
  expandStatus?: boolean
  showProgressBarBackground?: boolean
  className?: string
}) {
  const {
    uploadState: {
      isUploading,
      uploadError,
    },
    setHideUploadPanel,
    cancelUpload,
    onUploadStart,
    onUploadBlobReady,
    isFinishingUpload,
  } = useUploadState();

  const appText = useAppText();

  useEffect(() => {
    // Hide upload panel while button is shown
    if (showButton) {
      setHideUploadPanel?.(true);
      return () => { setHideUploadPanel?.(false); };
    }
  }, [setHideUploadPanel, showButton]);

  const showCancel = isUploading && !uploadError;

  return (
    <div className={clsx(
      'flex items-center gap-4',
      isUploading && 'cursor-not-allowed',
      expandStatus && 'w-full',
      className,
    )}>
      <div className={clsx(
        showButton ? 'flex items-center gap-2' : 'hidden',
        expandStatus && 'shrink-0',
      )}>
        <ImageInput
          ref={inputRef}
          id={inputId}
          shouldResize={shouldResize}
          onStart={onUploadStart}
          onBlobReady={onUploadBlobReady}
          showButton={showButton}
          primary={primary}
        />
        {showButton && showCancel &&
          <LoaderButton
            className={isFinishingUpload ? undefined : 'cursor-pointer'}
            disabled={isFinishingUpload}
            onClick={cancelUpload}
            icon={<IoCloseSharp
              size={18}
              className="translate-y-[0.5px]"
            />}
          >
            {appText.utility.cancel}
          </LoaderButton>}
      </div>
      {showStatusText &&
        <PhotoUploadStatus
          showButton={showButton}
          expandStatus={expandStatus}
          showProgressBarBackground={showProgressBarBackground}
        />}
    </div>
  );
};
