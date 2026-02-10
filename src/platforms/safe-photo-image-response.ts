import { Photo } from '@/photo';
import { IS_PREVIEW } from '@/app/config';
import { getOptimizedPhotoUrl } from '@/photo/storage';

export const isNextImageReadyBasedOnPhotos = async (
  photos: Photo[],
): Promise<boolean> =>
  photos.length > 0 &&
  fetch(getOptimizedPhotoUrl({
    imageUrl: photos[0].url,
    size: 640,
    addBypassSecret: IS_PREVIEW,
  }))
    .then(response => response.ok)
    .catch(() => false);
