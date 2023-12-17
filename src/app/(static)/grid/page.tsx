import {
  getPhotosCached,
  getPhotosCountCached,
  getUniqueCamerasCached,
  getUniqueFilmSimulationsCached,
  getUniqueTagsCached,
} from '@/cache';
import SiteGrid from '@/components/SiteGrid';
import { generateOgImageMetaForPhotos } from '@/photo';
import PhotoGrid from '@/photo/PhotoGrid';
import PhotosEmptyState from '@/photo/PhotosEmptyState';
import { MAX_PHOTOS_TO_SHOW_OG } from '@/photo/image-response';
import { pathForGrid } from '@/site/paths';
import { Metadata } from 'next';
import {
  PaginationParams,
  getPaginationForSearchParams,
} from '@/site/pagination';
import PhotoGridSidebar from '@/photo/PhotoGridSidebar';
import { SHOW_FILM_SIMULATIONS } from '@/site/config';

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
    getPhotosCountCached(),
    getUniqueTagsCached(),
    getUniqueCamerasCached(),
    SHOW_FILM_SIMULATIONS ? getUniqueFilmSimulationsCached() : [],
  ]);

  const showMorePath = photosCount > photos.length
    ? pathForGrid(offset + 1)
    : undefined;
  
  return (
    photos.length > 0
      ? <SiteGrid
        contentMain={<PhotoGrid {...{ photos, showMorePath }} />}
        contentSide={<div className="sticky top-4 space-y-4">
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
