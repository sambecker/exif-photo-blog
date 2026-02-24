'use client';

import { PATH_ABOUT } from '@/app/path';
import AppGrid from '@/components/AppGrid';
import ImageInput from '@/components/ImageInput';
import LinkWithStatus from '@/components/LinkWithStatus';
import { Photo } from '@/photo';
import { getOptimizedPhotoUrl } from '@/photo/storage';
import clsx from 'clsx/lite';
import { useRef, useState } from 'react';

export default function AdminAboutEditPage({
  photoAvatar,
  shouldResizeImages,
}: {
  photoAvatar?: Photo
  shouldResizeImages?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);

  const avatarUrl = getOptimizedPhotoUrl({
    imageUrl: photoAvatar?.url ?? '',
    useNextImage: true,
    size: 640,
  });

  return (
    <AppGrid contentMain={<div className={clsx(
      'space-y-8 mt-5',
    )}>
      <div>AboutEditPage</div>
      <button
        className={clsx(
          'size-10 rounded-full overflow-auto',
          'active:opacity-70',
          'bg-cover bg-center bg-no-repeat bg-dim',
        )}
        onClick={() => {
          if (inputRef.current) {
            setIsUploading(true);
            inputRef.current.value = '';
            inputRef.current.click();
            inputRef.current.oncancel = () => setIsUploading(false);
          }
        }}
        style={{ backgroundImage: `url(${avatarUrl})` }}
        disabled={isUploading}
      />
      <ImageInput
        ref={inputRef}
        multiple={false}
        shouldResize={shouldResizeImages}
      />
      <LinkWithStatus
        href={PATH_ABOUT}
        className="button"
      >
        Done
      </LinkWithStatus>
    </div>} />
  );
}
