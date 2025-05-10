import { Photo, PhotoDateRange } from '@/photo';
import { absolutePathForRecipeImage, pathForRecipe } from '@/app/paths';
import OGTile, { OGLoadingState } from '@/components/OGTile';
import { descriptionForRecipePhotos, titleForRecipe } from '.';

export default function RecipeOGTile({
  recipe,
  photos,
  loadingState: loadingStateExternal,
  riseOnHover,
  onLoad,
  onFail,
  retryTime,
  count,
  dateRange,
}: {
  recipe: string
  photos: Photo[]
  loadingState?: OGLoadingState
  onLoad?: () => void
  onFail?: () => void
  riseOnHover?: boolean
  retryTime?: number
  count?: number
  dateRange?: PhotoDateRange
}) {
  return (
    <OGTile {...{
      title: titleForRecipe(recipe, photos, count),
      description: descriptionForRecipePhotos(photos, true, count, dateRange),
      path: pathForRecipe(recipe),
      pathImageAbsolute: absolutePathForRecipeImage(recipe),
      loadingState: loadingStateExternal,
      onLoad,
      onFail,
      riseOnHover,
      retryTime,
    }}/>
  );
};
