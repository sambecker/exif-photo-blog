import { absolutePathForFilm } from '@/app/path';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import FilmOGTile from './FilmOGTile';
import { labelForFilm, shareTextForFilm } from '.';
import { useAppText } from '@/i18n/state/client';

export default function FilmShareModal({
  film,
  photos,
  count,
  dateRange,
}: {
  film: string
} & PhotoSetAttributes) {
  const appText = useAppText();
  return (
    <ShareModal
      pathShare={absolutePathForFilm(film, true)}
      navigatorTitle={labelForFilm(film).large}
      socialText={shareTextForFilm(film, appText)}
    >
      <FilmOGTile {...{ film, photos, count, dateRange }} />
    </ShareModal>
  );
};
