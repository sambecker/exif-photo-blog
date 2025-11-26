import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_OG,
} from '@/image-response';
import HomeImageResponse from '@/app/HomeImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { APP_OG_IMAGE_QUERY_OPTIONS } from '@/feed';
import { safePhotoImageResponse } from '@/platforms/safe-photo-image-response';
import { KEY_PHOTOS } from '@/cache';
import { cacheTag } from 'next/cache';

async function getCacheComponent() {
  'use cache';
  cacheTag(KEY_PHOTOS);

  const [
    photos,
    { fontFamily, fonts },
  ] = await Promise.all([
    getPhotosCached({
      ...APP_OG_IMAGE_QUERY_OPTIONS,
      limit: MAX_PHOTOS_TO_SHOW_OG,
    })
      .catch(() => []),
    getIBMPlexMono(),
  ]);

  const { width, height } = IMAGE_OG_DIMENSION_SMALL;

  return safePhotoImageResponse(
    photos,
    isNextImageReady => (
      <HomeImageResponse {...{
        photos: isNextImageReady ? photos : [],
        width,
        height,
        fontFamily,
      }}/>
    ), { width, height, fonts },
  );
}

export async function GET() {
  return getCacheComponent();
}
