import { getPhotosCachedCached } from '@/photo/cache';
import {
  INFINITE_SCROLL_MULTIPLE_HOME,
  generateOgImageMetaForPhotos,
} from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { MAX_PHOTOS_TO_SHOW_OG } from '@/image-response';
import InfinitePhotoScroll from '../photo/InfinitePhotoScroll';

export const dynamic = 'force-static';

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCachedCached({
    limit: MAX_PHOTOS_TO_SHOW_OG,
  })
    // Make homepage queries resilient to error on first time setup
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function HomePage() {
  const photos = await getPhotosCachedCached({ 
    limit: INFINITE_SCROLL_MULTIPLE_HOME,
  })
    // Make homepage queries resilient to error on first time setup
    .catch(() => []);

  return (
    photos.length > 0
      ? <div className="space-y-1">
        <InfinitePhotoScroll
          initialPhotos={photos}
          itemsPerPage={INFINITE_SCROLL_MULTIPLE_HOME}
        />
      </div>
      : <PhotosEmptyState />
  );
}
