import { Photo, PhotoDateRange } from '@/photo';
import { pathForRecipe, pathForRecipeImage } from '@/app/paths';
import OGTile, { OGLoadingState } from '@/components/og/OGTile';
import { descriptionForRecipePhotos, titleForRecipe } from '.';
import { useAppText } from '@/i18n/state/client';

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
  const appText = useAppText();
  return (
    <OGTile {...{
      title: titleForRecipe(recipe, photos, appText, count),
      description: descriptionForRecipePhotos(
        photos,
        appText,
        true,
        count,
        dateRange,
      ),
      path: pathForRecipe(recipe),
      pathImage: pathForRecipeImage(recipe),
      loadingState: loadingStateExternal,
      onLoad,
      onFail,
      riseOnHover,
      retryTime,
    }}/>
  );
};
