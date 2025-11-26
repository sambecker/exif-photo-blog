import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import YearImageResponse from '@/year/YearImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { ImageResponse } from 'next/og';
import { getUniqueYears } from '@/photo/query';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';
import { KEY_PHOTOS } from '@/cache';
import { cacheTag } from 'next/cache';

export const generateStaticParams = staticallyGenerateCategoryIfConfigured(
  'years',
  'image',
  getUniqueYears,
  years => years.map(({ year }) => ({ year })),
);

async function getCacheComponent(year: string) {
  'use cache';
  cacheTag(KEY_PHOTOS);

  const [
    photos,
    { fontFamily, fonts },
  ] = await Promise.all([
    getPhotosCached({
      limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
      year: year,
    }),
    getIBMPlexMono(),
  ]);

  const { width, height } = IMAGE_OG_DIMENSION_SMALL;

  return new ImageResponse(
    <YearImageResponse {...{
      year,
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
  context: { params: Promise<{ year: string }> },
) {
  const { year } = await context.params;

  return getCacheComponent(year);
}
