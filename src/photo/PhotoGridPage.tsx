import { Tags } from '@/tag';
import { Photo } from '.';
import { Cameras } from '@/camera';
import { FilmSimulations } from '@/simulation';
import { PATH_GRID } from '@/site/paths';
import PhotoGridSidebar from './PhotoGridSidebar';
import PhotoGridContainer from './PhotoGridContainer';

export default function PhotoGridPage({
  photos,
  photosCount,
  tags,
  cameras,
  simulations,
}:{
  photos: Photo[]
  photosCount: number
  tags: Tags
  cameras: Cameras
  simulations: FilmSimulations
}) {
  return (
    <PhotoGridContainer
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
  );
}
