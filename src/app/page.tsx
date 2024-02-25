import { getPhotosCached, getPhotosCountCached } from '@/photo/cache';
import {
  INFINITE_SCROLL_MULTIPLE_HOME,
  generateOgImageMetaForPhotos,
} from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { MAX_PHOTOS_TO_SHOW_OG } from '@/image-response';
import PhotosLarge from '@/photo/PhotosLarge';
import { Suspense } from 'react';
import { MorePhotosRoot } from '@/photo/MorePhotosRoot';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  // Make homepage queries resilient to error on first time setup
  const photos = await getPhotosCached({ limit: MAX_PHOTOS_TO_SHOW_OG })
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function HomePage() {
  const [
    photos,
    count,
  ] = await Promise.all([
    // Make homepage queries resilient to error on first time setup
    getPhotosCached({ limit: INFINITE_SCROLL_MULTIPLE_HOME }).catch(() => []),
    getPhotosCountCached().catch(() => 0),
  ]);

  return (
    photos.length > 0
      ? <div className="space-y-1">
        <PhotosLarge photos={photos} />
        <Suspense>
          <MorePhotosRoot
            initialOffset={INFINITE_SCROLL_MULTIPLE_HOME}
            itemsPerRequest={INFINITE_SCROLL_MULTIPLE_HOME}
            totalPhotosCount={count}
          />
        </Suspense>
      </div>
      : <PhotosEmptyState />
  );
}
