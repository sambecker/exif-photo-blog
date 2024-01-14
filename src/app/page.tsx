import { LARGE_PHOTOS_TO_SHOW, generateOgImageMetaForPhotos } from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { MAX_PHOTOS_TO_SHOW_OG } from '@/photo/image-response';
import MoreComponents from '@/components/MoreComponents';
import PhotosLarge from '@/photo/PhotosLarge';
import { Suspense } from 'react';
import { getPhotos, getPhotosCount } from '@/services/vercel-postgres';

export const revalidate = 30;

export async function generateMetadata(): Promise<Metadata> {
  // Make homepage queries resilient to error on first time setup
  const photos = await getPhotos({ limit: MAX_PHOTOS_TO_SHOW_OG })
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function HomePage() {
  const [
    photos,
    count,
  ] = await Promise.all([
    // Make homepage queries resilient to error on first time setup
    getPhotos({ limit: LARGE_PHOTOS_TO_SHOW }).catch(() => []),
    getPhotosCount().catch(() => 0),
  ]);

  return (
    photos.length > 0
      ? <div className="space-y-1">
        <PhotosLarge photos={photos} />
        <Suspense>
          <MoreComponents
            label="More photos"
            itemsPerRequest={LARGE_PHOTOS_TO_SHOW}
            itemsTotalCount={count}
            componentLoader={async (limit: number) => {
              'use server';
              return <PhotosLarge
                photos={(await getPhotos({ limit }))
                  .slice(LARGE_PHOTOS_TO_SHOW)}
              />;
            }}
          />
        </Suspense>
      </div>
      : <PhotosEmptyState />
  );
}
