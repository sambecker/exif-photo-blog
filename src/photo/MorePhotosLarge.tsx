import MoreComponents from '@/components/MoreComponents';
import PhotosLarge from './PhotosLarge';
import { getPhotosCached } from '@/cache';

export function MorePhotosLarge({
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
      stateKey="PhotosLarge"
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
            nextComponent: <PhotosLarge photos={nextPhotos} />,
            isFinished: offset + limit >= totalPhotosCount,
          };
        }
      }}
    />
  );
}
