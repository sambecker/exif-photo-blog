'use client';

import { Photo, PhotoDateRange } from '@/photo';
import { descriptionForFilmPhotos } from '.';
import PhotoHeader from '@/photo/PhotoHeader';
import PhotoFilm from '@/film/PhotoFilm';
import { getRecipePropsFromPhotos } from '@/recipe';
import { useAppState } from '@/state/AppState';

export default function FilmHeader({
  film,
  photos,
  selectedPhoto,
  indexNumber,
  count,
  dateRange,
}: {
  film: string
  photos: Photo[]
  selectedPhoto?: Photo
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRange
}) {
  const { recipeModalProps, setRecipeModalProps } = useAppState();

  // Only show recipe button when viewing individual photos
  // that don't have named recipes
  const recipeProps = selectedPhoto && !selectedPhoto?.recipeTitle
    ? getRecipePropsFromPhotos(photos, selectedPhoto)
    : undefined;

  return (
    <PhotoHeader
      film={film}
      entity={<PhotoFilm
        film={film}
        isShowingRecipeOverlay={Boolean(recipeModalProps)}
        toggleRecipeOverlay={recipeProps
          ? () => setRecipeModalProps?.(recipeProps)
          : undefined}
      />}
      entityDescription={descriptionForFilmPhotos(
        photos, undefined, count, dateRange)}
      photos={photos}
      selectedPhoto={selectedPhoto}
      indexNumber={indexNumber}
      count={count}
      dateRange={dateRange}
      includeShareButton
    />
  );
}
