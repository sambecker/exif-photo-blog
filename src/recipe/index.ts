import { absolutePathForRecipe, absolutePathForRecipeImage } from '@/app/paths';
import { Photo, photoQuantityText } from '@/photo';
import { PhotoDateRange } from '@/photo';
import {
  descriptionForTaggedPhotos,
  isTagFavs,
  isTagHidden,
  Tags,
} from '../tag';
import { convertStringToArray, parameterize } from '@/utility/string';
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

export const convertTagsToRecipes = (tags: Tags) =>
  tags.filter(({ tag }) => tag.startsWith(KEY_RECIPE))
    .map(({ tag }) => convertTagToRecipe(tag));

export const convertRecipeToTag = (recipe: string) =>
  `${KEY_RECIPE}-${parameterize(recipe)}`;

export const convertTagToRecipe = (tag: string) =>
  tag.replace(new RegExp(`^${KEY_RECIPE}-?`), '');

export const formatRecipe = (recipe?: string) =>
  capitalizeWords(recipe?.replaceAll('-', ' '));

export const getValidationMessageForTags = (tags?: string) => {
  const reservedTags = (convertStringToArray(tags) ?? [])
    .filter(tag => isTagFavs(tag) || isTagHidden(tag))
    .map(tag => tag.toLocaleUpperCase());
  return reservedTags.length
    ? `Reserved tags: ${reservedTags.join(', ').toLocaleLowerCase()}`
    : undefined;
};

export const titleForRecipe = (
  recipe: string,
  photos:Photo[] = [],
  explicitCount?: number,
) => [
  `Recipe: ${formatRecipe(recipe)}`,
  photoQuantityText(explicitCount ?? photos.length),
].join(' ');

export const generateMetaForRecipe = (
  recipe: string,
  photos: Photo[],
  explicitCount?: number,
  explicitDateRange?: PhotoDateRange,
) => ({
  url: absolutePathForRecipe(recipe),
  title: titleForRecipe(recipe, photos, explicitCount),
  description:
    descriptionForTaggedPhotos(photos, true, explicitCount, explicitDateRange),
  images: absolutePathForRecipeImage(recipe),
});
