import type { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import {
  OM_RECIPE_VERSION,
  OmRecipe,
  parseOmRecipe,
} from '@/platforms/om-system/recipe';

// Untagged data is the original Fujifilm format. OM imports also save an
// empty result here so unsupported profiles are not downloaded repeatedly.
export type OmRecipeData = {
  camera: 'om-system'
  checkedVersion: number
  recipe?: OmRecipe
};
export type RecipeData =
  | (FujifilmRecipe & { camera?: 'fujifilm' })
  | OmRecipeData;

export const isOmRecipeData = (
  data?: RecipeData,
): data is OmRecipeData => data?.camera === 'om-system';

export const getOmRecipe = (data?: RecipeData) =>
  isOmRecipeData(data) ? data.recipe : undefined;

export const getFujifilmRecipe = (data?: RecipeData) =>
  data && !isOmRecipeData(data) ? data : undefined;

export const createOmRecipeData = (recipe?: OmRecipe): OmRecipeData => ({
  camera: 'om-system',
  checkedVersion: OM_RECIPE_VERSION,
  ...recipe && { recipe: parseOmRecipe(recipe) },
});

export const parseRecipeData = (value: unknown): RecipeData | undefined => {
  try {
    const data = typeof value === 'string' ? JSON.parse(value) : value;
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return undefined;
    }
    if (data.camera === 'om-system') {
      return {
        camera: 'om-system',
        checkedVersion: Number.isInteger(data.checkedVersion)
          ? data.checkedVersion : 0,
        recipe: parseOmRecipe(data.recipe),
      };
    }
    if (data.camera === undefined || data.camera === 'fujifilm') {
      return data as FujifilmRecipe;
    }
  } catch {
    // Malformed or unknown-brand data must not reach a recipe viewer.
  }
};
