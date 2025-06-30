'use client';

import { Photo, PhotoDateRange, descriptionForPhotoSet } from '@/photo';
import { pathForYear, pathForYearImage } from '@/app/paths';
import OGTile, { OGTilePropsCore } from '@/components/og/OGTile';
import { useAppText } from '@/i18n/state/client';

export default function YearOGTile({
  year,
  photos,
  count,
  dateRange,
  ...props
}: {
  year: string
  photos: Photo[]
  count?: number
  dateRange?: PhotoDateRange
} & OGTilePropsCore) {
  const appText = useAppText();
  return (
    <OGTile {...{
      ...props,
      title: appText.category.yearTitle(year),
      description: descriptionForPhotoSet(
        photos,
        appText,
        undefined,
        undefined,
        count,
        dateRange,
      ),
      path: pathForYear(year),
      pathImage: pathForYearImage(year),
    }}/>
  );
} 