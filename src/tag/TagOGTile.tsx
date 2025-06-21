'use client';

import { Photo, PhotoDateRange } from '@/photo';
import { pathForTag, pathForTagImage } from '@/app/paths';
import OGTile, { OGTilePropsCore } from '@/components/og/OGTile';
import { descriptionForTaggedPhotos, titleForTag } from '.';
import { useAppText } from '@/i18n/state/client';

export default function TagOGTile({
  tag,
  photos,
  count,
  dateRange,
  ...props
}: {
  tag: string
  photos: Photo[]
  count?: number
  dateRange?: PhotoDateRange
} & OGTilePropsCore) {
  const appText = useAppText();
  return (
    <OGTile {...{
      ...props,
      title: titleForTag(tag, photos, appText, count),
      description: descriptionForTaggedPhotos(
        photos,
        appText,
        true,
        count,
        dateRange,
      ),
      path: pathForTag(tag),
      pathImage: pathForTagImage(tag),
    }}/>
  );
};
