import { generateOgImageMetaForPhotos } from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { getPhotos } from '@/photo/db/query';
import { cache } from 'react';
import PhotoGridPage from '@/photo/PhotoGridPage';
import { getDataForCategoriesCached } from '@/category/cache';
import { getPhotosMetaCached } from '@/photo/cache';
import { SortProps } from '@/photo/db/sort';
import { getSortOptionsFromParams } from '@/photo/db/sort-path';
import { FEED_META_QUERY_OPTIONS, getFeedQueryOptions } from '@/feed';
import { PhotoQueryOptions } from '@/photo/db';

export const maxDuration = 60;

const getPhotosCached = cache((options: PhotoQueryOptions) =>
  getPhotos(getFeedQueryOptions({
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
    categories,
  ] = await Promise.all([
    getPhotosCached(sortOptions)
      .catch(() => []),
    getPhotosMetaCached(FEED_META_QUERY_OPTIONS)
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
          ...sortOptions,
          ...categories,
        }}
      />
      : <PhotosEmptyState />
  );
}
