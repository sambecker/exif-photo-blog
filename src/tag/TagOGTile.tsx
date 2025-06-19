'use client';

import { Photo, PhotoDateRange } from '@/photo';
import { pathForTag, pathForTagImage } from '@/app/paths';
import OGTile, { OGLoadingState } from '@/components/og/OGTile';
import { descriptionForTaggedPhotos, titleForTag } from '.';
import { useAppText } from '@/i18n/state/client';

export default function TagOGTile({
  tag,
  photos,
  loadingState: loadingStateExternal,
  riseOnHover,
  onLoad,
  onFail,
  retryTime,
  count,
  dateRange,
}: {
  tag: string
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
      loadingState: loadingStateExternal,
      onLoad,
      onFail,
      riseOnHover,
      retryTime,
    }}/>
  );
};
