import AnimateItems from '@/components/AnimateItems';
import { Photo } from '.';
import PhotoLarge from './PhotoLarge';

export default function PhotosLarge({
  photos,
  prefetchFirstPhotoLinks,
}: {
  photos: Photo[]
  prefetchFirstPhotoLinks?: boolean
}) {
  return (
    <AnimateItems
      className="space-y-1"
      duration={0.7}
      staggerDelay={0.15}
      distanceOffset={0}
      staggerOnFirstLoadOnly
      items={photos.map((photo, index) =>
        <PhotoLarge
          key={photo.id}
          photo={photo}
          priority={index <= 1}
          prefetchRelatedLinks={prefetchFirstPhotoLinks && index === 0}
        />)}
    />
  );
}
