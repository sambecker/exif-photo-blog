'use client';

import { Photo } from '@/photo';
import { getOptimizedUrlsFromPhotoUrl } from '@/photo/storage';
import useVisibility from '@/utility/useVisibility';
import { useCallback, useRef, useState } from 'react';

export default function AdminPhotoStorageCheck({
  photo,
}: {
  photo: Photo
}) {
  const ref = useRef<HTMLDivElement>(null);

  const url = getOptimizedUrlsFromPhotoUrl(photo.url)[0];

  const [hasImage, setHasImage] = useState<boolean>();

  const onVisible = useCallback(() => {
    if (hasImage === undefined) {
      fetch(url)
        .then(res => setHasImage(res.ok))
        .catch(() => setHasImage(false));
    }
  }, [url, hasImage]);

  useVisibility({ ref, onVisible });

  return <div ref={ref}>
    {hasImage === undefined
      ? 'Checking ...'
      : hasImage === false
        ? '❌'
        : '✅'}
  </div>;
}
