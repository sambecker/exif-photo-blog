import { createHash } from 'node:crypto';
import { createOmRecipeKey } from '@/platforms/om-system/server';
import { parameterize } from '@/utility/string';
import { FujifilmRecipe } from '@/platforms/fujifilm/recipe';
import {
  getFujifilmRecipe,
  getOmRecipe,
  parseRecipeData,
} from './serialization';

// JSONB reorders keys, so hash input must not depend on key order
const sortKeysDeep = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(sortKeysDeep)
    : value && typeof value === 'object'
      ? Object.fromEntries(Object.keys(value).sort().map(key =>
        [key, sortKeysDeep((value as Record<string, unknown>)[key])]))
      : value;

export const createFujifilmRecipeKey = (
  recipe: FujifilmRecipe & { camera?: string },
  film: string,
) => {
  const { camera: _camera, ...data } = recipe;
  const hash = createHash('sha256')
    .update(JSON.stringify(sortKeysDeep(data))).digest('hex');
  return `fujifilm-v1-${parameterize(film, true)}-${hash}`;
};

// Generated titles are only stored for OM recipes (Fujifilm stays untitled)
export const createRecipeHashKey = (recipeData?: string | object) => {
  const omRecipe = getOmRecipe(parseRecipeData(recipeData));
  if (omRecipe) { return createOmRecipeKey(omRecipe); }
};

// Identifies recipe settings (and film, for Fujifilm) for comparison only
export const createRecipeIdentityKey = (
  recipeData?: string | object,
  film?: string,
) => {
  const fujifilmRecipe = getFujifilmRecipe(parseRecipeData(recipeData));
  return fujifilmRecipe && film
    ? createFujifilmRecipeKey(fujifilmRecipe, film)
    : createRecipeHashKey(recipeData);
};
