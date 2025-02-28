'use client';

import { isPathAdminPhotos } from '@/app/paths';
import Container from '@/components/Container';
import LoaderButton from '@/components/primitives/LoaderButton';
import SiteGrid from '@/components/SiteGrid';
import PhotoUploadWithStatus from '@/photo/PhotoUploadWithStatus';
import { useAppState } from '@/state/AppState';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { IoCloseSharp } from 'react-icons/io5';

export default function AdminUploadPanel({
  shouldResize,
  onLastUpload,
}: {
  shouldResize: boolean
  onLastUpload: () => Promise<void>
}) {
  const pathname = usePathname();

  const {
    uploadInputRef,
    uploadState: {
      isUploading,
    },
    resetUploadState,
  } = useAppState();

  return (
    <SiteGrid
      className={clsx((
        !isUploading ||
        isPathAdminPhotos(pathname)
      ) && 'hidden')}
      contentMain={
        <Container
          color="gray"
          padding="tight"
          className="p-2! pl-4! text-main!"
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
              onClick={resetUploadState}
            />
          </div>
        </Container>}
    />
  );
}
