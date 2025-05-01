'use client';

import { Photo } from '.';
import { PATH_GRID_INFERRED } from '@/app/paths';
import PhotoGridSidebar from './PhotoGridSidebar';
import PhotoGridContainer from './PhotoGridContainer';
import { ComponentProps, useEffect, useRef } from 'react';
import { useAppState } from '@/state/AppState';
import clsx from 'clsx/lite';
import useElementHeight from '@/utility/useElementHeight';
import MaskedScroll from '@/components/MaskedScroll';

export default function PhotoGridPageClient({
  photos,
  photosCount,
  ...categories
}: ComponentProps<typeof PhotoGridSidebar> & {
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
        <MaskedScroll
          className={clsx(
            'sticky top-0 -mb-5 -mt-5',
            'max-h-screen py-4',
          )}
          fadeSize={100}
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
