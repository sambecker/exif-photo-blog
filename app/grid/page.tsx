import { generateOgImageMetaForPhotos } from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { getPhotos } from '@/photo/query';
import { cache } from 'react';
import PhotoGridPage from '@/photo/PhotoGridPage';
import { getDataForCategoriesCached } from '@/category/cache';
import { getPhotosMetaCached } from '@/photo/cache';
import { USER_DEFAULT_SORT_OPTIONS } from '@/app/config';
import { FEED_META_QUERY_OPTIONS, feedQueryOptions } from '@/feed';

export const dynamic = 'force-static';
export const maxDuration = 60;

const getPhotosCached = cache(() => getPhotos(feedQueryOptions({
  isGrid: true,
})));

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCached()
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function GridPage() {
  const [
    photos,
    photosCount,
    photosCountWithExcludes,
    categories,
  ] = await Promise.all([
    getPhotosCached()
      .catch(() => []),
    getPhotosMetaCached(FEED_META_QUERY_OPTIONS)
      .then(({ count }) => count)
      .catch(() => 0),
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
          photosCountWithExcludes,
          ...USER_DEFAULT_SORT_OPTIONS,
          ...categories,
        }}
      />
      : <PhotosEmptyState />
  );
}
