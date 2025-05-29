'use client';

import { useCallback, useEffect, useState } from 'react';
import { Photo } from '@/photo';
import PhotoOGTile from './PhotoOGTile';
import { OGLoadingState } from '@/components/OGTile';

const DEFAULT_MAX_CONCURRENCY = 3;

type PhotoLoadingState = Record<string, OGLoadingState>;

export default function StaggeredOgPhotos({
  photos,
  maxConcurrency = DEFAULT_MAX_CONCURRENCY,
  onLastPhotoVisible,
}: {
  photos: Photo[]
  maxConcurrency?: number
  onLastPhotoVisible?: () => void
}) {
  const [loadingState, setLoadingState] = useState(
    photos.reduce((acc, photo) => ({
      ...acc,
      [photo.id]: 'unloaded' as const,
    }), {} as PhotoLoadingState),
  );

  const recomputeLoadingState = useCallback((
    updatedState: PhotoLoadingState = {},
  ) => setLoadingState(currentLoadingState => {
    const initialLoadingState = {
      ...currentLoadingState,
      ...updatedState,
    };
    const updatedLoadingState = {
      ...currentLoadingState,
      ...updatedState,
    };

    let imagesLoadingCount = 0;
    Object.entries(initialLoadingState).forEach(([id, state]) => {
      if (state === 'loading') {
        imagesLoadingCount++;
      } else if (imagesLoadingCount < maxConcurrency && state === 'unloaded') {
        updatedLoadingState[id] = 'loading';
        imagesLoadingCount++;
      }
    });
    
    return updatedLoadingState;
  })
  , [maxConcurrency]);

  useEffect(() => {
    recomputeLoadingState();
  }, [recomputeLoadingState]);

  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo, index) =>
        <PhotoOGTile
          key={photo.id}
          photo={photo}
          loadingState={loadingState[photo.id]}
          onLoad={() => recomputeLoadingState({ [photo.id]: 'loaded' })}
          onFail={() => recomputeLoadingState({ [photo.id]: 'failed' })}
          onVisible={index === photos.length - 1
            ? onLastPhotoVisible
            : undefined}
          riseOnHover
        />)}
    </div>
  );
};
