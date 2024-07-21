'use client';

import { INFINITE_SCROLL_GRID_MULTIPLE } from '.';
import InfinitePhotoScroll from './InfinitePhotoScroll';
import PhotoGrid from './PhotoGrid';
import { ComponentProps } from 'react';

export default function PhotoGridInfinite({
  cacheKey,
  initialOffset,
  canStart,
  tag,
  camera,
  simulation,
  focal,
  animateOnFirstLoadOnly,
  canSelect,
}: {
  cacheKey: string
  initialOffset: number
} & Omit<ComponentProps<typeof PhotoGrid>, 'photos'>) {
  return (
    <InfinitePhotoScroll
      cacheKey={cacheKey}
      initialOffset={initialOffset}
      itemsPerPage={INFINITE_SCROLL_GRID_MULTIPLE}
      tag={tag}
      camera={camera}
      simulation={simulation}
    >
      {({ photos, onLastPhotoVisible }) =>
        <PhotoGrid {...{
          photos,
          canStart,
          tag,
          camera,
          simulation,
          focal,
          onLastPhotoVisible,
          animateOnFirstLoadOnly,
          canSelect,
        }} />}
    </InfinitePhotoScroll>
  );
}
