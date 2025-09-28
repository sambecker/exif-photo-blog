import { generateOgImageMetaForPhotos } from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { cache } from 'react';
import { GRID_HOMEPAGE_ENABLED, USER_DEFAULT_SORT_OPTIONS } from '@/app/config';
import { NULL_CATEGORY_DATA } from '@/category/data';
import PhotoFullPage from '@/photo/PhotoFullPage';
import PhotoGridPage from '@/photo/PhotoGridPage';
import { getDataForCategoriesCached } from '@/category/cache';
import {
  getPhotosCachedLight, getPhotosMetaCached,
  getPhotosCached,
} from '@/photo/cache';
import { FEED_META_QUERY_OPTIONS, getFeedQueryOptions } from '@/feed';
  
export const dynamic = 'force-static';
export const maxDuration = 60;
  
const getPhotosLightCached = cache(() =>
  getPhotosCachedLight(getFeedQueryOptions({ isGrid: true }))
);

const getPhotosFullCached = cache(() =>
  getPhotosCached(getFeedQueryOptions({ isGrid: false }))
);

export async function generateMetadata(): Promise<Metadata> {
  const photos = GRID_HOMEPAGE_ENABLED 
    ? await getPhotosLightCached().catch(() => [])
    : await getPhotosFullCached().catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function HomePage() {  
  const [
    photosLight,
    photosFull,
    photosCount,
    photosCountWithExcludes,
    categories,
  ] = await Promise.all([
    GRID_HOMEPAGE_ENABLED ? getPhotosLightCached().catch(() => [])
      : Promise.resolve([]),
    !GRID_HOMEPAGE_ENABLED ? getPhotosFullCached().catch(() => [])
      : Promise.resolve([]),
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

  const photos = GRID_HOMEPAGE_ENABLED ? photosLight : photosFull;

  return (
    photos.length > 0
      ? GRID_HOMEPAGE_ENABLED
        ? <PhotoGridPage
          {...{
            photos: photosLight,
            photosCount,
            photosCountWithExcludes,
            ...USER_DEFAULT_SORT_OPTIONS,
            ...categories,
          }}
        />
        : <PhotoFullPage {...{
          photos: photosFull,
          photosCount,
          ...USER_DEFAULT_SORT_OPTIONS,
        }} />
      : <PhotosEmptyState />
  );
}
