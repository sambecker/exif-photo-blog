import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import { getIBMPlexMonoMedium } from '@/app/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { GENERATE_STATIC_PARAMS_LIMIT } from '@/photo/db';
import { getUniqueRecipes } from '@/photo/db/query';
import {
  STATICALLY_OPTIMIZED_PHOTO_CATEGORY_OG_IMAGES,
  IS_PRODUCTION,
} from '@/app/config';
import RecipeImageResponse from '@/image-response/RecipeImageResponse';

export let generateStaticParams:
  (() => Promise<{ recipe: string }[]>) | undefined = undefined;

if (STATICALLY_OPTIMIZED_PHOTO_CATEGORY_OG_IMAGES && IS_PRODUCTION) {
  generateStaticParams = async () => {
    const recipes = await getUniqueRecipes();
    return recipes
      .slice(0, GENERATE_STATIC_PARAMS_LIMIT)
      .map(({ recipe }) => ({ recipe }));
  };
}

export async function GET(
  _: Request,
  context: { params: Promise<{ recipe: string }> },
) {
  const { recipe } = await context.params;

  const [
    photos,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    getPhotosCached({ recipe, limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY }),
    getIBMPlexMonoMedium(),
    getImageResponseCacheControlHeaders(),
  ]);

  const { width, height } = IMAGE_OG_DIMENSION_SMALL;

  return new ImageResponse(
    <RecipeImageResponse {...{
      recipe,
      photos,
      width,
      height,
      fontFamily,
    }}/>,
    { width, height, fonts, headers },
  );
}
