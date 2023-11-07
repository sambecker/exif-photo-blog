import {
  getPhotosCountCached,
  getUniqueCamerasCached,
  getUniqueFilmSimulationsCached,
  getUniqueTagsCached,
} from '@/cache';
import RedirectOnDesktop from '@/components/RedirectOnDesktop';
import SiteGrid from '@/components/SiteGrid';
import PhotoGridSidebar from '@/photo/PhotoGridSidebar';
import { SHOW_FILM_SIMULATIONS } from '@/site/config';
import { PATH_GRID } from '@/site/paths';
import { cc } from '@/utility/css';

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
      contentMain={<div className={cc(
        'top-4 space-y-4 text-base',
      )}>
        <RedirectOnDesktop redirectPath={PATH_GRID} />
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
