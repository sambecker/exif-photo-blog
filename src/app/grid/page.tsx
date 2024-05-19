import {
  INFINITE_SCROLL_GRID_PHOTO_INITIAL,
  generateOgImageMetaForPhotos,
} from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { Metadata } from 'next/types';
import PhotoGridSidebar from '@/photo/PhotoGridSidebar';
import { getPhotoSidebarData } from '@/photo/data';
import { getPhotos } from '@/photo/db';
import { cache } from 'react';
import PhotoGridPage from '@/photo/PhotoGridPage';
import { PATH_GRID } from '@/site/paths';

export const dynamic = 'force-static';

const getPhotosCached = cache(() => getPhotos({
  limit: INFINITE_SCROLL_GRID_PHOTO_INITIAL,
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
    ...getPhotoSidebarData(),
  ]);

  return (
    photos.length > 0
      ? <PhotoGridPage
        cacheKey={`page-${PATH_GRID}`}
        photos={photos}
        count={photosCount}
        sidebar={<div className="sticky top-4 space-y-4 mt-[-4px]">
          <PhotoGridSidebar {...{
            tags,
            cameras,
            simulations,
            photosCount,
          }} />
        </div>}
      />
      : <PhotosEmptyState />
  );
}
