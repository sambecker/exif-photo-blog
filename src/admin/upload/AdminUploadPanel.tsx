'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import StickyBanner from '@/components/StickyBanner';
import PhotoUploadWithStatus from '@/photo/PhotoUploadWithStatus';
import { useAppState } from '@/app/AppState';
import clsx from 'clsx/lite';
import { IoCloseSharp } from 'react-icons/io5';
import { useAppText } from '@/i18n/state/client';

export default function AdminUploadPanel({
  shouldResize,
  onLastUpload,
}: {
  shouldResize: boolean
  onLastUpload: () => Promise<void>
}) {
  const {
    uploadInputRef,
    uploadState: {
      isUploading,
      hideUploadPanel,
      uploadError,
    },
    cancelUpload,
    resetUploadState,
  } = useAppState();

  const appText = useAppText();

  const isVisible = (isUploading || Boolean(uploadError)) && !hideUploadPanel;

  return (
    <StickyBanner
      isEnabled={isVisible}
      className={clsx(
        'flex items-center gap-2 pl-4',
        // Necessary for progress bar placement
        'relative overflow-hidden',
      )}
    >
      <PhotoUploadWithStatus
        className="overflow-hidden w-full"
        inputId="admin-upload-panel"
        inputRef={uploadInputRef}
        shouldResize={shouldResize}
        onLastUpload={onLastUpload}
        showButton={false}
        showProgressBarBackground={false}
      />
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
  );
}