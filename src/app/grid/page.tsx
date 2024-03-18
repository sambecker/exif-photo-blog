import { getPhotosCached } from '@/photo/cache';
import SiteGrid from '@/components/SiteGrid';
import { generateOgImageMetaForPhotos } from '@/photo';
import PhotoGrid from '@/photo/PhotoGrid';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { MAX_PHOTOS_TO_SHOW_OG } from '@/image-response';
import { pathForGrid } from '@/site/paths';
import { Metadata } from 'next';
import {
  PaginationParams,
  getPaginationForSearchParams,
} from '@/site/pagination';
import PhotoGridSidebar from '@/photo/PhotoGridSidebar';
import { getPhotoSidebarDataCached } from '@/photo/data';

export const runtime = 'edge';

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCached({ limit: MAX_PHOTOS_TO_SHOW_OG });
  return generateOgImageMetaForPhotos(photos);
}

export default async function GridPage({ searchParams }: PaginationParams) {
  const { offset, limit } = getPaginationForSearchParams(searchParams);

  const [
    photos,
    photosCount,
    tags,
    cameras,
    simulations,
  ] = await Promise.all([
    getPhotosCached({ limit }),
    ...getPhotoSidebarDataCached(),
  ]);

  const showMorePath = photosCount > photos.length
    ? pathForGrid(offset + 1)
    : undefined;
  
  return (
    photos.length > 0
      ? <SiteGrid
        contentMain={<PhotoGrid {...{ photos, showMorePath }} />}
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
