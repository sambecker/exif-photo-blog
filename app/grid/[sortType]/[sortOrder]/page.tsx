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
import { SortProps } from '@/photo/db/sort';
import { getSortOptionsFromParams } from '@/photo/db/sort-path';
import { GetPhotosOptions } from '@/photo/db';

export const maxDuration = 60;

const getPhotosCached = cache((options: GetPhotosOptions) => getPhotos({
  ...options,
  limit: INFINITE_SCROLL_GRID_INITIAL,
}));

export async function generateMetadata({
  params,
}: SortProps): Promise<Metadata> {
  const options = await getSortOptionsFromParams(params);
  const photos = await getPhotosCached(options)
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function GridPage({ params }: SortProps) {
  const options = await getSortOptionsFromParams(params);
  const [
    photos,
    photosCount,
    categories,
  ] = await Promise.all([
    getPhotosCached(options)
      .catch(() => []),
    getPhotosMetaCached(options)
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
          ...options,
          ...categories,
        }}
      />
      : <PhotosEmptyState />
  );
}
