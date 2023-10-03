import { Photo } from '.';
import PhotoSmall from './PhotoSmall';
import { cc } from '@/utility/css';
import AnimateItems from '@/components/AnimateItems';
import { Camera } from '@/camera';

export default function PhotoGrid({
  photos,
  selectedPhoto,
  tag,
  camera,
  fast,
  animate = true,
  animateOnFirstLoadOnly,
  staggerOnFirstLoadOnly = true,
}: {
  photos: Photo[]
  selectedPhoto?: Photo
  tag?: string
  camera?: Camera
  fast?: boolean
  animate?: boolean
  animateOnFirstLoadOnly?: boolean
  staggerOnFirstLoadOnly?: boolean
}) {
  return (
    <AnimateItems
      className={cc(
        'grid gap-1',
        'grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4',
        'items-center',
      )}
      type={animate === false ? 'none' : undefined}
      duration={fast ? 0.3 : undefined}
      staggerDelay={0.075}
      distanceOffset={40}
      animateOnFirstLoadOnly={animateOnFirstLoadOnly}
      staggerOnFirstLoadOnly={staggerOnFirstLoadOnly}
      items={photos.map(photo =>
        <PhotoSmall
          key={photo.id}
          photo={photo}
          tag={tag}
          camera={camera}
          selected={photo.id === selectedPhoto?.id}
        />)}
    />
  );
};
