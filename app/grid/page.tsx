import { generateOgImageMetaForPhotos } from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { getPhotos } from '@/photo/query';
import { cache } from 'react';
import PhotoGridHybridContainer from '@/photo/PhotoGridHybridContainer';
import { getPhotosMetaCached } from '@/photo/cache';
import {
  MASONRY_GRID_ENABLED,
  USER_DEFAULT_SORT_OPTIONS,
} from '@/app/config';
import { FEED_META_QUERY_OPTIONS, feedQueryOptions } from '@/feed';
import { PATH_GRID } from '@/app/path';

export const dynamic = 'force-static';
export const maxDuration = 60;

const getPhotosCached = cache(() => getPhotos(feedQueryOptions({
  isGrid: true,
})));

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCached()
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function GridPage() {
  const [
    photos,
    photosCount,
  ] = await Promise.all([
    getPhotosCached()
      .catch(() => []),
    getPhotosMetaCached(FEED_META_QUERY_OPTIONS)
      .then(({ count }) => count)
      .catch(() => 0),
  ]);

  return (
    photos.length > 0
      ? <PhotoGridHybridContainer
        cacheKey={`page-${PATH_GRID}`}
        photos={photos}
        count={photosCount}
        excludeFromFeeds
        prioritizeInitialPhotos
        matted={!MASONRY_GRID_ENABLED}
        {...USER_DEFAULT_SORT_OPTIONS}
      />
      : <PhotosEmptyState />
  );
}
