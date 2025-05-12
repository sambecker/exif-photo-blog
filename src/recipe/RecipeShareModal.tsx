import { absolutePathForRecipe } from '@/app/paths';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import {
  formatRecipe,
  shareTextForRecipe,
  getRecipePropsFromPhotos,
  generateRecipeText,
} from '.';
import RecipeOGTile from './RecipeOGTile';
import { getAppText } from '@/i18n/state/server';

export default async function RecipeShareModal({
  recipe,
  photos,
  count,
  dateRange,
}: {
  recipe: string
} & PhotoSetAttributes) {
  // Omit title from RecipeProps
  const { data, film } = getRecipePropsFromPhotos(photos) ?? {};
  const recipeText = data && film
    ? generateRecipeText({ data, film })
    : undefined;

  const appText = await getAppText();

  return (
    <ShareModal
      pathShare={absolutePathForRecipe(recipe, true)}
      socialText={shareTextForRecipe(recipe, appText)}
      navigatorTitle={formatRecipe(recipe)}
      navigatorText={recipeText}
    >
      <RecipeOGTile {...{ recipe, photos, count, dateRange }} />
    </ShareModal>
  );
};
