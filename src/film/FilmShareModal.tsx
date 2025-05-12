import { absolutePathForFilm } from '@/app/paths';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import FilmOGTile from './FilmOGTile';
import { labelForFilm, shareTextForFilm } from '.';
import { getAppText } from '@/i18n/state/server';

export default async function FilmShareModal({
  film,
  photos,
  count,
  dateRange,
}: {
  film: string
} & PhotoSetAttributes) {
  const appText = await getAppText();
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
