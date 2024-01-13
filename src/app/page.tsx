import { getPhotosCached } from '@/cache';
import { generateOgImageMetaForPhotos } from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next';
import { MAX_PHOTOS_TO_SHOW_OG } from '@/photo/image-response';
import MoreComponents from '@/components/MoreComponents';
import PhotosLarge from '@/photo/PhotosLarge';

export async function generateMetadata(): Promise<Metadata> {
  // Make homepage queries resilient to error on first time setup
  const photos = await getPhotosCached({ limit: MAX_PHOTOS_TO_SHOW_OG })
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function HomePage() {
  // Make homepage queries resilient to error on first time setup
  const photos = await getPhotosCached({ limit: MAX_PHOTOS_TO_SHOW_OG })
    .catch(() => []);

  return (
    photos.length > 0
      ? <div className="space-y-1">
        <PhotosLarge photos={photos} />
        <MoreComponents
          itemsPerRequest={MAX_PHOTOS_TO_SHOW_OG}
          componentLoader={async (limit: number) => {
            'use server';
            return <PhotosLarge
              photos={await getPhotosCached({ limit })}
            />;
          }}
        />
      </div>
      : <PhotosEmptyState />
  );
}
