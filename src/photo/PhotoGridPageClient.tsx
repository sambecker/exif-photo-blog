'use client';

import { Photo } from '.';
import { PATH_GRID_INFERRED } from '@/app/path';
import PhotoGridSidebar from './PhotoGridSidebar';
import PhotoGridContainer from './PhotoGridContainer';
import { ComponentProps, useMemo, useRef } from 'react';
import clsx from 'clsx/lite';
import MaskedScroll from '@/components/MaskedScroll';
import { IS_RECENTS_FIRST, SHOW_CATEGORIES_ON_MOBILE } from '@/app/config';
import { SortBy } from './sort';
import useViewportHeight from '@/utility/useViewportHeight';
import TopPhotoEntities from './TopPhotoEntities';
import AnimateItems from '@/components/AnimateItems';
import { hasEnoughTopEntities } from '@/category/mobile';

export default function PhotoGridPageClient({
  photos,
  photosCount,
  photosCountWithExcludes,
  sortBy,
  sortWithPriority,
  ...categories
}: ComponentProps<typeof PhotoGridSidebar> & {
  photos: Photo[]
  photosCount: number
  photosCountWithExcludes: number
  sortBy: SortBy
  sortWithPriority: boolean
}) {
  const ref = useRef<HTMLDivElement>(null);

  const viewPortHeight = useViewportHeight();
  const containerHeight = useMemo(() =>
    viewPortHeight - (ref.current?.getBoundingClientRect().y ?? 0),
  [viewPortHeight]);

  const shouldShowTopEntities = useMemo(() =>
    SHOW_CATEGORIES_ON_MOBILE && hasEnoughTopEntities(categories),
  [categories]);

  return (
    <div>
      {shouldShowTopEntities &&
        <AnimateItems
          type="bottom"
          items={[
            <div key="mobile-sidebar" className={clsx(
              'flex gap-x-2',
              'md:hidden',
              'mb-4',
            )}>
              <TopPhotoEntities
                className="grow"
                {...categories}
              />
            </div>,
          ]} />}
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
          >
            <PhotoGridSidebar {...{
              ...categories,
              photosCount: photosCountWithExcludes,
              containerHeight,
            }} />
          </MaskedScroll>
        }
      />
    </div>
  );
}
