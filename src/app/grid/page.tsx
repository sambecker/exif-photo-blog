import {
  INFINITE_SCROLL_INITIAL_GRID,
  generateOgImageMetaForPhotos,
} from '@/photo';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { MAX_PHOTOS_TO_SHOW_OG } from '@/image-response';
import { Metadata } from 'next/types';
import PhotoGridSidebar from '@/photo/PhotoGridSidebar';
import { getPhotoSidebarData } from '@/photo/data';
import { getPhotos } from '@/photo/db';
import { cache } from 'react';
import PhotoGridPage from '@/photo/PhotoGridPage';
import { PATH_GRID } from '@/site/paths';

export const dynamic = 'force-static';

const getPhotosCached = cache(getPhotos);

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCached({
    limit: MAX_PHOTOS_TO_SHOW_OG,
  })
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
    getPhotosCached({ limit: INFINITE_SCROLL_INITIAL_GRID }).catch(() => []),
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
