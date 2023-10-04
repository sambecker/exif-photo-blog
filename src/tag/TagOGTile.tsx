import { Photo } from '@/photo';
import { absolutePathForTagImage, pathForTag } from '@/site/paths';
import OGTile from '@/components/OGTile';
import { descriptionForTaggedPhotos, titleForTag } from '.';

export type OGLoadingState = 'unloaded' | 'loading' | 'loaded' | 'failed';

export default function TagOGTile({
  tag,
  photos,
  loadingState: loadingStateExternal,
  riseOnHover,
  onLoad,
  onFail,
  retryTime,
  count,
}: {
  tag: string
  photos: Photo[]
  loadingState?: OGLoadingState
  onLoad?: () => void
  onFail?: () => void
  riseOnHover?: boolean
  retryTime?: number
  count?: number
}) {
  return (
    <OGTile {...{
      title: titleForTag(tag, photos),
      description: descriptionForTaggedPhotos(photos, true, count),
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
