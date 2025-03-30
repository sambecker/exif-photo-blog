import { absolutePathForRecipe, absolutePathForRecipeImage } from '@/app/paths';
import { descriptionForPhotoSet, Photo, photoQuantityText } from '@/photo';
import { PhotoDateRange } from '@/photo';
import {
  capitalizeWords,
  formatCount,
  formatCountDescriptive,
} from '@/utility/string';
import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import { FilmSimulation } from '@/film';
import { labelForFilm } from '@/platforms/fujifilm/simulation';

export type RecipeWithCount = {
  recipe: string
  count: number
}

export type Recipes = RecipeWithCount[]

export interface RecipeProps {
  title?: string
  recipe: FujifilmRecipe
  film: FilmSimulation
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
  title,
  recipe,
  film,
}: RecipeProps,
abbreviate?: boolean,
) => {
  const lines = [
    `${labelForFilm(film).small.toLocaleUpperCase()}`,
    // eslint-disable-next-line max-len
    `${formatWhiteBalance(recipe).toLocaleUpperCase()} ${formatWhiteBalanceColor(recipe)}`,
  ];

  if (abbreviate) {
    // eslint-disable-next-line max-len
    lines.push(`DR${recipe.dynamicRange.development} NR${formatNoiseReduction(recipe)}`);
  } else {
    lines.push(
      `DYNAMIC RANGE ${recipe.dynamicRange.development}`,
      `NOISE REDUCTION ${formatNoiseReduction(recipe)}`,
    );
  }

  if (recipe.highlight || recipe.shadow) {
    lines.push(abbreviate
      ? `HIGH${addSign(recipe.highlight)} SHAD${addSign(recipe.shadow)}`
      // eslint-disable-next-line max-len
      : `HIGHLIGHT ${addSign(recipe.highlight)} SHADOW ${addSign(recipe.shadow)}`,
    );
  }
  lines.push(abbreviate
    // eslint-disable-next-line max-len
    ? `COL${addSign(recipe.color)} SHARP${addSign(recipe.sharpness)} CLAR${addSign(recipe.clarity)}`
    // eslint-disable-next-line max-len
    : `COLOR ${addSign(recipe.color)} SHARPEN ${addSign(recipe.sharpness)} CLARITY ${addSign(recipe.clarity)}`,
  );
  if (recipe.colorChromeEffect) {
    lines.push(abbreviate
      ? `CHROME ${recipe.colorChromeEffect.toLocaleUpperCase()}`
      : `COLOR CHROME ${recipe.colorChromeEffect.toLocaleUpperCase()}`,
    );
  }
  if (recipe.colorChromeFXBlue) {
    lines.push(abbreviate
      ? `FX BLUE ${recipe.colorChromeFXBlue.toLocaleUpperCase()}`
      : `CHROME FX BLUE ${recipe.colorChromeFXBlue.toLocaleUpperCase()}`,
    );
  }
  if (recipe.grainEffect.roughness !== 'off') {
    lines.push(`GRAIN ${formatGrain(recipe, abbreviate)}`);
  }
  if (recipe.bwAdjustment || recipe.bwMagentaGreen) {
    lines.push(abbreviate
      // eslint-disable-next-line max-len
      ? `BW ADJ${addSign(recipe.bwAdjustment)} M/G${addSign(recipe.bwMagentaGreen)}`
      // eslint-disable-next-line max-len
      : `BW ADJUSTMENT ${addSign(recipe.bwAdjustment)} MAGENTA/GREEN ${addSign(recipe.bwMagentaGreen)}`,
    );
  }

  return title
    ? [formatRecipe(title).toLocaleUpperCase(),'–', ...lines] 
    : lines;
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
  photo?.film && photo?.recipeData;

export const getPhotoWithRecipeFromPhotos = (
  photos: Photo[],
  preferredPhoto?: Photo,
) =>
  photoHasRecipe(preferredPhoto)
    ? preferredPhoto
    : photos.find(photoHasRecipe);

export const sortRecipes = (recipes: Recipes = []) =>
  recipes.sort((a, b) => a.recipe.localeCompare(b.recipe));

export const convertRecipesForForm = (recipes: Recipes = []) =>
  sortRecipes(recipes)
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

export const formatGrain = (
  { grainEffect }: FujifilmRecipe,
  abbreviate?: boolean,
) => {
  const size = abbreviate
    ? grainEffect.size === 'small' ? 'SM' : 'LG'
    : grainEffect.size;
  return grainEffect.roughness === 'off'
    ? 'OFF'
    : `${grainEffect.roughness}/${size}`.toLocaleUpperCase();
};

export const formatNoiseReduction = ({
  highISONoiseReduction,
  noiseReductionBasic,
}: FujifilmRecipe) =>
  highISONoiseReduction
    ? addSign(highISONoiseReduction)
    : noiseReductionBasic?.toLocaleUpperCase() ?? 'OFF';
