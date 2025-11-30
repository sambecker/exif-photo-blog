'use cache';

import { generateOgImageMetaForPhotos } from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { cache } from 'react';
import { getPhotos, getPhotosMeta } from '@/photo/query';
import PhotoFullPage from '@/photo/PhotoFullPage';
import { USER_DEFAULT_SORT_OPTIONS } from '@/app/config';
import { FEED_META_QUERY_OPTIONS, getFeedQueryOptions } from '@/feed';
import { cacheTagGlobal } from '@/cache';

const getPhotosCached = cache(() => getPhotos(getFeedQueryOptions({
  isGrid: false,
})));

export async function generateMetadata(): Promise<Metadata> {
  cacheTagGlobal();

  const photos = await getPhotosCached()
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function FullPage() {
  cacheTagGlobal();

  const [
    photos,
    photosCount,
  ] = await Promise.all([
    getPhotosCached()
      .catch(() => []),
    getPhotosMeta(FEED_META_QUERY_OPTIONS)
      .then(({ count }) => count)
      .catch(() => 0),
  ]);

  return (
    photos.length > 0
      ? <PhotoFullPage {...{
        photos,
        photosCount,
        ...USER_DEFAULT_SORT_OPTIONS,
      }} />
      : <PhotosEmptyState />
  );
}
