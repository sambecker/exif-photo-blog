import { absolutePathForFilmSimulation } from '@/app/paths';
import { PhotoSetAttributes } from '../photo/set';
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
