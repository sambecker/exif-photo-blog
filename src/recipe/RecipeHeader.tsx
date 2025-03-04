'use client';

import { Photo, PhotoDateRange } from '@/photo';
import PhotoHeader from '@/photo/PhotoHeader';
import PhotoRecipe from './PhotoRecipe';
import { useAppState } from '@/state/AppState';
import { descriptionForRecipePhotos, photoHasRecipe } from '.';
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
  const { setRecipeModalProps } = useAppState();

  const photo = photoHasRecipe(selectedPhoto)
    ? selectedPhoto
    : photos.find(photoHasRecipe);

  return (
    <PhotoHeader
      recipe={recipe}
      entity={<PhotoRecipe
        recipe={recipe}
        contrast="high"
        recipeOnClick={() => (
          photo?.recipeData &&
          photo?.filmSimulation
        ) ? setRecipeModalProps?.({
            simulation: photo.filmSimulation,
            recipe: photo.recipeData,
            iso: photo.isoFormatted,
            exposure: photo.exposureTimeFormatted,
          })
          : undefined}
      />}
      entityDescription={descriptionForRecipePhotos(photos, undefined, count)}
      photos={photos}
      selectedPhoto={selectedPhoto}
      indexNumber={indexNumber}
      count={count}
      dateRange={dateRange}
      includeShareButton
    />
  );
}
