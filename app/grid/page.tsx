import { generateOgImageMetaForPhotos } from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { getPhotos } from '@/photo/query';
import { cache } from 'react';
import PhotoGridPage from '@/photo/PhotoGridPage';
import PhotoGridHybridContainer from '@/photo/PhotoGridHybridContainer';
import { getDataForCategoriesCached } from '@/category/cache';
import { getPhotosMetaCached } from '@/photo/cache';
import {
  EXPRESSIVE_LAYOUT_ENABLED,
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
    photosCountWithExcludes,
    categories,
  ] = await Promise.all([
    getPhotosCached()
      .catch(() => []),
    getPhotosMetaCached(FEED_META_QUERY_OPTIONS)
      .then(({ count }) => count)
      .catch(() => 0),
    getPhotosMetaCached()
      .then(({ count }) => count)
      .catch(() => 0),
    getDataForCategoriesCached(),
  ]);

  if (photos.length === 0) {
    return <PhotosEmptyState />;
  }

  // Classic layout: grid + sidebar (matches main)
  if (!EXPRESSIVE_LAYOUT_ENABLED) {
    return (
      <PhotoGridPage
        {...{
          photos,
          photosCount,
          photosCountWithExcludes,
          ...USER_DEFAULT_SORT_OPTIONS,
          ...categories,
        }}
      />
    );
  }

  // Expressive: wide matted feed without sidebar
  return (
    <PhotoGridHybridContainer
      cacheKey={`page-${PATH_GRID}`}
      photos={photos}
      count={photosCount}
      excludeFromFeeds
      prioritizeInitialPhotos
      matted={!MASONRY_GRID_ENABLED}
      {...USER_DEFAULT_SORT_OPTIONS}
    />
  );
}
