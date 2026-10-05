'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import StickyBanner from '@/components/StickyBanner';
import ImageInput from '@/components/ImageInput';
import PhotoUploadStatus from '@/photo/PhotoUploadStatus';
import { useUploadState } from '@/admin/upload/UploadState';
import clsx from 'clsx/lite';
import { IoCloseSharp } from 'react-icons/io5';
import { useAppText } from '@/i18n/state/client';

export default function AdminUploadPanel({
  shouldResize,
}: {
  shouldResize: boolean
}) {
  const {
    uploadInputRef,
    uploadState: {
      isUploading,
      uploadError,
    },
    hideUploadPanel,
    cancelUpload,
    resetUploadState,
    onUploadStart,
    onUploadBlobReady,
  } = useUploadState();

  const appText = useAppText();

  const isVisible = (isUploading || Boolean(uploadError)) && !hideUploadPanel;

  return (
    <>
      {/* Stays mounted so uploads can start while the banner is hidden */}
      <ImageInput
        ref={uploadInputRef}
        id="admin-upload-panel"
        shouldResize={shouldResize}
        onStart={onUploadStart}
        onBlobReady={onUploadBlobReady}
        hidden
      />
      <StickyBanner
        isVisible={isVisible}
        className={clsx(
          'flex items-center gap-2 pl-4',
          // Necessary for progress bar placement
          'relative overflow-hidden',
        )}
      >
        <div className={clsx(
          'flex items-center gap-4 overflow-hidden w-full',
          isUploading && 'cursor-not-allowed',
        )}>
          <PhotoUploadStatus showProgressBarBackground={false} />
        </div>
        <LoaderButton 
          icon={<IoCloseSharp
            size={18}
            className="translate-y-[0.5px]"
          />}
          tooltip={isUploading
            ? appText.utility.cancel
            : undefined}
          onClick={isUploading
            ? cancelUpload
            : resetUploadState}
        />
      </StickyBanner>
    </>
  );
}
