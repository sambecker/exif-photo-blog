import { absolutePathForFilm } from '@/app/paths';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import FilmOGTile from './FilmOGTile';
import { shareTextForFilm } from '.';

export default function FilmShareModal({
  film,
  photos,
  count,
  dateRange,
}: {
  film: string
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
