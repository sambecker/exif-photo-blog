import { generateOgImageMetaForPhotos } from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { cache } from 'react';
import { getPhotos } from '@/photo/db/query';
import PhotoFullPage from '@/photo/PhotoFullPage';
import { getPhotosMetaCached } from '@/photo/cache';
import { SortProps } from '@/photo/db/sort';
import { getSortOptionsFromParams } from '@/photo/db/sort-path';
import { PhotoQueryOptions } from '@/photo/db';
import { FEED_META_QUERY_OPTIONS, getFeedQueryOptions } from '@/feed';

export const maxDuration = 60;

const getPhotosCached = cache((options: PhotoQueryOptions) =>
  getPhotos(getFeedQueryOptions({
    isGrid: false,
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

export default async function FullPageSort({ params }: SortProps) {
  const sortOptions = await getSortOptionsFromParams(params);
  const [
    photos,
    photosCount,
  ] = await Promise.all([
    getPhotosCached(sortOptions)
      .catch(() => []),
    getPhotosMetaCached(FEED_META_QUERY_OPTIONS)
      .then(({ count }) => count)
      .catch(() => 0),
  ]);

  return (
    photos.length > 0
      ? <PhotoFullPage {...{
        photos,
        photosCount,
        ...sortOptions,
      }} />
      : <PhotosEmptyState />
  );
}
