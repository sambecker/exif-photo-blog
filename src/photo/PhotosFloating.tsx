import AnimateItems from '@/components/AnimateItems';
import { Photo } from '.';
import PhotoFloating from './PhotoFloating';
import { RevalidatePhoto } from './InfinitePhotoScroll';

export default function PhotosFloating({
  photos,
  animate = true,
  prefetchFirstPhotoLinks,
  onLastPhotoVisible,
  revalidatePhoto,
  showStorageCheck,
  indexOffset = 0,
}: {
  photos: Photo[]
  animate?: boolean
  prefetchFirstPhotoLinks?: boolean
  onLastPhotoVisible?: () => void
  revalidatePhoto?: RevalidatePhoto
  showStorageCheck?: boolean
  indexOffset?: number
}) {
  return (
    <AnimateItems
      className="space-y-12 md:space-y-16"
      type={animate ? 'scale' : 'none'}
      duration={0.7}
      staggerDelay={0.15}
      distanceOffset={0}
      staggerOnFirstLoadOnly
      items={photos.map((photo, index) =>
        <PhotoFloating
          key={photo.id}
          photo={photo}
          metaSide={(indexOffset + index) % 2 === 0 ? 'right' : 'left'}
          priority={index <= 1}
          prefetchRelatedLinks={prefetchFirstPhotoLinks && index === 0}
          revalidatePhoto={revalidatePhoto}
          shouldZoomOnFKeydown={false}
          onVisible={index === photos.length - 1
            ? onLastPhotoVisible
            : undefined}
          showStorageCheck={showStorageCheck}
        />)}
      itemKeys={photos.map(photo => photo.id)}
    />
  );
}
