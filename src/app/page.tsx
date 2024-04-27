import { getPhotosCachedCached, getPhotosCountCached } from '@/photo/cache';
import {
  INFINITE_SCROLL_INITIAL_HOME,
  INFINITE_SCROLL_MULTIPLE_HOME,
  generateOgImageMetaForPhotos,
} from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { MAX_PHOTOS_TO_SHOW_OG } from '@/image-response';
import InfinitePhotoScroll from '../photo/InfinitePhotoScroll';
import PhotosLarge from '@/photo/PhotosLarge';

export const revalidate = 1;

export async function generateMetadata(): Promise<Metadata> {
  // Make homepage queries resilient to error on first time setup
  const photos = await getPhotosCachedCached({
    limit: MAX_PHOTOS_TO_SHOW_OG,
  })
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function HomePage() {
  // Make homepage queries resilient to error on first time setup
  const [
    photos,
    photosCount,
  ] = await Promise.all([
    getPhotosCachedCached({ 
      limit: INFINITE_SCROLL_INITIAL_HOME,
    })
      .catch(() => []),
    getPhotosCountCached()
      .catch(() => 0),
  ]);

  return (
    photos.length > 0
      ? <div className="space-y-1">
        <PhotosLarge {...{ photos }} />
        {photosCount > photos.length &&
          <InfinitePhotoScroll
            type="full-frame"
            initialOffset={INFINITE_SCROLL_INITIAL_HOME}
            itemsPerPage={INFINITE_SCROLL_MULTIPLE_HOME}
          />}
      </div>
      : <PhotosEmptyState />
  );
}
