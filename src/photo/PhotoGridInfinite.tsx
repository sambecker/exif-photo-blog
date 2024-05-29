'use client';

import { Camera } from '@/camera';
import { INFINITE_SCROLL_GRID_PHOTO_MULTIPLE } from '.';
import InfinitePhotoScroll from './InfinitePhotoScroll';
import PhotoGrid from './PhotoGrid';
import { FilmSimulation } from '@/simulation';

export default function PhotoGridInfinite({
  cacheKey,
  initialOffset,
  canStart,
  tag,
  camera,
  simulation,
  focal,
  animateOnFirstLoadOnly,
}: {
  cacheKey: string
  initialOffset: number
  canStart?: boolean
  tag?: string
  camera?: Camera
  simulation?: FilmSimulation
  focal?: number
  animateOnFirstLoadOnly?: boolean
}) {
  return (
    <InfinitePhotoScroll
      cacheKey={cacheKey}
      initialOffset={initialOffset}
      itemsPerPage={INFINITE_SCROLL_GRID_PHOTO_MULTIPLE}
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
        }} />}
    </InfinitePhotoScroll>
  );
}
