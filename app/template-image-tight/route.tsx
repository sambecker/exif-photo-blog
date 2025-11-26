import {
  IMAGE_OG_DIMENSION,
  MAX_PHOTOS_TO_SHOW_TEMPLATE_TIGHT,
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
      limit: MAX_PHOTOS_TO_SHOW_TEMPLATE_TIGHT,
    }).catch(() => []),
    getIBMPlexMono(),
  ]);

  const { width, height } = IMAGE_OG_DIMENSION;

  return safePhotoImageResponse(
    photos,
    isNextImageReady => (
      <TemplateImageResponse {...{
        photos: isNextImageReady ? photos : [],
        includeHeader: false,
        outerMargin: 0,
        width,
        height,
        fontFamily,
      }}/>
    ),
    { width, height, fonts },
  );
}
