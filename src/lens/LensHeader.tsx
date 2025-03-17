import { Photo, PhotoDateRange } from '@/photo';
import PhotoHeader from '@/photo/PhotoHeader';
import { Lens, lensFromPhoto } from '.';
import PhotoLens from './PhotoLens';
import { descriptionForLensPhotos } from './meta';

export default function LensHeader({
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
  return (
    <PhotoHeader
      lens={lens}
      entity={<PhotoLens {...{ lens }} contrast="high" />}
      entityDescription={
        descriptionForLensPhotos(photos, undefined, count, dateRange)}
      photos={photos}
      selectedPhoto={selectedPhoto}
      indexNumber={indexNumber}
      count={count}
      dateRange={dateRange}
      includeShareButton
    />
  );
}
