import { generateOgImageMetaForPhotos } from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { cache } from 'react';
import { getPhotos } from '@/photo/query';
import { GRID_HOMEPAGE_ENABLED, USER_DEFAULT_SORT_OPTIONS } from '@/app/config';
import { NULL_CATEGORY_DATA } from '@/category/data';
import PhotoFullPage from '@/photo/PhotoFullPage';
import PhotoGridPage from '@/photo/PhotoGridPage';
import { getDataForCategoriesCached } from '@/category/cache';
import { getPhotosMetaCached } from '@/photo/cache';
import { FEED_META_QUERY_OPTIONS, feedQueryOptions } from '@/feed';

export const dynamic = 'force-static';
export const maxDuration = 60;

const getPhotosCached = cache(() => getPhotos(feedQueryOptions({
  isGrid: GRID_HOMEPAGE_ENABLED,
})));

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCached()
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function HomePage() {
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
    GRID_HOMEPAGE_ENABLED
      ? getDataForCategoriesCached()
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
