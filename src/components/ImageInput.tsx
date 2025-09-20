'use client';

import { useRef, RefObject } from 'react';
import { pngToJpegWithExif, jpgToJpegWithExif } from '@/utility/exif-client';
import { clsx } from 'clsx/lite';
import { ACCEPTED_PHOTO_FILE_TYPES } from '@/photo';
import { FiUploadCloud } from 'react-icons/fi';
import { MAX_IMAGE_SIZE } from '@/platforms/next-image';
import ProgressButton from './primitives/ProgressButton';
import { useAppState } from '@/app/AppState';
import { useAppText } from '@/i18n/state/client';

export default function ImageInput({
  ref: inputRefExternal,
  id = 'file',
  onStart,
  onBlobReady,
  shouldResize,
  maxSize = MAX_IMAGE_SIZE,
  quality = 0.9,
  showButton,
  disabled: disabledProp,
  debug: _debug,
}: {
  ref?: RefObject<HTMLInputElement | null>
  id?: string
  onStart?: () => void
  onBlobReady?: (args: {
    blob: Blob,
    extension?: string,
    hasMultipleUploads?: boolean,
    isLastBlob?: boolean,
  }) => Promise<any>
  shouldResize?: boolean
  maxSize?: number
  quality?: number
  showButton?: boolean
  disabled?: boolean
  debug?: boolean
}) {
  const inputRefInternal = useRef<HTMLInputElement>(null);

  const inputRef = inputRefExternal ?? inputRefInternal;

  const {
    uploadState: {
      isUploading,
      filesLength,
      fileUploadIndex,
    },
    setUploadState,
    resetUploadState,
  } = useAppState();
  
  const appText = useAppText();

  const disabled = disabledProp || isUploading;

  return (
    <div className="flex flex-col gap-4 min-w-0">
      <div className="flex items-center gap-2 sm:gap-4">
        <label
          htmlFor={id}
          className={clsx(
            'shrink-0 select-none text-main',
            // Undo standard label styles since
            // content is shown as button
            'font-normal tracking-normal',
            disabled && 'pointer-events-none cursor-not-allowed',
          )}
        >
          {showButton &&
            <ProgressButton
              type="button"
              isLoading={disabled}
              progress={filesLength > 1
                ? (fileUploadIndex + 1) / filesLength * 0.95
                : undefined}
              icon={<FiUploadCloud
                size={18}
                className="translate-x-[-0.5px] translate-y-[0.5px]"
              />}
              aria-disabled={disabled}
              onClick={() => inputRef.current?.click()}
              hideText="never"
              primary
            >
              {isUploading
                ? filesLength > 1
                  ? appText.utility.paginateAction(
                    fileUploadIndex + 1,
                    filesLength,
                    appText.admin.uploading,
                  )
                  : appText.admin.uploading
                : appText.admin.uploadPhotos}
            </ProgressButton>}
          <input
            ref={inputRef}
            id={id}
            type="file"
            className="hidden!"
            accept={ACCEPTED_PHOTO_FILE_TYPES.join(',')}
            disabled={disabled}
            multiple
            onChange={async e => {
              onStart?.();
              const { files } = e.currentTarget;
              if (files && files.length > 0) {
                setUploadState?.({ filesLength: files.length });
                for (let i = 0; i < files.length; i++) {
                  const file = files[i];
                  setUploadState?.({
                    fileUploadIndex: i,
                    fileUploadName: file.name,
                  });
                  const inputExtension = file.name
                    .split('.')
                    .pop()?.toLowerCase();

                  const isInputPng = inputExtension === 'png';
                  
                  const outputExtension = shouldResize
                    ? 'jpeg'
                    : inputExtension;
                  
                  const callbackArgs = {
                    extension: outputExtension,
                    hasMultipleUploads: files.length > 1,
                    isLastBlob: i === files.length - 1,
                  };

                  let blob: Blob | File = file;
                  
                  if (shouldResize) {
                    if (isInputPng) {
                      // Use specialized PNG <> JPEG converter
                      // for EXIF preservation
                      blob = await pngToJpegWithExif(
                        file,
                        { maxSize, quality },
                      ).catch(() => file);
                    } else {
                      // Use specialized JPG <> JPEG converter
                      // for EXIF preservation
                      blob = await jpgToJpegWithExif(
                        file,
                        { maxSize, quality },
                      ).catch(() => file);
                    }

                    await onBlobReady?.({
                      ...callbackArgs,
                      blob,
                    });
                  } else {
                    // No need to process
                    await onBlobReady?.({
                      ...callbackArgs,
                      blob,
                    });
                  }
                }
              } else {
                resetUploadState?.();
              }
            }}
          />
        </label>
      </div>
    </div>
  );
}
