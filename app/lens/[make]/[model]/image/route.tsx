import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import { getIBMPlexMono } from '@/app/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { GENERATE_STATIC_PARAMS_LIMIT } from '@/photo/db';
import { getUniqueLenses } from '@/photo/db/query';
import {
  STATICALLY_OPTIMIZED_PHOTO_CATEGORY_OG_IMAGES,
  IS_PRODUCTION,
} from '@/app/config';
import { getLensFromParams, Lens, LensProps } from '@/lens';
import LensImageResponse from '@/image-response/LensImageResponse';

export let generateStaticParams:
  (() => Promise<{ lens: Lens }[]>) | undefined = undefined;

if (STATICALLY_OPTIMIZED_PHOTO_CATEGORY_OG_IMAGES && IS_PRODUCTION) {
  generateStaticParams = async () => {
    const lenses = await getUniqueLenses();
    return lenses
      .slice(0, GENERATE_STATIC_PARAMS_LIMIT)
      .map(({ lens }) => ({ lens }));
  };
}

export async function GET(
  _: Request,
  context: LensProps,
) {
  const lens = getLensFromParams(await context.params);

  const [
    photos,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    getPhotosCached({
      limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
      lens: lens,
    }),
    getIBMPlexMono(),
    getImageResponseCacheControlHeaders(),
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
    { width, height, fonts, headers },
  );
}
