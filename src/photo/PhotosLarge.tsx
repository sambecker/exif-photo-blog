import AnimateItems from '@/components/AnimateItems';
import { Photo } from '.';
import PhotoLarge from './PhotoLarge';
import { RevalidatePhotos } from './InfinitePhotoScroll';

export default function PhotosLarge({
  photos,
  animate = true,
  prefetchFirstPhotoLinks,
  revalidatePhotos,
}: {
  photos: Photo[]
  animate?: boolean
  prefetchFirstPhotoLinks?: boolean
  revalidatePhotos?: RevalidatePhotos
}) {
  return (
    <AnimateItems
      className="space-y-1"
      type={animate ? 'scale' : 'none'}
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
          revalidatePhoto={revalidatePhotos}
        />)}
      itemKeys={photos.map(photo => photo.id)}
    />
  );
}
