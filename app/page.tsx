import {
  INFINITE_SCROLL_FEED_INITIAL,
  INFINITE_SCROLL_GRID_INITIAL,
  generateOgImageMetaForPhotos,
} from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { cache } from 'react';
import { getPhotos, getPhotosMeta } from '@/photo/db/query';
import { GRID_HOMEPAGE_ENABLED } from '@/app/config';
import { getDataForCategories } from '@/category/data';
import PhotoGridPage from '@/photo/PhotoGridPage';
import PhotoFeedPage from '@/photo/PhotoFeedPage';

export const dynamic = 'force-static';
export const maxDuration = 60;

const getPhotosCached = cache(() => getPhotos({
  limit: GRID_HOMEPAGE_ENABLED
    ? INFINITE_SCROLL_GRID_INITIAL
    : INFINITE_SCROLL_FEED_INITIAL,
}));

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCached()
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function HomePage() {
  const [
    photos,
    photosCount,
    cameras,
    lenses,
    tags,
    recipes,
    simulations,
    focalLengths,
  ] = await Promise.all([
    getPhotosCached()
      .catch(() => []),
    getPhotosMeta()
      .then(({ count }) => count)
      .catch(() => 0),
    ...(GRID_HOMEPAGE_ENABLED
      ? getDataForCategories()
      : [[], [], [], [], [], [], []]),
  ]);

  return (
    photos.length > 0
      ? GRID_HOMEPAGE_ENABLED
        ? <PhotoGridPage
          {...{
            photos,
            photosCount,
            cameras,
            lenses,
            tags,
            recipes,
            simulations,
            focalLengths,
          }}
        />
        : <PhotoFeedPage {...{ photos, photosCount }} />
      : <PhotosEmptyState />
  );
}
