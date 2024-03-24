import { getPhotosCached } from '@/photo/cache';
import {
  GRID_OG_DIMENSION,
  MAX_PHOTOS_TO_SHOW_TEMPLATE,
} from '@/image-response';
import TemplateImageResponse from
  '@/image-response/TemplateImageResponse';
import { getIBMPlexMonoMedium } from '@/site/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';

export const runtime = 'edge';

export async function GET() {
  const [
    photos,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    getPhotosCached({ sortBy: 'priority', limit: MAX_PHOTOS_TO_SHOW_TEMPLATE }),
    getIBMPlexMonoMedium(),
    getImageResponseCacheControlHeaders(),
  ]);

  const { width, height } = GRID_OG_DIMENSION;
  
  return new ImageResponse(
    (
      <TemplateImageResponse {...{
        photos,
        width,
        height,
        fontFamily,
      }}/>
    ),
    { width, height, fonts, headers },
  );
}
