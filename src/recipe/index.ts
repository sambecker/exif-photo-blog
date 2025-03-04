import { absolutePathForRecipe, absolutePathForRecipeImage } from '@/app/paths';
import { descriptionForPhotoSet, Photo, photoQuantityText } from '@/photo';
import { PhotoDateRange } from '@/photo';
import { capitalizeWords } from '@/utility/string';
import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import { FilmSimulation } from '@/simulation';

export type RecipeWithCount = {
  recipe: string
  count: number
}

export type Recipes = RecipeWithCount[]

export interface RecipeProps {
  recipe: FujifilmRecipe
  simulation: FilmSimulation
  iso?: string
  exposure?: string   
}

export const formatRecipe = (recipe?: string) =>
  capitalizeWords(recipe?.replaceAll('-', ' '));

export const titleForRecipe = (
  recipe: string,
  photos:Photo[] = [],
  explicitCount?: number,
) => [
  `Recipe: ${formatRecipe(recipe)}`,
  photoQuantityText(explicitCount ?? photos.length),
].join(' ');

export const shareTextForRecipe = (recipe: string) =>
  `${formatRecipe(recipe)} recipe photos`;

export const descriptionForRecipePhotos = (
  photos: Photo[] = [],
  dateBased?: boolean,
  explicitCount?: number,
  explicitDateRange?: PhotoDateRange,
) =>
  descriptionForPhotoSet(
    photos,
    undefined,
    dateBased,
    explicitCount,
    explicitDateRange,
  );

export const generateMetaForRecipe = (
  recipe: string,
  photos: Photo[],
  explicitCount?: number,
  explicitDateRange?: PhotoDateRange,
) => ({
  url: absolutePathForRecipe(recipe),
  title: titleForRecipe(recipe, photos, explicitCount),
  description:
    descriptionForRecipePhotos(photos, true, explicitCount, explicitDateRange),
  images: absolutePathForRecipeImage(recipe),
});

export const photoHasRecipe = (photo?: Photo) =>
  photo?.filmSimulation && photo?.recipeData;

export const sortRecipesWithCount = (
  a: RecipeWithCount,
  b: RecipeWithCount,
) =>
  a.recipe.localeCompare(b.recipe);
