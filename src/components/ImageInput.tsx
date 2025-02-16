'use client';

import { blobToImage } from '@/utility/blob';
import { useRef, useState } from 'react';
import { CopyExif } from '@/lib/CopyExif';
import exifr from 'exifr';
import { clsx } from 'clsx/lite';
import { ACCEPTED_PHOTO_FILE_TYPES } from '@/photo';
import { FiUploadCloud } from 'react-icons/fi';
import { MAX_IMAGE_SIZE } from '@/platforms/next-image';
import ProgressButton from './primitives/ProgressButton';

const INPUT_ID = 'file';

export default function ImageInput({
  onStart,
  onBlobReady,
  shouldResize,
  maxSize = MAX_IMAGE_SIZE,
  quality = 0.8,
  loading,
  showUploadStatus = true,
  debug,
}: {
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
  loading?: boolean
  showUploadStatus?: boolean
  debug?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [image, setImage] = useState<HTMLImageElement>();
  const [filesLength, setFilesLength] = useState(0);
  const [fileUploadIndex, setFileUploadIndex] = useState(0);
  const [fileUploadName, setFileUploadName] = useState('');

  return (
    <div className="space-y-4 min-w-0">
      <div className="flex items-center gap-2 sm:gap-4">
        <label
          htmlFor={INPUT_ID}
          className={clsx(
            'shrink-0 select-none text-main',
            loading && 'pointer-events-none cursor-not-allowed',
          )}
        >
          <ProgressButton
            type="button"
            isLoading={loading}
            progress={filesLength > 1
              ? (fileUploadIndex + 1) / filesLength * 0.95
              : undefined}
            icon={<FiUploadCloud
              size={18}
              className="translate-x-[-0.5px] translate-y-[0.5px]"
            />}
            aria-disabled={loading}
            onClick={() => inputRef.current?.click()}
            hideTextOnMobile={false}
            primary
          >
            {loading
              ? filesLength > 1
                ? `Uploading ${fileUploadIndex + 1} of ${filesLength}`
                : 'Uploading'
              : 'Upload Photos'}
          </ProgressButton>
          <input
            ref={inputRef}
            id={INPUT_ID}
            type="file"
            className="hidden!"
            accept={ACCEPTED_PHOTO_FILE_TYPES.join(',')}
            disabled={loading}
            multiple
            onChange={async e => {
              onStart?.();
              const { files } = e.currentTarget;
              if (files && files.length > 0) {
                setFilesLength(files.length);
                for (let i = 0; i < files.length; i++) {
                  const file = files[i];
                  setFileUploadIndex(i);
                  setFileUploadName(file.name);
                  const callbackArgs = {
                    extension: file.name.split('.').pop()?.toLowerCase(),
                    hasMultipleUploads: files.length > 1,
                    isLastBlob: i === files.length - 1,
                  };

                  const isPng = callbackArgs.extension === 'png';
                  
                  const canvas = canvasRef.current;

                  // Specify wide gamut to avoid data loss while resizing
                  const ctx = canvas?.getContext(
                    '2d', { colorSpace: 'display-p3' },
                  );

                  if ((shouldResize || isPng) && canvas && ctx) {
                    // Process images that need resizing
                    const image = await blobToImage(file);

                    setImage(image);

                    ctx.save();
                    
                    let orientation = await exifr
                      .orientation(file)
                      .catch(() => 1) ?? 1;

                    // Preserve EXIF data for PNGs
                    if (!isPng) {
                      // Reverse engineer orientation
                      // so preserved EXIF data can be copied
                      switch (orientation) {
                      case 1: orientation = 1; break;
                      case 2: orientation = 1; break;
                      case 3: orientation = 3; break;
                      case 4: orientation = 1; break;
                      case 5: orientation = 1; break;
                      case 6: orientation = 8; break;
                      case 7: orientation = 1; break;
                      case 8: orientation = 6; break;
                      }
                    }

                    const ratio = image.width / image.height;
  
                    const width =
                      Math.round(ratio >= 1 ? maxSize : maxSize * ratio);
                    const height =
                      Math.round(ratio >= 1 ? maxSize / ratio : maxSize);

                    canvas.width = width;
                    canvas.height = height;

                    // Orientation transforms from:
                    // eslint-disable-next-line max-len
                    // https://gist.github.com/SagiMedina/f00a57de4e211456225d3114fd10b0d0
                    
                    switch(orientation) {
                    case 2:
                      ctx.translate(width, 0);
                      ctx.scale(-1, 1);
                      break;
                    case 3:
                      ctx.translate(width, height);
                      ctx.rotate((180 / 180) * Math.PI);
                      break;
                    case 4:
                      ctx.translate(0, height);
                      ctx.scale(1, -1);
                      break;
                    case 5:
                      canvas.width = height;
                      canvas.height = width;
                      ctx.rotate((90 / 180) * Math.PI);
                      ctx.scale(1, -1);
                      break;
                    case 6:
                      canvas.width = height;
                      canvas.height = width;
                      ctx.rotate((90 / 180) * Math.PI);
                      ctx.translate(0, -height);
                      break;
                    case 7:
                      canvas.width = height;
                      canvas.height = width;
                      ctx.rotate((270 / 180) * Math.PI);
                      ctx.translate(-width, height);
                      ctx.scale(1, -1);
                      break;
                    case 8:
                      canvas.width = height;
                      canvas.height = width;
                      ctx.translate(0, width);
                      ctx.rotate((270 / 180) * Math.PI);
                      break;
                    }

                    ctx.drawImage(image, 0, 0, width, height);

                    ctx.restore();

                    canvas.toBlob(
                      async blob => {
                        if (blob) {
                          const blobWithExif = await CopyExif(file, blob)
                            // Fallback to original blob if EXIF data is missing
                            // or image is in PNG format which cannot be parsed
                            .catch(() => blob);
                          await onBlobReady?.({
                            ...callbackArgs,
                            blob: blobWithExif,
                          });
                        }
                      },
                      'image/jpeg',
                      quality,
                    );
                  } else {
                    // No need to process
                    await onBlobReady?.({
                      ...callbackArgs,
                      blob: file,
                    });
                  }
                }
              }
            }}
          />
        </label>
        {showUploadStatus && filesLength > 0 &&
          <div className="max-w-full truncate">
            {fileUploadName}
          </div>}
      </div>
      <canvas
        ref={canvasRef}
        className={clsx(
          'bg-gray-50 dark:bg-gray-900/50 rounded-md',
          'border border-gray-200 dark:border-gray-800',
          'w-[400px]',
          (!image || !debug) && 'hidden',
        )}
      />
    </div>
  );
}
