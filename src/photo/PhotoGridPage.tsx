'use client';

import { Tags } from '@/tag';
import { Photo } from '.';
import { Cameras } from '@/camera';
import { FilmSimulations } from '@/simulation';
import { PATH_GRID } from '@/site/paths';
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
}:{
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

  return (
    <PhotoGridContainer
      cacheKey={`page-${PATH_GRID}`}
      photos={photos}
      count={photosCount}
      sidebar={
        <div className={clsx(
          'sticky top-0 -mt-5',
          'max-h-screen overflow-y-auto py-4',
          '[scrollbar-width:none]',
        )}>
          <PhotoGridSidebar {...{
            tags,
            cameras,
            simulations,
            photosCount,
          }} />
        </div>}
      canSelect
    />
  );
}
