import { generateOgImageMetaForPhotos } from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { cache } from 'react';
import { getPhotos } from '@/photo/query';
import PhotoFullPage from '@/photo/PhotoFullPage';
import { getPhotosMetaCached } from '@/photo/cache';
import { USER_DEFAULT_SORT_OPTIONS } from '@/app/config';
import { FEED_META_QUERY_OPTIONS, feedQueryOptions } from '@/feed';

export const dynamic = 'force-static';
export const maxDuration = 60;

const getPhotosCached = cache(() => getPhotos(feedQueryOptions({
  isGrid: false,
})));

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCached()
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function FullPage() {
  const [
    photos,
    photosCount,
  ] = await Promise.all([
    getPhotosCached()
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
        ...USER_DEFAULT_SORT_OPTIONS,
      }} />
      : <PhotosEmptyState />
  );
}
