import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import RecentsImageResponse from
  '@/recents/RecentsImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { getAppText } from '@/i18n/state/server';
import { SHOW_RECENTS } from '@/app/config';
import { safePhotoImageResponse } from '@/platforms/safe-photo-image-response';
import { getPhotos } from '@/photo/query';
import { KEY_PHOTOS } from '@/cache';
import { cacheTag } from 'next/cache';

async function getCacheContent() {
  'use cache';
  cacheTag(KEY_PHOTOS);

  return Promise.all([
    SHOW_RECENTS
      ? getPhotos({
        limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
        recent: true,
      }).catch(() => [])
      : [],
    getIBMPlexMono(),
    getAppText()
      .then(({ category }) => category.recentPlural.toLocaleUpperCase()),
  ]);
}

export async function GET() {
  const [
    photos,
    { fontFamily, fonts },
    title,
  ] = await getCacheContent();

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
    { width, height, fonts },
  );
}
