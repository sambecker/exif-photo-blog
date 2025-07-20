'use client';

import { Photo, PhotoDateRange } from '@/photo';
import {
  pathForFilm,
  pathForFilmImage,
} from '@/app/path';
import OGTile, { OGTilePropsCore } from '@/components/og/OGTile';
import { descriptionForFilmPhotos, titleForFilm } from '.';
import { useAppText } from '@/i18n/state/client';

export default function FilmOGTile({
  film,
  photos,
  count,
  dateRange,
  ...props
}: {
  film: string
  photos: Photo[]
  count?: number
  dateRange?: PhotoDateRange
} & OGTilePropsCore) {
  const appText = useAppText();
  return (
    <OGTile {...{
      ...props,
      title: titleForFilm(film, photos, appText, count),
      description:
        descriptionForFilmPhotos(photos, appText, true, count, dateRange),
      path: pathForFilm(film),
      pathImage: pathForFilmImage(film),
    }}/>
  );
};
