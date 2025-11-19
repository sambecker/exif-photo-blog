'use cache';

import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import RecentsImageResponse from
  '@/recents/RecentsImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { getAppText } from '@/i18n/state/server';
import { SHOW_RECENTS } from '@/app/config';
import { safePhotoImageResponse } from '@/platforms/safe-photo-image-response';
import { cacheTag } from 'next/cache';
import { KEY_PHOTOS } from '@/cache';
import { getPhotos } from '@/photo/query';

export async function GET() {
  cacheTag(KEY_PHOTOS);

  const [
    photos,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    SHOW_RECENTS
      ? getPhotos({
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

  return safePhotoImageResponse(
    photos,
    isNextImageReady => (
      <RecentsImageResponse {...{
        title,
        photos: isNextImageReady ? photos : [],
        width,
        height,
        fontFamily,
      }}/>
    ),
    { width, height, fonts, headers },
  );
}
