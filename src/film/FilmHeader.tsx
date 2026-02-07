'use client';

import { Photo, PhotoDateRangePostgres } from '@/photo';
import { descriptionForFilmPhotos } from '.';
import PhotoHeader from '@/photo/PhotoHeader';
import PhotoFilm from '@/film/PhotoFilm';
import { getRecipePropsFromPhotos } from '@/recipe';
import { useAppState } from '@/app/AppState';
import { AI_CONTENT_GENERATION_ENABLED } from '@/app/config';
import { useAppText } from '@/i18n/state/client';

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
  dateRange?: PhotoDateRangePostgres
}) {
  const { recipeModalProps, setRecipeModalProps } = useAppState();

  // Only show recipe button when viewing individual photos
  // that don't have named recipes
  const recipeProps = selectedPhoto && !selectedPhoto?.recipeTitle
    ? getRecipePropsFromPhotos(photos, selectedPhoto)
    : undefined;

  const appText = useAppText();

  return (
    <PhotoHeader
      film={film}
      entity={<PhotoFilm
        film={film}
        isShowingRecipeOverlay={Boolean(recipeModalProps)}
        toggleRecipeOverlay={recipeProps
          ? () => setRecipeModalProps?.(recipeProps)
          : undefined}
        hoverType="none"
      />}
      entityDescription={descriptionForFilmPhotos(
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
      hasAiTextGeneration={AI_CONTENT_GENERATION_ENABLED}
      includeShareButton
    />
  );
}
