import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION,
  MAX_PHOTOS_TO_SHOW_TEMPLATE_TIGHT,
} from '@/image-response';
import TemplateImageResponse from
  '@/app/TemplateImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { ImageResponse } from 'next/og';

export async function GET() {
  const [
    photos,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    getPhotosCached({
      sortWithPriority: true,
      limit: MAX_PHOTOS_TO_SHOW_TEMPLATE_TIGHT,
    }).catch(() => []),
    getIBMPlexMono(),
    getImageResponseCacheControlHeaders(),
  ]);

  const { width, height } = IMAGE_OG_DIMENSION;

  return new ImageResponse(
    <TemplateImageResponse {...{
      photos,
      includeHeader: false,
      outerMargin: 0,
      width,
      height,
      fontFamily,
    }}/>,
    { width, height, fonts, headers },
  );
}
