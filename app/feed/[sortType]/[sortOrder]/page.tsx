import {
  INFINITE_SCROLL_FEED_INITIAL,
  generateOgImageMetaForPhotos,
} from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { cache } from 'react';
import { getPhotos } from '@/photo/db/query';
import PhotoFeedPage from '@/photo/PhotoFeedPage';
import { getPhotosMetaCached } from '@/photo/cache';
import { SortBy, SortProps } from '@/photo/db/sort';
import { getSortByFromParams } from '@/photo/db/sort-path';

export const maxDuration = 60;

const getPhotosCached = cache((sortBy: SortBy) => getPhotos({
  sortBy,
  limit: INFINITE_SCROLL_FEED_INITIAL,
}));

export async function generateMetadata({
  params,
}: SortProps): Promise<Metadata> {
  const sortBy = await getSortByFromParams(params);
  const photos = await getPhotosCached(sortBy)
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function FeedPageSort({ params }: SortProps) {
  const sortBy = await getSortByFromParams(params);
  const [
    photos,
    photosCount,
  ] = await Promise.all([
    getPhotosCached(sortBy)
      .catch(() => []),
    getPhotosMetaCached()
      .then(({ count }) => count)
      .catch(() => 0),
  ]);

  return (
    photos.length > 0
      ? <PhotoFeedPage {...{ photos, photosCount, sortBy }} />
      : <PhotosEmptyState />
  );
}
