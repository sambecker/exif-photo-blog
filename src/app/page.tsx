import { getPhotosCached, getPhotosCountCached } from '@/cache';
import {
  PHOTO_LOAD_MULTIPLE_ROOT,
  generateOgImageMetaForPhotos,
} from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { MAX_PHOTOS_TO_SHOW_OG } from '@/photo/image-response';
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
    getPhotosCached({ limit: PHOTO_LOAD_MULTIPLE_ROOT }).catch(() => []),
    getPhotosCountCached().catch(() => 0),
  ]);

  return (
    photos.length > 0
      ? <div className="space-y-1">
        <PhotosLarge photos={photos} />
        <Suspense>
          <MorePhotosRoot
            initialOffset={PHOTO_LOAD_MULTIPLE_ROOT}
            itemsPerRequest={PHOTO_LOAD_MULTIPLE_ROOT}
            totalPhotosCount={count}
          />
        </Suspense>
      </div>
      : <PhotosEmptyState />
  );
}
