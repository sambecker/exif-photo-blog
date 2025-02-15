import { absolutePathForFilmSimulation } from '@/site/paths';
import { PhotoSetAttributes } from '../photo';
import ShareModal from '@/share/ShareModal';
import FilmSimulationOGTile from './FilmSimulationOGTile';
import { FilmSimulation, shareTextForFilmSimulation } from '.';

export default function FilmSimulationShareModal({
  simulation,
  photos,
  count,
  dateRange,
}: {
  simulation: FilmSimulation
} & PhotoSetAttributes) {
  return (
    <ShareModal
      pathShare={absolutePathForFilmSimulation(simulation)}
      socialText={shareTextForFilmSimulation(simulation)}
    >
      <FilmSimulationOGTile {...{ simulation, photos, count, dateRange }} />
    </ShareModal>
  );
};
