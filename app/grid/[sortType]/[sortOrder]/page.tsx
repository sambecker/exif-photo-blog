import { generateOgImageMetaForPhotos } from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { getPhotos } from '@/photo/query';
import { cache } from 'react';
import PhotoGridPage from '@/photo/PhotoGridPage';
import PhotoGridHybridContainer from '@/photo/PhotoGridHybridContainer';
import { getDataForCategoriesCached } from '@/category/cache';
import { getPhotosMetaCached } from '@/photo/cache';
import { SortProps } from '@/photo/sort';
import { getSortOptionsFromParams } from '@/photo/sort/path';
import { FEED_META_QUERY_OPTIONS, feedQueryOptions } from '@/feed';
import { PhotoQueryOptions } from '@/db';
import { PATH_GRID } from '@/app/path';
import {
  EXPRESSIVE_LAYOUT_ENABLED,
  MASONRY_GRID_ENABLED,
} from '@/app/config';

export const maxDuration = 60;

const getPhotosCached = cache((options: PhotoQueryOptions) =>
  getPhotos(feedQueryOptions({
    isGrid: true,
    ...options,
  })));

export async function generateMetadata({
  params,
}: SortProps): Promise<Metadata> {
  const sortOptions = await getSortOptionsFromParams(params);
  const photos = await getPhotosCached(sortOptions)
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function GridPage({ params }: SortProps) {
  const sortOptions = await getSortOptionsFromParams(params);
  const [
    photos,
    photosCount,
    photosCountWithExcludes,
    categories,
  ] = await Promise.all([
    getPhotosCached(sortOptions)
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
          ...sortOptions,
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
      {...sortOptions}
    />
  );
}
