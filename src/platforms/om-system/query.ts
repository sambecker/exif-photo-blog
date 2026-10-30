import { safelyQuery } from '@/db/query';
import { sql } from '@/platforms/postgres';
import { OmRecipe, OM_RECIPE_VERSION, OM_CAMERA_MAKES } from './recipe';
import { createOmRecipeKey } from './server';
import { createOmRecipeData } from '@/recipe/serialization';

export const getOmPhotoCount = () => safelyQuery(() => sql`
  SELECT COUNT(*) FROM photos
  WHERE LOWER(TRIM(make)) = ANY(
    string_to_array(${OM_CAMERA_MAKES.join('|')}, '|')
  )
`.then(({ rows }) => Number(rows[0].count)), 'getOmPhotoCount');

export const getPendingOmRecipes = () => safelyQuery(() => sql<{
  id: string
  title: string | null
}>`
  SELECT id, title FROM photos
  WHERE LOWER(TRIM(make)) = ANY(
    string_to_array(${OM_CAMERA_MAKES.join('|')}, '|')
  )
  AND CASE WHEN recipe_data->>'camera' = 'om-system'
    THEN COALESCE(recipe_data->>'checkedVersion', '0')
      <> ${String(OM_RECIPE_VERSION)}
    ELSE TRUE END
  ORDER BY created_at, id
`.then(({ rows }) => rows), 'getPendingOmRecipes');

export const storeOmRecipe = (
  photoId: string,
  sourceUrl: string,
  recipe?: OmRecipe,
) => safelyQuery(() => sql`
  UPDATE photos SET
    recipe_data=${JSON.stringify(createOmRecipeData(recipe))},
    recipe_title=${recipe ? createOmRecipeKey(recipe) : null},
    updated_at=CURRENT_TIMESTAMP
  WHERE id=${photoId} AND url=${sourceUrl}
`.then(({ rowCount }) => {
      if (rowCount !== 1) {
        throw new Error('Photo changed while importing; retry');
      }
    }), 'storeOmRecipe');
