'use client';

import { Tags } from '@/tag';
import { Photo } from '.';
import { Cameras } from '@/camera';
import { FilmSimulations } from '@/simulation';
import { PATH_GRID_INFERRED } from '@/app/paths';
import PhotoGridSidebar from './PhotoGridSidebar';
import PhotoGridContainer from './PhotoGridContainer';
import { useEffect } from 'react';
import { useAppState } from '@/state/AppState';
import clsx from 'clsx/lite';

export default function PhotoGridPage({
  photos,
  photosCount,
  tags,
  cameras,
  simulations,
}: {
  photos: Photo[]
  photosCount: number
  tags: Tags
  cameras: Cameras
  simulations: FilmSimulations
}) {
  const { setSelectedPhotoIds } = useAppState();

  useEffect(
    () => () => setSelectedPhotoIds?.(undefined),
    [setSelectedPhotoIds],
  );

  const renderGuard = (side: 'top' | 'bottom') =>
    <div
      className={clsx(
        'absolute left-0 right-0',
        side === 'top'
          ? 'top-0 bg-linear-to-b from-white dark:from-black'
          : 'bottom-0 bg-linear-to-t from-white dark:from-black',
        'h-6 z-10 pointer-events-none',
      )}
    />;

  return (
    <PhotoGridContainer
      cacheKey={`page-${PATH_GRID_INFERRED}`}
      photos={photos}
      count={photosCount}
      sidebar={
        <div
          className={clsx(
            'sticky top-0 -mb-5 -mt-5',
            'max-h-screen h-full',
          )}
        >
          {renderGuard('top')}
          <div className={clsx(
            'max-h-full overflow-y-auto [scrollbar-width:none]',
            'py-4',
          )}>
            <PhotoGridSidebar {...{
              tags,
              cameras,
              simulations,
              photosCount,
            }}
            />
          </div>
          {renderGuard('bottom')}
        </div>
      }
      canSelect
    />
  );
}
