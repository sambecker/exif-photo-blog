import { absolutePathForRecipe } from '@/app/paths';
import { PhotoSetAttributes } from '../photo';
import ShareModal from '@/share/ShareModal';
import { shareTextForRecipe } from '.';
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
      pathShare={absolutePathForRecipe(recipe)}
      socialText={shareTextForRecipe(recipe)}
    >
      <RecipeOGTile {...{ recipe, photos, count, dateRange }} />
    </ShareModal>
  );
};
