'use client';

import AppGrid from '@/components/AppGrid';
import PhotoGrid from './PhotoGrid';
import PhotoGridInfinite from './PhotoGridInfinite';
import PhotosLarge from './PhotosLarge';
import PhotosLargeInfinite from './PhotosLargeInfinite';
import { clsx } from 'clsx/lite';
import AnimateItems from '@/components/AnimateItems';
import { ComponentProps, useCallback, useState, ReactNode } from 'react';
import { GRID_SPACE_CLASSNAME } from '@/components';
import { SortBy } from './sort';
import { MASONRY_GRID_ENABLED } from '@/app/config';
import { useAppState } from '@/app/AppState';
import {
  INFINITE_SCROLL_FULL_INITIAL,
  INFINITE_SCROLL_FULL_MULTIPLE,
} from '.';

// Shows either grid or full frame with infinite scroll

export default function PhotoGridHybridContainer({
  cacheKey,
  photos,
  count,
  sortBy,
  sortWithPriority,
  excludeFromFeeds,
  animateOnFirstLoadOnly,
  header,
  sidebar,
  className,
  ...categories
}: {
  cacheKey: string
  count: number
  sortBy?: SortBy
  sortWithPriority?: boolean
  excludeFromFeeds?: boolean
  header?: ReactNode
  sidebar?: ReactNode
  className?: string
} & ComponentProps<typeof PhotoGrid>) {
  const { isPhotoSetFull } = useAppState();

  const [
    shouldAnimateDynamicItems,
    setShouldAnimateDynamicItems,
  ] = useState(false);
  const onAnimationComplete = useCallback(() =>
    setShouldAnimateDynamicItems(true), []);

  const renderHeader = header &&
    <AnimateItems
      type="bottom"
      items={[header]}
      animateOnFirstLoadOnly
    />;

  // Full frame only offered on photo sets, which always render a header
  const photosFull = header && isPhotoSetFull
    // Server sends grid-sized batch, so only show full-sized slice
    // and let infinite scroll take over
    ? photos.slice(0, INFINITE_SCROLL_FULL_INITIAL)
    : undefined;

  return photosFull
    ? <div className={className}>
      <AppGrid className="mt-1.5 mb-6" contentMain={renderHeader} />
      <div className="space-y-1">
        <PhotosLarge {...{ photos: photosFull, ...categories }} />
        {count > photosFull.length &&
          <PhotosLargeInfinite {...{
            // Keep grid and full frame caches separate
            cacheKey: `${cacheKey}-full`,
            initialOffset: photosFull.length,
            itemsPerPage: INFINITE_SCROLL_FULL_MULTIPLE,
            sortBy,
            sortWithPriority,
            excludeFromFeeds,
            ...categories,
          }} />}
      </div>
    </div>
    : <AppGrid
      contentMain={<div className={clsx(
        header && 'space-y-8 mt-1.5',
        className,
      )}>
        {renderHeader}
        <div className={GRID_SPACE_CLASSNAME}>
          {(!MASONRY_GRID_ENABLED || count <= photos.length) && (
            <PhotoGrid {...{
              photos,
              ...categories,
              animateOnFirstLoadOnly,
              onAnimationComplete,
            }} />
          )}
          {count > photos.length &&
            <PhotoGridInfinite {...{
              // Keep grid and full frame caches separate
              cacheKey: `${cacheKey}-grid`,
              initialPhotos: MASONRY_GRID_ENABLED ? photos : undefined,
              initialOffset: photos.length,
              sortBy,
              sortWithPriority,
              excludeFromFeeds,
              ...categories,
              canStart: shouldAnimateDynamicItems,
              animateOnFirstLoadOnly,
            }} />}
        </div>
      </div>}
      contentSide={sidebar}
    />;
}
