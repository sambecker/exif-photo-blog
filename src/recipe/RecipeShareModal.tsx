import { absolutePathForRecipe } from '@/app/paths';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import { formatRecipe, shareTextForRecipe } from '.';
import RecipeOGTile from './RecipeOGTile';

export default function RecipeShareModal({
  recipe,
  photos,
  count,
  dateRange,
}: {
  recipe: string
} & PhotoSetAttributes) {
  return (
    <ShareModal
      pathShare={absolutePathForRecipe(recipe, true)}
      navigatorTitle={formatRecipe(recipe)}
      socialText={shareTextForRecipe(recipe)}
    >
      <RecipeOGTile {...{ recipe, photos, count, dateRange }} />
    </ShareModal>
  );
};
