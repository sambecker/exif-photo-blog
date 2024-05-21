import { Photo, PhotoDateRange } from '@/photo';
import {
  absolutePathForFocalLengthImage,
  pathForFocalLength,
} from '@/site/paths';
import OGTile from '@/components/OGTile';
import { descriptionForFocalLengthPhotos, titleForFocalLength } from '.';

export type OGLoadingState = 'unloaded' | 'loading' | 'loaded' | 'failed';

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
  return (
    <OGTile {...{
      title: titleForFocalLength(focal, photos, count),
      description: descriptionForFocalLengthPhotos(
        photos,
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
