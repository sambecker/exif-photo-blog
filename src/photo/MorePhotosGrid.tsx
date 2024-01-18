import MoreComponents from '@/components/MoreComponents';
import { getPhotosCached } from '@/cache';
import PhotoGrid from './PhotoGrid';

export function MorePhotosGrid({
  initialOffset,
  itemsPerRequest,
  totalPhotosCount,
}: {
  initialOffset: number
  itemsPerRequest: number
  totalPhotosCount: number
}) {
  return (
    <MoreComponents
      stateKey="PhotosGrid"
      label="More photos"
      initialOffset={initialOffset}
      itemsPerRequest={itemsPerRequest}
      getNextComponent={async (offset, limit) => {
        'use server';
        if (
          process.env.NODE_ENV === 'development' &&
          Math.random() < 0.95
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
            nextComponent: <PhotoGrid photos={nextPhotos} />,
            isFinished: offset + limit >= totalPhotosCount,
          };
        }
      }}
    />
  );
}
