import AnimateItems from '@/components/AnimateItems';
import { Photo } from '.';
import PhotoFull from './PhotoFull';
import { RevalidatePhoto } from './InfinitePhotoScroll';

export const PHOTOS_FULL_SPACING = 'max-md:space-y-12';

export default function PhotosFull({
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
      className={PHOTOS_FULL_SPACING}
      type={animate ? 'scale' : 'none'}
      duration={0.7}
      staggerDelay={0.15}
      distanceOffset={0}
      staggerOnFirstLoadOnly
      items={photos.map((photo, index) => {
        const absoluteIndex = indexOffset + index;
        return (
          <PhotoFull
            key={photo.id}
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
        );
      })}
      itemKeys={photos.map(photo => photo.id)}
    />
  );
}
