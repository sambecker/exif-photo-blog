'use client';

import { Photo, PhotoDateRangePostgres } from '@/photo';
import {
  pathForFocalLength,
  pathForFocalLengthImage,
} from '@/app/path';
import OGTile, { OGTilePropsCore } from '@/components/og/OGTile';
import { descriptionForFocalLengthPhotos, titleForFocalLength } from '.';
import { useAppText } from '@/i18n/state/client';

export default function FocalLengthOGTile({
  focal,
  photos,
  count,
  dateRange,
  ...props
}: {
  focal: number
  photos: Photo[]
  count?: number
  dateRange?: PhotoDateRangePostgres
} & OGTilePropsCore) {
  const appText = useAppText();
  return (
    <OGTile {...{
      ...props,
      title: titleForFocalLength(focal, photos, appText, count),
      description:
        descriptionForFocalLengthPhotos(
          photos,
          appText,
          true,
          count,
          dateRange,
        ),
      path: pathForFocalLength(focal),
      pathImage: pathForFocalLengthImage(focal),
    }}/>
  );
};
