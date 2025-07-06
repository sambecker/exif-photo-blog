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
  sortWithPriority,
  excludeFromFeeds,
  canStart,
  animateOnFirstLoadOnly,
  canSelect,
  ...categories
}: {
  cacheKey: string
  initialOffset: number
  sortBy?: SortBy
  sortWithPriority?: boolean
  excludeFromFeeds?: boolean
} & Omit<ComponentProps<typeof PhotoGrid>, 'photos'>) {
  return (
    <InfinitePhotoScroll
      cacheKey={cacheKey}
      initialOffset={initialOffset}
      itemsPerPage={INFINITE_SCROLL_GRID_MULTIPLE}
      sortBy={sortBy}
      sortWithPriority={sortWithPriority}
      excludeFromFeeds={excludeFromFeeds}
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
