import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import { getIBMPlexMono } from '@/app/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { GENERATE_STATIC_PARAMS_LIMIT } from '@/photo/db';
import { getUniqueRecipes } from '@/photo/db/query';
import RecipeImageResponse from '@/image-response/RecipeImageResponse';
import { shouldGenerateStaticParamsForCategory } from '@/category';

export let generateStaticParams:
  (() => Promise<{ recipe: string }[]>) | undefined = undefined;

if (shouldGenerateStaticParamsForCategory('recipes', 'image')) {
  generateStaticParams = async () => {
    const recipes = await getUniqueRecipes();
    return recipes
      .map(({ recipe }) => ({ recipe }))
      .slice(0, GENERATE_STATIC_PARAMS_LIMIT);
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
    getIBMPlexMono(),
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
