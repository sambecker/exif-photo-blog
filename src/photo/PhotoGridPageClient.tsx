'use client';

import { Photo } from '.';
import { PATH_GRID_INFERRED } from '@/app/paths';
import PhotoGridSidebar from './PhotoGridSidebar';
import PhotoGridContainer from './PhotoGridContainer';
import { ComponentProps, useEffect, useRef } from 'react';
import { useAppState } from '@/app/AppState';
import clsx from 'clsx/lite';
import useElementHeight from '@/utility/useElementHeight';
import MaskedScroll from '@/components/MaskedScroll';
import { IS_RECENTS_FIRST } from '@/app/config';
import { SortBy } from './db/sort';

export default function PhotoGridPageClient({
  photos,
  photosCount,
  sortBy,
  sortWithPriority,
  ...categories
}: ComponentProps<typeof PhotoGridSidebar> & {
  photos: Photo[]
  photosCount: number
  sortBy: SortBy
  sortWithPriority: boolean
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { setSelectedPhotoIds } = useAppState();

  useEffect(
    () => () => setSelectedPhotoIds?.(undefined),
    [setSelectedPhotoIds],
  );

  const containerHeight = useElementHeight(ref);

  return (
    <PhotoGridContainer
      cacheKey={`page-${PATH_GRID_INFERRED}`}
      photos={photos}
      count={photosCount}
      sortBy={sortBy}
      sortWithPriority={sortWithPriority}
      excludeFromFeeds
      prioritizeInitialPhotos
      sidebar={
        <MaskedScroll
          ref={ref}
          className={clsx(
            'sticky top-0',
            // Optical adjustment for headerless recents
            IS_RECENTS_FIRST ? '-mb-4.5 -mt-4.5' : '-mb-5 -mt-5',
            'max-h-screen py-4',
          )}
          fadeSize={100}
          setMaxSize={false}
          updateMaskAfterDelay={500}
        >
          <PhotoGridSidebar {...{
            ...categories,
            photosCount,
            containerHeight,
          }} />
        </MaskedScroll>
      }
      canSelect
    />
  );
}
