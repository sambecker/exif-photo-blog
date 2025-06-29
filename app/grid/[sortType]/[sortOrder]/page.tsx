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
import { SortBy, SortProps } from '@/photo/db/sort';
import { getSortByFromParams } from '@/photo/db/sort-path';

export const maxDuration = 60;

const getPhotosCached = cache((sortBy: SortBy) => getPhotos({
  sortBy,
  limit: INFINITE_SCROLL_GRID_INITIAL,
}));

export async function generateMetadata({
  params,
}: SortProps): Promise<Metadata> {
  const sortBy = await getSortByFromParams(params);
  const photos = await getPhotosCached(sortBy)
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function GridPage({ params }: SortProps) {
  const sortBy = await getSortByFromParams(params);
  const [
    photos,
    photosCount,
    categories,
  ] = await Promise.all([
    getPhotosCached(sortBy)
      .catch(() => []),
    getPhotosMetaCached()
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
          sortBy,
          ...categories,
        }}
      />
      : <PhotosEmptyState />
  );
}
