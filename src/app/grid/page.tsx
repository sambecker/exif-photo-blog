import SiteGrid from '@/components/SiteGrid';
import {
  INFINITE_SCROLL_INITIAL_GRID,
  INFINITE_SCROLL_MULTIPLE_GRID,
  generateOgImageMetaForPhotos,
} from '@/photo';
import PhotoGrid from '@/photo/PhotoGrid';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { MAX_PHOTOS_TO_SHOW_OG } from '@/image-response';
import { Metadata } from 'next/types';
import PhotoGridSidebar from '@/photo/PhotoGridSidebar';
import { getPhotoSidebarData } from '@/photo/data';
import { getPhotos } from '@/photo/db';
import { cache } from 'react';
import PhotoGridInfinite from '@/photo/PhotoGridInfinite';

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
      ? <SiteGrid
        contentMain={<div className="space-y-0.5 sm:space-y-1">
          <PhotoGrid {...{ photos }} />
          {photosCount > photos.length &&
            <PhotoGridInfinite
              initialOffset={INFINITE_SCROLL_INITIAL_GRID}
              itemsPerPage={INFINITE_SCROLL_MULTIPLE_GRID}
            />}
        </div>}
        contentSide={<div className="sticky top-4 space-y-4 mt-[-4px]">
          <PhotoGridSidebar {...{
            tags,
            cameras,
            simulations,
            photosCount,
          }} />
        </div>}
        sideHiddenOnMobile
      />
      : <PhotosEmptyState />
  );
}
