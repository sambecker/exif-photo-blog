'use client';

import { Photo } from '.';
import { PATH_GRID_INFERRED } from '@/app/path';
import PhotoGridSidebar from './PhotoGridSidebar';
import PhotoGridContainer from './PhotoGridContainer';
import { ComponentProps, useMemo, useRef } from 'react';
import clsx from 'clsx/lite';
import MaskedScroll from '@/components/MaskedScroll';
import { IS_RECENTS_FIRST } from '@/app/config';
import { SortBy } from './sort';
import useViewportHeight from '@/utility/useViewportHeight';
import PhotoAlbum from '@/album/PhotoAlbum';
import PhotoYear from '@/year/PhotoYear';
import PhotoTag from '@/tag/PhotoTag';
import PhotoFavs from '@/tag/PhotoFavs';
import PhotoCamera from '@/camera/PhotoCamera';

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

  return (
    <div>
      <div className={clsx(
        'flex items-center gap-x-2',
        'md:hidden',
        'mb-5',
      )}>
        <MaskedScroll
          className="grow"
          direction="horizontal"
          fadeSize={50}
        >
          <div className={clsx(
            'whitespace-nowrap space-x-2',
            // Tighten badge lockups
            '*:*:*:*:gap-1',
          )}>
            <PhotoFavs badged badgeIconFirst />
            <PhotoAlbum album={categories.albums[0].album} badged />
            <PhotoYear year={categories.years[0].year} badged />
            <PhotoTag tag={categories.tags[2].tag} badged />
            <PhotoCamera camera={categories.cameras[0].camera} badged />
          </div>
        </MaskedScroll>
        <div className={clsx(
          'rounded-full bg-medium',
          'px-3 pt-[1px] pb-[3px]',
          'text-sm',
        )}>
          More
        </div>
      </div>
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
