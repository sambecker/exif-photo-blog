import { isOmRecipeKey } from '@/platforms/om-system/recipe';
import {
  getFujifilmRecipe,
  getOmRecipe,
  parseRecipeData,
} from './serialization';

const FUJIFILM_RECIPE_KEY_PATTERN = /^fujifilm-v1-([a-z0-9-]+)-[a-f0-9]{64}$/;

// Postgres-compatible pattern matching every generated recipe key
export const RECIPE_HASH_KEY_PATTERN_DB =
  '^(om-v1-(color|mono)|fujifilm-v1-[a-z0-9-]+)-[a-f0-9]{64}$';

export const isFujifilmRecipeKey = (key?: string): boolean =>
  FUJIFILM_RECIPE_KEY_PATTERN.test(key ?? '');

export const filmForFujifilmRecipeKey = (key: string) =>
  FUJIFILM_RECIPE_KEY_PATTERN.exec(key)?.[1];
// Generated Fujifilm titles display as untitled recipes
export const recipeTitleForDisplay = (title?: string) =>
  isFujifilmRecipeKey(title) ? undefined : title;

export const isRecipeHashKey = (key?: string): boolean =>
  isOmRecipeKey(key) || isFujifilmRecipeKey(key);

export const canCreateRecipeHashKey = (recipeData?: string, film?: string) => {
  const data = parseRecipeData(recipeData);
  return Boolean(getOmRecipe(data) || (getFujifilmRecipe(data) && film));
};
