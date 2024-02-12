import MoreComponents from '@/components/MoreComponents';
import { getPhotosCached } from '@/photo/cache';
import PhotoGrid from './PhotoGrid';
import { useCallback } from 'react';

export function MorePhotosGrid({
  initialOffset,
  itemsPerRequest,
  totalPhotosCount,
}: {
  initialOffset: number
  itemsPerRequest: number
  totalPhotosCount: number
}) {
  const getNextComponent = useCallback(async (
    offset: number,
    limit: number,
  ) => {
    'use server';
    if (
      process.env.NODE_ENV === 'development' &&
      Math.random() < 0.5
    ) {
      return { didFail: true };
    }
    const photos = await getPhotosCached({ limit: offset + limit })
      .catch(() => undefined);
    if (!photos) {
      return { didFail: true };
    } else {
      const nextPhotos = photos.slice(offset);
      return {
        ...nextPhotos.length > 0 && {
          nextComponent: <PhotoGrid photos={nextPhotos} />,
        },
        isFinished: offset + limit >= totalPhotosCount,
      };
    }
  }, [totalPhotosCount]);
  return (
    <MoreComponents
      stateKey="PhotosGrid"
      label="More photos"
      itemsClass='space-y-0.5 sm:space-y-1'
      initialOffset={initialOffset}
      itemsPerRequest={itemsPerRequest}
      getNextComponent={getNextComponent}
    />
  );
}
