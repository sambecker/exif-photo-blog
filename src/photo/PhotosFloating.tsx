import AnimateItems from '@/components/AnimateItems';
import { Photo } from '.';
import PhotoFloating from './PhotoFloating';
import FloatingParallax from './FloatingParallax';
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
      // Negative gap: rows start overlapped; parallax opens/closes further
      className="-space-y-4 md:-space-y-6"
      type={animate ? 'scale' : 'none'}
      duration={0.7}
      staggerDelay={0.15}
      distanceOffset={0}
      staggerOnFirstLoadOnly
      items={photos.map((photo, index) => {
        const absoluteIndex = indexOffset + index;
        return (
          <FloatingParallax
            key={photo.id}
            index={absoluteIndex}
          >
            <PhotoFloating
              photo={photo}
              metaSide={absoluteIndex % 2 === 0 ? 'right' : 'left'}
              priority={index <= 1}
              prefetchRelatedLinks={prefetchFirstPhotoLinks && index === 0}
              revalidatePhoto={revalidatePhoto}
              shouldZoomOnFKeydown={false}
              onVisible={index === photos.length - 1
                ? onLastPhotoVisible
                : undefined}
              showStorageCheck={showStorageCheck}
            />
          </FloatingParallax>
        );
      })}
      itemKeys={photos.map(photo => photo.id)}
    />
  );
}
