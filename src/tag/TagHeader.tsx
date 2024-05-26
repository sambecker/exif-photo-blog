import { Photo, PhotoDateRange } from '@/photo';
import PhotoTag from './PhotoTag';
import { descriptionForTaggedPhotos, isTagFavs } from '.';
import { pathForTagShare } from '@/site/paths';
import PhotoSetHeader from '@/photo/PhotoSetHeader';
import FavsTag from './FavsTag';

export default function TagHeader({
  tag,
  photos,
  selectedPhoto,
  indexNumber,
  count,
  dateRange,
}: {
  tag: string
  photos: Photo[]
  selectedPhoto?: Photo
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRange
}) {
  return (
    <PhotoSetHeader
      entity={isTagFavs(tag) 
        ? <FavsTag contrast="high" />
        : <PhotoTag tag={tag} contrast="high" />}
      entityVerb="Tagged"
      entityDescription={descriptionForTaggedPhotos(photos, undefined, count)}
      photos={photos}
      selectedPhoto={selectedPhoto}
      sharePath={pathForTagShare(tag)}
      indexNumber={indexNumber}
      count={count}
      dateRange={dateRange}
    />
  );
}
