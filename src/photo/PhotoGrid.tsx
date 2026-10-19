'use client';

import {
  Photo,
  altTextForPhoto,
  doesPhotoNeedBlurCompatibility,
} from '.';
import { PhotoSetCategory } from '../category';
import PhotoMedium from './PhotoMedium';
import ImageMedium from '@/components/image/ImageMedium';
import { clsx } from 'clsx/lite';
import AnimateItems from '@/components/AnimateItems';
import {
  GRID_ASPECT_RATIO,
  MASONRY_GRID_ENABLED,
  SHOULD_PREFETCH_ALL_LINKS,
} from '@/app/config';
import { useAppState } from '@/app/AppState';
import SelectTileOverlay from '@/components/SelectTileOverlay';
import { CSSProperties, ReactNode, useRef } from 'react';
import { GRID_GAP_CLASSNAME } from '@/components';
import { useSelectPhotosState } from '@/admin/select/SelectPhotosState';
import { DATA_KEY_PHOTO_GRID } from '@/admin/select/SelectPhotosProvider';
import PhotoGridMasonry from './PhotoGridMasonry';
import AdminPhotoMenu from '@/admin/AdminPhotoMenu';
import { RevalidatePhoto } from './InfinitePhotoScroll';
import { pathForPhoto } from '@/app/path';
import LinkWithStatus from '@/components/LinkWithStatus';
import Spinner from '@/components/Spinner';
import useVisibility from '@/utility/useVisibility';

// Size the photo box by aspect ratio so it matches the rendered image
// (menu/overlay anchor to the photo, not the square cell).
function mattedPhotoBoxClass(aspectRatio: number) {
  // Small screens: tighter matte (photos fill more of the cell).
  // md+: keep the airier floating inset.
  if (aspectRatio > 3 / 2 + 0.1) { return 'w-[98%] md:w-[96%]'; }
  if (aspectRatio >= 1) { return 'w-[96%] md:w-[90%]'; }
  return 'h-[98%] md:h-[96%]';
}

function PhotoGridMattedTile({
  photo,
  priority,
  selected,
  onSelectChange,
  onVisible,
  revalidatePhoto,
  classNamePhoto,
  ...categories
}: {
  photo: Photo
  priority?: boolean
  selected?: boolean
  onSelectChange?: () => void
  onVisible?: () => void
  revalidatePhoto?: RevalidatePhoto
  classNamePhoto?: string
} & PhotoSetCategory) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { isUserSignedIn } = useAppState();
  const { isSelectingPhotos } = useSelectPhotosState();

  useVisibility({ ref, onVisible });

  return (
    <div
      className={clsx(
        'flex aspect-square',
        'items-center justify-center',
        'overflow-visible',
      )}
    >
      <div
        className={clsx(
          'relative group',
          // Photo silhouette inside the square cell
          'aspect-[var(--photo-ar)]',
          mattedPhotoBoxClass(photo.aspectRatio),
        )}
        style={{
          '--photo-ar': String(photo.aspectRatio),
        } as CSSProperties}
      >
        <LinkWithStatus
          ref={ref}
          href={pathForPhoto({ photo, ...categories })}
          className={clsx(
            'relative block',
            'w-full h-full',
            'active:brightness-75',
            selected && 'brightness-50',
            isSelectingPhotos && 'pointer-events-none',
            classNamePhoto,
          )}
          prefetch={SHOULD_PREFETCH_ALL_LINKS}
        >
          {({ isLoading }) =>
            <>
              {isLoading &&
                <div className={clsx(
                  'absolute inset-0 flex items-center justify-center',
                  'text-white bg-black/25 backdrop-blur-xs',
                  'animate-fade-in',
                  'z-10',
                )}>
                  <Spinner size={20} color="frosted" />
                </div>}
              <ImageMedium
                src={photo.url}
                alt={altTextForPhoto(photo)}
                aspectRatio={photo.aspectRatio}
                blurDataURL={photo.blurData}
                blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
                className="flex object-cover w-full h-full"
                classNameImage="object-cover w-full h-full"
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
            isSelected={Boolean(selected)}
            onSelectChange={() => onSelectChange?.()}
          />}
      </div>
    </div>
  );
}

export default function PhotoGrid({
  photos,
  prioritizeInitialPhotos,
  className,
  classNamePhoto,
  animate = true,
  canStart,
  animateOnFirstLoadOnly,
  staggerOnFirstLoadOnly,
  additionalTile,
  small,
  selectable = true,
  // Home / grid feed: always-floating matted tile layout.
  // Under a featured photo (and other embeds): leave unset.
  matted,
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
  matted?: boolean
  onLastPhotoVisible?: () => void
  onAnimationComplete?: () => void
  revalidatePhoto?: RevalidatePhoto
} & PhotoSetCategory) {
  const {
    isGridHighDensity,
    isUserSignedIn,
  } = useAppState();

  // Grid root (matted): re-animate + stagger on every visit.
  // Embedded grids: stagger only on first load by default.
  const staggerOnFirstLoadOnlyResolved = staggerOnFirstLoadOnly ?? !matted;

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

    if (matted) {
      return (
        <PhotoGridMattedTile
          key={photo.id}
          photo={photo}
          priority={prioritizeInitialPhotos ? index < 6 : undefined}
          selected={isSelected}
          onSelectChange={() => togglePhotoSelection?.(photo.id)}
          onVisible={index === photos.length - 1
            ? onLastPhotoVisible
            : undefined}
          revalidatePhoto={revalidatePhoto}
          classNamePhoto={classNamePhoto}
          {...categories}
        />
      );
    }

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

  // Matted layout owns its own tile geometry — skip masonry
  if (MASONRY_GRID_ENABLED && !matted) {
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
        staggerOnFirstLoadOnly={staggerOnFirstLoadOnlyResolved}
        onAnimationCompleteAction={onAnimationComplete}
      />
    );
  }

  const gridClassName = matted
    ? clsx(
      'grid',
      // No gap — matte inset already spaces photos inside square cells
      // Floating column counts at all sizes (2 → 3 → 4)
      small
        ? 'grid-cols-3 xs:grid-cols-6'
        : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      'items-center',
    )
    : clsx(
      'grid',
      GRID_GAP_CLASSNAME,
      small
        ? 'grid-cols-3 xs:grid-cols-6'
        : isGridHighDensity
          ? 'grid-cols-2 xs:grid-cols-4 lg:grid-cols-6'
          : 'grid-cols-2 sm:grid-cols-4',
      'items-center',
    );

  return (
    <div
      {...{ [DATA_KEY_PHOTO_GRID]: selectable, className }}
    >
      <AnimateItems
        className={gridClassName}
        type={animate === false ? 'none' : undefined}
        canStart={canStart}
        duration={0.7}
        staggerDelay={0.04}
        distanceOffset={40}
        animateOnFirstLoadOnly={animateOnFirstLoadOnly}
        staggerOnFirstLoadOnly={staggerOnFirstLoadOnlyResolved}
        onAnimationComplete={onAnimationComplete}
        items={allItems}
        itemKeys={photos.map(photo => photo.id)
          .concat(additionalTile ? ['more'] : [])}
      />
    </div>
  );
};
