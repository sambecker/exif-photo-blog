import { Photo, PhotoDateRange } from '@/photo';
import { descriptionForFocalLengthPhotos } from '.';
import { pathForFocalLength } from '@/site/paths';
import PhotoSetHeader from '@/photo/PhotoSetHeader';
import PhotoFocalLength from './PhotoFocalLength';

export default function FocalLengthHeader({
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
  return (
    <PhotoSetHeader
      entity={<PhotoFocalLength focal={focal} contrast="high" />}
      entityVerb="Tagged"
      entityDescription={descriptionForFocalLengthPhotos(
        photos,
        undefined,
        count,
      )}
      photos={photos}
      selectedPhoto={selectedPhoto}
      sharePath={pathForFocalLength(focal)}
      indexNumber={indexNumber}
      count={count}
      dateRange={dateRange}
    />
  );
}
