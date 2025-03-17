import { Photo, PhotoDateRange } from '@/photo';
import { absolutePathForLensImage, pathForLens } from '@/app/paths';
import OGTile from '@/components/OGTile';
import { Lens } from '.';
import { titleForLens, descriptionForLensPhotos } from './meta';

export type OGLoadingState = 'unloaded' | 'loading' | 'loaded' | 'failed';

export default function LensOGTile({
  lens,
  photos,
  loadingState: loadingStateExternal,
  riseOnHover,
  onLoad,
  onFail,
  retryTime,
  count,
  dateRange,
}: {
  lens: Lens
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
      title: titleForLens(lens, photos, count),
      description: descriptionForLensPhotos(photos, true, count, dateRange),
      path: pathForLens(lens),
      pathImageAbsolute: absolutePathForLensImage(lens),
      loadingState: loadingStateExternal,
      onLoad,
      onFail,
      riseOnHover,
      retryTime,
    }}/>
  );
};
