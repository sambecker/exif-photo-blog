'use client';

import { useState } from 'react';
import Spinner from '@/components/Spinner';
import {
  ACCEPTED_PHOTO_FILE_TYPES,
  uploadPhotoFromClient,
} from '@/services/blob';
import { cc } from '@/utility/css';
import { useRouter } from 'next/navigation';

export default function PhotoUploadInput() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const router = useRouter();

  return (
    <div>
      <div className="flex items-center gap-8">
        <form className="flex items-center gap-3">
          <input
            type="file"
            name="file"
            accept={ACCEPTED_PHOTO_FILE_TYPES.join(',')}
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                setIsUploading(true);
                setUploadError('');
                const extension = file.name.split('.').pop();
                uploadPhotoFromClient(
                  file,
                  extension,
                )
                  .then(({ url }) => {
                    // Refresh page to update upload list,
                    // relevant only when a photo isn't added
                    router.refresh();
                    // Redirect to photo detail page
                    router.push(`/admin/uploads/${encodeURIComponent(url)}`);
                  })
                  .catch(error => {
                    setIsUploading(false);
                    setUploadError(`Upload Error: ${error.message}`);
                  });

              }
            }}
            disabled={isUploading}
          />
          {isUploading &&
            <div className={cc(
              'flex items-center gap-2',
              'flex-grow',
              'select-none',
            )}>
              <Spinner size={14} />
              Uploading...
            </div>}
        </form>
      </div>
      {uploadError &&
        <div className="text-red-500">
          {uploadError}
        </div>}
    </div>
  );
};
