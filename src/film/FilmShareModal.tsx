import { absolutePathForFilm } from '@/app/paths';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import FilmOGTile from './FilmOGTile';
import { FilmSimulation, shareTextForFilm } from '.';

export default function FilmShareModal({
  film,
  photos,
  count,
  dateRange,
}: {
  film: FilmSimulation
} & PhotoSetAttributes) {
  return (
    <ShareModal
      pathShare={absolutePathForFilm(film)}
      socialText={shareTextForFilm(film)}
    >
      <FilmOGTile {...{ film, photos, count, dateRange }} />
    </ShareModal>
  );
};
