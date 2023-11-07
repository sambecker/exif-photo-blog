import {
  getPhotosCountCached,
  getUniqueCamerasCached,
  getUniqueFilmSimulationsCached,
  getUniqueTagsCached,
} from '@/cache';
import SiteGrid from '@/components/SiteGrid';
import PhotoGridSidebar from '@/photo/PhotoGridSidebar';
import { SHOW_FILM_SIMULATIONS } from '@/site/config';

export default async function SetsPage() {
  const [
    photosCount,
    tags,
    cameras,
    simulations,
  ] = await Promise.all([
    getPhotosCountCached(),
    getUniqueTagsCached(),
    getUniqueCamerasCached(),
    SHOW_FILM_SIMULATIONS ? getUniqueFilmSimulationsCached() : [],
  ]);
  return (
    <SiteGrid
      contentMain={<div className="sticky top-4 space-y-4">
        <PhotoGridSidebar {...{
          tags,
          cameras,
          simulations,
          photosCount,
        }} />
      </div>}
    />
  );
}
