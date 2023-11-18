import {
  getPhotosCached,
  getPhotosCountCached,
  getUniqueCamerasCached,
  getUniqueFilmSimulationsCached,
  getUniqueTagsCached,
} from '@/cache';
import InfoBlock from '@/components/InfoBlock';
import RedirectOnDesktop from '@/components/RedirectOnDesktop';
import SiteGrid from '@/components/SiteGrid';
import { generateOgImageMetaForPhotos } from '@/photo';
import PhotoGridSidebar from '@/photo/PhotoGridSidebar';
import { MAX_PHOTOS_TO_SHOW_OG } from '@/photo/image-response';
import { SHOW_FILM_SIMULATIONS } from '@/site/config';
import { PATH_GRID } from '@/site/paths';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const photos = await getPhotosCached({ limit: MAX_PHOTOS_TO_SHOW_OG });
  return generateOgImageMetaForPhotos(photos);
}

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
      contentMain={<InfoBlock
        padding="tight"
        centered={false}
      >
        <RedirectOnDesktop redirectPath={PATH_GRID} />
        <div className="text-base space-y-4 p-2">
          <PhotoGridSidebar {...{
            tags,
            cameras,
            simulations,
            photosCount,
          }} />
        </div>
      </InfoBlock>}
    />
  );
}
