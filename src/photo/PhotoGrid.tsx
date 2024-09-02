'use client';

import { Photo, PhotoSetAttributes } from '.';
import PhotoMedium from './PhotoMedium';
import { clsx } from 'clsx/lite';
import AnimateItems from '@/components/AnimateItems';
import { GRID_ASPECT_RATIO, HIGH_DENSITY_GRID } from '@/site/config';
import { useAppState } from '@/state/AppState';
import SelectTileOverlay from '@/components/SelectTileOverlay';

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
  canSelect,
  onLastPhotoVisible,
  onAnimationComplete,
}: {
  photos: Photo[]
  selectedPhoto?: Photo
  photoPriority?: boolean
  fast?: boolean
  animate?: boolean
  canStart?: boolean
  animateOnFirstLoadOnly?: boolean
  staggerOnFirstLoadOnly?: boolean
  additionalTile?: JSX.Element
  small?: boolean
  canSelect?: boolean
  onLastPhotoVisible?: () => void
  onAnimationComplete?: () => void
} & PhotoSetAttributes) {
  const {
    isUserSignedIn,
    selectedPhotoIds,
    setSelectedPhotoIds,
  } = useAppState();

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
      items={photos.map((photo, index) =>{
        const isSelected = selectedPhotoIds?.includes(photo.id) ?? false;
        return <div
          key={photo.id}
          className={clsx(
            GRID_ASPECT_RATIO !== 0 && 'flex relative overflow-hidden',
            'group',
          )}
          style={{
            ...GRID_ASPECT_RATIO !== 0 && {
              aspectRatio: GRID_ASPECT_RATIO,
            },
          }}
        >
          <PhotoMedium
            className={clsx(
              'flex w-full h-full',
              // Prevent photo navigation when selecting
              selectedPhotoIds?.length !== undefined && 'pointer-events-none',
            )}
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
          {isUserSignedIn && canSelect && selectedPhotoIds !== undefined &&
            <SelectTileOverlay
              isSelected={isSelected}
              onSelectChange={() => setSelectedPhotoIds?.(isSelected
                ? (selectedPhotoIds ?? []).filter(id => id !== photo.id)
                : (selectedPhotoIds ?? []).concat(photo.id),
              )}
            />}
        </div>;
      }).concat(additionalTile ?? [])}
      itemKeys={photos.map(photo => photo.id)
        .concat(additionalTile ? ['more'] : [])}
    />
  );
};
