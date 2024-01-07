import { auth } from '@/auth';
import { getImageCacheHeadersForAuth, getPhotosCached } from '@/cache';
import {
  IMAGE_OG_DIMENSION,
  MAX_PHOTOS_TO_SHOW_TEMPLATE_TIGHT,
} from '@/photo/image-response';
import TemplateImageResponse from
  '@/photo/image-response/TemplateImageResponse';
import { getIBMPlexMonoMedium } from '@/site/font';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  const [
    photos,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    getPhotosCached({
      sortBy: 'priority',
      limit: MAX_PHOTOS_TO_SHOW_TEMPLATE_TIGHT,
    }),
    getIBMPlexMonoMedium(),
    getImageCacheHeadersForAuth(await auth()),
  ]);

  const { width, height } = IMAGE_OG_DIMENSION;

  return new ImageResponse(
    (
      <TemplateImageResponse {...{
        photos,
        includeHeader: false,
        outerMargin: 0,
        width,
        height,
        fontFamily,
      }}/>
    ),
    {
      width,
      height,
      fonts,
      headers,
    },
  );
}
