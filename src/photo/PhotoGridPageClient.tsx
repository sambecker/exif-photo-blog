'use client';

import { Photo } from '.';
import { PATH_GRID_INFERRED } from '@/app/path';
import PhotoGridSidebar from './PhotoGridSidebar';
import PhotoGridHybridContainer from './PhotoGridHybridContainer';
import { ComponentProps, useMemo, useRef } from 'react';
import clsx from 'clsx/lite';
import MaskedScroll from '@/components/MaskedScroll';
import {
  HOME_FOLDERS_ENABLED,
  IS_RECENTS_FIRST,
  SHOW_CATEGORIES_ON_MOBILE,
} from '@/app/config';
import { SortBy } from './sort';
import useViewportHeight from '@/utility/useViewportHeight';
import TopPhotoEntities from './TopPhotoEntities';
import TopPhotoFolders from './TopPhotoFolders';
import AnimateItems from '@/components/AnimateItems';
import { hasEnoughTopEntities } from '@/category/mobile';
import type { LibrarySetFolder } from '@/library';

export default function PhotoGridPageClient({
  photos,
  photosCount,
  photosCountWithExcludes,
  sortBy,
  sortWithPriority,
  className,
  aboutTextSafelyParsedHtml,
  aboutTextHasBrParagraphBreaks,
  folders,
  ...categories
}: Omit<ComponentProps<typeof PhotoGridSidebar>, 'containerHeight'> & {
  photos: Photo[]
  photosCount: number
  photosCountWithExcludes: number
  sortBy: SortBy
  sortWithPriority: boolean
  folders?: LibrarySetFolder[]
}) {
  const ref = useRef<HTMLDivElement>(null);

  const viewPortHeight = useViewportHeight();
  const containerHeight = useMemo(() =>
    viewPortHeight - (ref.current?.getBoundingClientRect().y ?? 0),
  [viewPortHeight]);

  const shouldShowTopEntities = useMemo(() =>
    SHOW_CATEGORIES_ON_MOBILE && hasEnoughTopEntities(categories),
  [categories]);

  const shouldShowFolders = Boolean(
    HOME_FOLDERS_ENABLED &&
    folders &&
    folders.length > 0,
  );

  return (
    <div>
      {shouldShowTopEntities &&
        <AnimateItems
          type="bottom"
          // Elevate above sticky nav (z-10). Must live on this motion.div —
          // its transform creates a stacking context that would otherwise
          // trap descendant z-indexes below the nav.
          classNameItem={shouldShowFolders
            ? 'relative z-11'
            : undefined}
          items={[
            <div key="mobile-sidebar" className={clsx(
              'flex gap-x-2',
              'md:hidden',
              'mb-4',
            )}>
              {shouldShowFolders && folders
                ? <TopPhotoFolders
                  className="grow"
                  folders={folders}
                />
                : <TopPhotoEntities
                  className="grow"
                  {...categories}
                />}
            </div>,
          ]} />}
      <PhotoGridHybridContainer
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
              className,
              aboutTextSafelyParsedHtml,
              aboutTextHasBrParagraphBreaks,
              photosCount: photosCountWithExcludes,
              containerHeight,
            }} />
          </MaskedScroll>
        }
      />
    </div>
  );
}
