import { Photo, PhotoDateRange } from '@/photo';
import { absolutePathForTagImage, pathForTag } from '@/app/paths';
import OGTile, { OGLoadingState } from '@/components/OGTile';
import { descriptionForTaggedPhotos, titleForTag } from '.';
import { getAppText } from '@/i18n/state/server';

export default async function TagOGTile({
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
  const appText = await getAppText();
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
      pathImageAbsolute: absolutePathForTagImage(tag),
      loadingState: loadingStateExternal,
      onLoad,
      onFail,
      riseOnHover,
      retryTime,
    }}/>
  );
};
