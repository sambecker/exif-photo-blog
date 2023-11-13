'use client';

import { blobToImage } from '@/utility/blob';
import { useRef, useState } from 'react';
import { CopyExif } from '@/lib/CopyExif';
import { cc } from '@/utility/css';
import Spinner from './Spinner';
import { ACCEPTED_PHOTO_FILE_TYPES } from '@/photo';
import { FiUploadCloud } from 'react-icons/fi';

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
  onBlobReady?: (args: {
    blob: Blob,
    extension?: string,
    hasMultipleUploads?: boolean,
    isLastBlob?: boolean,
  }) => Promise<any>
  maxSize?: number
  quality?: number
  loading?: boolean
  debug?: boolean
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  const [image, setImage] = useState<HTMLImageElement>();
  const [filesLength, setFilesLength] = useState(0);
  const [fileUploadIndex, setFileUploadIndex] = useState(0);
  const [fileUploadName, setFileUploadName] = useState('');

  const uploadStatusText = filesLength > 1
    ? `${fileUploadIndex + 1} of ${filesLength}: ${fileUploadName}`
    : fileUploadName;

  return (
    <div className="space-y-4 min-w-0">
      <div className="flex items-center gap-2 sm:gap-4">
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
                ? <Spinner color="text" className="translate-y-[0.5px]" />
                : <FiUploadCloud
                  size={17}
                  className="translate-y-[0.5px] shrink-0"
                />}
            </span>
            {loading
              ? 'Uploading'
              : 'Upload Photos'}
          </span>
          <input
            id={INPUT_ID}
            type="file"
            className="!hidden"
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
                  const canvas = ref.current;
                  if (!(maxSize && canvas)) {
                    // No need to process
                    await onBlobReady?.({
                      ...callbackArgs,
                      blob: file,
                    });
                  } else {
                    // Process images that need resizing
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
                    
                    // Specify wide gamut to avoid data loss while resizing
                    const ctx = canvas.getContext(
                      '2d',
                      { colorSpace: 'display-p3' },
                    );
  
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
                          const blobWithExif = await CopyExif(file, blob);
                          await onBlobReady?.({
                            ...callbackArgs,
                            blob: blobWithExif,
                          });
                        }
                      },
                      'image/jpeg',
                      quality,
                    );
                  }
                }
              }
            }}
          />
        </label>
        {filesLength > 0 &&
          <div className="max-w-full truncate text-ellipsis">
            {uploadStatusText}
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
