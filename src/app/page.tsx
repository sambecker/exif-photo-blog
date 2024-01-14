import { getPhotosCached, getPhotosCountCached } from '@/cache';
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
  const [
    photos,
    count,
  ] = await Promise.all([
    // Make homepage queries resilient to error on first time setup
    getPhotosCached({ limit: MAX_PHOTOS_TO_SHOW_OG }).catch(() => []),
    getPhotosCountCached().catch(() => 0),
  ]);

  return (
    photos.length > 0
      ? <div className="space-y-1">
        <PhotosLarge photos={photos} />
        <MoreComponents
          label="More photos"
          itemsPerRequest={MAX_PHOTOS_TO_SHOW_OG}
          itemsTotalCount={count}
          componentLoader={async (limit: number) => {
            'use server';
            return <PhotosLarge
              photos={(await getPhotosCached({ limit }))
                .slice(MAX_PHOTOS_TO_SHOW_OG)}
            />;
          }}
        />
      </div>
      : <PhotosEmptyState />
  );
}
