'use client';

import { usePathname, useRouter } from 'next/navigation';
import { PATH_ADMIN_UPLOADS, pathForAdminUploadUrl } from '@/app/path';
import ImageInput from '../components/ImageInput';
import { clsx } from 'clsx/lite';
import { useAppState } from '@/app/AppState';
import { RefObject, useTransition, useRef, useEffect } from 'react';
import Spinner from '@/components/Spinner';
import ResponsiveText from '@/components/primitives/ResponsiveText';
import { useAppText } from '@/i18n/state/client';
import { uploadTempPhotoFromClient } from './storage';
import { isAbortError } from '@/utility/abort';
import ProgressBar from '@/components/primitives/ProgressBar';
import LoaderButton from '@/components/primitives/LoaderButton';
import { IoCloseSharp } from 'react-icons/io5';

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
      uploadProgress,
      debugDownload,
    },
    setUploadState,
    resetUploadState,
    cancelUpload,
  } = useAppState();

  const appText = useAppText();

  const router = useRouter();

  const pathname = usePathname();

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
    ? appText.utility.paginate(fileUploadIndex + 1, filesLength)
    : undefined;

  const showCancel = isUploading && !isFinishing && !uploadError;

  return (
    <div className={clsx(
      'flex items-center gap-4',
      isUploading && 'cursor-not-allowed',
      className,
    )}>
      <div className={clsx(
        showButton ? 'flex items-center gap-2' : 'hidden',
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
              uploadProgress: 0,
            });
          }}
          onBlobReady={async ({
            blob,
            extension, 
            hasMultipleUploads,
            isLastBlob,
            abortSignal,
            onProgress,
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
              return uploadTempPhotoFromClient(
                blob,
                extension,
                { abortSignal, onProgress },
              )
                .then(async url => {
                  if (isLastBlob) {
                    await onLastUpload?.();
                    shouldResetUploadStateAfterPending.current = true;
                    if (pathname === PATH_ADMIN_UPLOADS) {
                      setUploadState?.({ isUploading: false });
                      router.refresh();
                    } else {
                      startTransition(() => hasMultipleUploads
                        ? router.push(PATH_ADMIN_UPLOADS)
                        : router.push(pathForAdminUploadUrl(url)));
                    }
                  }
                })
                .catch(error => {
                  if (isAbortError(error)) {
                    throw error;
                  }
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
        {showButton && showCancel &&
          <LoaderButton
            className="cursor-pointer"
            onClick={cancelUpload}
            icon={<IoCloseSharp
              size={18}
              className="translate-y-[0.5px]"
            />}
          >
            {appText.utility.cancel}
          </LoaderButton>}
      </div>
      {showStatusText && <div className={clsx(
        'flex flex-col gap-1.5 min-w-0 overflow-hidden',
        !showButton && 'w-full',
      )}>
        <div className="flex items-center gap-4 overflow-hidden">
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
                    {appText.utility.finishing}
                  </>
                  : <>
                    {!showButton && uploadStatusText
                      ? <>
                        <ResponsiveText shortText={uploadStatusText}>
                          {appText.utility.uploading} {uploadStatusText}
                        </ResponsiveText>
                        {': '}
                        {fileUploadName}
                      </>
                      : <ResponsiveText shortText={fileUploadName}>
                        {appText.utility.uploading} {fileUploadName}
                      </ResponsiveText>}
                  </>
                : !showButton && <>Initializing</>}
            </span>}
        </div>
        {!showButton && isUploading && !isFinishing && !uploadError &&
          <ProgressBar
            progress={uploadProgress ?? 0}
            className={clsx(
              'absolute! top-0 left-0 w-full',
              'h-[2px] bg-medium',
            )}
          />}
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