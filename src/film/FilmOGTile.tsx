'use client';

import { Photo, PhotoDateRange } from '@/photo';
import {
  absolutePathForFilmImage,
  pathForFilm,
} from '@/app/paths';
import OGTile, { OGLoadingState } from '@/components/OGTile';
import { descriptionForFilmPhotos, titleForFilm } from '.';
import { useAppText } from '@/i18n/state/client';

export default function FilmOGTile({
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
  const appText = useAppText();
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
