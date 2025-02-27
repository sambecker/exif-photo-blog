import {
  INFINITE_SCROLL_GRID_INITIAL,
  generateOgImageMetaForPhotos,
} from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import { getPhotoSidebarData } from '@/photo/data';
import { getPhotos, getPhotosMeta } from '@/photo/db/query';
import { cache } from 'react';
import PhotoGridPage from '@/photo/PhotoGridPage';

export const dynamic = 'force-static';

const getPhotosCached = cache(() => getPhotos({
  limit: INFINITE_SCROLL_GRID_INITIAL,
}));

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCached()
    .catch(() => []);
  return generateOgImageMetaForPhotos(photos);
}

export default async function GridPage() {
  const [
    photos,
    photosCount,
    tags,
    cameras,
    simulations,
  ] = await Promise.all([
    getPhotosCached()
      .catch(() => []),
    getPhotosMeta()
      .then(({ count }) => count)
      .catch(() => 0),
    ...getPhotoSidebarData(),
  ]);

  return (
    photos.length > 0
      ? <PhotoGridPage
        {...{ photos, photosCount, tags, cameras, simulations }}
      />
      : <PhotosEmptyState />
  );
}
