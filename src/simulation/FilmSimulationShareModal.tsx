import {
  absolutePathForFilmSimulation,
  pathForFilmSimulation,
} from '@/site/paths';
import { Photo, PhotoDateRange } from '../photo';
import ShareModal from '@/components/ShareModal';
import FilmSimulationOGTile from './FilmSimulationOGTile';
import { FilmSimulation } from '.';

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
      title="Share Photos"
      pathShare={absolutePathForFilmSimulation(simulation)}
      pathClose={pathForFilmSimulation(simulation)}
    >
      <FilmSimulationOGTile {...{ simulation, photos, count, dateRange }} />
    </ShareModal>
  );
};
