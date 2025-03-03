import { absolutePathForRecipe, absolutePathForRecipeImage } from '@/app/paths';
import { descriptionForPhotoSet, Photo, photoQuantityText } from '@/photo';
import { PhotoDateRange } from '@/photo';
import { Tags } from '../tag';
import { parameterize } from '@/utility/string';
import { capitalizeWords } from '@/utility/string';
import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import { FilmSimulation } from '@/simulation';

const KEY_RECIPE = 'recipe';

export interface RecipeProps {
  recipe: FujifilmRecipe
  simulation: FilmSimulation
  iso?: string
  exposure?: string   
}

export const isTagRecipe = (tag: string) =>
  (new RegExp(`^${KEY_RECIPE}-?`).test(tag));

export const convertTagsToRecipes = (tags: Tags) =>
  tags.filter(({ tag }) => isTagRecipe(tag))
    .map(({ tag }) => convertTagToRecipe(tag));

export const convertRecipeToTag = (recipe: string) =>
  `${KEY_RECIPE}-${parameterize(recipe)}`;

export const convertTagToRecipe = (tag: string) =>
  tag.replace(new RegExp(`^${KEY_RECIPE}-?`), '');

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
