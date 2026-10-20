'use client';

import { Photo, PhotoDateRangePostgres } from '@/photo';
import PhotoHeader from '@/photo/PhotoHeader';
import PhotoRecipe from './PhotoRecipe';
import { useAppState } from '@/app/AppState';
import { descriptionForRecipePhotos, getRecipePropsFromPhotos } from '.';
import { AI_CONTENT_GENERATION_ENABLED } from '@/app/config';
import { useAppText } from '@/i18n/state/client';
import PhotoOmRecipe from '@/platforms/om-system/PhotoOmRecipe';
import { isOmRecipeKey } from '@/platforms/om-system/recipe';

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
  dateRange?: PhotoDateRangePostgres
}) {
  const { recipeModalProps, setRecipeModalProps } = useAppState();

  const appText = useAppText();

  const recipeProps = getRecipePropsFromPhotos(photos, selectedPhoto);
  const omPhoto = isOmRecipeKey(recipe)
    ? [selectedPhoto, ...photos].find(photo =>
      photo?.omRecipeKey === recipe && photo.omRecipeData)
    : undefined;

  return (
    <PhotoHeader
      recipe={recipe}
      entity={omPhoto?.omRecipeData ? <PhotoOmRecipe
        recipe={omPhoto.omRecipeData}
        recipeKey={recipe}
        contrast="high"
        hoverType="none"
        hoverCount={count}
      /> : <PhotoRecipe
        recipe={recipe}
        contrast="high"
        hoverType="none"
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
      hasAiContentGeneration={AI_CONTENT_GENERATION_ENABLED}
      includeShareButton
    />
  );
}
