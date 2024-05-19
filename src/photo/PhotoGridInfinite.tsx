'use client';

import { Camera } from '@/camera';
import { INFINITE_SCROLL_MULTIPLE_GRID } from '.';
import InfinitePhotoScroll from './InfinitePhotoScroll';
import PhotoGrid from './PhotoGrid';
import { FilmSimulation } from '@/simulation';

export default function PhotoGridInfinite({
  cacheKey,
  initialOffset,
  tag,
  camera,
  simulation,
  animateOnFirstLoadOnly,
}: {
  cacheKey: string
  initialOffset: number
  tag?: string
  camera?: Camera
  simulation?: FilmSimulation
  animateOnFirstLoadOnly?: boolean
}) {
  return (
    <InfinitePhotoScroll
      cacheKey={cacheKey}
      initialOffset={initialOffset}
      itemsPerPage={INFINITE_SCROLL_MULTIPLE_GRID}
      tag={tag}
      camera={camera}
      simulation={simulation}
    >
      {({ photos, onLastPhotoVisible }) =>
        <PhotoGrid {...{
          photos,
          tag,
          camera,
          simulation,
          onLastPhotoVisible,
          animateOnFirstLoadOnly,
        }} />}
    </InfinitePhotoScroll>
  );
}
