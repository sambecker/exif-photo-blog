'use client';

import SiteGrid from '@/components/SiteGrid';
import PhotoGrid from './PhotoGrid';
import PhotoGridInfinite from './PhotoGridInfinite';
import { clsx } from 'clsx/lite';
import AnimateItems from '@/components/AnimateItems';
import { ComponentProps, useCallback, useState, ReactNode } from 'react';

export default function PhotoGridContainer({
  cacheKey,
  photos,
  count,
  tag,
  camera,
  simulation,
  focal,
  recipe,
  animateOnFirstLoadOnly,
  header,
  sidebar,
  canSelect,
}: {
  cacheKey: string
  count: number
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
    <SiteGrid
      contentMain={<div className={clsx(
        header && 'space-y-8 mt-1.5',
      )}>
        {header &&
          <AnimateItems
            type="bottom"
            items={[header]}
            animateOnFirstLoadOnly
          />}
        <div className="space-y-0.5 sm:space-y-1">
          <PhotoGrid {...{
            photos,
            tag,
            camera,
            simulation,
            focal,
            recipe,
            animateOnFirstLoadOnly,
            onAnimationComplete,
            canSelect,
          }} />
          {count > photos.length &&
            <PhotoGridInfinite {...{
              cacheKey,
              initialOffset: photos.length,
              canStart: shouldAnimateDynamicItems,
              tag,
              camera,
              simulation,
              focal,
              recipe,
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
