'use client';

import Container from '@/components/Container';
import LoaderButton from '@/components/primitives/LoaderButton';
import AppGrid from '@/components/AppGrid';
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

  return (
    <AppGrid
      className={clsx(
        ((!isUploading && !uploadError) || hideUploadPanel) && 'hidden',
      )}
      contentMain={
        <Container
          color="gray"
          padding="tight"
          className={clsx(
            // Necessary for progress bar placement
            'relative overflow-hidden',
            'p-2! pl-4! text-main!',
          )}
        >
          <div className="flex w-full items-center gap-2">
            <PhotoUploadWithStatus
              className="overflow-hidden w-full"
              inputId="admin-upload-panel"
              inputRef={uploadInputRef}
              shouldResize={shouldResize}
              onLastUpload={onLastUpload}
              showButton={false}
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
          </div>
        </Container>}
    />
  );
}