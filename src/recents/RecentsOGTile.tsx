'use client';

import { Photo, PhotoDateRange } from '@/photo';
import { PREFIX_RECENTS, pathForRecentsImage } from '@/app/paths';
import OGTile, { OGTilePropsCore } from '@/components/og/OGTile';
import { descriptionForPhotoSet } from '@/photo';
import { useAppText } from '@/i18n/state/client';

export default function RecentsOGTile({
  photos,
  count,
  dateRange,
  ...props
}: {
  photos: Photo[]
  count?: number
  dateRange?: PhotoDateRange
} & OGTilePropsCore) {
  const appText = useAppText();
  return (
    <OGTile {...{
      ...props,
      title: appText.category.recentTitle,
      description: descriptionForPhotoSet(
        photos,
        appText,
        undefined,
        undefined,
        count,
        dateRange,
      ),
      path: PREFIX_RECENTS,
      pathImage: pathForRecentsImage(),
    }}/>
  );
} 