'use client';

/* eslint-disable max-len */

import { Photo } from '.';
import { PhotoSetCategory } from '../category';
import PhotoMedium from './PhotoMedium';
import { clsx } from 'clsx/lite';
import { GRID_ASPECT_RATIO } from '@/app/config';
import SelectTileOverlay from '@/components/SelectTileOverlay';
import { ReactNode } from 'react';



export default function PhotoGrid({
  photos,
  small,
  isGridHighDensity,
  selectionMode,
  selectedPhotos,
  togglePhotoSelection,
  prioritizeInitialPhotos,
  additionalTile,
  userEmail,
  ...categories
}: {
  photos: Photo[],
  small?: boolean,
  isGridHighDensity?: boolean,
  selectionMode?: boolean,
  selectedPhotos?: Photo[],
  togglePhotoSelection?: (photo: Photo) => void,
  prioritizeInitialPhotos?: boolean,
  additionalTile?: ReactNode,
  userEmail?: string,
} & PhotoSetCategory) {
  // userEmail is passed down from the parent (HomePageClient / PhotoGridPageClient)
  // which already calls useSession() once at a higher level — no need to call it here
  const currentUserEmail = userEmail;

  return (
    <div className={clsx(
      'grid',
      small
        ? 'grid-cols-3 xs:grid-cols-6'
        : isGridHighDensity
          ? 'grid-cols-2 xs:grid-cols-4 lg:grid-cols-6'
          : 'grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4',
      'items-center',
      'gap-1',
    )}>
      {photos.map((photo, index) => {
        const isSelected = selectedPhotos?.some(p => p.id === photo.id);
        const isLocked = photo.lockedBy != null;
        const isLockedByMe = !!currentUserEmail && currentUserEmail?.toLowerCase() === photo.lockedBy?.toLowerCase();



        const showOverlay = selectionMode || isLockedByMe;

        return <div
          key={photo.id}
          className={clsx(
            'relative overflow-hidden',
            'group',
            // Smooth transition for selection / lock state changes
            'transition-[border-width,opacity] duration-200 ease-out',
            isSelected && 'border-4 border-red-800',
            isLocked && 'border-4 border-red-800',
            isLocked && 'cursor-not-allowed',
          )}
          style={{
            ...GRID_ASPECT_RATIO !== 0 && {
              aspectRatio: GRID_ASPECT_RATIO,
            },
          }}
        >
          <PhotoMedium
            className={clsx(
              'w-full h-full',
              (isSelected || isLocked) && 'opacity-50',
            )}
            photo={photo}
            // Reduce priority count: 4 covers above-the-fold on every breakpoint
            priority={prioritizeInitialPhotos ? index < 4 : undefined}
            disableLink={selectionMode}
            {...categories}
          />
          {showOverlay &&
            <SelectTileOverlay
              isSelected={isSelected || isLockedByMe}
              onSelectChange={() => !isLocked && togglePhotoSelection?.(photo)}
              disabled={isLocked}
            />}
        </div>;
      })}
      {additionalTile}
    </div>
  );
}