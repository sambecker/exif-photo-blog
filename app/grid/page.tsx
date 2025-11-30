'use cache';

import { generateOgImageMetaForPhotos } from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { getPhotos, getPhotosMeta } from '@/photo/query';
import { cache } from 'react';
import PhotoGridPage from '@/photo/PhotoGridPage';
import { USER_DEFAULT_SORT_OPTIONS } from '@/app/config';
import { FEED_META_QUERY_OPTIONS, getFeedQueryOptions } from '@/feed';
import { cacheTagGlobal } from '@/cache';
import { getDataForCategories } from '@/category/data';

const getPhotosCached = cache(() => getPhotos(getFeedQueryOptions({
  isGrid: true,
})));

export async function generateMetadata(): Promise<Metadata> {
  cacheTagGlobal();

  const photos = await getPhotosCached()
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function GridPage() {
  cacheTagGlobal();

  const [
    photos,
    photosCount,
    photosCountWithExcludes,
    categories,
  ] = await Promise.all([
    getPhotosCached()
      .catch(() => []),
    getPhotosMeta(FEED_META_QUERY_OPTIONS)
      .then(({ count }) => count)
      .catch(() => 0),
    getPhotosMeta()
      .then(({ count }) => count)
      .catch(() => 0),
    getDataForCategories(),
  ]);

  return (
    photos.length > 0
      ? <PhotoGridPage
        {...{
          photos,
          photosCount,
          photosCountWithExcludes,
          ...USER_DEFAULT_SORT_OPTIONS,
          ...categories,
        }}
      />
      : <PhotosEmptyState />
  );
}
