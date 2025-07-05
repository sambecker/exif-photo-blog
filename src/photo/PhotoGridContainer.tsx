'use client';

import AppGrid from '@/components/AppGrid';
import PhotoGrid from './PhotoGrid';
import PhotoGridInfinite from './PhotoGridInfinite';
import { clsx } from 'clsx/lite';
import AnimateItems from '@/components/AnimateItems';
import { ComponentProps, useCallback, useState, ReactNode } from 'react';
import { GRID_SPACE_CLASSNAME } from '@/components';
import { SortBy } from './db/sort';

export default function PhotoGridContainer({
  cacheKey,
  photos,
  count,
  sortBy,
  sortWithPriority,
  excludeFromFeeds,
  animateOnFirstLoadOnly,
  header,
  sidebar,
  canSelect,
  ...categories
}: {
  cacheKey: string
  count: number
  sortBy?: SortBy
  sortWithPriority?: boolean
  excludeFromFeeds?: boolean
  header?: ReactNode
  sidebar?: ReactNode
} & ComponentProps<typeof PhotoGrid>) {
  const [
    shouldAnimateDynamicItems,
    setShouldAnimateDynamicItems,
  ] = useState(false);

  const onAnimationComplete = useCallback(() =>
    setShouldAnimateDynamicItems(true), []);

  return (
    <AppGrid
      contentMain={<div className={clsx(
        header && 'space-y-8 mt-1.5',
      )}>
        {header &&
          <AnimateItems
            type="bottom"
            items={[header]}
            animateOnFirstLoadOnly
          />}
        <div className={GRID_SPACE_CLASSNAME}>
          <PhotoGrid {...{
            photos,
            ...categories,
            animateOnFirstLoadOnly,
            onAnimationComplete,
            canSelect,
          }} />
          {count > photos.length &&
            <PhotoGridInfinite {...{
              cacheKey,
              initialOffset: photos.length,
              sortBy,
              sortWithPriority,
              excludeFromFeeds,
              ...categories,
              canStart: shouldAnimateDynamicItems,
              animateOnFirstLoadOnly,
              canSelect,
            }} />}
        </div>
      </div>}
      contentSide={sidebar}
      sideHiddenOnMobile
    />
  );
}
