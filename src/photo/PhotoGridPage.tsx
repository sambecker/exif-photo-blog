'use client';

import { Photo } from '.';
import { PATH_GRID_INFERRED } from '@/app/paths';
import PhotoGridSidebar from './PhotoGridSidebar';
import PhotoGridContainer from './PhotoGridContainer';
import { useEffect, useRef } from 'react';
import { useAppState } from '@/state/AppState';
import clsx from 'clsx/lite';
import { PhotoSetCategories } from '@/category';
import useElementHeight from '@/utility/useElementHeight';
import FadedScroll from '@/components/FadedScroll';

export default function PhotoGridPage({
  photos,
  photosCount,
  ...categories
}: PhotoSetCategories & {
  photos: Photo[]
  photosCount: number
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
      sidebar={
        <FadedScroll
          ref={ref}
          className={clsx(
            'sticky top-0 -mb-5 -mt-5',
            'max-h-screen h-full',
          )}
          classNameContent="py-4"
          fadeHeight={36}
          hideScrollbar
        >
          <PhotoGridSidebar {...{
            ...categories,
            photosCount,
            containerHeight,
          }}
          />
        </FadedScroll>
      }
      canSelect
    />
  );
}
