import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_OG,
} from '@/image-response';
import HomeImageResponse from '@/image-response/HomeImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { APP_OG_IMAGE_QUERY_OPTIONS } from '@/feed';
import { safePhotoImageResponse } from '@/platforms/safe-photo-image-response';

export const dynamic = 'force-static';

export async function GET() {
  const [
    photos,
    headers,
    { fontFamily, fonts },
  ] = await Promise.all([
    getPhotosCached({
      ...APP_OG_IMAGE_QUERY_OPTIONS,
      limit: MAX_PHOTOS_TO_SHOW_OG,
    })
      .catch(() => []),
    getImageResponseCacheControlHeaders(),
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
    ), { width, height, headers, fonts },
  );
}
