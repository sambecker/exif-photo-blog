import { safelyQuery } from '@/db/query';
import { sql } from '@/platforms/postgres';
import { OmRecipe, OM_RECIPE_VERSION } from './recipe';
import { createOmRecipeKey } from './server';

export const getPenPhotoCount = () => safelyQuery(() => sql`
  SELECT COUNT(*) FROM photos
  WHERE LOWER(TRIM(make)) IN ('om digital solutions', 'om system')
  AND UPPER(TRIM(model)) = 'PEN'
`.then(({ rows }) => Number(rows[0].count)), 'getPenPhotoCount');

export const getPendingPenRecipes = () => safelyQuery(() => sql<{
  id: string
  title: string | null
}>`
  SELECT id, title FROM photos
  WHERE LOWER(TRIM(make)) IN ('om digital solutions', 'om system')
  AND UPPER(TRIM(model)) = 'PEN'
  AND COALESCE(om_recipe_checked_version, 0) < ${OM_RECIPE_VERSION}
  ORDER BY created_at, id
`.then(({ rows }) => rows), 'getPendingPenRecipes');

export const storePenRecipe = (
  photoId: string,
  sourceUrl: string,
  recipe?: OmRecipe,
) => safelyQuery(() => sql`
  UPDATE photos SET
    om_recipe_data=${recipe ? JSON.stringify(recipe) : null},
    om_recipe_key=${recipe ? createOmRecipeKey(recipe) : null},
    om_recipe_checked_version=${OM_RECIPE_VERSION},
    updated_at=CURRENT_TIMESTAMP
  WHERE id=${photoId} AND url=${sourceUrl}
`.then(({ rowCount }) => {
      if (rowCount !== 1) {
        throw new Error('Photo changed while importing; retry');
      }
    }), 'storePenRecipe');
