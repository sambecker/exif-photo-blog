import { generateOgImageMetaForPhotos } from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { cache } from 'react';
import { getPhotos } from '@/photo/query';
import PhotoFloatingPage from '@/photo/PhotoFloatingPage';
import { getPhotosMetaCached } from '@/photo/cache';
import { SortProps } from '@/photo/sort';
import { getSortOptionsFromParams } from '@/photo/sort/path';
import { PhotoQueryOptions } from '@/db';
import { FEED_META_QUERY_OPTIONS, feedQueryOptions } from '@/feed';

export const maxDuration = 60;

const getPhotosCached = cache((options: PhotoQueryOptions) =>
  getPhotos(feedQueryOptions({
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

export default async function FloatingPageSort({ params }: SortProps) {
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
      ? <PhotoFloatingPage {...{
        photos,
        photosCount,
        ...sortOptions,
      }} />
      : <PhotosEmptyState />
  );
}
