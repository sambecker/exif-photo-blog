import { absolutePathForRecipe, absolutePathForRecipeImage } from '@/app/paths';
import { descriptionForPhotoSet, Photo, photoQuantityText } from '@/photo';
import { PhotoDateRange } from '@/photo';
import {
  capitalizeWords,
  formatCount,
  formatCountDescriptive,
} from '@/utility/string';
import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import { FilmSimulation } from '@/simulation';

export type RecipeWithCount = {
  recipe: string
  count: number
}

export type Recipes = RecipeWithCount[]

export interface RecipeProps {
  title?: string
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

const photoHasRecipe = (photo?: Photo) =>
  photo?.filmSimulation && photo?.recipeData;

export const getPhotoWithRecipeFromPhotos = (
  photos: Photo[],
  preferredPhoto?: Photo,
) =>
  photoHasRecipe(preferredPhoto)
    ? preferredPhoto
    : photos.find(photoHasRecipe);

export const sortRecipesWithCount = (recipes: Recipes = []) =>
  recipes.sort((a, b) => a.recipe.localeCompare(b.recipe));

export const convertRecipesForForm = (recipes: Recipes = []) =>
  sortRecipesWithCount(recipes)
    .map(({ recipe, count }) => ({
      value: recipe,
      annotation: formatCount(count),
      annotationAria: formatCountDescriptive(count),
    }));

export const addSign = (value = 0) => value < 0 ? value : `+${value}`;

export const formatWhiteBalance = ({ whiteBalance }: FujifilmRecipe) =>
  whiteBalance.type === 'kelvin' && whiteBalance.colorTemperature
    ? `${whiteBalance.colorTemperature}K`
    : whiteBalance.type
      .replace(/auto./i, '')
      .replaceAll('-', ' ');
