'use client';

import { Photo } from '.';
import { PATH_GRID } from '@/app/path';
import PhotoGridFloating from './PhotoGridFloating';
import PhotoGridFloatingInfinite from './PhotoGridFloatingInfinite';
import { useCallback, useState } from 'react';
import { GRID_SPACE_CLASSNAME } from '@/components';
import { SortBy } from './sort';
import { clsx } from 'clsx/lite';

export default function PhotoGridFloatingPage({
  photos,
  photosCount,
  sortBy,
  sortWithPriority,
}: {
  photos: Photo[]
  photosCount: number
  sortBy: SortBy
  sortWithPriority: boolean
}) {
  const [
    shouldAnimateDynamicItems,
    setShouldAnimateDynamicItems,
  ] = useState(false);
  const onAnimationComplete = useCallback(() =>
    setShouldAnimateDynamicItems(true), []);

  return (
    // Wider than nav (956px) on large screens for a 4-column grid
    <div className="mx-auto w-full max-w-[1100px]">
      <div className={clsx(GRID_SPACE_CLASSNAME)}>
        <PhotoGridFloating
          photos={photos}
          prioritizeInitialPhotos
          animateOnFirstLoadOnly
          onAnimationComplete={onAnimationComplete}
        />
        {photosCount > photos.length &&
          <PhotoGridFloatingInfinite
            cacheKey={`page-${PATH_GRID}-floating`}
            initialOffset={photos.length}
            sortBy={sortBy}
            sortWithPriority={sortWithPriority}
            excludeFromFeeds
            canStart={shouldAnimateDynamicItems}
            animateOnFirstLoadOnly
          />}
      </div>
    </div>
  );
}
