import { Photo } from '@/photo';
import { ImageResponse } from 'next/og';
import { JSX } from 'react';
import { getNextImageUrlForRequest } from './next-image';
import { IS_PREVIEW } from '@/app/config';

const isNextImageReadyBasedOnPhotos = async (
  photos: Photo[],
): Promise<boolean> =>
  photos.length > 0 &&
  fetch(getNextImageUrlForRequest({
    imageUrl: photos[0].url,
    size: 640,
    addBypassSecret: IS_PREVIEW,
  }))
    .then(response => response.ok)
    .catch(() => false);

export const safePhotoImageResponse = async (
  photos: Photo[],
  jsx: (isNextImageReady: boolean) => JSX.Element,
  options: ConstructorParameters<typeof ImageResponse>[1],
) => {
  // Make sure next/image can be reached from absolute urls,
  // which may not exist on first pre-render
  const isNextImageReady = await isNextImageReadyBasedOnPhotos(photos);

  return new ImageResponse(
    jsx(isNextImageReady),
    options,
  );
};
