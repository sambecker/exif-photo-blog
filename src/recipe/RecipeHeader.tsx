'use client';

import { Photo, PhotoDateRange } from '@/photo';
import PhotoHeader from '@/photo/PhotoHeader';
import PhotoRecipe from './PhotoRecipe';
import { useAppState } from '@/state/AppState';
import { descriptionForRecipePhotos, getRecipePropsFromPhotos } from '.';
import { AI_TEXT_GENERATION_ENABLED } from '@/app/config';
import { useAppText } from '@/i18n/state/client';

export default function RecipeHeader({
  recipe,
  photos,
  selectedPhoto,
  indexNumber,
  count,
  dateRange,
}: {
  recipe: string
  photos: Photo[]
  selectedPhoto?: Photo
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRange
}) {
  const { recipeModalProps, setRecipeModalProps } = useAppState();

  const appText = useAppText();

  const recipeProps = getRecipePropsFromPhotos(photos, selectedPhoto);

  return (
    <PhotoHeader
      recipe={recipe}
      entity={<PhotoRecipe
        recipe={recipe}
        contrast="high"
        isShowingRecipeOverlay={Boolean(recipeModalProps)}
        toggleRecipeOverlay={recipeProps
          ? () => setRecipeModalProps?.(recipeProps)
          : undefined}
      />}
      entityDescription={descriptionForRecipePhotos(
        photos,
        appText,
        undefined,
        count,
        dateRange,
      )}
      photos={photos}
      selectedPhoto={selectedPhoto}
      indexNumber={indexNumber}
      count={count}
      dateRange={dateRange}
      hasAiTextGeneration={AI_TEXT_GENERATION_ENABLED}
      includeShareButton
    />
  );
}
