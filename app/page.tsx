'use cache';

import { generateOgImageMetaForPhotos } from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { cache } from 'react';
import { getPhotos, getPhotosMeta } from '@/photo/query';
import { GRID_HOMEPAGE_ENABLED, USER_DEFAULT_SORT_OPTIONS } from '@/app/config';
import { getDataForCategories, NULL_CATEGORY_DATA } from '@/category/data';
import PhotoFullPage from '@/photo/PhotoFullPage';
import PhotoGridPage from '@/photo/PhotoGridPage';
import { FEED_META_QUERY_OPTIONS, getFeedQueryOptions } from '@/feed';
import { cacheTagGlobal } from '@/cache';

const getPhotosCached = cache(() => getPhotos(getFeedQueryOptions({
  isGrid: GRID_HOMEPAGE_ENABLED,
})));

export async function generateMetadata(): Promise<Metadata> {
  cacheTagGlobal();
  
  const photos = await getPhotosCached()
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function HomePage() {
  cacheTagGlobal();
  
  const [
    photos,
    photosCount,
    photosCountWithExcludes,
    categories,
  ] = await Promise.all([
    getPhotos()
      .catch(() => []),
    getPhotosMeta(FEED_META_QUERY_OPTIONS)
      .then(({ count }) => count)
      .catch(() => 0),
    getPhotosMeta()
      .then(({ count }) => count)
      .catch(() => 0),
    GRID_HOMEPAGE_ENABLED
      ? getDataForCategories()
      : NULL_CATEGORY_DATA,
  ]);

  return (
    photos.length > 0
      ? GRID_HOMEPAGE_ENABLED
        ? <PhotoGridPage
          {...{
            photos,
            photosCount,
            photosCountWithExcludes,
            ...USER_DEFAULT_SORT_OPTIONS,
            ...categories,
          }}
        />
        : <PhotoFullPage {...{
          photos,
          photosCount,
          ...USER_DEFAULT_SORT_OPTIONS,
        }} />
      : <PhotosEmptyState />
  );
}
