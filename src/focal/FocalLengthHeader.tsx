import { Photo, PhotoDateRange } from '@/photo';
import { descriptionForFocalLengthPhotos } from '.';
import PhotoHeader from '@/photo/PhotoHeader';
import PhotoFocalLength from './PhotoFocalLength';
import { AI_TEXT_GENERATION_ENABLED } from '@/app/config';
import { getAppText } from '@/i18n/state/server';

export default async function FocalLengthHeader({
  focal,
  photos,
  selectedPhoto,
  indexNumber,
  count,
  dateRange,
}: {
  focal: number
  photos: Photo[]
  selectedPhoto?: Photo
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRange
}) {
  const appText = await getAppText();
  return (
    <PhotoHeader
      focal={focal}
      entity={<PhotoFocalLength focal={focal} contrast="high" />}
      entityDescription={descriptionForFocalLengthPhotos(
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
