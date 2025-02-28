'use client';

import { pathForAdminUploadUrl } from '@/app/paths';
import { PATH_ADMIN_UPLOADS } from '@/app/paths';
import Container from '@/components/Container';
import ImageInput from '@/components/ImageInput';
import LoaderButton from '@/components/primitives/LoaderButton';
import SiteGrid from '@/components/SiteGrid';
import Spinner from '@/components/Spinner';
import { uploadPhotoFromClient } from '@/platforms/storage';
import { useAppState } from '@/state/AppState';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useTransition } from 'react';
import { IoCloseSharp } from 'react-icons/io5';

export default function AdminUploadPanel({
  shouldResize,
  onLastUpload,
  debug,
}: {
  shouldResize: boolean
  onLastUpload?: () => Promise<void>
  debug?: boolean
}) {
  const {
    uploadInputRef,
    uploadState: {
      isUploading,
      filesLength,
      fileUploadIndex,
      fileUploadName,
      uploadError,
      debugDownload,
      hideUploadPanel,
    },
    setUploadState,
    resetUploadState,
  } = useAppState();

  const router = useRouter();

  const shouldResetUploadStateAfterPending = useRef(false);
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    if (!isPending) {
      if (shouldResetUploadStateAfterPending.current) {
        resetUploadState?.();
        shouldResetUploadStateAfterPending.current = false;
      }
    }
  }, [isPending, resetUploadState]);
  const isFinalizing = isPending &&
    shouldResetUploadStateAfterPending.current;

  return (
    <SiteGrid
      className={clsx((!isUploading || hideUploadPanel) && 'hidden')}
      contentMain={
        <Container
          color="gray"
          padding="tight"
          className="p-2! pl-4! text-main!"
        >
          <div className="flex w-full items-center gap-2">
            <div className="grow">
              <ImageInput
                ref={uploadInputRef}
                shouldResize={shouldResize}
                onStart={() => {
                  setUploadState?.({
                    isUploading: true,
                    uploadError: '',
                  });
                }}
                onBlobReady={async ({
                  blob,
                  extension, 
                  hasMultipleUploads,
                  isLastBlob,
                }) => {
                  if (debug) {
                    setUploadState?.({
                      isUploading: false,
                      uploadError: '',
                      debugDownload: {
                        href: URL.createObjectURL(blob),
                        fileName: `debug.${extension}`,
                      },
                    });
                  } else {
                    return uploadPhotoFromClient(
                      blob,
                      extension,
                    )
                      .then(async url => {
                        if (isLastBlob) {
                          await onLastUpload?.();
                          shouldResetUploadStateAfterPending.current = true;
                          startTransition(() => hasMultipleUploads
                            ? router.push(PATH_ADMIN_UPLOADS)
                            : router.push(pathForAdminUploadUrl(url)));
                        }
                      })
                      .catch(error => {
                        setUploadState?.({
                          isUploading: false,
                          uploadError: `Upload Error: ${error.message}`,
                        });
                      });
                  }
                }}
                showUploadStatus={false}
                showUploadButton={false}
              />
              {isUploading
                ? <div className={clsx('flex items-center gap-4')}>
                  {isFinalizing
                    ? <span>
                      Finishing
                    </span>
                    : <span className="inline-block truncate">
                      {/* eslint-disable-next-line max-len */}
                      Uploading {fileUploadIndex + 1} of {filesLength}: {fileUploadName}
                    </span>}
                  <Spinner
                    className="text-dim translate-y-[1px]"
                    color="text"
                    size={14}
                  />
                </div>
                : 'Initializing...'}
            </div>
            <LoaderButton 
              icon={<IoCloseSharp
                size={18}
                className="translate-y-[0.5px]"
              />}
            />
          </div>
          {debug && debugDownload &&
            <a
              className="block"
              href={debugDownload.href}
              download={debugDownload.fileName}
            >
              Download
            </a>}
          {uploadError &&
            <div className="text-error">
              {uploadError}
            </div>}
        </Container>}
    />
  );
}
