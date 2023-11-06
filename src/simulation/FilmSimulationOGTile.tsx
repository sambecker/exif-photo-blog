import { Photo, PhotoDateRange } from '@/photo';
import {
  absolutePathForFilmSimulationImage,
  pathForFilmSimulation,
} from '@/site/paths';
import OGTile from '@/components/OGTile';
import {
  FilmSimulation,
  descriptionForFilmSimulationPhotos,
  titleForFilmSimulation,
} from '.';

export type OGLoadingState = 'unloaded' | 'loading' | 'loaded' | 'failed';

export default function FilmSimulationOGTile({
  simulation,
  photos,
  loadingState: loadingStateExternal,
  riseOnHover,
  onLoad,
  onFail,
  retryTime,
  count,
  dateRange,
}: {
  simulation: FilmSimulation
  photos: Photo[]
  loadingState?: OGLoadingState
  onLoad?: () => void
  onFail?: () => void
  riseOnHover?: boolean
  retryTime?: number
  count?: number
  dateRange?: PhotoDateRange
}) {
  return (
    <OGTile {...{
      title: titleForFilmSimulation(simulation, photos, count),
      description:
        descriptionForFilmSimulationPhotos(photos, true, count, dateRange),
      path: pathForFilmSimulation(simulation),
      pathImageAbsolute: absolutePathForFilmSimulationImage(simulation),
      loadingState: loadingStateExternal,
      onLoad,
      onFail,
      riseOnHover,
      retryTime,
    }}/>
  );
};
