import { INFINITE_SCROLL_GRID_INITIAL } from '@/photo';
import { getUniqueRecipes } from '@/photo/db/query';
import { IS_PRODUCTION } from '@/app/config';
import { STATICALLY_OPTIMIZED_PHOTO_CATEGORIES } from '@/app/config';
import { PATH_ROOT } from '@/app/paths';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { generateMetaForRecipe } from '@/recipe';
import RecipeOverview from '@/recipe/RecipeOverview';
import { getPhotosRecipeDataCached } from '@/recipe/data';

const getPhotosRecipeDataCachedCached = cache(getPhotosRecipeDataCached);

export let generateStaticParams:
  (() => Promise<{ recipe: string }[]>) | undefined = undefined;

if (STATICALLY_OPTIMIZED_PHOTO_CATEGORIES && IS_PRODUCTION) {
  generateStaticParams = async () => {
    const recipes = await getUniqueRecipes();
    return recipes.map(({ recipe }) => ({ recipe }));
  };
}

interface RecipeProps {
  params: Promise<{ recipe: string }>
}

export async function generateMetadata({
  params,
}: RecipeProps): Promise<Metadata> {
  const { recipe: recipeFromParams } = await params;

  const recipe = decodeURIComponent(recipeFromParams);

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosRecipeDataCachedCached({
    recipe,
    limit: INFINITE_SCROLL_GRID_INITIAL,
  });

  if (photos.length === 0) { return {}; }

  const {
    url,
    title,
    description,
    images,
  } = generateMetaForRecipe(recipe, photos, count, dateRange);

  return {
    title,
    openGraph: {
      title,
      description,
      images,
      url,
    },
    twitter: {
      images,
      description,
      card: 'summary_large_image',
    },
    description,
  };
}

export default async function RecipePage({
  params,
}:RecipeProps) {
  const { recipe: recipeFromParams } = await params;

  const recipe = decodeURIComponent(recipeFromParams);

  const [
    photos,
    { count, dateRange },
  ] = await getPhotosRecipeDataCachedCached({
    recipe,
    limit: INFINITE_SCROLL_GRID_INITIAL,
  });

  if (photos.length === 0) { redirect(PATH_ROOT); }

  return (
    <RecipeOverview {...{ recipe, photos, count, dateRange }} />
  );
}
