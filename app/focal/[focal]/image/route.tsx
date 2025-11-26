import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import { getIBMPlexMono } from '@/app/font';
import { ImageResponse } from 'next/og';
import FocalLengthImageResponse from '@/focal/FocalLengthImageResponse';
import { formatFocalLength, getFocalLengthFromString } from '@/focal';
import { getPhotos, getUniqueFocalLengths } from '@/photo/query';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';
import { KEY_PHOTOS } from '@/cache';
import { cacheTag } from 'next/cache';

export const generateStaticParams = staticallyGenerateCategoryIfConfigured(
  'focal-lengths',
  'image',
  getUniqueFocalLengths,
  focalLengths => focalLengths
    .map(({ focal }) => ({ focal: formatFocalLength(focal) })),
);

async function getCacheComponent(focal: number) {
  'use cache';
  cacheTag(KEY_PHOTOS);

  const [
    photos,
    { fontFamily, fonts },
  ] = await Promise.all([
    getPhotos({ limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY, focal }),
    getIBMPlexMono(),
  ]);

  const { width, height } = IMAGE_OG_DIMENSION_SMALL;

  return new ImageResponse(
    <FocalLengthImageResponse {...{
      focal,
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
  context: { params: Promise<{ focal: string }> },
) {
  const focalString = (await context.params).focal;

  const focal = getFocalLengthFromString(focalString);

  return getCacheComponent(focal);
}
