import {
  INFINITE_SCROLL_INITIAL_HOME,
  INFINITE_SCROLL_MULTIPLE_HOME,
  generateOgImageMetaForPhotos,
} from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { MAX_PHOTOS_TO_SHOW_OG } from '@/image-response';
import PhotosLarge from '@/photo/PhotosLarge';
import { cache } from 'react';
import { getPhotos, getPhotosCount } from '@/photo/db';
import PhotosLargeInfinite from '@/photo/PhotosLargeInfinite';

export const dynamic = 'force-static';

const getPhotosCached = cache(getPhotos);

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCached({
    limit: MAX_PHOTOS_TO_SHOW_OG,
  })
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function HomePage() {
  const [
    photos,
    photosCount,
  ] = await Promise.all([
    getPhotosCached({ 
      limit: INFINITE_SCROLL_INITIAL_HOME,
    })
      .catch(() => []),
    getPhotosCount()
      .catch(() => 0),
  ]);

  return (
    photos.length > 0
      ? <div className="space-y-1">
        <PhotosLarge {...{ photos }} />
        {photosCount > photos.length &&
          <PhotosLargeInfinite
            initialOffset={INFINITE_SCROLL_INITIAL_HOME}
            itemsPerPage={INFINITE_SCROLL_MULTIPLE_HOME}
          />}
      </div>
      : <PhotosEmptyState />
  );
}
