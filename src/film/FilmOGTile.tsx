import { Photo, PhotoDateRange } from '@/photo';
import {
  absolutePathForFilmImage,
  pathForFilm,
} from '@/app/paths';
import OGTile from '@/components/OGTile';
import { descriptionForFilmPhotos, titleForFilm } from '.';

export type OGLoadingState = 'unloaded' | 'loading' | 'loaded' | 'failed';

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
  return (
    <OGTile {...{
      title: titleForFilm(film, photos, count),
      description:
        descriptionForFilmPhotos(photos, true, count, dateRange),
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
