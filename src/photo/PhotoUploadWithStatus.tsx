'use client';

import { uploadPhotoFromClient } from '@/platforms/storage';
import { useRouter } from 'next/navigation';
import { PATH_ADMIN_UPLOADS, pathForAdminUploadUrl } from '@/app/paths';
import ImageInput from '../components/ImageInput';
import { clsx } from 'clsx/lite';
import { useAppState } from '@/state/AppState';
import { RefObject, useTransition } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import Spinner from '@/components/Spinner';
import ResponsiveText from '@/components/primitives/ResponsiveText';

export default function PhotoUploadWithStatus({
  inputRef,
  inputId,
  shouldResize,
  onLastUpload,
  showStatusText = true,
  showButton = true,
  className,
  debug,
}: {
  inputRef?: RefObject<HTMLInputElement | null>
  inputId: string
  shouldResize: boolean
  onLastUpload?: () => Promise<void>
  showStatusText?: boolean
  showButton?: boolean
  className?: string
  debug?: boolean
}) {
  const {
    uploadState: {
      isUploading,
      uploadError,
      fileUploadName,
      fileUploadIndex,
      filesLength,
      debugDownload,
    },
    setUploadState,
    resetUploadState,
  } = useAppState();

  const router = useRouter();

  useEffect(() => {
    // Hide upload panel while button is shown
    if (showButton) {
      setUploadState?.({ hideUploadPanel: true });
      return () => { setUploadState?.({ hideUploadPanel: false }); };
    }
  }, [setUploadState, showButton]);

  const shouldResetUploadStateAfterPending = useRef(false);
  const [isPending, startTransition] = useTransition();
  // Only reset upload state after route transition completes
  useEffect(() => {
    if (!isPending && shouldResetUploadStateAfterPending.current) {
      resetUploadState?.();
      shouldResetUploadStateAfterPending.current = false;
    }
  }, [isPending, resetUploadState]);
  // Reset upload state when component unmounts
  // when not reset during route transition
  useEffect(() => {
    return () => {
      if (shouldResetUploadStateAfterPending.current) {
        resetUploadState?.();
      }
    };
  }, [resetUploadState]);
  const isFinishing = isPending && shouldResetUploadStateAfterPending.current;

  const uploadStatusText = filesLength > 1
    ? `${fileUploadIndex + 1} of ${filesLength}`
    : undefined;

  return (
    <div className={clsx(
      'flex items-center gap-4',
      isUploading && 'cursor-not-allowed',
      className,
    )}>
      <div className={clsx(
        showButton ? 'flex' : 'hidden',
        'items-center',
      )}>
        <ImageInput
          ref={inputRef}
          id={inputId}
          shouldResize={shouldResize}
          disabled={isPending}
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
                  console.error(error);
                  setUploadState?.({
                    isUploading: false,
                    uploadError: error.message,
                  });
                });
            }
          }}
          showButton={showButton}
          debug={debug}
        />
      </div>
      {showStatusText && <div className={clsx(
        'flex items-center gap-4 overflow-hidden',
      )}>
        {isUploading && !showButton &&
          <Spinner
            className="text-dim translate-y-[1px]"
            color="text"
            size={14}
          />}
        {uploadError
          ? <span className="text-error">
            {uploadError}
          </span>
          : <span className="truncate">
            {isUploading
              ? isFinishing
                ? <>
                  Finishing ...
                </>
                : <>
                  {!showButton && uploadStatusText
                    ? <>
                      <ResponsiveText shortText={uploadStatusText}>
                        Uploading {uploadStatusText}
                      </ResponsiveText>
                      {': '}
                      {fileUploadName}
                    </>
                    : <ResponsiveText shortText={fileUploadName}>
                      Uploading {fileUploadName}
                    </ResponsiveText>}
                </>
              : !showButton && <>Initializing</>}
          </span>}
      </div>}
      {debug && debugDownload &&
        <a
          className="block"
          href={debugDownload.href}
          download={debugDownload.fileName}
        >
          Download
        </a>}
    </div>
  );
};
