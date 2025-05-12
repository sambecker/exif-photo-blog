'use client';

import { Photo, PhotoDateRange } from '@/photo';
import {
  absolutePathForFocalLengthImage,
  pathForFocalLength,
} from '@/app/paths';
import OGTile, { OGLoadingState } from '@/components/OGTile';
import { descriptionForFocalLengthPhotos, titleForFocalLength } from '.';
import { useAppText } from '@/i18n/state/client';

export default function FocalLengthOGTile({
  focal,
  photos,
  loadingState: loadingStateExternal,
  riseOnHover,
  onLoad,
  onFail,
  retryTime,
  count,
  dateRange,
}: {
  focal: number
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
      title: titleForFocalLength(focal, photos, appText, count),
      description: descriptionForFocalLengthPhotos(
        photos,
        appText,
        true,
        count,
        dateRange,
      ),
      path: pathForFocalLength(focal),
      pathImageAbsolute: absolutePathForFocalLengthImage(focal),
      loadingState: loadingStateExternal,
      onLoad,
      onFail,
      riseOnHover,
      retryTime,
    }}/>
  );
};
