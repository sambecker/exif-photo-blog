import { Photo, PhotoDateRange } from '@/photo';
import { pathForLens, pathForLensImage } from '@/app/path';
import OGTile, { OGTilePropsCore } from '@/components/og/OGTile';
import { Lens } from '.';
import { titleForLens, descriptionForLensPhotos } from './meta';
import { useAppText } from '@/i18n/state/client';

export default function LensOGTile({
  lens,
  photos,
  count,
  dateRange,
  ...props
}: {
  lens: Lens
  photos: Photo[]
  count?: number
  dateRange?: PhotoDateRange
} & OGTilePropsCore) {
  const appText = useAppText();
  return (
    <OGTile {...{
      ...props,
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
    }}/>
  );
};
