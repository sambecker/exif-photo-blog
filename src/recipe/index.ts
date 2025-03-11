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
import { labelForFilmSimulation } from '@/platforms/fujifilm/simulation';

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

export const generateRecipeText = ({
  recipe,
  simulation,
}: RecipeProps) => {
  const lines = [
    `${labelForFilmSimulation(simulation).small.toLocaleUpperCase()}`,
    // eslint-disable-next-line max-len
    `${formatWhiteBalance(recipe).toLocaleUpperCase()} ${formatWhiteBalanceColor(recipe)}`,
    `DR${recipe.dynamicRange.development} NR${formatNoiseReduction(recipe)}`,
  ];

  if (recipe.highlight || recipe.shadow) {
    // eslint-disable-next-line max-len
    lines.push(`HIGH${addSign(recipe.highlight)} SHADOW${addSign(recipe.shadow)}`);
  }
  // eslint-disable-next-line max-len
  lines.push(`COL${addSign(recipe.color)} SHARP${addSign(recipe.sharpness)} CLAR${addSign(recipe.clarity)}`);
  if (recipe.colorChromeEffect) {
    lines.push(`CHROME ${recipe.colorChromeEffect.toLocaleUpperCase()}`);
  }
  if (recipe.colorChromeFXBlue) {
    lines.push(`FX BLUE ${recipe.colorChromeFXBlue.toLocaleUpperCase()}`);
  }
  if (recipe.grainEffect.roughness !== 'off') {
    lines.push(`GRAIN ${formatGrain(recipe)}`);
  }
  if (recipe.bwAdjustment || recipe.bwMagentaGreen) {
    // eslint-disable-next-line max-len
    lines.push(`BW ADJ ${addSign(recipe.bwAdjustment)} BW M/G ${addSign(recipe.bwMagentaGreen)}`);
  }

  return lines;
};

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

export const formatWhiteBalanceColor = ({
  whiteBalance: { red, blue },
}: FujifilmRecipe) =>
  (red || blue)
    ? `R${addSign(red)}/B${addSign(blue)}`
    : '';

export const formatGrain = ({ grainEffect }: FujifilmRecipe) =>
  grainEffect.roughness === 'off'
    ? 'OFF'
    : grainEffect.roughness === 'weak'
      ? `WEAK/${grainEffect.size === 'small' ? 'SM' : 'LG'}`
      : `STRONG/${grainEffect.size === 'small' ? 'SM' : 'LG'}`;

export const formatNoiseReduction = ({
  highISONoiseReduction,
  noiseReductionBasic,
}: FujifilmRecipe) =>
  highISONoiseReduction
    ? addSign(highISONoiseReduction)
    : noiseReductionBasic ?? 'OFF';
