import { getPhotosCached } from '@/photo/cache';
import {
  GRID_OG_DIMENSION,
  MAX_PHOTOS_TO_SHOW_TEMPLATE,
} from '@/image-response';
import TemplateImageResponse from
  '@/app/TemplateImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { safePhotoImageResponse } from '@/platforms/safe-photo-image-response';

export async function GET() {
  const [
    photos,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    getPhotosCached({
      sortWithPriority: true,
      limit: MAX_PHOTOS_TO_SHOW_TEMPLATE,
    }).catch(() => []),
    getIBMPlexMono(),
    getImageResponseCacheControlHeaders(),
  ]);

  const { width, height } = GRID_OG_DIMENSION;

  return safePhotoImageResponse(
    photos,
    isNextImageReady => (
      <TemplateImageResponse {...{
        photos: isNextImageReady ? photos : [],
        width,
        height,
        fontFamily,
      }}/>
    ),
    { width, height, fonts, headers },
  );
}
