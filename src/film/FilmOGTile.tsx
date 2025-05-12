import { Photo, PhotoDateRange } from '@/photo';
import {
  absolutePathForFilmImage,
  pathForFilm,
} from '@/app/paths';
import OGTile, { OGLoadingState } from '@/components/OGTile';
import { descriptionForFilmPhotos, titleForFilm } from '.';
import { getAppText } from '@/i18n/state/server';

export default async function FilmOGTile({
  film,
  photos,
  loadingState: loadingStateExternal,
  riseOnHover,
  onLoad,
  onFail,
  retryTime,
  count,
  dateRange,
}: {
  film: string
  photos: Photo[]
  loadingState?: OGLoadingState
  onLoad?: () => void
  onFail?: () => void
  riseOnHover?: boolean
  retryTime?: number
  count?: number
  dateRange?: PhotoDateRange
}) {
  const appText = await getAppText();
  return (
    <OGTile {...{
      title: titleForFilm(film, photos, appText, count),
      description:
        descriptionForFilmPhotos(photos, appText, true, count, dateRange),
      path: pathForFilm(film),
      pathImageAbsolute: absolutePathForFilmImage(film),
      loadingState: loadingStateExternal,
      onLoad,
      onFail,
      riseOnHover,
      retryTime,
    }}/>
  );
};
