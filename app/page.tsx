import {
  INFINITE_SCROLL_FEED_INITIAL,
  INFINITE_SCROLL_GRID_INITIAL,
  generateOgImageMetaForPhotos,
} from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { cache } from 'react';
import { getPhotos } from '@/photo/db/query';
import { GRID_HOMEPAGE_ENABLED } from '@/app/config';
import { NULL_CATEGORY_DATA } from '@/category/data';
import PhotoFeedPage from '@/photo/PhotoFeedPage';
import PhotoGridPage from '@/photo/PhotoGridPage';
import { getDataForCategoriesCached } from '@/category/cache';
import { getPhotosMetaCached } from '@/photo/cache';
import { USER_DEFAULT_SORT_OPTIONS } from '@/app/config';
import { GetPhotosOptions } from '@/photo/db';

export const dynamic = 'force-static';
export const maxDuration = 60;

const getPhotosCached = cache((options: GetPhotosOptions) => getPhotos({
  ...options,
  limit: GRID_HOMEPAGE_ENABLED
    ? INFINITE_SCROLL_GRID_INITIAL
    : INFINITE_SCROLL_FEED_INITIAL,
}));

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCached(USER_DEFAULT_SORT_OPTIONS)
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function HomePage() {
  const [
    photos,
    photosCount,
    categories,
  ] = await Promise.all([
    getPhotosCached(USER_DEFAULT_SORT_OPTIONS)
      .catch(() => []),
    getPhotosMetaCached(USER_DEFAULT_SORT_OPTIONS)
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
            ...USER_DEFAULT_SORT_OPTIONS,
            ...categories,
          }}
        />
        : <PhotoFeedPage {...{
          photos,
          photosCount,
          ...USER_DEFAULT_SORT_OPTIONS,
        }} />
      : <PhotosEmptyState />
  );
}
