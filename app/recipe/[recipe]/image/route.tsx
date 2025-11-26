import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import { getIBMPlexMono } from '@/app/font';
import { ImageResponse } from 'next/og';
import { getUniqueRecipes } from '@/photo/query';
import RecipeImageResponse from '@/recipe/RecipeImageResponse';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';
import { KEY_PHOTOS } from '@/cache';
import { cacheTag } from 'next/cache';

export const generateStaticParams = staticallyGenerateCategoryIfConfigured(
  'recipes',
  'image',
  getUniqueRecipes,
  recipes => recipes.map(({ recipe }) => ({ recipe })),
);

async function getCacheComponent(recipe: string) {
  'use cache';
  cacheTag(KEY_PHOTOS);
  
  const [
    photos,
    { fontFamily, fonts },
  ] = await Promise.all([
    getPhotosCached({ recipe, limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY }),
    getIBMPlexMono(),
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
    { width, height, fonts },
  );
}

export async function GET(
  _: Request,
  context: { params: Promise<{ recipe: string }> },
) {
  const { recipe } = await context.params;

  return getCacheComponent(recipe);
}
