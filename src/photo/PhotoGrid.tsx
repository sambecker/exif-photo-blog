import { Photo } from '.';
import PhotoMedium from './PhotoMedium';
import { clsx } from 'clsx/lite';
import AnimateItems from '@/components/AnimateItems';
import { Camera } from '@/camera';
import { FilmSimulation } from '@/simulation';
import { GRID_ASPECT_RATIO, HIGH_DENSITY_GRID } from '@/site/config';

export default function PhotoGrid({
  photos,
  selectedPhoto,
  tag,
  camera,
  simulation,
  focal,
  photoPriority,
  fast,
  animate = true,
  canStart,
  animateOnFirstLoadOnly,
  staggerOnFirstLoadOnly = true,
  additionalTile,
  small,
  onLastPhotoVisible,
  onAnimationComplete,
}: {
  photos: Photo[]
  selectedPhoto?: Photo
  tag?: string
  camera?: Camera
  simulation?: FilmSimulation
  focal?: number
  photoPriority?: boolean
  fast?: boolean
  animate?: boolean
  canStart?: boolean
  animateOnFirstLoadOnly?: boolean
  staggerOnFirstLoadOnly?: boolean
  additionalTile?: JSX.Element
  small?: boolean
  onLastPhotoVisible?: () => void
  onAnimationComplete?: () => void
}) {
  return (
    <AnimateItems
      className={clsx(
        'grid gap-0.5 sm:gap-1',
        small
          ? 'grid-cols-3 xs:grid-cols-6'
          : HIGH_DENSITY_GRID
            ? 'grid-cols-2 xs:grid-cols-4 lg:grid-cols-6'
            : 'grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4',
        'items-center',
      )}
      type={animate === false ? 'none' : undefined}
      canStart={canStart}
      duration={fast ? 0.3 : undefined}
      staggerDelay={0.075}
      distanceOffset={40}
      animateOnFirstLoadOnly={animateOnFirstLoadOnly}
      staggerOnFirstLoadOnly={staggerOnFirstLoadOnly}
      onAnimationComplete={onAnimationComplete}
      items={photos.map((photo, index) =>
        <div
          key={photo.id}
          className={GRID_ASPECT_RATIO !== 0
            ? 'flex relative overflow-hidden'
            : undefined}
          style={{
            ...GRID_ASPECT_RATIO !== 0 && {
              aspectRatio: GRID_ASPECT_RATIO,
            },
          }}
        >
          <PhotoMedium
            className="flex w-full h-full"
            {...{
              photo,
              tag,
              camera,
              simulation,
              focal,
              selected: photo.id === selectedPhoto?.id,
              priority: photoPriority,
              onVisible: index === photos.length - 1
                ? onLastPhotoVisible
                : undefined,
            }}
          />
        </div>).concat(additionalTile ?? [])}
      itemKeys={photos.map(photo => photo.id)
        .concat(additionalTile ? ['more'] : [])}
    />
  );
};
