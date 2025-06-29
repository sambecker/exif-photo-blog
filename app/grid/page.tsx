import {
  INFINITE_SCROLL_GRID_INITIAL,
  generateOgImageMetaForPhotos,
} from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { getPhotos } from '@/photo/db/query';
import { cache } from 'react';
import PhotoGridPage from '@/photo/PhotoGridPage';
import { getDataForCategoriesCached } from '@/category/cache';
import { getPhotosMetaCached } from '@/photo/cache';
import { USER_DEFAULT_SORT_OPTIONS } from '@/app/config';
import { GetPhotosOptions } from '@/photo/db';

export const dynamic = 'force-static';
export const maxDuration = 60;

const getPhotosCached = cache((options: GetPhotosOptions) => getPhotos({
  ...options,
  limit: INFINITE_SCROLL_GRID_INITIAL,
}));

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCached(USER_DEFAULT_SORT_OPTIONS)
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function GridPage() {
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
    getDataForCategoriesCached(),
  ]);

  return (
    photos.length > 0
      ? <PhotoGridPage
        {...{
          photos,
          photosCount,
          ...USER_DEFAULT_SORT_OPTIONS,
          ...categories,
        }}
      />
      : <PhotosEmptyState />
  );
}
