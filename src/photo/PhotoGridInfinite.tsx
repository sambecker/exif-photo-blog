'use client';

import { INFINITE_SCROLL_GRID_MULTIPLE } from '.';
import InfinitePhotoScroll from './InfinitePhotoScroll';
import PhotoGrid from './PhotoGrid';
import { ComponentProps } from 'react';
import { SortBy } from './db/sort';

export default function PhotoGridInfinite({
  cacheKey,
  initialOffset,
  sortBy,
  canStart,
  animateOnFirstLoadOnly,
  canSelect,
  ...categories
}: {
  cacheKey: string
  initialOffset: number
  sortBy?: SortBy
} & Omit<ComponentProps<typeof PhotoGrid>, 'photos'>) {
  return (
    <InfinitePhotoScroll
      cacheKey={cacheKey}
      initialOffset={initialOffset}
      itemsPerPage={INFINITE_SCROLL_GRID_MULTIPLE}
      sortBy={sortBy}
      {...categories}
    >
      {({ photos, onLastPhotoVisible }) =>
        <PhotoGrid {...{
          photos,
          ...categories,
          canStart,
          onLastPhotoVisible,
          animateOnFirstLoadOnly,
          canSelect,
        }} />}
    </InfinitePhotoScroll>
  );
}
