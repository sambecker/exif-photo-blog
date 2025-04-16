import { absolutePathForRecipe, absolutePathForRecipeImage } from '@/app/paths';
import { descriptionForPhotoSet, Photo, photoQuantityText } from '@/photo';
import { PhotoDateRange } from '@/photo';
import {
  capitalizeWords,
  formatCount,
  formatCountDescriptive,
} from '@/utility/string';
import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import { labelForFilm } from '@/film';

export type RecipeWithCount = {
  recipe: string
  count: number
}

export type Recipes = RecipeWithCount[]

export interface RecipeProps {
  title?: string
  data: FujifilmRecipe
  film: string
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
  data,
  film,
}: RecipeProps,
abbreviate?: boolean,
) => {
  const lines = [`${labelForFilm(film).small.toLocaleUpperCase()}`];

  const whiteBalance = formatWhiteBalance(data).toLocaleUpperCase();
  const whiteBalanceColor = formatWhiteBalanceColor(data);

  lines.push(abbreviate
    ? `${whiteBalance} ${whiteBalanceColor}`
    : `${whiteBalance}: ${whiteBalanceColor}`,
  );

  lines.push(...abbreviate
    ? [`DR${data.dynamicRange.development} NR${formatNoiseReduction(data)}`]
    : [
      `DYNAMIC RANGE: ${data.dynamicRange.development}`,
      `NOISE REDUCTION: ${formatNoiseReduction(data)}`,
    ],
  );

  if (data.highlight || data.shadow) {
    lines.push(...abbreviate
      ? [`HIGH${addSign(data.highlight)} SHAD${addSign(data.shadow)}`]
      : [
        `HIGHLIGHT: ${addSign(data.highlight)}`,
        `SHADOW: ${addSign(data.shadow)}`,
      ],
    );
  }
  lines.push(...abbreviate
    // eslint-disable-next-line max-len
    ? [`COL${addSign(data.color)} SHARP${addSign(data.sharpness)} CLAR${addSign(data.clarity)}`]
    : [
      `COLOR: ${addSign(data.color)}`,
      `SHARPEN: ${addSign(data.sharpness)}`,
      `CLARITY: ${addSign(data.clarity)}`,
    ],
  );
  if (data.colorChromeEffect) {
    lines.push(abbreviate
      ? `CHROME ${data.colorChromeEffect.toLocaleUpperCase()}`
      : `COLOR CHROME: ${data.colorChromeEffect.toLocaleUpperCase()}`,
    );
  }
  if (data.colorChromeFXBlue) {
    lines.push(abbreviate
      ? `FX BLUE ${data.colorChromeFXBlue.toLocaleUpperCase()}`
      : `CHROME FX BLUE: ${data.colorChromeFXBlue.toLocaleUpperCase()}`,
    );
  }
  if (data.grainEffect.roughness !== 'off') {
    lines.push(abbreviate
      ? `GRAIN ${formatGrain(data, abbreviate)}`
      : `GRAIN: ${formatGrain(data, abbreviate)}`,
    );
  }
  if (data.bwAdjustment || data.bwMagentaGreen) {
    lines.push(...abbreviate
      // eslint-disable-next-line max-len
      ? [`BW ADJ${addSign(data.bwAdjustment)} M/G${addSign(data.bwMagentaGreen)}`]
      : [
        `BW ADJUSTMENT: ${addSign(data.bwAdjustment)}`,
        `MAGENTA/GREEN: ${addSign(data.bwMagentaGreen)}`,
      ],
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

const getPhotoWithRecipeFromPhotos = (
  photos: Photo[],
  preferredPhoto?: Photo,
) =>
  photoHasRecipe(preferredPhoto)
    ? preferredPhoto
    : photos.find(photoHasRecipe);

export const getRecipePropsFromPhotos = (
  ...args: Parameters<typeof getPhotoWithRecipeFromPhotos>
): RecipeProps | undefined => {
  const photo = getPhotoWithRecipeFromPhotos(...args);
  return photo?.recipeData && photo?.film
    ? {
      title: photo.recipeTitle,
      data: photo.recipeData,
      film: photo.film,
      iso: photo.isoFormatted,
      exposure: photo.exposureTimeFormatted,
    }
    : undefined;
};

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
