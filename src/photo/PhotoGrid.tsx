'use client';

import { Photo } from '.';
import { PhotoSetCategory } from '../category';
import PhotoMedium from './PhotoMedium';
import { clsx } from 'clsx/lite';
import AnimateItems from '@/components/AnimateItems';
import {
  GRID_ASPECT_RATIO,
  MASONRY_GRID_ENABLED,
} from '@/app/config';
import { useAppState } from '@/app/AppState';
import SelectTileOverlay from '@/components/SelectTileOverlay';
import { ReactNode } from 'react';
import { GRID_GAP_CLASSNAME } from '@/components';
import { useSelectPhotosState } from '@/admin/select/SelectPhotosState';
import { DATA_KEY_PHOTO_GRID } from '@/admin/select/SelectPhotosProvider';
import PhotoGridMasonry from './PhotoGridMasonry';
import AdminPhotoMenu from '@/admin/AdminPhotoMenu';
import { RevalidatePhoto } from './InfinitePhotoScroll';

export default function PhotoGrid({
  photos,
  prioritizeInitialPhotos,
  className,
  classNamePhoto,
  animate = true,
  canStart,
  animateOnFirstLoadOnly,
  staggerOnFirstLoadOnly = true,
  additionalTile,
  small,
  selectable = true,
  onLastPhotoVisible,
  onAnimationComplete,
  revalidatePhoto,
  ...categories
}: {
  photos: Photo[]
  prioritizeInitialPhotos?: boolean
  className?: string
  classNamePhoto?: string
  animate?: boolean
  canStart?: boolean
  animateOnFirstLoadOnly?: boolean
  staggerOnFirstLoadOnly?: boolean
  additionalTile?: ReactNode
  small?: boolean
  selectable?: boolean
  onLastPhotoVisible?: () => void
  onAnimationComplete?: () => void
  revalidatePhoto?: RevalidatePhoto
} & PhotoSetCategory) {
  const {
    isGridHighDensity,
    isUserSignedIn,
  } = useAppState();

  const {
    isSelectingPhotos,
    isSelectingAllPhotos,
    selectedPhotoIds,
    togglePhotoSelection,
  } = useSelectPhotosState();

  const photoNodes = photos.map((photo, index) => {
    const isSelected = (
      selectedPhotoIds?.includes(photo.id) ||
      isSelectingAllPhotos
    ) ?? false;
    return <div
      key={photo.id}
      className={clsx(
        'flex relative overflow-hidden',
        'group',
      )}
      style={{
        ...(MASONRY_GRID_ENABLED) ? {
          aspectRatio: photo.aspectRatio,
          // Skip render/paint work for tiles scrolled off-screen — height
          // stays derived from aspectRatio, so this doesn't affect layout
          contentVisibility: 'auto',
        } : (GRID_ASPECT_RATIO !== 0) ? {
          aspectRatio: GRID_ASPECT_RATIO,
        } : {},
      }}
    >
      <PhotoMedium
        className={clsx(
          'flex w-full h-full',
          // Prevent photo navigation when selecting
          isSelectingPhotos && 'pointer-events-none',
          classNamePhoto,
        )}
        {...{
          photo,
          ...categories,
          selected: isSelected,
          // More priority slots when masonry is on (helps LCP)
          priority: prioritizeInitialPhotos
            ? (MASONRY_GRID_ENABLED ? index < 36 : index < 6)
            : undefined,
          onVisible: index === photos.length - 1
            ? onLastPhotoVisible
            : undefined,
        }}
      />
      {isUserSignedIn && !isSelectingPhotos &&
        <div className={clsx(
          'absolute top-0 right-0 z-10 p-1',
          'opacity-0 pointer-events-none',
          'group-hover:opacity-100',
          'group-hover:pointer-events-auto',
          'has-[[data-state=open]]:opacity-100',
          'has-[[data-state=open]]:pointer-events-auto',
          'focus-within:opacity-100',
          'focus-within:pointer-events-auto',
          'transition-opacity',
        )}>
          <AdminPhotoMenu
            photo={photo}
            revalidatePhoto={revalidatePhoto}
            classNameButton={clsx(
              'text-white!',
              'bg-black/40!',
              'hover:bg-black/60!',
              'active:bg-black/75!',
              'dark:hover:bg-black/60!',
              'dark:active:bg-black/75!',
              'backdrop-blur-xs',
              'border-transparent',
              'shadow-none',
            )}
            classNameButtonOpen="bg-black/60!"
            alignOffset={-4}
          />
        </div>}
      {isSelectingPhotos &&
        <SelectTileOverlay
          isSelected={isSelected}
          onSelectChange={() => togglePhotoSelection?.(photo.id)}
        />}
    </div>;
  });

  const allItems = photoNodes.concat(
    additionalTile ? [<div key="more">{additionalTile}</div>] : [],
  );

  if (MASONRY_GRID_ENABLED) {
    return (
      <PhotoGridMasonry
        photos={photos}
        photoNodes={photoNodes}
        additionalTile={additionalTile}
        small={small}
        isGridHighDensity={isGridHighDensity}
        selectable={selectable}
        className={className}
        animate={animate}
        canStart={canStart}
        animateOnFirstLoadOnly={animateOnFirstLoadOnly}
        staggerOnFirstLoadOnly={staggerOnFirstLoadOnly}
        onAnimationCompleteAction={onAnimationComplete}
      />
    );
  }

  return (
    <div
      {...{ [DATA_KEY_PHOTO_GRID]: selectable, className }}
    >
      <AnimateItems
        className={clsx(
          'grid',
          GRID_GAP_CLASSNAME,
          small
            ? 'grid-cols-3 xs:grid-cols-6'
            : isGridHighDensity
              ? 'grid-cols-2 xs:grid-cols-4 lg:grid-cols-6'
              : 'grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4',
          'items-center',
        )}
        type={animate === false ? 'none' : undefined}
        canStart={canStart}
        duration={0.7}
        staggerDelay={0.04}
        distanceOffset={40}
        animateOnFirstLoadOnly={animateOnFirstLoadOnly}
        staggerOnFirstLoadOnly={staggerOnFirstLoadOnly}
        onAnimationComplete={onAnimationComplete}
        items={allItems}
        itemKeys={photos.map(photo => photo.id)
          .concat(additionalTile ? ['more'] : [])}
      />
    </div>
  );
};
