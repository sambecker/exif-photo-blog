'use client';

import { INFINITE_SCROLL_GRID_MULTIPLE } from '.';
import InfinitePhotoScroll from './InfinitePhotoScroll';
import PhotoGridFloating from './PhotoGridFloating';
import { ComponentProps } from 'react';
import { SortBy } from './sort';

export default function PhotoGridFloatingInfinite({
  cacheKey,
  initialOffset,
  sortBy,
  sortWithPriority,
  excludeFromFeeds,
  canStart,
  animateOnFirstLoadOnly,
}: {
  cacheKey: string
  initialOffset: number
  sortBy?: SortBy
  sortWithPriority?: boolean
  excludeFromFeeds?: boolean
} & Omit<ComponentProps<typeof PhotoGridFloating>, 'photos'>) {
  return (
    <InfinitePhotoScroll
      cacheKey={cacheKey}
      initialOffset={initialOffset}
      itemsPerPage={INFINITE_SCROLL_GRID_MULTIPLE}
      sortBy={sortBy}
      sortWithPriority={sortWithPriority}
      excludeFromFeeds={excludeFromFeeds}
    >
      {({ key, photos, onLastPhotoVisible, revalidatePhoto }) =>
        <PhotoGridFloating
          key={key}
          {...{
            photos,
            canStart,
            onLastPhotoVisible,
            animateOnFirstLoadOnly,
            revalidatePhoto,
          }}
        />}
    </InfinitePhotoScroll>
  );
}
