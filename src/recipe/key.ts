import { isOmRecipeKey } from '@/platforms/om-system/recipe';
import { getOmRecipe, parseRecipeData } from './serialization';

// Postgres-compatible pattern matching every generated recipe key
export const RECIPE_HASH_KEY_PATTERN_DB = '^om-v1-(color|mono)-[a-f0-9]{64}$';

export const isRecipeHashKey = (key?: string): boolean => isOmRecipeKey(key);

export const canCreateRecipeHashKey = (recipeData?: string) =>
  Boolean(getOmRecipe(parseRecipeData(recipeData)));
