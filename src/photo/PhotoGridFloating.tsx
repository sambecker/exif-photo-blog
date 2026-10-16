'use client';

import {
  Photo,
  altTextForPhoto,
  doesPhotoNeedBlurCompatibility,
} from '.';
import ImageMedium from '@/components/image/ImageMedium';
import { clsx } from 'clsx/lite';
import AnimateItems from '@/components/AnimateItems';
import { pathForPhoto } from '@/app/path';
import { SHOULD_PREFETCH_ALL_LINKS } from '@/app/config';
import { useAppState } from '@/app/AppState';
import SelectTileOverlay from '@/components/SelectTileOverlay';
import { GRID_GAP_CLASSNAME } from '@/components';
import { useSelectPhotosState } from '@/admin/select/SelectPhotosState';
import { DATA_KEY_PHOTO_GRID } from '@/admin/select/SelectPhotosProvider';
import AdminPhotoMenu from '@/admin/AdminPhotoMenu';
import { RevalidatePhoto } from './InfinitePhotoScroll';
import LinkWithStatus from '@/components/LinkWithStatus';
import Spinner from '@/components/Spinner';
import useVisibility from '@/utility/useVisibility';
import { useRef } from 'react';

function matteWidthForAspectRatio(aspectRatio: number) {
  // Tighter than PhotoLarge matte so the grid stays dense
  if (aspectRatio > 3 / 2 + 0.1) { return 'w-[96%]'; }
  if (aspectRatio >= 1) { return 'w-[90%]'; }
  return undefined;
}

function PhotoGridFloatingTile({
  photo,
  priority,
  selected,
  onSelectChange,
  onVisible,
  revalidatePhoto,
}: {
  photo: Photo
  priority?: boolean
  selected?: boolean
  onSelectChange?: () => void
  onVisible?: () => void
  revalidatePhoto?: RevalidatePhoto
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { isUserSignedIn } = useAppState();
  const { isSelectingPhotos } = useSelectPhotosState();

  useVisibility({ ref, onVisible });

  return (
    <div className={clsx(
      'relative aspect-square',
      'flex items-center justify-center',
      'group',
    )}>
      <LinkWithStatus
        ref={ref}
        href={pathForPhoto({ photo })}
        className={clsx(
          'relative',
          'flex items-center justify-center',
          'h-[96%]',
          matteWidthForAspectRatio(photo.aspectRatio),
          'active:brightness-75',
          selected && 'brightness-50',
          isSelectingPhotos && 'pointer-events-none',
        )}
        prefetch={SHOULD_PREFETCH_ALL_LINKS}
      >
        {({ isLoading }) =>
          <>
            {isLoading &&
              <div className={clsx(
                'absolute inset-0 flex items-center justify-center',
                'text-dim',
                'animate-fade-in',
                'z-10',
              )}>
                <Spinner size={20} color="text" />
              </div>}
            <ImageMedium
              src={photo.url}
              alt={altTextForPhoto(photo)}
              aspectRatio={photo.aspectRatio}
              blurDataURL={photo.blurData}
              blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
              className="h-full"
              classNameImage="object-contain w-full h-full"
              priority={priority}
            />
          </>}
      </LinkWithStatus>
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
            alignOffset={-4}
          />
        </div>}
      {isSelectingPhotos &&
        <SelectTileOverlay
          isSelected={Boolean(selected)}
          onSelectChange={() => onSelectChange?.()}
        />}
    </div>
  );
}

export default function PhotoGridFloating({
  photos,
  prioritizeInitialPhotos,
  className,
  animate = true,
  canStart,
  animateOnFirstLoadOnly,
  staggerOnFirstLoadOnly = true,
  selectable = true,
  onLastPhotoVisible,
  onAnimationComplete,
  revalidatePhoto,
}: {
  photos: Photo[]
  prioritizeInitialPhotos?: boolean
  className?: string
  animate?: boolean
  canStart?: boolean
  animateOnFirstLoadOnly?: boolean
  staggerOnFirstLoadOnly?: boolean
  selectable?: boolean
  onLastPhotoVisible?: () => void
  onAnimationComplete?: () => void
  revalidatePhoto?: RevalidatePhoto
}) {
  const {
    isSelectingAllPhotos,
    selectedPhotoIds,
    togglePhotoSelection,
  } = useSelectPhotosState();

  const items = photos.map((photo, index) => {
    const isSelected = (
      selectedPhotoIds?.includes(photo.id) ||
      isSelectingAllPhotos
    ) ?? false;

    return (
      <PhotoGridFloatingTile
        key={photo.id}
        photo={photo}
        priority={prioritizeInitialPhotos ? index < 6 : undefined}
        selected={isSelected}
        onSelectChange={() => togglePhotoSelection?.(photo.id)}
        onVisible={index === photos.length - 1
          ? onLastPhotoVisible
          : undefined}
        revalidatePhoto={revalidatePhoto}
      />
    );
  });

  return (
    <div
      {...{ [DATA_KEY_PHOTO_GRID]: selectable, className }}
    >
      <AnimateItems
        className={clsx(
          'grid',
          GRID_GAP_CLASSNAME,
          'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
        )}
        type={animate === false ? 'none' : undefined}
        canStart={canStart}
        duration={0.7}
        staggerDelay={0.04}
        distanceOffset={40}
        animateOnFirstLoadOnly={animateOnFirstLoadOnly}
        staggerOnFirstLoadOnly={staggerOnFirstLoadOnly}
        onAnimationComplete={onAnimationComplete}
        items={items}
        itemKeys={photos.map(photo => photo.id)}
      />
    </div>
  );
}
