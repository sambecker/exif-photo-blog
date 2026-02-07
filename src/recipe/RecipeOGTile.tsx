import { Photo, PhotoDateRangePostgres } from '@/photo';
import { pathForRecipe, pathForRecipeImage } from '@/app/path';
import OGTile, { OGTilePropsCore } from '@/components/og/OGTile';
import { descriptionForRecipePhotos, titleForRecipe } from '.';
import { useAppText } from '@/i18n/state/client';

export default function RecipeOGTile({
  recipe,
  photos,
  count,
  dateRange,
  ...props
}: {
  recipe: string
  photos: Photo[]
  count?: number
  dateRange?: PhotoDateRangePostgres
} & OGTilePropsCore) {
  const appText = useAppText();
  return (
    <OGTile {...{
      ...props,
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
    }}/>
  );
};
