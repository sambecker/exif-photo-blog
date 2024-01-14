import { getPhotosCached, getPhotosCountCached } from '@/cache';
import { LARGE_PHOTOS_TO_SHOW, generateOgImageMetaForPhotos } from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { MAX_PHOTOS_TO_SHOW_OG } from '@/photo/image-response';
import MoreComponents from '@/components/MoreComponents';
import PhotosLarge from '@/photo/PhotosLarge';
import { Suspense } from 'react';

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
    getPhotosCached({ limit: LARGE_PHOTOS_TO_SHOW }).catch(() => []),
    getPhotosCountCached().catch(() => 0),
  ]);

  return (
    photos.length > 0
      ? <div className="space-y-1">
        <PhotosLarge photos={photos} />
        <Suspense>
          <MoreComponents
            label="More photos"
            itemsPerRequest={LARGE_PHOTOS_TO_SHOW}
            componentLoader={async (limit: number) => {
              'use server';
              return {
                component: <PhotosLarge
                  photos={(await getPhotosCached({ limit }))
                    .slice(LARGE_PHOTOS_TO_SHOW)} />,
                isFinished: limit > count,
              };
            }}
          />
        </Suspense>
      </div>
      : <PhotosEmptyState />
  );
}
