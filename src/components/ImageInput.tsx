'use client';

import { blobToImage } from '@/utility/blob';
import { useRef, useState } from 'react';
import { CopyExif } from '@/lib/CopyExif';
import { cc } from '@/utility/css';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import Spinner from './Spinner';
import { ACCEPTED_PHOTO_FILE_TYPES } from '@/photo';

const INPUT_ID = 'file';

export default function ImageInput({
  onStart,
  onBlobReady,
  maxSize,
  quality = 0.8,
  loading,
  debug,
}: {
  onStart?: () => void
  onBlobReady?: (blob: Blob, extension?: string) => void
  maxSize?: number
  quality?: number
  loading?: boolean
  debug?: boolean
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  const [fileName, setFileName] = useState<string>();
  const [image, setImage] = useState<HTMLImageElement>();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label
          htmlFor={INPUT_ID}
          className={cc(
            'shrink-0 select-none text-main',
            loading && 'pointer-events-none cursor-not-allowed',
          )}
        >
          <span
            className={cc(
              'button primary normal-case',
              loading && 'disabled'
            )}
            aria-disabled={loading}
          >
            <span className="w-4 inline-flex items-center">
              {loading
                ? <Spinner color="text" />
                : <AiOutlineCloudUpload
                  size={18}
                  className="translate-y-[0.5px]"
                />}
            </span>
            Upload Photo
          </span>
          <input
            id={INPUT_ID}
            type="file"
            className="!hidden"
            accept={ACCEPTED_PHOTO_FILE_TYPES.join(',')}
            disabled={loading}
            onChange={async e => {
              onStart?.();
              const file = e.currentTarget.files?.[0];
              setFileName(file?.name);
              const extension = file?.name.split('.').pop()?.toLowerCase();
              const canvas = ref.current;
              if (file) {
                if (!maxSize) {
                  // No need to resize
                  onBlobReady?.(file);
                } else if (canvas) {
                  const image = await blobToImage(file);
                  setImage(image);
                  const { naturalWidth, naturalHeight } = image;
                  const ratio = naturalWidth / naturalHeight;

                  const width =
                    Math.round(ratio >= 1 ? maxSize : maxSize * ratio);
                  const height =
                    Math.round(ratio >= 1 ? maxSize / ratio : maxSize);

                  canvas.width = width;
                  canvas.height = height;
                  
                  // Specify wide gamut to avoid data loss during resizing
                  const ctx = canvas.getContext(
                    '2d',
                    { colorSpace: 'display-p3' },
                  );

                  const imageType =
                    `image/${extension === 'jpg' ? 'jpeg' : extension}`;

                  ctx?.drawImage(
                    image,
                    0,
                    0,
                    canvas.width,
                    canvas.height,
                  );
                  canvas.toBlob(
                    async blob => {
                      if (blob) {
                        // await sleep();
                        const newBlob = await CopyExif(file, blob, imageType);
                        // await sleep();
                        onBlobReady?.(newBlob, extension);
                      }
                    },
                    imageType,
                    quality,
                  );
                }
              }
            }}
          />
        </label>
        {fileName &&
          <div className="max-w-full truncate text-ellipsis">
            {fileName}
          </div>}
      </div>
      <canvas
        ref={ref}
        className={cc(
          'bg-gray-50 dark:bg-gray-900/50 rounded-md',
          'border border-gray-200 dark:border-gray-800',
          'w-[400px]',
          (!image || !debug) && 'hidden',
        )}
      />
    </div>
  );
}
