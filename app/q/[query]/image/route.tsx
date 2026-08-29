import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import QueryImageResponse from '@/query/QueryImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';

export async function GET(
  _: Request,
  context: { params: Promise<{ query: string }> },
) {
  const { query: queryFromParams } = await context.params;

  const query = decodeURIComponent(queryFromParams);

  const [
    photos,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    getPhotosCached({
      limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
      query,
    }),
    getIBMPlexMono(),
    getImageResponseCacheControlHeaders(),
  ]);

  const { width, height } = IMAGE_OG_DIMENSION_SMALL;

  return new ImageResponse(
    <QueryImageResponse {...{
      query,
      photos,
      width,
      height,
      fontFamily,
    }}/>,
    { width, height, fonts, headers },
  );
}
