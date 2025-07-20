import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import RecentsImageResponse from
  '@/image-response/RecentsImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { getAppText } from '@/i18n/state/server';
import { SHOW_RECENTS } from '@/app/config';

export const dynamic = 'force-static';

export async function GET() {
  const [
    photos,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    SHOW_RECENTS
      ? getPhotosCached({
        limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
        recent: true,
      }).catch(() => [])
      : [],
    getIBMPlexMono(),
    getImageResponseCacheControlHeaders(),
  ]);

  const appText = await getAppText();

  const title = appText.category.recentPlural.toLocaleUpperCase();

  const { width, height } = IMAGE_OG_DIMENSION_SMALL;

  return new ImageResponse(
    <RecentsImageResponse {...{
      title,
      photos,
      width,
      height,
      fontFamily,
    }}/>,
    { width, height, fonts, headers },
  );
}
