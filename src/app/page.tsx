import {
  INFINITE_SCROLL_LARGE_PHOTO_INITIAL,
  INFINITE_SCROLL_LARGE_PHOTO_MULTIPLE,
  generateOgImageMetaForPhotos,
} from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import PhotosLarge from '@/photo/PhotosLarge';
import { cache } from 'react';
import { getPhotos, getPhotosMeta } from '@/photo/db/query';
import PhotosLargeInfinite from '@/photo/PhotosLargeInfinite';

export const dynamic = 'force-static';

const getPhotosCached = cache(() => getPhotos({
  limit: INFINITE_SCROLL_LARGE_PHOTO_INITIAL,
}));

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCached()
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function HomePage() {
  const [
    photos,
    photosCount,
  ] = await Promise.all([
    getPhotosCached()
      .catch(() => []),
    getPhotosMeta()
      .then(({ count }) => count)
      .catch(() => 0),
  ]);

  return (
    photos.length > 0
      ? <div className="space-y-1">
        <PhotosLarge {...{ photos }} />
        {photosCount > photos.length &&
          <PhotosLargeInfinite
            initialOffset={INFINITE_SCROLL_LARGE_PHOTO_INITIAL}
            itemsPerPage={INFINITE_SCROLL_LARGE_PHOTO_MULTIPLE}
          />}
      </div>
      : <PhotosEmptyState />
  );
}
