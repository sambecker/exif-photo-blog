import { Photo, PhotoDateRange } from '@/photo';
import PhotoHeader from '@/photo/PhotoHeader';
import { Lens, lensFromPhoto } from '.';
import PhotoLens from './PhotoLens';
import { descriptionForLensPhotos } from './meta';
import { AI_TEXT_GENERATION_ENABLED } from '@/app/config';
import { getAppText } from '@/i18n/state/server';

export default async function LensHeader({
  lens: lensProp,
  photos,
  selectedPhoto,
  indexNumber,
  count,
  dateRange,
}: {
  lens: Lens
  photos: Photo[]
  selectedPhoto?: Photo
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRange
}) {
  const lens = lensFromPhoto(photos[0], lensProp);
  const appText = await getAppText();

  return (
    <PhotoHeader
      lens={lens}
      entity={<PhotoLens
        {...{ lens }}
        contrast="high"
        showHover={false}
        longText
      />}
      entityDescription={
        descriptionForLensPhotos(
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
