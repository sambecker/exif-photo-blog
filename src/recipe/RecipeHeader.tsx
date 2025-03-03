'use client';

import { Photo, PhotoDateRange } from '@/photo';
import { descriptionForTaggedPhotos } from '../tag';
import PhotoHeader from '@/photo/PhotoHeader';
import PhotoRecipe from './PhotoRecipe';
import { useAppState } from '@/state/AppState';
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

  const photo = photos.find(({ filmSimulation, fujifilmRecipe }) =>
    fujifilmRecipe && filmSimulation);

  return (
    <PhotoHeader
      tag={recipe}
      entity={<PhotoRecipe
        recipe={recipe}
        contrast="high"
        recipeOnClick={() => (
          photo?.fujifilmRecipe &&
          photo?.filmSimulation
        ) ? setRecipeModalProps?.({
            simulation: photo.filmSimulation,
            recipe: photo.fujifilmRecipe,
            iso: photo.isoFormatted,
            exposure: photo.exposureTimeFormatted,
          })
          : undefined}
      />}
      entityDescription={descriptionForTaggedPhotos(photos, undefined, count)}
      photos={photos}
      selectedPhoto={selectedPhoto}
      indexNumber={indexNumber}
      count={count}
      dateRange={dateRange}
      includeShareButton
    />
  );
}
