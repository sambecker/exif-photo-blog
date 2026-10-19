import { generateOgImageMetaForPhotos } from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { getPhotos } from '@/photo/query';
import { cache } from 'react';
import PhotoGridFeedPage from '@/photo/PhotoGridFeedPage';
import { getPhotosMetaCached } from '@/photo/cache';
import { SortProps } from '@/photo/sort';
import { getSortOptionsFromParams } from '@/photo/sort/path';
import { FEED_META_QUERY_OPTIONS, feedQueryOptions } from '@/feed';
import { PhotoQueryOptions } from '@/db';

export const maxDuration = 60;

const getPhotosCached = cache((options: PhotoQueryOptions) =>
  getPhotos(feedQueryOptions({
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
  ] = await Promise.all([
    getPhotosCached(sortOptions)
      .catch(() => []),
    getPhotosMetaCached(FEED_META_QUERY_OPTIONS)
      .then(({ count }) => count)
      .catch(() => 0),
  ]);

  return (
    photos.length > 0
      ? <PhotoGridFeedPage
        {...{
          photos,
          photosCount,
          ...sortOptions,
        }}
      />
      : <PhotosEmptyState />
  );
}
