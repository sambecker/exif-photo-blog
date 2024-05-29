import {
  absolutePathForFilmSimulation,
  pathForFilmSimulation,
} from '@/site/paths';
import { Photo, PhotoDateRange } from '../photo';
import ShareModal from '@/components/ShareModal';
import FilmSimulationOGTile from './FilmSimulationOGTile';
import { FilmSimulation, shareTextForFilmSimulation } from '.';

export default function FilmSimulationShareModal({
  simulation,
  photos,
  count,
  dateRange,
}: {
  simulation: FilmSimulation
  photos: Photo[]
  count?: number
  dateRange?: PhotoDateRange
}) {
  return (
    <ShareModal
      pathShare={absolutePathForFilmSimulation(simulation)}
      pathClose={pathForFilmSimulation(simulation)}
      socialText={shareTextForFilmSimulation(simulation)}
    >
      <FilmSimulationOGTile {...{ simulation, photos, count, dateRange }} />
    </ShareModal>
  );
};
