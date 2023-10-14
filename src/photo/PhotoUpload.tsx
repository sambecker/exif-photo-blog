'use client';

import { useState } from 'react';
import { uploadPhotoFromClient } from '@/services/blob';
import { useRouter } from 'next/navigation';
import { pathForAdminUploadUrl } from '@/site/paths';
import ImageInput from '../components/ImageInput';
import { MAX_IMAGE_SIZE } from '@/utility/image';
import { cc } from '@/utility/css';

export default function PhotoUpload({
  shouldResize,
  debug,
}: {
  shouldResize?: boolean
  debug?: boolean
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>();
  const [debugDownload, setDebugDownload] = useState<{
    href: string
    fileName: string
  }>();

  const router = useRouter();

  return (
    <div className={cc(
      'space-y-4',
      isUploading && 'cursor-not-allowed',
    )}>
      <div className="flex items-center gap-8">
        <form className="flex items-center gap-3">
          <ImageInput
            maxSize={shouldResize ? MAX_IMAGE_SIZE : undefined}
            loading={isUploading}
            onStart={() => {
              setIsUploading(true);
              setUploadError('');
            }}
            onBlobReady={(blob, extension) => {
              if (debug) {
                setDebugDownload({
                  href: URL.createObjectURL(blob),
                  fileName: `debug.${extension}`,
                });
                setIsUploading(false);
                setUploadError('');
              } else {
                uploadPhotoFromClient(
                  blob,
                  extension,
                )
                  .then(({ url }) => {
                    // Refresh page to update upload list,
                    // relevant only when a photo isn't added
                    router.refresh();
                    // Redirect to photo detail page
                    router.push(pathForAdminUploadUrl(url));
                  })
                  .catch(error => {
                    setIsUploading(false);
                    setUploadError(`Upload Error: ${error.message}`);
                  });
              }
            }}
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
