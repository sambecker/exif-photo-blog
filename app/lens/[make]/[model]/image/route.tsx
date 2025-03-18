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
  getLensFromParams,
  Lens,
  LensProps,
  safelyGenerateLensStaticParams,
} from '@/lens';
import LensImageResponse from '@/image-response/LensImageResponse';
import { shouldGenerateStaticParamsForCategory } from '@/category';

export let generateStaticParams:
  (() => Promise<Lens[]>) | undefined = undefined;

if (shouldGenerateStaticParamsForCategory('lenses', 'image')) {
  generateStaticParams = async () => {
    const lenses = await getUniqueLenses();
    return safelyGenerateLensStaticParams(lenses)
      .slice(0, GENERATE_STATIC_PARAMS_LIMIT);
  };
}

export async function GET(
  _: Request,
  context: LensProps,
) {
  const lens = await getLensFromParams(context.params);

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
