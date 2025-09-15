'use client';

import { descriptionForPhotoSet, Photo, PhotoDateRangePostgres } from '@/photo';
import PhotoHeader from '@/photo/PhotoHeader';
import { AI_CONTENT_GENERATION_ENABLED } from '@/app/config';
import { useAppText } from '@/i18n/state/client';
import PhotoRecents from './PhotoRecents';

export default function RecentsHeader({
  photos,
  selectedPhoto,
  indexNumber,
  count,
  dateRange,
}: {
  photos: Photo[]
  selectedPhoto?: Photo
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRangePostgres
}) {
  const appText = useAppText();

  return (
    <PhotoHeader
      recent={true}
      entity={<PhotoRecents hoverType="none" />}
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
