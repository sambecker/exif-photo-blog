import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import { getIBMPlexMono } from '@/app/font';
import { ImageResponse } from 'next/og';
import { getUniqueLenses } from '@/photo/query';
import {
  getLensFromParams,
  Lens,
  LensProps,
  safelyGenerateLensStaticParams,
} from '@/lens';
import LensImageResponse from '@/lens/LensImageResponse';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';
import { KEY_PHOTOS } from '@/cache';
import { cacheTag } from 'next/cache';

export const generateStaticParams = staticallyGenerateCategoryIfConfigured(
  'lenses',
  'image',
  getUniqueLenses,
  safelyGenerateLensStaticParams,
);

async function getCacheComponent(lens: Lens) {
  'use cache';
  cacheTag(KEY_PHOTOS);

  const [
    photos,
    { fontFamily, fonts },
  ] = await Promise.all([
    getPhotosCached({
      limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
      lens: lens,
    }),
    getIBMPlexMono(),
  ]);

  const { width, height } = IMAGE_OG_DIMENSION_SMALL;

  return new ImageResponse(
    <LensImageResponse {...{
      lens,
      photos,
      width,
      height,
      fontFamily,
    }}/>,
    { width, height, fonts },
  );
}

export async function GET(
  _: Request,
  context: LensProps,
) {
  const lens = await getLensFromParams(context.params);

  return getCacheComponent(lens);
}
