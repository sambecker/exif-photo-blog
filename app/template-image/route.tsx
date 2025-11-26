import {
  GRID_OG_DIMENSION,
  MAX_PHOTOS_TO_SHOW_TEMPLATE,
} from '@/image-response';
import TemplateImageResponse from
  '@/app/TemplateImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { safePhotoImageResponse } from '@/platforms/safe-photo-image-response';
import { getPhotos } from '@/photo/query';

export async function GET() {
  const [
    photos,
    { fontFamily, fonts },
  ] = await Promise.all([
    getPhotos({
      sortWithPriority: true,
      limit: MAX_PHOTOS_TO_SHOW_TEMPLATE,
    }).catch(() => []),
    getIBMPlexMono(),
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
    { width, height, fonts },
  );
}
