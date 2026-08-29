'use client';

import { Photo, PhotoDateRangePostgres, descriptionForPhotoSet } from '@/photo';
import { pathForQuery, pathForQueryImage } from '@/app/path';
import OGTile, { OGTilePropsCore } from '@/components/og/OGTile';
import { useAppText } from '@/i18n/state/client';

export default function QueryOGTile({
  query,
  photos,
  count,
  dateRange,
  ...props
}: {
  query: string
  photos: Photo[]
  count?: number
  dateRange?: PhotoDateRangePostgres
} & OGTilePropsCore) {
  const appText = useAppText();
  return (
    <OGTile {...{
      ...props,
      title: appText.category.queryTitle(query),
      description: descriptionForPhotoSet(
        photos,
        appText,
        undefined,
        undefined,
        count,
        dateRange,
      ),
      path: pathForQuery(query),
      pathImage: pathForQueryImage(query),
    }}/>
  );
}
