'use client';

import { descriptionForPhotoSet, Photo, PhotoDateRangePostgres } from '@/photo';
import PhotoHeader from '@/photo/PhotoHeader';
import { AI_CONTENT_GENERATION_ENABLED } from '@/app/config';
import { useAppText } from '@/i18n/state/client';
import PhotoQuery from './PhotoQuery';

export default function QueryHeader({
  query,
  photos,
  selectedPhoto,
  indexNumber,
  count,
  dateRange,
}: {
  query: string
  photos: Photo[]
  selectedPhoto?: Photo
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRangePostgres
}) {
  const appText = useAppText();

  return (
    <PhotoHeader
      query={query}
      entity={<PhotoQuery
        query={query}
        contrast="high"
        hoverType="none"
        // Editing the query only makes sense where it drives the whole page
        editable={!selectedPhoto}
      />}
      entityDescription={descriptionForPhotoSet(
        photos,
        appText,
        undefined,
        undefined,
        count,
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
