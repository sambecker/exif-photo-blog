'use client';

import { uploadPhotoFromClient } from '@/platforms/storage';
import { useRouter } from 'next/navigation';
import { PATH_ADMIN_UPLOADS, pathForAdminUploadUrl } from '@/app/paths';
import ImageInput from '../components/ImageInput';
import { clsx } from 'clsx/lite';
import { useAppState } from '@/state/AppState';

export default function PhotoUpload({
  shouldResize,
  onLastUpload,
  showUploadStatus,
  debug,
}: {
  shouldResize?: boolean
  onLastUpload?: () => Promise<void>
  showUploadStatus?: boolean
  debug?: boolean
}) {
  const {
    uploadState: {
      isUploading,
      uploadError,
      debugDownload,
    },
    setUploadState,
    resetUploadState,
  } = useAppState();

  const router = useRouter();

  return (
    <div className={clsx(
      'space-y-4',
      isUploading && 'cursor-not-allowed',
    )}>
      <div className="flex items-center gap-8">
        <form className="flex items-center min-w-0">
          <ImageInput
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
                      resetUploadState?.();
                      if (hasMultipleUploads) {
                        // Redirect to view multiple uploads
                        router.push(PATH_ADMIN_UPLOADS);
                      } else {
                        // Redirect to photo detail page
                        router.push(pathForAdminUploadUrl(url));
                      }
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
            showUploadStatus={showUploadStatus}
            debug={debug}
          />
        </form>
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
    </div>
  );
};
