import { absolutePathForFilmSimulation } from '@/app/paths';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import FilmOGTile from './FilmOGTile';
import { FilmSimulation, shareTextForFilmSimulation } from '.';

export default function FilmShareModal({
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
      <FilmOGTile {...{ simulation, photos, count, dateRange }} />
    </ShareModal>
  );
};
