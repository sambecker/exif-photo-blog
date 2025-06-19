import { Photo, PhotoDateRange } from '@/photo';
import { pathForLens, pathForLensImage } from '@/app/paths';
import OGTile, { OGLoadingState } from '@/components/og/OGTile';
import { Lens } from '.';
import { titleForLens, descriptionForLensPhotos } from './meta';
import { useAppText } from '@/i18n/state/client';

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
  const appText = useAppText();
  return (
    <OGTile {...{
      title: titleForLens(lens, photos, appText, count),
      description: descriptionForLensPhotos(
        photos,
        appText,
        true,
        count,
        dateRange,
      ),
      path: pathForLens(lens),
      pathImage: pathForLensImage(lens),
      loadingState: loadingStateExternal,
      onLoad,
      onFail,
      riseOnHover,
      retryTime,
    }}/>
  );
};
