'use client';

import { descriptionForPhotoSet, Photo, PhotoDateRange } from '@/photo';
import PhotoHeader from '@/photo/PhotoHeader';
import { AI_CONTENT_GENERATION_ENABLED } from '@/app/config';
import PhotoYear from './PhotoYear';
import { useAppText } from '@/i18n/state/client';

export default function YearHeader({
  year,
  photos,
  selectedPhoto,
  indexNumber,
  count,
  dateRange,
}: {
  year: string
  photos: Photo[]
  selectedPhoto?: Photo
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRange
}) {
  const appText = useAppText();

  return (
    <PhotoHeader
      year={year}
      entity={<PhotoYear
        year={year}
        contrast="high"
        showHover={false}
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